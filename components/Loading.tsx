"use client";

import React from "react";

interface LoadingProps {
  message?: string;
}

export function Loading({ message = "Loading..." }: LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-4 border-gray-200 border-t-[#0B1F3B] animate-spin"></div>
      </div>
      <p className="mt-4 text-gray-600 text-sm">{message}</p>
    </div>
  );
}

export function PageLoading() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
      <Loading message="Loading page..." />
    </div>
  );
}


