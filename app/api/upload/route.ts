import { NextRequest, NextResponse } from "next/server";
import { uploadRefMap } from "../shared";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json();
    if (!image) {
      return NextResponse.json({ success: false, error: "No image data provided" }, { status: 400 });
    }

    // Generate a highly professional internal Reference ID
    const randomPart = randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase();
    const refId = `MUNSOC-REF-${randomPart}`;

    // Temporarily cache the base64 image string in server memory
    // It will be uploaded to ImgBB only when the application is submitted
    uploadRefMap.set(refId, image);

    return NextResponse.json({
      success: true,
      refId: refId,
    });
  } catch (err) {
    console.error("[MUNSoC Upload] Server error:", err);
    return NextResponse.json({ success: false, error: "Server error occurred during upload" }, { status: 500 });
  }
}
