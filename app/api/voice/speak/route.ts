import { NextRequest } from "next/server";

export const runtime = "nodejs";

const ELEVEN_API = "https://api.elevenlabs.io/v1/text-to-speech";
// Default to ElevenLabs' sample "Rachel" voice ID if not provided via env
// Docs commonly reference: 21m00Tcm4TlvDq8ikWAM
const DEFAULT_VOICE = process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM";

export async function POST(req: NextRequest) {
  try {
    const { text, voiceId, format } = await req.json();
    if (!text || typeof text !== "string") {
      return new Response(JSON.stringify({ error: "Invalid text" }), { status: 400 });
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      // No TTS available; signal client to skip playback
      return new Response(null, { status: 204 });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    const accept = typeof format === "string" && format ? format : "audio/mpeg";
    const response = await fetch(`${ELEVEN_API}/${encodeURIComponent(voiceId || DEFAULT_VOICE)}`, {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        "Accept": accept,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const msg = await response.text().catch(() => "");
      return new Response(JSON.stringify({ error: "TTS error", details: msg }), { status: 502 });
    }

    const audio = await response.arrayBuffer();
    const contentType = response.headers.get("Content-Type") || accept || "audio/mpeg";
    return new Response(audio, {
      status: 200,
      headers: { "Content-Type": contentType, "Cache-Control": "public, max-age=60" },
    });
  } catch (err: any) {
    const message = typeof err?.message === "string" ? err.message : String(err);
    if (err?.name === "AbortError") {
      return new Response(JSON.stringify({ error: "TTS timeout", details: message }), { status: 504 });
    }
    return new Response(JSON.stringify({ error: "TTS failure", details: message }), { status: 500 });
  }
}


