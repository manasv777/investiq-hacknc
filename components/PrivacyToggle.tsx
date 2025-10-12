"use client";

import React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "./ui/button";
import { useSessionStore } from "@/store/session";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export function PrivacyToggle() {
  const { showPrivateInput, setShowPrivateInput } = useSessionStore();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => setShowPrivateInput(!showPrivateInput)}
            className="gap-2"
            aria-label={
              showPrivateInput
                ? "Hide sensitive information"
                : "Show sensitive information"
            }
            aria-pressed={showPrivateInput}
          >
            {showPrivateInput ? (
              <>
                <EyeOff className="h-4 w-4" />
                <span className="text-sm">Hide Sensitive</span>
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                <span className="text-sm">Show Sensitive</span>
              </>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {showPrivateInput
              ? "Click to mask SSN and DOB"
              : "Click to reveal masked fields"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}


