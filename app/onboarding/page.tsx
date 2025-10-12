"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Chat } from "@/components/Chat";
import { ProgressPanel } from "@/components/ProgressPanel";
import { OnboardingSteps } from "@/components/OnboardingSteps";
import { useSessionStore } from "@/store/session";
import { OnboardingStep } from "@/lib/schemas";
import { WELCOME_MESSAGE } from "@/lib/prompts";
import Tesseract from "tesseract.js";
import { extractFieldsFromOCR, calculateMatchScore } from "@/lib/ocr";
import confetti from "canvas-confetti";

const STEP_ORDER: OnboardingStep[] = ["A", "B", "C", "D", "E", "F", "G"];

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    onboardingData,
    setCurrentStep,
    markStepComplete,
    addChatMessage,
    initializeSession,
    updateOnboardingData,
  } = useSessionStore();

  useEffect(() => {
    // Initialize session if not already done
    if (!onboardingData.sessionId) {
      initializeSession();
    }

    // Add welcome message if chat is empty
    const hasMessages = useSessionStore.getState().chatMessages.length > 0;
    if (!hasMessages) {
      addChatMessage({
        role: "assistant",
        content: "Hi! I'm here to help you through opening your first investment account. This process usually takes about 10 minutes. I'll explain each step and answer any questions you have. Ready to get started?",
      });
    }
  }, []);

  const currentStepIndex = STEP_ORDER.indexOf(
    onboardingData.currentStep || "A"
  );

  const canGoNext = () => {
    // Add validation logic for each step
    const data = onboardingData;

    switch (data.currentStep) {
      case "A":
        return !!data.accountType;
      case "B":
        return !!(data.firstName && data.lastName && data.email && data.mobile);
      case "C":
        return !!(data.dob && data.isUsCitizen !== undefined);
      case "D":
        return !!(data.street && data.city && data.state && data.zip);
      case "E":
        return (
          !!data.employmentStatus && !data.isRestrictedPerson
        );
      case "F":
        return true; // Optional step
      case "G":
        return !!(
          data.acknowledgedTerms &&
          data.acknowledgedRisks &&
          data.acknowledgedAccuracy &&
          data.acknowledgedPrivacy
        );
      default:
        return false;
    }
  };

  const handleNext = async () => {
    const current = onboardingData.currentStep || "A";

    // Mark current step as complete
    markStepComplete(current);

    // Log completion
    await fetch("/api/logs/append", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: onboardingData.sessionId,
        step: current,
        completed: true,
      }),
    });

    // Move to next step
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEP_ORDER.length) {
      setCurrentStep(STEP_ORDER[nextIndex]);
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(STEP_ORDER[prevIndex]);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Mark final step complete
      markStepComplete("G");
      // Persist completion timestamp to local state so dashboards reflect submission
      const completedAtIso = new Date().toISOString();
      updateOnboardingData({ completedAt: completedAtIso });

      // Log completion
      await fetch("/api/logs/append", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: onboardingData.sessionId,
          step: "G",
          completed: true,
        }),
      });

      // Save session
      await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: onboardingData.sessionId,
          updates: {
            ...onboardingData,
            completedAt: completedAtIso,
          },
        }),
      });

      // Show success
      setShowSuccess(true);

      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      // Redirect after delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
    } catch (error) {
      console.error("Submission error:", error);
      alert("There was an error submitting your application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExplainClick = async (topic: string) => {
    // Trigger AI explanation via chat
    addChatMessage({
      role: "user",
      content: `Can you explain ${topic}?`,
    });

    // Get AI response
    try {
      const response = await fetch("/api/ai/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Explain ${topic} in the context of opening an investment account.`,
        }),
      });

      const data = await response.json();

      // Add AI message
      addChatMessage({
        role: "assistant",
        content: data.text,
      });
    } catch (error) {
      console.error("Explain error:", error);
    }
  };

  const handleScanDocument = async (type: "id" | "utility-bill") => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async (e: any) => {
      const file = e.target?.files?.[0];
      if (!file) return;

      addChatMessage({
        role: "assistant",
        content: `Scanning your ${type === "id" ? "ID" : "utility bill"}. This may take a moment...`,
      });

      try {
        const result = await Tesseract.recognize(file, "eng", {
          logger: (m) => console.log(m),
        });

        const extractedFields = extractFieldsFromOCR(result.data.text);

        // Calculate match score
        const matchResult = calculateMatchScore(extractedFields, {
          name: `${onboardingData.firstName} ${onboardingData.lastName}`,
          dob: onboardingData.dob,
          address: onboardingData.street,
        });

        const message =
          matchResult.score >= 70
            ? `✅ Identity Check: Passed (${matchResult.score}% match). Fields verified: ${matchResult.matches.join(", ")}.`
            : `⚠️ Identity Check: Needs Review (${matchResult.score}% match). Please verify your information matches your documents.`;

        addChatMessage({
          role: "assistant",
          content: message,
        });
      } catch (error) {
        console.error("OCR error:", error);
        addChatMessage({
          role: "assistant",
          content:
            "Sorry, I had trouble scanning the document. Please make sure the image is clear and try again.",
        });
      }
    };

    input.click();
  };

  if (status === "unauthenticated") {
    router.push("/login");
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🎉</span>
          </div>
          <h1 className="text-3xl font-bold text-[#0B1F3B] mb-4">
            Application Submitted!
          </h1>
          <p className="text-gray-600 mb-6">
            Thank you for completing your investment account application. We'll
            review your information and get back to you within 1-2 business days.
          </p>
          <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Compliance Banner */}
      <div className="bg-amber-50 border-b border-amber-200 py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-amber-900">
          <Shield className="h-3 w-3" />
          <span>
            <strong>Compliance Mode:</strong> Demo only. Sensitive inputs are
            masked. Do not enter real PII.
          </span>
        </div>
      </div>

      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>

          <h1 className="text-lg font-semibold text-[#0B1F3B]">
            Account Opening
          </h1>

          <div className="w-24" /> {/* Spacer */}
        </div>
      </header>

      {/* Two-pane layout */}
      <main className="max-w-7xl mx-auto p-4">
        <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          {/* Left: Chat/Voice */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col">
            <div className="border-b border-gray-200 p-4 bg-gray-50">
              <h2 className="font-semibold text-[#0B1F3B]">
                AI Chat Assistant
              </h2>
              <p className="text-sm text-gray-600">
                Ask questions anytime for instant help
              </p>
            </div>
            <Chat />
          </div>

          {/* Right: Progress + Form */}
          <div className="space-y-6 overflow-y-auto">
            {/* Progress Panel */}
            <div className="bg-white rounded-lg">
              <ProgressPanel
                currentStep={onboardingData.currentStep || "A"}
                completedSteps={onboardingData.completedSteps || []}
              />
            </div>

            {/* Current Step Form */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mt-6">
              <OnboardingSteps
                onExplainClick={handleExplainClick}
                onScanDocument={handleScanDocument}
              />

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStepIndex === 0}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>

                {onboardingData.currentStep === "G" ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={!canGoNext() || isSubmitting}
                    className="gap-2"
                  >
                    {isSubmitting ? "Submitting..." : "Open My Account"}
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    disabled={!canGoNext()}
                    className="gap-2"
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

