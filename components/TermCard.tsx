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

      const data = await response.json();

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
        </div>
      </div>
    </div>
  );
}