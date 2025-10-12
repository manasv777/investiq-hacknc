import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // For now, return a simple message
    // Full PDF generation would require puppeteer or similar
    return NextResponse.json({
      message: "Deck export functionality",
      slides: [
        {
          title: "Problem & Challenge",
          content:
            "First-time investors face complexity and anxiety when opening investment accounts. Traditional processes lack guidance and feel overwhelming.",
        },
        {
          title: "Solution: InvestIQ",
          content:
            "Voice-first AI companion that guides users through account opening with calm explanations, document scanning, and real-time support.",
        },
        {
          title: "UX Flow",
          content:
            "Home → Voice Onboarding (A-G steps) → Document Scan → Review → Success. Each step includes AI guidance and explain-this-step chips.",
        },
        {
          title: "AI & Architecture",
          content:
            "Google Gemini AI for intelligent guidance, Tesseract.js for OCR, Next.js 14 App Router, TypeScript, Tailwind CSS.",
        },
        {
          title: "Results & Next Steps",
          content:
            "Accessible (AI chat + keyboard navigation), compliant (deny rules, audit logs), innovative (AI-powered guidance, adaptive responses). Next: real ID verification, enhanced security features.",
        },
      ],
    });
  } catch (error) {
    console.error("Deck export error:", error);
    return NextResponse.json(
      { error: "Failed to export deck" },
      { status: 500 }
    );
  }
}

