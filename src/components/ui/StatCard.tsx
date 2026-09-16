"use client";

import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { GlassCard } from "./GlassCard";

export interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number; // e.g. +12.5 or -3.2
    label?: string;
  };
  icon?: React.ReactNode;
  iconBg?: "indigo" | "purple" | "cyan" | "emerald" | "amber" | "rose";
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  trend,
  icon,
  iconBg = "cyan",
}) => {
  const iconBgClasses = {
    indigo: "bg-indigo-500/15 text-indigo-300 border-indigo-400/40 shadow-[0_0_20px_rgba(99,102,241,0.35)]",
    purple: "bg-purple-500/15 text-purple-300 border-purple-400/40 shadow-[0_0_20px_rgba(157,78,225,0.35)]",
    cyan: "bg-cyan-500/15 text-cyan-300 border-cyan-400/40 shadow-[0_0_20px_rgba(0,242,254,0.35)]",
    emerald: "bg-emerald-500/15 text-emerald-300 border-emerald-400/40 shadow-[0_0_20px_rgba(0,255,136,0.35)]",
    amber: "bg-amber-500/15 text-amber-300 border-amber-400/40 shadow-[0_0_20px_rgba(245,158,11,0.35)]",
    rose: "bg-rose-500/15 text-rose-300 border-rose-400/40 shadow-[0_0_20px_rgba(255,0,127,0.35)]",
  };

  return (
    <GlassCard hoverable glowColor={iconBg === "cyan" ? "cyan" : "indigo"}>
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <p className="text-[10px] font-black text-cyan-400/80 uppercase tracking-widest font-mono">
            {title}
          </p>
          <p className="text-3xl font-black text-white tracking-tight font-heading text-gradient-cyan">
            {value}
          </p>
        </div>

        {icon && (
          <div
            className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${iconBgClasses[iconBg]}`}
          >
            {icon}
          </div>
        )}
      </div>

      {(trend || description) && (
        <div className="mt-4 pt-3 border-t border-cyan-500/20 flex items-center justify-between text-xs">
          {trend && (
            <div className="flex items-center gap-1.5 font-semibold">
              {trend.value > 0 ? (
                <span className="inline-flex items-center gap-1 text-emerald-300 bg-emerald-500/20 border border-emerald-400/40 px-2 py-0.5 rounded-full font-bold shadow-[0_0_10px_rgba(0,255,136,0.2)]">
                  <TrendingUp className="w-3 h-3 text-emerald-300" /> +{trend.value}%
                </span>
              ) : trend.value < 0 ? (
                <span className="inline-flex items-center gap-1 text-rose-300 bg-rose-500/20 border border-rose-400/40 px-2 py-0.5 rounded-full font-bold shadow-[0_0_10px_rgba(255,0,127,0.2)]">
                  <TrendingDown className="w-3 h-3 text-rose-300" /> {trend.value}%
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-slate-400 bg-slate-800/80 border border-slate-700/60 px-2 py-0.5 rounded-full font-medium">
                  <Minus className="w-3 h-3" /> 0%
                </span>
              )}
              {trend.label && (
                <span className="text-slate-400 font-normal text-[11px]">{trend.label}</span>
              )}
            </div>
          )}
          {description && (
            <span className="text-slate-400 font-medium text-[11px]">{description}</span>
          )}
        </div>
      )}
    </GlassCard>
  );
};
