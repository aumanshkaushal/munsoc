import { NextRequest, NextResponse } from "next/server";
import { uploadRefMap } from "../shared";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json();

    if (typeof image !== "string" || image.trim() === "") {
      return NextResponse.json(
        { success: false, error: "No image data provided" },
        { status: 400 },
      );
    }
    if (image.length > 15_000_000) {
      return NextResponse.json(
        { success: false, error: "Image data too large (max 10MB)" },
        { status: 413 },
      );
    }
    const randomPart = randomUUID()
      .replace(/-/g, "")
      .slice(0, 12)
      .toUpperCase();
    const refId = `MUNSOC-REF-${randomPart}`;

    uploadRefMap.set(refId, image);

    setTimeout(
      () => {
        if (uploadRefMap.has(refId)) {
          uploadRefMap.delete(refId);
          console.log(
            `[MUNSoC Upload] Automatically cleaned up expired reference: ${refId}`,
          );
        }
      },
      15 * 60 * 1000,
    );

    return NextResponse.json({
      success: true,
      refId: refId,
    });
  } catch (err) {
    console.error("[MUNSoC Upload] Server error:", err);
    return NextResponse.json(
      { success: false, error: "Server error occurred during upload" },
      { status: 500 },
    );
  }
}
