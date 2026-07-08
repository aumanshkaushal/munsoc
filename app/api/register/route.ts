import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// CONFIGURATION: Set environment variables or defaults
const GOOGLE_SHEET_WEBHOOK_URL = process.env.GOOGLE_SHEET_WEBHOOK_URL || "";
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const NOTIFICATION_EMAILS = process.env.NOTIFICATION_EMAILS || "";
const FROM_EMAIL = process.env.FROM_EMAIL || "onboarding@resend.dev";

// In-memory rate limiting store: client IP -> timestamps[]
const rateLimitStore = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_SUBMISSIONS = 3;

/**
 * Checks if a given IP has exceeded the limit of 3 submissions in the last hour
 */
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitStore.get(ip) || [];
  
  // Keep only timestamps within the 1-hour window
  const activeTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW);
  rateLimitStore.set(ip, activeTimestamps);
  
  return activeTimestamps.length >= MAX_SUBMISSIONS;
}

/**
 * Logs a new submission timestamp for a given IP
 */
function recordSubmission(ip: string) {
  const now = Date.now();
  const timestamps = rateLimitStore.get(ip) || [];
  timestamps.push(now);
  rateLimitStore.set(ip, timestamps);
}

export async function POST(req: NextRequest) {
  try {
    // Resolve client IP address
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "127.0.0.1";

    // Enforce rate limit
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, error: "Rate limit exceeded. Maximum 3 submissions per hour allowed." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { name, email, whatsapp, institute, pref1, pref2, pref3, experience, transactionId } = body;

    // Validate required fields
    if (!name || !email || !whatsapp || !pref1 || !pref2 || !pref3 || !transactionId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!GOOGLE_SHEET_WEBHOOK_URL) {
      console.warn("[MUNSoC Register] Warning: GOOGLE_SHEET_WEBHOOK_URL is not set.");
      // If not configured, we simulate a successful submission for frontend preview
      recordSubmission(ip); // Log submission
      return NextResponse.json({
        success: true,
        message: "Demo mode: Registration received. (Please set GOOGLE_SHEET_WEBHOOK_URL in .env.local for Sheets sync)",
      });
    }

    // Forward the data to Google Apps Script Web App
    const response = await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        whatsapp,
        institute: institute || "",
        pref1,
        pref2,
        pref3,
        experience: experience || "",
        transactionId,
        timestamp: new Date().toISOString(),
      }),
    });

    const result = await response.json();

    if (result.result === "success") {
      // Record this submission in the rate limiter
      recordSubmission(ip);

      // Dispatch Resend email notification if configured
      if (RESEND_API_KEY && NOTIFICATION_EMAILS) {
        try {
          const resend = new Resend(RESEND_API_KEY);
          const recipientEmails = NOTIFICATION_EMAILS.split(",")
            .map((e) => e.trim())
            .filter((e) => e.length > 0);

          if (recipientEmails.length > 0) {
            const { data, error } = await resend.emails.send({
              from: FROM_EMAIL,
              to: recipientEmails,
              subject: `AIPPM Registration: ${name}`,
              html: `
                <div style="font-family: sans-serif; max-width: 600px; color: #333;">
                  <h2 style="color: #0284c7; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">
                    New AIPPM Registration Received
                  </h2>
                  <p>Here are the details of the submission:</p>
                  <table style="border-collapse: collapse; width: 100%; border: 1px solid #e2e8f0; font-size: 13px;">
                    <thead>
                      <tr style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">
                        <th style="padding: 10px; text-align: left; font-weight: bold; width: 160px; border-right: 1px solid #e2e8f0;">Field</th>
                        <th style="padding: 10px; text-align: left; font-weight: bold;">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style="border-bottom: 1px solid #e2e8f0;">
                        <td style="padding: 10px; font-weight: bold; border-right: 1px solid #e2e8f0; background-color: #fcfcfc;">Name</td>
                        <td style="padding: 10px;">${name}</td>
                      </tr>
                      <tr style="border-bottom: 1px solid #e2e8f0;">
                        <td style="padding: 10px; font-weight: bold; border-right: 1px solid #e2e8f0; background-color: #fcfcfc;">Email</td>
                        <td style="padding: 10px;"><a href="mailto:${email}">${email}</a></td>
                      </tr>
                      <tr style="border-bottom: 1px solid #e2e8f0;">
                        <td style="padding: 10px; font-weight: bold; border-right: 1px solid #e2e8f0; background-color: #fcfcfc;">WhatsApp Number</td>
                        <td style="padding: 10px;"><a href="https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}">${whatsapp}</a></td>
                      </tr>
                      <tr style="border-bottom: 1px solid #e2e8f0;">
                        <td style="padding: 10px; font-weight: bold; border-right: 1px solid #e2e8f0; background-color: #fcfcfc;">Institute</td>
                        <td style="padding: 10px;">${institute || "N/A"}</td>
                      </tr>
                      <tr style="border-bottom: 1px solid #e2e8f0;">
                        <td style="padding: 10px; font-weight: bold; border-right: 1px solid #e2e8f0; background-color: #fcfcfc;">1st Preference</td>
                        <td style="padding: 10px; font-weight: 600; color: #0284c7;">${pref1}</td>
                      </tr>
                      <tr style="border-bottom: 1px solid #e2e8f0;">
                        <td style="padding: 10px; font-weight: bold; border-right: 1px solid #e2e8f0; background-color: #fcfcfc;">2nd Preference</td>
                        <td style="padding: 10px;">${pref2}</td>
                      </tr>
                      <tr style="border-bottom: 1px solid #e2e8f0;">
                        <td style="padding: 10px; font-weight: bold; border-right: 1px solid #e2e8f0; background-color: #fcfcfc;">3rd Preference</td>
                        <td style="padding: 10px;">${pref3}</td>
                      </tr>
                      <tr style="border-bottom: 1px solid #e2e8f0;">
                        <td style="padding: 10px; font-weight: bold; border-right: 1px solid #e2e8f0; background-color: #fcfcfc;">Transaction ID</td>
                        <td style="padding: 10px; font-family: monospace; font-weight: 600; color: #0f172a;">${transactionId}</td>
                      </tr>
                      <tr>
                        <td style="padding: 10px; font-weight: bold; border-right: 1px solid #e2e8f0; background-color: #fcfcfc; vertical-align: top;">MUN Experience</td>
                        <td style="padding: 10px; white-space: pre-wrap; line-height: 1.5;">${experience || "None specified"}</td>
                      </tr>
                    </tbody>
                  </table>
                  <p style="font-size: 11px; color: #64748b; margin-top: 20px;">
                    This email was automatically generated and sent to you from the MUNSoC Web Platform Registration Webhook.
                  </p>
                </div>
              `,
            });

            if (error) {
              console.error("[MUNSoC Register] Resend API error:", error);
            } else {
              console.log(`[MUNSoC Register] Notification email sent successfully, ID: ${data?.id}`);
            }
          }
        } catch (emailErr) {
          console.error("[MUNSoC Register] Resend sending failed:", emailErr);
        }
      }
      return NextResponse.json({ success: true });
    } else {
      console.error("[MUNSoC Register] Google script error:", result.error);
      return NextResponse.json(
        { success: false, error: "Failed to write to Google Sheet" },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("[MUNSoC Register] Error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    // Resolve client IP address
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "127.0.0.1";
    const rateLimited = isRateLimited(ip);

    if (!GOOGLE_SHEET_WEBHOOK_URL) {
      console.warn("[MUNSoC Register] Warning: GOOGLE_SHEET_WEBHOOK_URL is not set.");
      // Return empty array and rate limit status
      return NextResponse.json({ success: true, allotted: [], rateLimited });
    }

    const response = await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
      method: "GET",
      cache: "no-store",
    });

    const result = await response.json();

    if (result.result === "success") {
      return NextResponse.json({
        success: true,
        allotted: result.allotted || [],
        rateLimited,
      });
    } else {
      console.error("[MUNSoC Register] Google script GET error:", result.error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch allocation data", rateLimited },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("[MUNSoC Register] GET Error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
