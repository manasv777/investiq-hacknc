"use client";

import React, { useRef, useEffect, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useSessionStore } from "@/store/session";
import { cn } from "@/lib/utils";

export function Chat() {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    chatMessages,
    addChatMessage,
    onboardingData,
    setCurrentStep,
    markStepComplete,
  } = useSessionStore();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    // Add user message
    addChatMessage({
      role: "user",
      content: message,
    });

    setInputValue("");
    setIsLoading(true);

    try {
      // Call AI completion API
      const response = await fetch("/api/ai/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: message,
          sessionId: onboardingData.sessionId,
          currentStep: onboardingData.currentStep,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get AI response");
      }

      // Add AI message
      addChatMessage({
        role: "assistant",
        content: data.text,
      });

      // Handle step progression if AI indicates we should move to next step
      if (data.nextStep && data.nextStep !== onboardingData.currentStep) {
        markStepComplete(onboardingData.currentStep);
        setCurrentStep(data.nextStep);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      addChatMessage({
        role: "assistant",
        content:
          "I apologize, but I encountered an error. Please try again or contact support if the issue persists.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <p className="text-lg font-medium">Welcome to InvestIQ</p>
            <p className="text-sm mt-2">
              Ask me anything about the account opening process.
            </p>
          </div>
        )}

        {chatMessages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex flex-col gap-2",
              message.role === "user" ? "items-end" : "items-start"
            )}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-lg px-4 py-2",
                message.role === "user"
                  ? "bg-[#0B1F3B] text-white"
                  : "bg-gray-100 text-gray-900"
              )}
            >
              <p className="text-sm">{message.content}</p>
            </div>

            <span className="text-xs text-gray-500">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-2">
            <div className="bg-gray-100 rounded-lg px-4 py-2">
              <div className="flex gap-1">
                <span className="animate-bounce delay-0">●</span>
                <span className="animate-bounce delay-100">●</span>
                <span className="animate-bounce delay-200">●</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1"
            aria-label="Chat message input"
          />

          <Button
            type="submit"
            size="icon"
            disabled={!inputValue.trim() || isLoading}
            aria-label="Send message"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}