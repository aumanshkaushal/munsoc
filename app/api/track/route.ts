import { NextRequest, NextResponse } from "next/server";

const REF_TRACKING_WEBHOOK_URL = process.env.REF_TRACKING_WEBHOOK_URL || "";
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!REF_TRACKING_WEBHOOK_URL) {
      console.warn("[MUNSoC Track] REF_TRACKING_WEBHOOK_URL is not set.");
      return NextResponse.json({ success: true, mode: "demo" });
    }

    const payload = {
      action: "track",
      ...body,
      secret: WEBHOOK_SECRET,
      timestamp: body.timestamp || new Date().toISOString(),
    };

    const response = await fetch(REF_TRACKING_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000),
    });

    const responseText = await response.text();
    let result: any = {};
    try {
      result = JSON.parse(responseText);
    } catch {
      if (responseText.toLowerCase().includes("success") || response.ok) {
        result = { result: "success" };
      } else {
        result = { result: "error", error: responseText.slice(0, 200) };
      }
    }

    if (result.result === "success" || result.status === "success") {
      return NextResponse.json({ success: true, message: result.message || "Tracking recorded" });
    } else {
      console.error("[MUNSoC Track] Google script error:", result.error || result);
      return NextResponse.json(
        { success: false, error: result.error || "Failed to write to sheet" },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("[MUNSoC Track] Error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

