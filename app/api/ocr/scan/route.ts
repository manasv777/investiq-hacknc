import { NextResponse } from "next/server";

// Note: Tesseract.js will be run client-side for better performance
// This endpoint is for server-side processing if needed in the future

export async function POST(request: Request) {
  try {
    // For now, return a message indicating client-side processing
    return NextResponse.json({
      message:
        "OCR processing is handled client-side using Tesseract.js for better performance and privacy",
      clientSide: true,
    });
  } catch (error) {
    console.error("OCR error:", error);
    return NextResponse.json(
      { error: "Failed to process OCR" },
      { status: 500 }
    );
  }
}


