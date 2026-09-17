"use client";

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "./Button";

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "An error occurred",
  message,
  onRetry,
  className = "",
}) => {
  return (
    <div
      className={`w-full p-6 rounded-lg bg-red-50/60 border border-red-200 text-red-800 flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-md bg-red-100 text-red-600 shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold tracking-tight">{title}</h4>
          <p className="text-xs text-red-700 mt-0.5">{message}</p>
        </div>
      </div>

      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          className="shrink-0 bg-white border-red-200 hover:bg-red-50 text-red-700"
        >
          Try Again
        </Button>
      )}
    </div>
  );
};
