import { NextRequest, NextResponse } from "next/server";
import { getModel } from "@/lib/gemini";

export const runtime = "nodejs";

const STYLE = `You are a calm, concise onboarding guide for new investors opening their first investment account.
- Use a Grade 6–8 reading level.
- Keep responses to 120 words or less unless the user asks for more detail.
- Be friendly, empathetic, and compliant with financial regulations.
- If sensitive information (SSN, DOB) is requested, add one short, reassuring note about privacy and regulatory compliance.
- Guide users through the account opening process step by step.
- Answer questions naturally and conversationally, like a helpful human advisor.`;

export async function POST(req: NextRequest) {
  try {
    const { prompt, context, sessionId, currentStep } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Invalid prompt" }, { status: 400 });
    }

    const model = getModel(); // gemini-1.5-flash by default
    
    // Build context information
    const contextInfo = {
      ...context,
      sessionId,
      currentStep,
    };
    
    const parts = [
      { text: STYLE },
      { text: `Context:\n${JSON.stringify(contextInfo, null, 2)}` },
      { text: `User:\n${prompt}` },
    ];

    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
    });

    const text = (result.response.text() || "").trim();
    
    // Determine if we should progress to the next step
    let nextStep = null;
    const lowerPrompt = prompt.toLowerCase();
    
    // Check if user is ready to move to next step
    if (lowerPrompt.includes("individual account") || lowerPrompt.includes("personal account") || lowerPrompt.includes("regular account")) {
      nextStep = "B"; // Move to Basics
    } else if (lowerPrompt.includes("ready") && lowerPrompt.includes("basics") && currentStep === "A") {
      nextStep = "B"; // Move to Basics
    }
    
    return NextResponse.json({ 
      text,
      nextStep,
      meta: {
        model: "gemini-1.5-flash",
        timestamp: new Date().toISOString(),
      },
    });
  } catch (e: any) {
    console.error("[/api/ai/complete] error:", e?.message || e);
    console.error("[/api/ai/complete] full error:", e);
    return NextResponse.json({ 
      error: "AI error occurred", 
      details: e?.message || String(e) 
    }, { status: 500 });
  }
}
