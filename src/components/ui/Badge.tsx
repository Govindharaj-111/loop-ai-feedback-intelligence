"use client";

import React from "react";

export interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "neutral"
    | "cyan";
  size?: "sm" | "md";
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "neutral",
  size = "md",
  dot = false,
  className = "",
}) => {
  const variantStyles = {
    primary: "bg-indigo-50 text-indigo-700 border-indigo-200/60",
    secondary: "bg-purple-50 text-purple-700 border-purple-200/60",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    warning: "bg-amber-50 text-amber-800 border-amber-200/60",
    danger: "bg-red-50 text-red-700 border-red-200/60",
    neutral: "bg-slate-100 text-slate-700 border-slate-200/80",
    cyan: "bg-cyan-50 text-cyan-700 border-cyan-200/60",
  };

  const dotColors = {
    primary: "bg-indigo-500",
    secondary: "bg-purple-500",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-red-500",
    neutral: "bg-slate-400",
    cyan: "bg-cyan-500",
  };

  const sizeStyles = {
    sm: "text-[11px] px-2 py-0.5 rounded-sm gap-1 font-medium",
    md: "text-xs px-2.5 py-1 rounded-sm gap-1.5 font-semibold",
  };

  return (
    <span
      className={`inline-flex items-center border tracking-tight ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />
      )}
      {children}
    </span>
  );
};
