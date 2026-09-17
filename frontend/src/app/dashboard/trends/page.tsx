"use client";

import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Zap, RefreshCw, Layers, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { SessionUser } from "@/types";

export default function TrendsPage() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [themes, setThemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [clustering, setClustering] = useState(false);

  const fetchSession = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (err) {
      console.error("Failed to fetch session:", err);
    }
  };

  const fetchThemes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/themes");
      if (res.ok) {
        const data = await res.json();
        setThemes(data.themes || []);
      }
    } catch (err) {
      console.error("Failed to fetch themes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
    fetchThemes();
  }, []);

  const handleClusterThemes = async () => {
    setClustering(true);
    try {
      const res = await fetch("/api/themes/cluster", { method: "POST" });
      if (res.ok) {
        fetchThemes();
      }
    } catch (err) {
      console.error("Failed to trigger theme clustering:", err);
    } finally {
      setClustering(false);
    }
  };

  const canModify = user?.role === "ADMIN" || user?.role === "ANALYST";

  const velocityPillStyles: Record<string, string> = {
    SPIKING: "bg-rose-50 border-rose-200 text-rose-700 font-extrabold",
    INCREASING: "bg-amber-50 border-amber-200 text-amber-700 font-bold",
    STABLE: "bg-slate-100 border-slate-200 text-slate-700 font-semibold",
    DECREASING: "bg-emerald-50 border-emerald-200 text-emerald-700 font-semibold",
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            Customer Trends <TrendingUp className="w-6 h-6 text-indigo-600" />
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Discover emerging themes, topic velocity, and period-over-period momentum for <span className="font-semibold text-indigo-600">{user?.workspaceName}</span>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchThemes}
            aria-label="Refresh Trends"
            className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-xl transition-all shadow-2xs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          {canModify && (
            <button
              onClick={handleClusterThemes}
              disabled={clustering}
              className="btn-primary flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl shadow-md shadow-indigo-600/20 disabled:opacity-50"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>{clustering ? "Clustering Themes..." : "Re-cluster AI Themes"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-1 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase">Spiking Themes</div>
          <div className="text-2xl font-extrabold text-rose-600">Payment & Mobile</div>
          <div className="text-[11px] text-slate-500">Requires priority triage</div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-1 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase">Trending Up</div>
          <div className="text-2xl font-extrabold text-amber-600">Usability & RAG</div>
          <div className="text-[11px] text-slate-500">+24.5% volume growth</div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-1 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase">Stable Themes</div>
          <div className="text-2xl font-extrabold text-slate-900">Security & Auth</div>
          <div className="text-[11px] text-slate-500">Consistent baseline volume</div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-1 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase">Decreasing</div>
          <div className="text-2xl font-extrabold text-emerald-600">Onboarding Slowness</div>
          <div className="text-[11px] text-slate-500">-14.2% after hotfix</div>
        </div>
      </div>

      {/* Theme Cards Grid */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 bg-white border border-slate-200 rounded-2xl">
          Analyzing workspace trend velocity...
        </div>
      ) : themes.length === 0 ? (
        <div className="p-16 text-center text-slate-500 bg-white border border-slate-200 rounded-2xl space-y-3">
          <Layers className="w-10 h-10 text-indigo-400 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">No Theme Clusters Found</h3>
            <p className="text-xs text-slate-500">Click "Re-cluster AI Themes" to generate topic trends from customer feedback records.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {themes.map((theme) => {
            const count = theme._count?.feedbacks || 0;
            const velocity = count > 30 ? "SPIKING" : count > 15 ? "INCREASING" : "STABLE";

            return (
              <div
                key={theme.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-900">{theme.name}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{theme.description}</p>
                  </div>

                  <span
                    className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-lg border shrink-0 ${
                      velocityPillStyles[velocity] || "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {velocity}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-500 font-medium">Feedback Volume</span>
                  <span className="text-sm font-extrabold text-slate-900">{count} records</span>
                </div>

                {theme.feedbacks && theme.feedbacks.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Representative Customer Feedback</div>
                    <div className="space-y-2">
                      {theme.feedbacks.slice(0, 2).map((link: any, idx: number) => (
                        <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 italic">
                          "{link.feedback?.content}"
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
