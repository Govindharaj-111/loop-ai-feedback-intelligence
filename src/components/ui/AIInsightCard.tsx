"use client";

import React from "react";
import { Sparkles, CheckCircle2 } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { Badge } from "./Badge";

export interface AIInsightCardProps {
  title: string;
  sentiment: "Positive" | "Neutral" | "Negative";
  sentimentScore: number;
  featureArea: string;
  rationale: string;
  themes?: string[];
  modelBadge?: string;
  className?: string;
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({
  title,
  sentiment,
  sentimentScore,
  featureArea,
  rationale,
  themes = [],
  modelBadge = "Claude 3.5 Sonnet",
  className = "",
}) => {
  const sentimentVariant = {
    Positive: "success",
    Neutral: "warning",
    Negative: "danger",
  } as const;

  return (
    <GlassCard glowColor="purple" className={`relative overflow-hidden ${className}`}>
      {/* Accent Gradient Glow Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500" />

      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-purple-50 text-purple-600 border border-purple-100">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-900 tracking-tight">
            {title}
          </span>
        </div>
        <span className="text-[10px] font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-100/80">
          {modelBadge}
        </span>
      </div>

      <div className="mt-3 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Sentiment:</span>
            <Badge variant={sentimentVariant[sentiment]} size="sm" dot>
              {sentiment} ({sentimentScore > 0 ? `+${sentimentScore}` : sentimentScore})
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-slate-500">
            <span className="font-medium">Area:</span>
            <span className="font-semibold text-slate-800">{featureArea}</span>
          </div>
        </div>

        <p className="text-xs text-slate-600 italic bg-white/80 p-2.5 rounded-md border border-slate-100">
          "{rationale}"
        </p>

        {themes.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-[11px] font-medium text-slate-400">Themes:</span>
            {themes.map((t, idx) => (
              <Badge key={idx} variant="cyan" size="sm">
                {t}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </GlassCard>
  );
};
