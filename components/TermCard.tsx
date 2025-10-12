"use client";

import React, { useState } from "react";
import { BookOpen } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface TermCardProps {
  term: string;
  onExplain?: (term: string) => void;
  className?: string;
}

export function TermCard({ term, onExplain, className }: TermCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [explanation, setExplanation] = useState<string>("");
  const [isTtsLoading, setIsTtsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleExplain = async () => {
    if (explanation) {
      return;
    }

    setIsLoading(true);

    try {
      // Get explanation from AI
      const response = await fetch("/api/ai/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Explain the term "${term}" in simple language for a beginner investor.`,
        }),
      });

      let data: any = {};
      try {
        data = await response.json();
      } catch {
        const txt = await response.text().catch(() => "");
        throw new Error(txt || "Invalid server response");
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to get explanation");
      }

      setExplanation(data.text);
      onExplain?.(term);
    } catch (error) {
      console.error("Error explaining term:", error);
      setExplanation("Sorry, I couldn't load the explanation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleListen = async () => {
    try {
      // If we don't have an explanation yet, load it first
      if (!explanation && !isLoading) {
        await handleExplain();
      }
      if (!explanation) return;

      setIsTtsLoading(true);
      const audioEl = document.createElement("audio");
      const canMp3 = !!audioEl.canPlayType && audioEl.canPlayType("audio/mpeg") !== "";
      const canOgg = !!audioEl.canPlayType && audioEl.canPlayType("audio/ogg; codecs=opus") !== "";
      const preferred = canMp3 ? "audio/mpeg" : canOgg ? "audio/ogg" : "audio/mpeg";
      const res = await fetch("/api/voice/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: explanation, format: preferred }),
      });
      if (res.status === 204) return; // no audio available
      if (!res.ok) {
        const details = await res.text().catch(() => "");
        console.warn("TTS non-OK response", res.status, details);
        return;
      }
      const type = res.headers.get("Content-Type") || "";
      if (!type.includes("audio")) throw new Error("Unsupported media type");
      const blob = await res.blob();
      if (!blob || blob.size === 0) return;
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.onplay = () => setIsPlaying(true);
      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(url);
      };
      await audio.play();
    } catch (e) {
      console.error("TTS play error", e);
    } finally {
      setIsTtsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "border border-gray-200 rounded-lg p-4 hover:border-[#0B1F3B] transition-colors",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-4 w-4 text-[#0B1F3B]" />
            <h4 className="font-medium text-gray-900">{term}</h4>
          </div>

          {explanation && (
            <p className="text-sm text-gray-700 mb-3">{explanation}</p>
          )}

          <Button
            size="sm"
            variant="outline"
            onClick={handleExplain}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? "Loading..." : explanation ? "Read Again" : "Explain"}
          </Button>

          {explanation && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleListen}
              disabled={isTtsLoading}
              className="ml-2"
              aria-label={`Listen to the definition of ${term}`}
              aria-busy={isTtsLoading || isPlaying}
            >
              {isTtsLoading ? "Preparing…" : isPlaying ? "Playing…" : "Listen"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}