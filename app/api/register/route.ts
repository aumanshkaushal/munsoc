import { NextRequest, NextResponse } from "next/server";
import { uploadRefMap } from "../shared";

const GOOGLE_SHEET_WEBHOOK_URL = process.env.GOOGLE_SHEET_WEBHOOK_URL || "";
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "";
const IMGBB_API_KEY = process.env.IMGBB_API_KEY || "";
const DEFAULT_PORTFOLIO_LIMIT = parseInt(
  process.env.PORTFOLIO_LIMIT || "65",
  10,
);

const rateLimitStore = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000;
const MAX_SUBMISSIONS = 3;

// Stores past submission bodies per IP for rate limit alert
const rateLimitSubmissionLog = new Map<
  string,
  { timestamp: string; body: Record<string, string> }[]
>();

let lastCleanup = Date.now();
const CLEANUP_INTERVAL = 60 * 60 * 1000; // 1 hour

function cleanupStores() {
  const now = Date.now();
  for (const [ip, timestamps] of rateLimitStore.entries()) {
    const active = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW);
    if (active.length === 0) {
      rateLimitStore.delete(ip);
    } else if (active.length !== timestamps.length) {
      rateLimitStore.set(ip, active);
    }
  }
  for (const [ip, log] of rateLimitSubmissionLog.entries()) {
    const active = log.filter(
      (s) => now - Date.parse(s.timestamp) < RATE_LIMIT_WINDOW,
    );
    if (active.length === 0) {
      rateLimitSubmissionLog.delete(ip);
    } else if (active.length !== log.length) {
      rateLimitSubmissionLog.set(ip, active);
    }
  }
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();

  // Periodic cleanup of all expired entries
  if (now - lastCleanup > CLEANUP_INTERVAL) {
    cleanupStores();
    lastCleanup = now;
  }

  const timestamps = rateLimitStore.get(ip) || [];
  const activeTimestamps = timestamps.filter(
    (t) => now - t < RATE_LIMIT_WINDOW,
  );
  if (activeTimestamps.length === 0) {
    rateLimitStore.delete(ip);
  } else {
    rateLimitStore.set(ip, activeTimestamps);
  }

  // Dynamic cleanup for current IP's submission log if expired
  const log = rateLimitSubmissionLog.get(ip);
  if (log) {
    const activeLog = log.filter(
      (s) => now - Date.parse(s.timestamp) < RATE_LIMIT_WINDOW,
    );
    if (activeLog.length === 0) {
      rateLimitSubmissionLog.delete(ip);
    } else if (activeLog.length !== log.length) {
      rateLimitSubmissionLog.set(ip, activeLog);
    }
  }

  return activeTimestamps.length >= MAX_SUBMISSIONS;
}

function recordSubmission(ip: string, body: Record<string, string>) {
  const now = Date.now();
  const timestamps = rateLimitStore.get(ip) || [];
  timestamps.push(now);
  rateLimitStore.set(ip, timestamps);

  const log = rateLimitSubmissionLog.get(ip) || [];
  const nextLog = [...log, { timestamp: new Date(now).toISOString(), body }]
    .filter((s) => now - Date.parse(s.timestamp) < RATE_LIMIT_WINDOW)
    .slice(-MAX_SUBMISSIONS);
  rateLimitSubmissionLog.set(ip, nextLog);
}

const SAFE_HEADERS = new Set([
  "accept",
  "accept-encoding",
  "accept-language",
  "connection",
  "content-length",
  "content-type",
  "host",
  "origin",
  "referer",
  "sec-ch-ua",
  "sec-ch-ua-mobile",
  "sec-ch-ua-platform",
  "sec-fetch-dest",
  "sec-fetch-mode",
  "sec-fetch-site",
  "user-agent",
  "x-forwarded-for",
  "x-real-ip",
]);

