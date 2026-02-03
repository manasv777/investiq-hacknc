"use client";

import React, { useRef, useEffect, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useSessionStore } from "@/store/session";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function Chat() {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    chatMessages,
    addChatMessage,
    onboardingData,
    setCurrentStep,
    markStepComplete,
  } = useSessionStore();
  const router = useRouter();

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

      let data: any = {};
      try {
        data = await response.json();
      } catch {
        const fallbackText = await response.text().catch(() => "");
        throw new Error(fallbackText || "Invalid server response");
      }

      if (!response.ok) {
        const errorDetails = data.details || data.error || "Failed to get AI response";
        
        // Handle 429 quota exceeded
        if (response.status === 429) {
          throw new Error(`Quota exceeded: ${errorDetails} (retry in ${data.retryAfter || 30}s)`);
        }
        
        throw new Error(errorDetails);
      }

      // Add AI message
      addChatMessage({
        role: "assistant",
        content: data.text,
      });

      // If server instructed a redirect (e.g., "open account"), navigate to dashboard
      if (data.redirectTo === "dashboard") {
        try {
          router.push("/dashboard");
        } catch (e) {
          console.warn("Router push failed", e);
        }
      }

      // Handle step progression if AI indicates we should move to next step
      if (data.nextStep && data.nextStep !== onboardingData.currentStep) {
        if (onboardingData.currentStep) {
          markStepComplete(onboardingData.currentStep);
        }
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
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4"
        role="log"
        aria-live="polite"
        aria-relevant="additions text"
        aria-atomic="false"
        aria-label="Chat messages"
        aria-busy={isLoading}
      >
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

            {message.role === "assistant" && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="text-xs underline text-blue-700 hover:text-blue-900"
                  aria-label="Listen to this response"
                  aria-busy={playingId === message.id}
                  onClick={async () => {
                    try {
                      setPlayingId(message.id);
                      const audioEl = document.createElement("audio");
                      const canMp3 = !!audioEl.canPlayType && audioEl.canPlayType("audio/mpeg") !== "";
                      const canOgg = !!audioEl.canPlayType && audioEl.canPlayType("audio/ogg; codecs=opus") !== "";
                      const preferred = canMp3 ? "audio/mpeg" : canOgg ? "audio/ogg" : "audio/mpeg";
                      const res = await fetch("/api/voice/speak", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ text: message.content, format: preferred }),
                      });
                      if (res.status === 204) return; // No audio available
                      if (!res.ok) {
                        // Warn in console, but don't throw to the user path
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
                      audio.onended = () => {
                        URL.revokeObjectURL(url);
                        setPlayingId((id) => (id === message.id ? null : id));
                      };
                      await audio.play();
                    } catch (e) {
                      console.error("Audio play error", e);
                    } finally {
                      setPlayingId((id) => (id === message.id ? null : id));
                    }
                  }}
                >
                  {playingId === message.id ? "Playing…" : "Listen"}
                </button>
              </div>
            )}
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
            <span className="sr-only" aria-live="polite">Assistant is typing</span>
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
            aria-describedby="chat-input-help"
          />

          <Button
            type="submit"
            size="icon"
            disabled={!inputValue.trim() || isLoading}
            aria-label="Send message"
          >
            <Send className="h-5 w-5" />
          </Button>
          <p id="chat-input-help" className="sr-only">Press Enter to send. Use Shift+Enter for a new line.</p>
        </form>
      </div>
    </div>
  );
}