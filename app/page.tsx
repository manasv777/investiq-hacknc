"use client";

import React from "react";
import Link from "next/link";
import { Shield, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Compliance Banner */}
      <div className="bg-amber-50 border-b border-amber-200 py-2 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-amber-900">
            <Shield className="h-4 w-4" />
            <span>
              <strong>Demo Mode:</strong> This is a demonstration application. Do not
              enter real PII. No actual account will be created.
            </span>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#0B1F3B] rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#0B1F3B]">InvestIQ</h1>
              <p className="text-xs text-gray-600">Powered by AI</p>
            </div>
          </div>

          <nav className="flex items-center gap-4">
            <Link
              href="/learn"
              className="text-sm text-gray-600 hover:text-[#0B1F3B]"
            >
              Learn
            </Link>
            <Link
              href="/dashboard"
              className="text-sm text-gray-600 hover:text-[#0B1F3B]"
            >
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-900 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            <span>AI-Powered Investment Guidance</span>
          </div>

          <h2 className="text-5xl font-bold text-[#0B1F3B] mb-6">
            Open Your First Investment Account
            <br />
            <span className="text-blue-600">With Confidence</span>
          </h2>

          <p className="text-xl text-gray-600 mb-8">
            A calm, AI-guided companion to help you understand and complete every
            step of opening your investment account. No jargon, just clarity.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/onboarding">
              <Button size="lg" className="gap-2 text-lg px-8 py-6">
                Start AI-Guided Onboarding
              </Button>
            </Link>

            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6"
              asChild
            >
              <Link href="/learn">Learn First</Link>
            </Button>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            Takes about 10 minutes • No account required to explore
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg p-6 border border-gray-200 hover:border-[#0B1F3B] transition-colors">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-[#0B1F3B] mb-2">
              AI-Powered Guidance
            </h3>
            <p className="text-gray-600">
              Get instant explanations for any question. Our AI companion guides you through every step with clear, helpful responses.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 hover:border-[#0B1F3B] transition-colors">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-[#0B1F3B] mb-2">
              Safe & Compliant
            </h3>
            <p className="text-gray-600">
              Bank-level security with built-in compliance checks. Your information is
              protected every step of the way.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 hover:border-[#0B1F3B] transition-colors">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-[#0B1F3B] mb-2">
              Step-by-Step Process
            </h3>
            <p className="text-gray-600">
              Follow our guided 7-step process. Each step is clearly explained with helpful tips and instant AI assistance.
            </p>
          </div>
        </div>

        {/* Sponsor Badges */}
        <div className="text-center py-8 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-4">Powered By</p>
          <div className="flex flex-wrap justify-center gap-8 items-center">
            <div className="text-gray-400 font-semibold">Fidelity QuickVest</div>
            <div className="text-gray-400 font-semibold">Google Gemini</div>
            <div className="text-gray-400 font-semibold">Next.js 14</div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              © 2025 InvestIQ. Demo application for educational purposes.
            </p>
            <div className="flex gap-6 text-sm text-gray-600">
              <Link href="/deck" className="hover:text-[#0B1F3B]">
                View Deck
              </Link>
              <a href="#" className="hover:text-[#0B1F3B]">
                Privacy
              </a>
              <a href="#" className="hover:text-[#0B1F3B]">
                Terms
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
