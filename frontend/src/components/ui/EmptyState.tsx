"use client";

import React from "react";
import { FolderOpen } from "lucide-react";

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon = <FolderOpen className="w-8 h-8 text-slate-400" />,
  action,
  className = "",
}) => {
  return (
    <div
      className={`w-full py-12 px-6 flex flex-col items-center justify-center text-center bg-slate-50/50 rounded-lg border border-dashed border-slate-200 ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center mb-3">
        {icon}
      </div>
      <h3 className="text-sm font-bold text-slate-800 tracking-tight">{title}</h3>
      {description && (
        <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4">{description}</p>
      )}
      {action}
    </div>
  );
};
