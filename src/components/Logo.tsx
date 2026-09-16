import React from "react";
import { Sparkles } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showSubtitle?: boolean;
}

export default function Logo({ size = "md", showSubtitle = true }: LogoProps) {
  const iconSizes = {
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-11 h-11 text-base",
  };

  const textSizes = {
    sm: "text-base font-extrabold",
    md: "text-lg font-extrabold",
    lg: "text-2xl font-extrabold",
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`relative ${iconSizes[size]} bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/25 shrink-0`}>
        <Sparkles className="w-1/2 h-1/2 text-white" />
        <div className="absolute inset-0 border border-white/30 rounded-xl pointer-events-none" />
      </div>
      <div>
        <div className={`${textSizes[size]} text-slate-900 tracking-tight leading-none`}>
          Project <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">LOOP</span>
        </div>
        {showSubtitle && (
          <div className="text-[10px] font-semibold text-slate-400 tracking-wide uppercase pt-0.5">
            AI Customer Intelligence
          </div>
        )}
      </div>
    </div>
  );
}
