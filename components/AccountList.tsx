"use client";

import React from "react";

interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  changePct?: number;
}

interface AccountListProps {
  accounts: Account[];
}

export function AccountList({ accounts }: AccountListProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#0B1F3B]">Accounts</h3>
        <button className="text-sm text-blue-700 hover:underline">Manage</button>
      </div>
      <div className="divide-y divide-gray-200">
        {accounts.map((a) => (
          <div key={a.id} className="flex items-center justify-between py-3">
            <div>
              <div className="text-sm font-medium text-gray-900">{a.name}</div>
              <div className="text-xs text-gray-500">{a.type}</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">
                ${a.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              {typeof a.changePct === "number" && (
                <div className={`text-xs ${a.changePct >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {a.changePct >= 0 ? "+" : "-"}{Math.abs(a.changePct).toFixed(2)}%
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


