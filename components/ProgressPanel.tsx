"use client";

import React from "react";
import { Check } from "lucide-react";
import { Progress } from "./ui/progress";
import { cn } from "@/lib/utils";
import { OnboardingStep } from "@/lib/schemas";

interface ProgressPanelProps {
  currentStep: OnboardingStep;
  completedSteps: OnboardingStep[];
}

const STEPS = [
  { id: "A" as OnboardingStep, label: "Account Type", description: "Choose your investment account" },
  { id: "B" as OnboardingStep, label: "Basics", description: "Personal information" },
  { id: "C" as OnboardingStep, label: "Security", description: "Identity verification" },
  { id: "D" as OnboardingStep, label: "Address", description: "Residential details" },
  { id: "E" as OnboardingStep, label: "Employment", description: "Work & investor info" },
  { id: "F" as OnboardingStep, label: "Trusted Contact", description: "Emergency contact (optional)" },
  { id: "G" as OnboardingStep, label: "Review", description: "Confirm & submit" },
];

export function ProgressPanel({ currentStep, completedSteps }: ProgressPanelProps) {
  const progress = (completedSteps.length / STEPS.length) * 100;

  const isStepComplete = (stepId: OnboardingStep) => completedSteps.includes(stepId);
  const isStepCurrent = (stepId: OnboardingStep) => stepId === currentStep;

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 h-full">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Account Opening Progress
          </h3>
          <Progress value={progress} className="h-3" aria-label="Progress bar" />
          <p className="text-sm text-gray-600 mt-2">
            {Math.round(progress)}% Complete • Step {completedSteps.length + 1} of{" "}
            {STEPS.length}
          </p>
        </div>

        <div className="space-y-3">
          {STEPS.map((step, index) => {
            const isComplete = isStepComplete(step.id);
            const isCurrent = isStepCurrent(step.id);

            return (
              <div
                key={step.id}
                className={cn(
                  "flex gap-3 p-3 rounded-lg border transition-all",
                  isCurrent && "border-[#0B1F3B] bg-blue-50",
                  isComplete && "border-green-200 bg-green-50",
                  !isCurrent && !isComplete && "border-gray-200"
                )}
              >
                <div
                  className={cn(
                    "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm",
                    isComplete && "bg-green-600 text-white",
                    isCurrent && "bg-[#0B1F3B] text-white",
                    !isCurrent && !isComplete && "bg-gray-200 text-gray-600"
                  )}
                  aria-label={`Step ${step.id}: ${step.label}`}
                >
                  {isComplete ? <Check className="h-4 w-4" /> : step.id}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4
                      className={cn(
                        "font-medium text-sm",
                        isCurrent && "text-[#0B1F3B]",
                        isComplete && "text-green-900",
                        !isCurrent && !isComplete && "text-gray-700"
                      )}
                    >
                      {step.label}
                    </h4>
                    {isCurrent && (
                      <span className="text-xs bg-[#0B1F3B] text-white px-2 py-0.5 rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


