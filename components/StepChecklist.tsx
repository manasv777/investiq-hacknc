"use client";

import React from "react";
import { CheckCircle2, Circle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  required: boolean;
  error?: string;
}

interface StepChecklistProps {
  items: ChecklistItem[];
  className?: string;
}

export function StepChecklist({ items, className }: StepChecklistProps) {
  return (
    <div className={cn("space-y-2", className)} role="checklist">
      {items.map((item) => (
        <div
          key={item.id}
          className={cn(
            "flex items-start gap-2 p-2 rounded-md",
            item.error && "bg-red-50"
          )}
        >
          {item.completed ? (
            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          ) : (
            <Circle className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "text-sm",
                  item.completed && "text-green-900 font-medium",
                  !item.completed && "text-gray-700"
                )}
              >
                {item.label}
              </span>
              {item.required && !item.completed && (
                <span className="text-xs text-red-600">*Required</span>
              )}
            </div>

            {item.error && (
              <div className="flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3 text-red-600" />
                <span className="text-xs text-red-600">{item.error}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}


