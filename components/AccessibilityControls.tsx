"use client";

import React, { useEffect, useState } from "react";

type TextSize = "base" | "lg" | "xl";

export function AccessibilityControls() {
  const [highContrast, setHighContrast] = useState(false);
  const [textSize, setTextSize] = useState<TextSize>("base");

  // Load saved preferences
  useEffect(() => {
    try {
      const savedContrast = localStorage.getItem("a11y.highContrast");
      const savedText = localStorage.getItem("a11y.textSize") as TextSize | null;
      if (savedContrast) setHighContrast(savedContrast === "true");
      if (savedText) setTextSize(savedText);
    } catch {}
  }, []);

  // Apply preferences to documentElement
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("a11y-high-contrast", highContrast);
    root.dataset.textSize = textSize;
  }, [highContrast, textSize]);

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem("a11y.highContrast", String(highContrast));
      localStorage.setItem("a11y.textSize", textSize);
    } catch {}
  }, [highContrast, textSize]);

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-md border border-gray-300 bg-white/95 backdrop-blur px-2 py-1 shadow-sm"
      role="region"
      aria-label="Accessibility controls"
    >
      <label className="flex items-center gap-1 text-xs">
        <input
          type="checkbox"
          checked={highContrast}
          onChange={(e) => setHighContrast(e.target.checked)}
          aria-label="High contrast mode"
        />
        High contrast
      </label>
      <div className="flex items-center gap-1 text-xs" aria-label="Text size">
        <button
          type="button"
          className={`px-2 py-0.5 rounded border ${textSize === "base" ? "bg-gray-100" : "bg-white"}`}
          onClick={() => setTextSize("base")}
          aria-pressed={textSize === "base"}
        >
          A
        </button>
        <button
          type="button"
          className={`px-2 py-0.5 rounded border ${textSize === "lg" ? "bg-gray-100" : "bg-white"}`}
          onClick={() => setTextSize("lg")}
          aria-pressed={textSize === "lg"}
        >
          A+
        </button>
        <button
          type="button"
          className={`px-2 py-0.5 rounded border ${textSize === "xl" ? "bg-gray-100" : "bg-white"}`}
          onClick={() => setTextSize("xl")}
          aria-pressed={textSize === "xl"}
        >
          A++
        </button>
      </div>
    </div>
  );
}


