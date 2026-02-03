"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { KpiCard } from "@/components/KpiCard";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useSessionStore } from "@/store/session";
import { AccountList } from "@/components/AccountList";
import { MarketCharts } from "@/components/MarketCharts";
import { MarketWatch } from "@/components/MarketWatch";

export default function DashboardPage() {
  const { data: session } = useSession();
  const initializeSession = useSessionStore((s) => s.initializeSession);
  const currentUserId = useSessionStore((s) => s.userId);
  useEffect(() => {
    if (session?.user?.id && session.user.id !== currentUserId) {
      initializeSession(session.user.id);
    }
  }, [session?.user?.id, currentUserId, initializeSession]);
  // Derive a simple application status from persisted onboarding data
  // In a real app, read this from a database
  const stored = (typeof window !== "undefined" && window.localStorage.getItem("investiq-session")) || null;
  const parsed = stored ? (() => { try { return JSON.parse(stored); } catch { return null; } })() : null;
  const onboarding = parsed?.state?.onboardingData || {};
  const appStatus = onboarding?.applicationStatus === 'approved'
    ? 'Approved'
    : onboarding?.applicationStatus === 'rejected'
      ? 'Rejected'
      : onboarding?.completedAt
        ? 'Submitted'
        : onboarding?.currentStep
          ? `In Progress (Step ${onboarding.currentStep})`
          : 'Not Started';

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild className="gap-2">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-xl font-semibold text-[#0B1F3B]">My Dashboard</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {!session ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <h2 className="text-xl font-semibold text-[#0B1F3B] mb-2">Welcome</h2>
              <p className="text-gray-600">Sign in to see your personal portfolio dashboard.</p>
              <div className="mt-4">
                <Button asChild>
                  <Link href="/login">Sign in</Link>
                </Button>
              </div>
            </div>
        ) : (
          <div className="space-y-8">
            {onboarding?.applicationStatus === 'approved' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-1">Your account is activated</h3>
                <p className="text-sm text-green-800 mb-3">Trading features are now enabled. You can fund your account and place trades.</p>
                <div className="flex gap-3">
                  <Link href="/trade" className="text-sm text-white bg-[#0B1F3B] px-3 py-2 rounded-md">Open Trading</Link>
                  <Button variant="outline" className="text-sm">Deposit Funds</Button>
                </div>
              </div>
            )}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-[#0B1F3B] mb-1">Application Status</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-700">{appStatus}</p>
                  {onboarding?.kycStatus && (
                    <p className="text-xs text-gray-500 mt-1">KYC: {onboarding.kycStatus}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {onboarding?.kycUrl && onboarding?.kycStatus !== 'approved' && (
                    <a href={onboarding.kycUrl} target="_blank" rel="noreferrer" className="text-sm text-blue-700 hover:underline">Continue KYC</a>
                  )}
                  <Link href="/onboarding" className="text-sm text-blue-700 hover:underline">
                    {onboarding?.completedAt ? "View Application" : "Resume Application"}
                  </Link>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AccountList
                accounts={[
                  { id: "1", name: "Brokerage", type: "Individual", balance: 15234.56, changePct: 0.64 },
                  { id: "2", name: "Roth IRA", type: "Retirement", balance: 7543.11, changePct: -0.22 },
                ]}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <KpiCard label="Total Balance" value="$24,580.12" />
                <KpiCard label="1D P/L" value="$+320.44" />
          </div>
        </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <MarketCharts
                  data={[
                    {
                      name: "S&P 500",
                      series: [
                        { time: "9:30", value: 5080 },
                        { time: "10:00", value: 5092 },
                        { time: "10:30", value: 5087 },
                        { time: "11:00", value: 5101 },
                        { time: "11:30", value: 5098 },
                        { time: "12:00", value: 5105 },
                        { time: "12:30", value: 5110 },
                      ],
                    },
                    {
                      name: "NASDAQ",
                      series: [
                        { time: "9:30", value: 16200 },
                        { time: "10:00", value: 16230 },
                        { time: "10:30", value: 16210 },
                        { time: "11:00", value: 16260 },
                        { time: "11:30", value: 16240 },
                        { time: "12:00", value: 16280 },
                        { time: "12:30", value: 16290 },
                      ],
                    },
                  ]}
                />
              </div>
              <div>
                <MarketWatch
                  tickers={[
                    { symbol: "SPY", price: 512.34, changePct: 0.42 },
                    { symbol: "QQQ", price: 434.21, changePct: 0.55 },
                    { symbol: "DIA", price: 397.76, changePct: -0.18 },
                    { symbol: "IWM", price: 208.19, changePct: 0.92 },
                  ]}
                />
          </div>
        </div>
          </div>
        )}
      </main>
    </div>
  );
}


