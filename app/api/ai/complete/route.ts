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

    // Attempt generateContent with retries for transient 429 rate limits
    const maxRetries = 3;
    let attempt = 0;
    let result: any = null;

    while (attempt <= maxRetries) {
      try {
        result = await model.generateContent({
          contents: [{ role: "user", parts }],
        });
        break; // success
      } catch (err: any) {
        const msg = err?.message || String(err);
        // If it's a 429 / quota issue, retry with backoff
        if (msg.includes("429") || msg.includes("Too Many Requests") || msg.includes("quota")) {
          attempt++;
          if (attempt > maxRetries) {
            // rethrow to be handled by outer catch
            throw err;
          }
          // exponential backoff with jitter
          const delay = Math.pow(2, attempt) * 1000 + Math.floor(Math.random() * 500);
          console.warn(`[/api/ai/complete] 429 received; retrying attempt ${attempt}/${maxRetries} after ${delay}ms`);
          await new Promise((r) => setTimeout(r, delay));
          continue;
        }
        // Non-retryable error: rethrow
        throw err;
      }
    }

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
    const errorMsg = e?.message || String(e);
    console.error("[/api/ai/complete] error:", errorMsg);
    
    // Detect 429 Too Many Requests (quota exceeded)
    if (errorMsg.includes("429") || errorMsg.includes("Too Many Requests") || errorMsg.includes("quota")) {
      console.error("[/api/ai/complete] Quota exceeded. Retrying after delay...");
      return NextResponse.json({ 
        error: "Gemini API quota exceeded", 
        details: "The AI service is temporarily rate-limited. Please try again in a few moments.",
        retryAfter: 30,
      }, { status: 429 });
    }
    
    console.error("[/api/ai/complete] full error:", e);
    return NextResponse.json({ 
      error: "AI error occurred", 
      details: errorMsg
    }, { status: 500 });
  }
}
