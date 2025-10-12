"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TradePage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild className="gap-2">
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-xl font-semibold text-[#0B1F3B]">Trading</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <h2 className="text-lg font-semibold text-[#0B1F3B] mb-2">Welcome to Trading</h2>
          <p className="text-sm text-gray-700 mb-4">This is a placeholder. Connect a brokerage API to enable live trading features.</p>
          <div className="flex gap-3">
            <Button disabled>Buy</Button>
            <Button disabled>Sell</Button>
          </div>
        </div>
      </main>
    </div>
  );
}