async function sendRateLimitAlert(
  ip: string,
  headers: Record<string, string>,
  currentBody: Record<string, string>,
) {
  if (!GOOGLE_SHEET_WEBHOOK_URL) return;
  try {
    const pastSubmissions = rateLimitSubmissionLog.get(ip) || [];
    const payload = {
      action: "rate_limit_alert",
      ip,
      headers,
      pastSubmissions,
      currentBody,
      timestamp: new Date().toISOString(),
    };

    fetch(GOOGLE_SHEET_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, secret: WEBHOOK_SECRET }),
      signal: AbortSignal.timeout(8000),
    }).catch((err) => {
      console.error("[MUNSoC Register] Rate limit alert webhook failed:", err);
    });
    console.log(
      `[MUNSoC Register] Rate limit alert dispatched to Google Apps Script for IP: ${ip}`,
    );
  } catch (err) {
    console.error("[MUNSoC Register] Failed to send rate limit alert:", err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    if (isRateLimited(ip)) {
      // Collect request headers (using allowlist & redaction)
      const headerMap: Record<string, string> = {};
      req.headers.forEach((value, key) => {
        const lowerKey = key.toLowerCase();
        if (SAFE_HEADERS.has(lowerKey)) {
          headerMap[key] = value;
        } else {
          headerMap[key] = "[REDACTED]";
        }
      });

      // Parse body to include in the alert (best-effort, size-capped to prevent DoS)
      let blockedBody: Record<string, string> = {};
      const contentLengthHeader = req.headers.get("content-length");
      const contentLength = contentLengthHeader
        ? parseInt(contentLengthHeader, 10)
        : 0;

      if (contentLength > 0 && contentLength < 10240) {
        try {
          blockedBody = await req.json();
        } catch {
          /* ignore parse errors */
        }
      } else {
        blockedBody = { _status: "[BODY_OMITTED_OR_TOO_LARGE]" };
      }

      // Fire-and-forget alert to Google Apps Script Webhook
      await sendRateLimitAlert(ip, headerMap, blockedBody);

      return NextResponse.json(
        {
          success: false,
          error: "Rate limit exceeded. Maximum 3 submissions per hour allowed.",
        },
        { status: 429 },
      );
    }

    // Size check for general registration body to prevent DoS (do not rely solely on Content-Length)
    const rawBody = await req.text();
    if (rawBody.length > 10240) {
      return NextResponse.json(
        { success: false, error: "Payload too large." },
        { status: 413 },
      );
    }

    let body: Record<string, any>;
    try {
      body = JSON.parse(rawBody || "{}");
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON payload." },
        { status: 400 },
      );
    }
    const {
      name,
      email,
      whatsapp,
      institute,
      pref1,
      pref2,
      pref3,
      experience,
      committee: committeeRaw,
      transactionId: transactionIdRaw,
    } = body;
    const transactionId =
      typeof transactionIdRaw === "string" ? transactionIdRaw.trim() : "";
    const committee =
      typeof committeeRaw === "string" && committeeRaw.trim()
        ? committeeRaw.trim()
        : "Youth Parliament (YPM)";

    recordSubmission(ip, {
      name: String(name ?? ""),
      email: String(email ?? ""),
      whatsapp: String(whatsapp ?? ""),
      committee: String(committee),
      pref1: String(pref1 ?? ""),
      pref2: String(pref2 ?? ""),
      pref3: String(pref3 ?? ""),
      transactionId,
    });

    if (GOOGLE_SHEET_WEBHOOK_URL) {
      try {
        const checkResponse = await fetch(
          WEBHOOK_SECRET
            ? `${GOOGLE_SHEET_WEBHOOK_URL}?secret=${WEBHOOK_SECRET}`
            : GOOGLE_SHEET_WEBHOOK_URL,
          {
            method: "GET",
            cache: "no-store",
            signal: AbortSignal.timeout(10000),
          },
        );

        const checkText = await checkResponse.text();
        let checkResult: any = {};
        try {
          checkResult = JSON.parse(checkText);
        } catch {
          checkResult = {};
        }

        const portfolioLimit =
          checkResult.portfolioLimit || DEFAULT_PORTFOLIO_LIMIT;
        const allottedList = Array.isArray(checkResult.allotted)
          ? checkResult.allotted
          : Array.isArray(checkResult.allottedPortfolios)
            ? checkResult.allottedPortfolios
            : [];
        const allottedCount = allottedList.length;

        if (
          checkResult.isClosed === true ||
          checkResult.closed === true ||
          (checkResult.result === "success" &&
            portfolioLimit > 0 &&
            allottedCount >= portfolioLimit)
        ) {
          return NextResponse.json(
            {
              success: false,
              error:
                "Registrations are closed because all delegate portfolios have been allotted.",
            },
            { status: 403 },
          );
        }
      } catch (checkErr) {
        console.error(
          "[MUNSoC Register] Failed to check registration closure status:",
          checkErr,
        );
      }
    }

    if (
      !name ||
      !email ||
      !whatsapp ||
      !pref1 ||
      !pref2 ||
      !pref3 ||
      !transactionId
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    let resolvedTransactionId = transactionId;
    if (transactionId.startsWith("MUNSOC-REF-")) {
      const base64Image = uploadRefMap.get(transactionId);
      if (!base64Image) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Upload session expired. Please re-upload your payment receipt.",
          },
          { status: 400 },
        );
      }
      uploadRefMap.delete(transactionId);

      if (base64Image && IMGBB_API_KEY) {
        try {
          const bodyParams = new URLSearchParams();
          bodyParams.append("image", base64Image);

          const response = await fetch(
            `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: bodyParams,
              signal: AbortSignal.timeout(15000),
            },
          );

          const uploadResult = await response.json();
          if (
            uploadResult.success &&
            uploadResult.data &&
            uploadResult.data.url
          ) {
            resolvedTransactionId = uploadResult.data.url;
          } else {
            console.error(
              "[MUNSoC Register] Late upload ImgBB API error:",
              uploadResult,
            );
          }
        } catch (uploadError) {
          console.error(
            "[MUNSoC Register] Late upload to ImgBB failed:",
            uploadError,
          );
        }
      }
    }

    if (!GOOGLE_SHEET_WEBHOOK_URL) {
      console.warn(
        "[MUNSoC Register] Warning: GOOGLE_SHEET_WEBHOOK_URL is not set.",
      );
      return NextResponse.json({
        success: true,
        message:
          "Demo mode: Registration received. (Please set GOOGLE_SHEET_WEBHOOK_URL in .env.local for Sheets sync)",
      });
    }

    const payload = {
      action: "register",
      committee,
      name,
      email,
      whatsapp,
      institute: institute || "",
      pref1,
      pref2,
      pref3,
      experience: experience || "",
      transactionId: resolvedTransactionId,
      timestamp: new Date().toISOString(),
    };

    const response = await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...payload, secret: WEBHOOK_SECRET }),
      signal: AbortSignal.timeout(15000),
    });

    const responseText = await response.text();
    let result: any = {};
    try {
      result = JSON.parse(responseText);
    } catch {
      console.warn(
        "[MUNSoC Register] Non-JSON response from Google Sheet Webhook:",
        responseText.slice(0, 300),
      );
      if (responseText.toLowerCase().includes("success") || response.ok) {
        result = { result: "success" };
      } else {
        result = { result: "error", error: responseText.slice(0, 200) };
      }
    }

    if (result.result === "success" || result.status === "success") {
      // Record this submission in the rate limiter
      recordSubmission(ip, {
        name,
        email,
        whatsapp: whatsapp || "",
        committee,
        pref1,
        pref2,
        pref3,
        transactionId: resolvedTransactionId,
      });

      return NextResponse.json({
        success: true,
        message: result.message || "Registration recorded successfully",
      });
    } else {
      console.error(
        "[MUNSoC Register] Google script error:",
        result.error || result,
      );
      return NextResponse.json(
        {
          success: false,
          error: result.error || "Failed to write to Google Sheet",
        },
        { status: 500 },
      );
    }
  } catch (err) {
    console.error("[MUNSoC Register] Error:", err);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";
    const rateLimited = isRateLimited(ip);

    if (!GOOGLE_SHEET_WEBHOOK_URL) {
      console.warn(
        "[MUNSoC Register] Warning: GOOGLE_SHEET_WEBHOOK_URL is not set.",
      );
      return NextResponse.json({
        success: true,
        allotted: [],
        allottedPortfolios: [],
        isClosed: false,
        rateLimited,
      });
    }

    const response = await fetch(
      WEBHOOK_SECRET
        ? `${GOOGLE_SHEET_WEBHOOK_URL}?secret=${WEBHOOK_SECRET}`
        : GOOGLE_SHEET_WEBHOOK_URL,
      {
        method: "GET",
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
      },
    );

    const responseText = await response.text();
    let result: any = {};
    try {
      result = JSON.parse(responseText);
    } catch {
      console.warn(
        "[MUNSoC Register] Non-JSON GET response from Google Sheet Webhook:",
        responseText.slice(0, 200),
      );
      result = {
        result: "error",
        error: "Invalid JSON returned by sheet script",
      };
    }

    if (result.result === "success" || result.status === "success") {
      const allottedList = Array.isArray(result.allotted)
        ? result.allotted
        : Array.isArray(result.allottedPortfolios)
          ? result.allottedPortfolios
          : [];

      return NextResponse.json({
        success: true,
        allotted: allottedList,
        allottedPortfolios: allottedList,
        totalAllotted: allottedList.length,
        isClosed: Boolean(result.isClosed || result.closed),
        rateLimited,
      });
    } else {
      console.error("[MUNSoC Register] Google script GET error:", result.error);
      return NextResponse.json(
        {
          success: false,
          error: result.error || "Failed to fetch allocation data",
          allotted: [],
          allottedPortfolios: [],
          rateLimited,
        },
        { status: 500 },
      );
    }
  } catch (err) {
    console.error("[MUNSoC Register] GET Error:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Server error",
        allotted: [],
        allottedPortfolios: [],
        rateLimited: false,
      },
      { status: 500 },
    );
  }
}
