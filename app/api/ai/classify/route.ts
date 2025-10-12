import { NextRequest, NextResponse } from "next/server";
import { getModel } from "@/lib/gemini";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { text, labels } = await req.json() as { text: string; labels?: string[] };
    const choices = labels?.length ? labels : ["Beginner","Intermediate","Advanced"];

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Invalid text" }, { status: 400 });
    }

    const model = getModel();
    const sys = `Classify the USER_TEXT into exactly one of the provided LABELS.
Return strict JSON only: {"label":"<one of labels>"} with no extra keys.`;

    const prompt = `LABELS: ${JSON.stringify(choices)}
USER_TEXT: ${text}
Return ONLY: {"label":"<one>"}
`;

    const res = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: sys }, { text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" },
    });

    const raw = res.response.text() || "{}";
    const parsed = JSON.parse(raw);
    const label = typeof parsed?.label === "string" ? parsed.label : choices[0];

    return NextResponse.json({ label });
  } catch (e: any) {
    console.error("[/api/ai/classify] error:", e?.message || e);
    return NextResponse.json({ error: "Classification error" }, { status: 500 });
  }
}
