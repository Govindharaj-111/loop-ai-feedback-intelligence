"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export interface LoadingStateProps {
  label?: string;
  variant?: "spinner" | "skeleton" | "card";
  rows?: number;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  label = "Loading data...",
  variant = "spinner",
  rows = 3,
  className = "",
}) => {
  if (variant === "skeleton") {
    return (
      <div className={`w-full space-y-3 animate-pulse ${className}`}>
        {Array.from({ length: rows }).map((_, idx) => (
          <div
            key={idx}
            className="h-10 bg-slate-200/70 rounded-md w-full"
          />
        ))}
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className={`w-full grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse ${className}`}>
        {Array.from({ length: 3 }).map((_, idx) => (
          <div
            key={idx}
            className="h-28 bg-slate-200/70 rounded-lg w-full"
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`w-full py-12 flex flex-col items-center justify-center gap-2 text-slate-500 ${className}`}
    >
      <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
      <span className="text-xs font-medium">{label}</span>
    </div>
  );
};
