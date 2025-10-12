"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string | number;
  change?: { value: number; positive?: boolean };
  icon?: React.ReactNode;
  className?: string;
}

export function KpiCard({ label, value, change, icon, className }: KpiCardProps) {
  const changeText = change ? `${change.positive === false ? "-" : "+"}${Math.abs(change.value).toFixed(2)}%` : undefined;
  const changeColor = change ? (change.positive === false ? "text-red-600" : "text-green-600") : "text-gray-500";
  return (
    <div className={cn("bg-white rounded-lg border border-gray-200 p-5", className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600">{label}</span>
        {icon}
      </div>
      <div className="flex items-end justify-between">
        <span className="text-3xl font-bold text-[#0B1F3B]">{value}</span>
        {change && (
          <span className={cn("text-sm font-medium", changeColor)}>{changeText}</span>
        )}
      </div>
    </div>
  );
}


