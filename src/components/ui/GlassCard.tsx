"use client";

import React from "react";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  glowColor?: "indigo" | "purple" | "cyan" | "emerald" | "none";
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  hoverable = true,
  glowColor = "cyan",
  className = "",
  ...props
}) => {
  const glowStyles = {
    none: "",
    indigo: "hover:border-indigo-400/60 hover:shadow-[0_0_25px_rgba(99,102,241,0.3)]",
    purple: "hover:border-purple-400/60 hover:shadow-[0_0_25px_rgba(157,78,225,0.3)]",
    cyan: "hover:border-cyan-400/70 hover:shadow-[0_0_30px_rgba(0,242,254,0.35)]",
    emerald: "hover:border-emerald-400/60 hover:shadow-[0_0_25px_rgba(0,255,136,0.3)]",
  };

  return (
    <div
      className={`glass-card p-5 rounded-2xl border border-cyan-500/20 bg-[#0b132b]/70 backdrop-blur-xl ${
        hoverable ? "transition-all duration-300 hover:-translate-y-1" : ""
      } ${glowStyles[glowColor]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
