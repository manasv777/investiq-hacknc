"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TermCard } from "@/components/TermCard";

const GLOSSARY_TERMS = [
  "Roth IRA",
  "ETF",
  "Diversification",
  "Dollar-Cost Averaging",
  "Index Fund",
  "Compound Interest",
  "Expense Ratio",
  "Bull Market",
  "Bear Market",
  "Dividend",
  "Asset Allocation",
  "Risk Tolerance",
  "Portfolio",
  "Mutual Fund",
  "Bond",
  "Stock",
  "Cryptocurrency",
  "Market Cap",
  "P/E Ratio",
  "Yield",
];

export default function LearnPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTerms = GLOSSARY_TERMS.filter((term) =>
    term.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <h1 className="text-xl font-semibold text-[#0B1F3B]">
              Investment Glossary
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {/* Hero */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#0B1F3B] mb-4">
            Learn Investment Terms
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore key financial concepts with simple explanations. Click any term to get an AI-powered explanation.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for a term..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>
        </div>

        {/* Terms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTerms.map((term) => (
            <TermCard key={term} term={term} />
          ))}
        </div>

        {filteredTerms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">
              No terms found matching "{searchQuery}". Try a different search.
            </p>
          </div>
        )}

        {/* Additional Resources */}
        <div className="mt-16 bg-white rounded-lg border border-gray-200 p-8">
          <h3 className="text-2xl font-bold text-[#0B1F3B] mb-4">
            Ready to Start Investing?
          </h3>
          <p className="text-gray-600 mb-6">
            Now that you're familiar with key investment terms, you can start the
            account opening process with confidence.
          </p>
          <Button asChild size="lg">
            <Link href="/onboarding">Start Your Application</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}

