import "server-only";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

const DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";
const DEFAULT_MAX_OUTPUT_TOKENS = Number(process.env.GEMINI_MAX_OUTPUT_TOKENS || 256);
const DEFAULT_TEMPERATURE = Number(process.env.GEMINI_TEMPERATURE || 0.3);

export function getModel(modelName = DEFAULT_MODEL) {
  if (!apiKey) {
    // Mock model for demo mode without API key
    return {
      async generateContent(_: any) {
        const text = () =>
          "I'm running in demo mode without a Gemini API key. You can still proceed through the onboarding steps and explanations.";
        return { response: { text } } as any;
      },
    } as any;
  }

  const genAI = new GoogleGenerativeAI(apiKey as string);
  return genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      maxOutputTokens: DEFAULT_MAX_OUTPUT_TOKENS,
      temperature: DEFAULT_TEMPERATURE,
    },
  });
}

export interface GenerateTextOptions {
  model?: string;
  systemInstruction?: string;
  contextParts?: Array<{ text: string }>; // additional context blocks
}

export async function generateText(prompt: string, options: GenerateTextOptions = {}) {
  const { model = DEFAULT_MODEL, systemInstruction, contextParts = [] } = options;
  const modelInstance = getModel(model);

  const parts = [
    ...(systemInstruction ? [{ text: systemInstruction }] : []),
    ...contextParts,
    { text: prompt },
  ];

  const result = await modelInstance.generateContent({
    contents: [{ role: "user", parts }],
  });

  return (result.response.text() || "").trim();
}

