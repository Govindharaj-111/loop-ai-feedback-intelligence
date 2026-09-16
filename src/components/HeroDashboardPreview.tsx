"use client";

import React from "react";
import {
  Sparkles,
  TrendingUp,
  MessageSquare,
  BarChart3,
  ChevronDown,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  PieChart as PieIcon,
  Activity,
  Layers,
  Cpu,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";

export default function HeroDashboardPreview() {
  return (
    <div className="w-full max-w-5xl mx-auto pt-8 pb-4 relative z-10">
      {/* Decorative Glow behind dashboard frame */}
      <div className="absolute -inset-8 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-[36px] blur-3xl pointer-events-none -z-10 animate-pulse" />

      {/* Main SaaS Glass Frame */}
      <div className="glass-surface overflow-hidden border border-cyan-500/30 shadow-[0_0_50px_rgba(0,242,254,0.2)] rounded-[28px] bg-[#060b19]/90 backdrop-blur-3xl">
        {/* Top Header Window Toolbar */}
        <div className="px-6 py-3.5 bg-[#030712] text-white flex items-center justify-between border-b border-cyan-500/20">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-500/80 shadow-[0_0_8px_#f43f5e]" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80 shadow-[0_0_8px_#f59e0b]" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-[0_0_8px_#10b981]" />
            </div>
            <div className="h-4 w-px bg-cyan-500/20 mx-1" />
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 font-mono tracking-wider">
              <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>PROJECT LOOP — CYBER INTELLIGENCE COCKPIT</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-cyan-950/40 border border-cyan-500/30 rounded-lg text-xs font-bold text-cyan-300 flex items-center gap-2 font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shadow-[0_0_8px_#00f2fe]" />
              <span>LIVE TENANT STREAM</span>
              <ChevronDown className="w-3 h-3 text-cyan-400/70" />
            </div>
          </div>
        </div>

        {/* Inner Dashboard View */}
        <div className="p-6 bg-[#040814]/80 space-y-6">
          {/* KPI Stat Cards Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              title="Total Feedback"
              value="1,284"
              trend={{ value: 18.4, label: "vs last month" }}
              icon={<MessageSquare className="w-5 h-5 text-cyan-300" />}
              iconBg="cyan"
            />
            <StatCard
              title="Positive Sentiment"
              value="68%"
              description="Healthy sentiment score"
              icon={<CheckCircle2 className="w-5 h-5 text-emerald-300" />}
              iconBg="emerald"
            />
            <StatCard
              title="Active Themes"
              value="12"
              description="Across 4 channels"
              icon={<Layers className="w-5 h-5 text-indigo-300" />}
              iconBg="indigo"
            />
            <StatCard
              title="Trending Velocity"
              value="+24%"
              trend={{ value: 24, label: "velocity spike" }}
              icon={<TrendingUp className="w-5 h-5 text-purple-300" />}
              iconBg="purple"
            />
          </div>

          {/* Interactive Visuals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Sentiment & Volume Bar Flow (7 cols) */}
            <div className="md:col-span-7 bg-[#080e22]/90 p-5 rounded-2xl border border-cyan-500/20 space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-white uppercase tracking-widest font-heading">
                    Sentiment & Volume Flow
                  </h4>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Real-time weekly customer feedback distribution
                  </p>
                </div>
                <div className="p-2 bg-cyan-500/20 text-cyan-300 rounded-xl border border-cyan-400/30">
                  <BarChart3 className="w-4 h-4" />
                </div>
              </div>

              {/* Stacked Sentiment Bars Visual */}
              <div className="h-36 flex items-end justify-between gap-2.5 pt-4 px-2 border-b border-cyan-500/20">
                {[
                  { day: "Mon", pos: 60, neg: 20, neu: 20 },
                  { day: "Tue", pos: 75, neg: 12, neu: 13 },
                  { day: "Wed", pos: 88, neg: 18, neu: 14 },
                  { day: "Thu", pos: 82, neg: 15, neu: 18 },
                  { day: "Fri", pos: 105, neg: 25, neu: 15 },
                  { day: "Sat", pos: 50, neg: 8, neu: 10 },
                  { day: "Sun", pos: 68, neg: 10, neu: 12 },
                ].map((bar, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <div className="w-full max-w-[28px] bg-white/5 rounded-t-lg overflow-hidden flex flex-col justify-end h-full">
                      <div style={{ height: `${bar.neg}%` }} className="bg-rose-500/80 w-full group-hover:bg-rose-400 transition-colors" />
                      <div style={{ height: `${bar.neu}%` }} className="bg-amber-500/80 w-full group-hover:bg-amber-400 transition-colors" />
                      <div style={{ height: `${bar.pos}%` }} className="bg-cyan-500 w-full group-hover:bg-cyan-400 transition-colors shadow-[0_0_10px_#00f2fe]" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 font-mono">{bar.day}</span>
                  </div>
                ))}
              </div>

              {/* Theme Breakdown Tags */}
              <div className="flex items-center justify-between text-xs pt-1">
                <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f2fe]" /> Positive
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400" /> Neutral
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-400" /> Negative
                  </span>
                </div>
                <span className="text-[11px] font-black text-cyan-300 font-mono">
                  Top Theme: Onboarding UX
                </span>
              </div>
            </div>

            {/* AI Insights & Recent Customer Signals (5 cols) */}
            <div className="md:col-span-5 space-y-4">
              {/* AI Insight Card Component */}
              <div className="bg-[#080e22]/90 p-4 rounded-2xl border border-purple-500/30 space-y-2.5 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <h5 className="text-xs font-black text-white uppercase tracking-wider font-heading">
                      AI Sentiment Analysis
                    </h5>
                  </div>
                  <Badge variant="secondary" size="sm">
                    Claude 3.5
                  </Badge>
                </div>
                <p className="text-xs text-purple-200 italic bg-purple-950/30 p-3 rounded-xl border border-purple-500/20">
                  "Auto-classified positive customer sentiment on SAML/SSO authentication overhaul."
                </p>
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="font-bold text-emerald-400">Positive (+0.88)</span>
                  <span className="text-slate-400">Security & Auth</span>
                </div>
              </div>

              {/* Live Signal Item */}
              <div className="bg-[#080e22]/90 p-4 rounded-2xl border border-cyan-500/20 space-y-2 shadow-lg">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-black text-white">Acme Corp Enterprise</span>
                  <Badge variant="success" size="sm" dot>
                    Zendesk Ticket
                  </Badge>
                </div>
                <p className="text-xs text-slate-300 truncate">
                  "Workspace isolation and SSO rollout was seamless for our 500+ team members."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
