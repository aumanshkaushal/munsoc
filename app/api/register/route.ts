import { NextRequest, NextResponse } from "next/server";

// CONFIGURATION: Set the Google Sheets Webhook URL here or in .env.local
const GOOGLE_SHEET_WEBHOOK_URL = process.env.GOOGLE_SHEET_WEBHOOK_URL || "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, institute, pref1, pref2, pref3, experience, transactionId } = body;

    // Validate required fields
    if (!name || !email || !pref1 || !pref2 || !pref3 || !transactionId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!GOOGLE_SHEET_WEBHOOK_URL) {
      console.warn("[MUNSoC Register] Warning: GOOGLE_SHEET_WEBHOOK_URL is not set.");
      // If not configured, we simulate a successful submission for frontend preview
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
