import "server-only";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) throw new Error("GEMINI_API_KEY is missing.");

const DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";
const DEFAULT_MAX_OUTPUT_TOKENS = Number(process.env.GEMINI_MAX_OUTPUT_TOKENS || 256);
const DEFAULT_TEMPERATURE = Number(process.env.GEMINI_TEMPERATURE || 0.3);

export function getModel(modelName = DEFAULT_MODEL) {
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      maxOutputTokens: DEFAULT_MAX_OUTPUT_TOKENS,
      temperature: DEFAULT_TEMPERATURE,
    },
  });
}


