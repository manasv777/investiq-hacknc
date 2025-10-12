"use client";

import React from "react";

interface Ticker {
  symbol: string;
  price: number;
  changePct: number;
}

interface MarketWatchProps {
  tickers: Ticker[];
}

export function MarketWatch({ tickers }: MarketWatchProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#0B1F3B]">Market Watch</h3>
        <button className="text-sm text-blue-700 hover:underline">View Markets</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {tickers.map((t) => (
          <div key={t.symbol} className="rounded border border-gray-200 p-3">
            <div className="text-xs text-gray-500">{t.symbol}</div>
            <div className="text-sm font-semibold text-gray-900">
              ${t.price.toFixed(2)}
            </div>
            <div className={`text-xs ${t.changePct >= 0 ? "text-green-600" : "text-red-600"}`}>
              {t.changePct >= 0 ? "+" : "-"}{Math.abs(t.changePct).toFixed(2)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


