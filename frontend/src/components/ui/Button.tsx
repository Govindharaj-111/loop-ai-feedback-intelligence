"use client";

import React, { ButtonHTMLAttributes, forwardRef } from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "glass" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none";

    const sizeStyles = {
      sm: "text-xs px-3 py-1.5 rounded-sm gap-1.5 h-8",
      md: "text-sm px-4 py-2 rounded-md gap-2 h-10",
      lg: "text-base px-6 py-2.5 rounded-lg gap-2.5 h-12",
    };

    const variantStyles = {
      primary:
        "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 active:scale-[0.98]",
      secondary:
        "bg-slate-900 hover:bg-slate-800 text-white shadow-sm active:scale-[0.98]",
      outline:
        "border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-sm active:scale-[0.98]",
      ghost:
        "text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:scale-[0.98]",
      glass:
        "bg-white/80 hover:bg-white backdrop-blur-md border border-white/90 text-slate-800 shadow-glass hover:shadow-glass-hover active:scale-[0.98]",
      danger:
        "bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-500/20 active:scale-[0.98]",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
