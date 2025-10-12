"use client";

import React from "react";
import { HelpCircle } from "lucide-react";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface ExplainChipProps {
  topic: string;
  onClick: () => void;
}

export function ExplainChip({ topic, onClick }: ExplainChipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={onClick}
            className="gap-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <HelpCircle className="h-3 w-3" />
            <span className="text-xs">Why {topic}?</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Click to hear an explanation</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}


