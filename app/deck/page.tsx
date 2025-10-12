"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const SLIDES = [
  {
    number: 1,
    title: "Problem & Challenge",
    content: [
      "First-time investors face significant barriers:",
      "• Complex jargon and confusing processes",
      "• Anxiety about making mistakes with personal information",
      "• Lack of real-time guidance and support",
      "• Overwhelming forms with unclear requirements",
      "Result: Many give up before completing account opening",
    ],
  },
  {
    number: 2,
    title: "Solution: InvestIQ",
    content: [
      "A calm, voice-guided AI companion that:",
      "• Explains every step in plain language (grade 6-8 level)",
      "• Responds to questions via voice or text instantly",
      "• Provides contextual 'Explain This Step' chips throughout",
      "• Scans documents (ID, utility bills) with client-side OCR",
      "• Masks sensitive inputs for privacy and compliance",
    ],
  },
  {
    number: 3,
    title: "User Experience Flow",
    content: [
      "🏠 Home: Hero section with compliance banner and sponsor badges",
      "🎙️ Onboarding: Two-pane wizard (Chat + Progress)",
      "  • Steps A-G: Account type → Basics → Security → Address → Employment → Trusted Contact → Review",
      "  • Voice/text input with real-time AI guidance",
      "  • Document scanning with identity verification",
      "  • Deny rules for restricted persons (board members, etc.)",
      "📊 Dashboard: Session analytics, completion rates, top FAQs",
      "📚 Learn: Voice-enabled glossary of investment terms",
    ],
  },
  {
    number: 4,
    title: "AI & Architecture",
    content: [
      "Tech Stack:",
      "• Next.js 14 App Router + TypeScript + Tailwind CSS",
      "• Zustand for state management",
      "• Snowflake Cortex (mistral-large) for AI guidance",
      "• ElevenLabs for text-to-speech (female voice)",
      "• Tesseract.js for client-side OCR",
      "• Mock Adapter fallback when Snowflake unavailable",
      "",
      "Key Features:",
      "• ≤120 word responses, grade 6-8 reading level",
      "• Subtitles rendered under all audio",
      "• Full keyboard navigation + ARIA labels",
    ],
  },
  {
    number: 5,
    title: "Results & Next Steps",
    content: [
      "✅ Accessibility: Voice + captions + keyboard nav",
      "✅ Compliance: Deny rules, audit logs, masked inputs",
      "✅ Innovation: Voice-first, adaptive pace, explain chips",
      "✅ Feasibility: Snowflake-ready with mock fallback",
      "",
      "Metrics:",
      "• ~10 minute completion time",
      "• 7-step wizard with progress tracking",
      "• Real-time AI guidance in <2 seconds",
      "",
      "Next Steps:",
      "• Production Snowflake integration",
      "• Real ID verification (e.g., Stripe Identity)",
      "• Multi-language support",
      "• Risk assessment questionnaire integration",
    ],
  },
];

export default function DeckPage() {
  const handleExport = async () => {
    try {
      const response = await fetch("/api/deck/export");
      const data = await response.json();
      console.log("Deck data:", data);
      alert(
        "PDF export would be generated here using headless browser (Puppeteer). See console for deck data."
      );
    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to export deck. See console for details.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild className="gap-2">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-xl font-semibold text-[#0B1F3B]">
              Presentation Deck
            </h1>
          </div>

          <Button onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <div className="space-y-8">
          {SLIDES.map((slide) => (
            <div
              key={slide.number}
              className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-[#0B1F3B] rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  {slide.number}
                </div>
                <h2 className="text-2xl font-bold text-[#0B1F3B]">
                  {slide.title}
                </h2>
              </div>

              <div className="space-y-2">
                {slide.content.map((line, index) => (
                  <p
                    key={index}
                    className={`${
                      line.startsWith("•")
                        ? "ml-4 text-gray-700"
                        : line.startsWith(" ")
                        ? "ml-8 text-gray-700"
                        : "text-gray-900"
                    } ${
                      line.match(/^[🏠🎙️📊📚✅]/)
                        ? "font-semibold text-lg mt-4"
                        : ""
                    }`}
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-sm text-blue-900">
            <strong>Note:</strong> Full PDF export would use Puppeteer to capture
            screenshots of each slide and generate a downloadable PDF. The export
            button above shows the data structure.
          </p>
        </div>
      </main>
    </div>
  );
}

