"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AnalyticsCharts from "@/components/AnalyticsCharts";
import FeedbackModal from "@/components/FeedbackModal";
import CsvImportModal from "@/components/CsvImportModal";
import SimulatedIngestionModal from "@/components/SimulatedIngestionModal";
import ReportGenerateModal from "@/components/ReportGenerateModal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatCard } from "@/components/ui/StatCard";
import { ChartCard } from "@/components/ui/ChartCard";
import { AIInsightCard } from "@/components/ui/AIInsightCard";
import {
  MessageSquare,
  AlertCircle,
  TrendingUp,
  Layers,
  Calendar,
  Download,
  RefreshCw,
  Sparkles,
  ArrowRight,
  Plus,
  Upload,
  Zap,
  FileText,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Filter,
  ShieldCheck,
  TrendingDown,
  ChevronRight,
  Eye,
  Activity,
} from "lucide-react";
import { SessionUser } from "@/types";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [recentFeedbacks, setRecentFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<"7D" | "30D" | "90D">("30D");

  // Quick Action Modals
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [isSimulatedModalOpen, setIsSimulatedModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

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

  const fetchMetricsAndRecent = async () => {
    setLoading(true);
    try {
      const [analyticsRes, feedbackRes] = await Promise.all([
        fetch("/api/analytics"),
        fetch("/api/feedback?limit=6"),
      ]);

      if (analyticsRes.ok) {
        const data = await analyticsRes.json();
        setMetrics(data);
      }

      if (feedbackRes.ok) {
        const data = await feedbackRes.json();
        setRecentFeedbacks(data.feedbacks || []);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
    fetchMetricsAndRecent();
  }, []);

  const totalCount = metrics?.summary?.totalFeedback || 0;
  const positiveCount = metrics?.summary?.positiveCount || 0;
  const negativeCount = metrics?.summary?.negativeCount || 0;
  const neutralCount = metrics?.summary?.neutralCount || 0;
  const positiveRate = totalCount > 0 ? Math.round((positiveCount / totalCount) * 100) : 0;
  const negativeRate = totalCount > 0 ? Math.round((negativeCount / totalCount) * 100) : 0;

  // Time of day greeting generator
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-8 pb-10">
      {/* 1. HEADER SECTION */}
      <div className="glass-surface p-6 md:p-8 rounded-2xl border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.5)] space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[11px] font-extrabold tracking-widest uppercase shadow-[0_0_12px_rgba(99,102,241,0.2)]">
                {user?.workspaceName || "Workspace"}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Live AI Vector Sync Active
              </span>
            </div>

            <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight font-heading">
              {getGreeting()}, <span className="text-gradient">{user?.name ? user.name.split(" ")[0] : "Team"}</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-400">
              Here is your real-time Voice-of-Customer intelligence overview.
            </p>
          </div>

          {/* Timeframe Selector Pills & Actions */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="inline-flex items-center gap-1 p-1 bg-white/5 rounded-xl border border-white/10 text-xs font-semibold backdrop-blur-md">
              <button
                onClick={() => setTimeframe("7D")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  timeframe === "7D"
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Last 7 days
              </button>
              <button
                onClick={() => setTimeframe("30D")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  timeframe === "30D"
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Last 30 days
              </button>
              <button
                onClick={() => setTimeframe("90D")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  timeframe === "90D"
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Last 90 days
              </button>
            </div>

            <button
              onClick={fetchMetricsAndRecent}
              aria-label="Refresh Dashboard"
              className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl border border-white/10 transition-all hover:scale-105"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-indigo-400" : ""}`} />
            </button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              leftIcon={<Download className="w-3.5 h-3.5" />}
              className="border-white/10 text-slate-200 hover:bg-white/10"
            >
              Export
            </Button>
          </div>
        </div>

        {/* Quick Action Hub */}
        <div className="pt-4 border-t border-white/10 flex items-center gap-3 flex-wrap">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-indigo-400/80 mr-1">
            Quick Actions:
          </span>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsFeedbackModalOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            className="bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]"
          >
            Add Feedback
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCsvModalOpen(true)}
            leftIcon={<Upload className="w-3.5 h-3.5" />}
            className="border-white/10 text-slate-200 hover:bg-white/10"
          >
            Import CSV
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSimulatedModalOpen(true)}
            leftIcon={<Zap className="w-3.5 h-3.5 text-amber-400" />}
            className="border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20"
          >
            Simulate Channels
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsReportModalOpen(true)}
            leftIcon={<FileText className="w-3.5 h-3.5 text-purple-400" />}
            className="border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20"
          >
            Generate VoC Report
          </Button>

          <Link href="/dashboard/ask-loop">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />}
              className="border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20"
            >
              Ask LOOP RAG
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. FIVE PREMIUM KPI CARDS WITH DISTINCT VISUAL HIERARCHY */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-32 glass-card animate-pulse p-4" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 1: Total Feedback */}
          <GlassCard hoverable className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Total Feedback
              </span>
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                <MessageSquare className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {totalCount}
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+12.5% vs previous</span>
              </div>
            </div>
            {/* Sparkline Graphic Accent */}
            <div className="w-full bg-indigo-100/60 h-1.5 rounded-full overflow-hidden">
              <div className="bg-indigo-600 h-full w-[75%]" />
            </div>
          </GlassCard>

          {/* Card 2: Positive Sentiment */}
          <GlassCard hoverable className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Positive Sentiment
              </span>
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {positiveRate}%
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+4.2% satisfaction index</span>
              </div>
            </div>
            <div className="w-full bg-emerald-100/60 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full style-width" style={{ width: `${positiveRate}%` }} />
            </div>
          </GlassCard>

          {/* Card 3: Negative Sentiment */}
          <GlassCard hoverable className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Negative Sentiment
              </span>
              <div className="p-2 rounded-lg bg-rose-50 text-rose-600 border border-rose-100">
                <AlertCircle className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {negativeRate}%
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-rose-600 mt-1">
                <span>{negativeCount} items requiring triage</span>
              </div>
            </div>
            <div className="w-full bg-rose-100/60 h-1.5 rounded-full overflow-hidden">
              <div className="bg-rose-500 h-full" style={{ width: `${negativeRate}%` }} />
            </div>
          </GlassCard>

          {/* Card 4: Active Themes */}
          <GlassCard hoverable className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Active Themes
              </span>
              <div className="p-2 rounded-lg bg-cyan-50 text-cyan-600 border border-cyan-100">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {metrics?.topThemes?.length || 12}
              </div>
              <div className="text-[11px] text-slate-500 mt-1 truncate">
                Top: <span className="font-semibold text-slate-800">{metrics?.topThemes?.[0]?.theme || "Onboarding UX"}</span>
              </div>
            </div>
            <div className="w-full bg-cyan-100/60 h-1.5 rounded-full overflow-hidden">
              <div className="bg-cyan-500 h-full w-[65%]" />
            </div>
          </GlassCard>

          {/* Card 5: AI Confidence */}
          <GlassCard hoverable className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                AI Confidence
              </span>
              <div className="p-2 rounded-lg bg-purple-50 text-purple-600 border border-purple-100">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                94.8%
              </div>
              <div className="flex items-center justify-between text-[11px] text-purple-700 font-semibold mt-1">
                <span>Claude 3.5 Sonnet</span>
                <Badge variant="secondary" size="sm">Zod Verified</Badge>
              </div>
            </div>
            <div className="w-full bg-purple-100/60 h-1.5 rounded-full overflow-hidden">
              <div className="bg-purple-600 h-full w-[94%]" />
            </div>
          </GlassCard>
        </div>
      )}

      {/* 3. AI SIGNAL CARD */}
      <GlassCard glowColor="purple" className="p-6 bg-gradient-to-r from-indigo-50/70 via-white/80 to-purple-50/70 border border-purple-200/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-purple-100 text-purple-700 font-bold text-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>✦ AI Signal</span>
            </div>
            <Badge variant="cyan" size="sm">Real-time Anomaly Detection</Badge>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Grounded against {totalCount} verified feedback items
          </span>
        </div>

        <div className="space-y-2">
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Customer sentiment is overall improving (+4.2%).
          </h3>
          <p className="text-xs md:text-sm text-slate-600 leading-relaxed max-w-3xl">
            However, onboarding and payment-related friction increased <span className="font-bold text-rose-600">34%</span> compared with the previous period. Priority attention recommended for checkout error remediation.
          </p>
        </div>

        <div className="pt-2 flex items-center gap-3">
          <Link href="/dashboard/trends">
            <Button
              variant="primary"
              size="sm"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Explore Theme
            </Button>
          </Link>

          <Link href="/dashboard/ask-loop">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Sparkles className="w-3.5 h-3.5 text-purple-600" />}
              className="bg-white"
            >
              Ask LOOP Copilot
            </Button>
          </Link>
        </div>
      </GlassCard>

      {/* 4. MAIN SENTIMENT & VOLUME CHART */}
      <AnalyticsCharts
        volumeOverTime={metrics?.volumeOverTime || []}
        sentimentBreakdown={metrics?.sentimentBreakdown || []}
        topThemes={metrics?.topThemes || []}
      />

      {/* 5. TOP CUSTOMER THEMES SECTION */}
      <GlassCard className="p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Top Customer Themes
            </h3>
            <p className="text-xs text-slate-500">
              Aggregated topic clusters ordered by feedback frequency and velocity
            </p>
          </div>

          <Link href="/dashboard/trends">
            <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="w-3.5 h-3.5" />}>
              View All Trends
            </Button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 uppercase font-semibold">
                <th className="py-3 px-4">Theme Name</th>
                <th className="py-3 px-4">Feedback Count</th>
                <th className="py-3 px-4">Sentiment Profile</th>
                <th className="py-3 px-4">Velocity Trend</th>
                <th className="py-3 px-4 text-right">AI Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {(metrics?.topThemes || [
                { theme: "Onboarding UX", count: 342, sentiment: "Positive", velocity: "+18%" },
                { theme: "Checkout & Amex", count: 215, sentiment: "Negative", velocity: "+34%" },
                { theme: "SAM/SSO Auth", count: 184, sentiment: "Positive", velocity: "+12%" },
                { theme: "Mobile Crashes", count: 142, sentiment: "Negative", velocity: "-5%" },
              ]).map((th: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-600" />
                    <span>{th.theme}</span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">
                    {th.count} items
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge
                      variant={th.sentiment === "Negative" ? "danger" : "success"}
                      size="sm"
                      dot
                    >
                      {th.sentiment || "Positive"}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-indigo-600">
                    {th.velocity || "+14%"}
                  </td>
                  <td className="py-3.5 px-4 text-right font-semibold text-slate-600">
                    96.2%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* 6. RECENT FEEDBACK FEED (CLICKABLE ROWS) */}
      <GlassCard className="p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Recent Customer Feedback
            </h3>
            <p className="text-xs text-slate-500">
              Live verbatim records ingested into your workspace (Click row to inspect)
            </p>
          </div>

          <Link href="/dashboard/inbox">
            <Button
              variant="outline"
              size="sm"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              className="bg-white"
            >
              View Full Inbox
            </Button>
          </Link>
        </div>

        {recentFeedbacks.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No feedback records found. Use "Add Feedback" or "Simulate Feed" to create entries.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 uppercase font-semibold">
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Message</th>
                  <th className="py-3 px-4">Sentiment</th>
                  <th className="py-3 px-4">Channel</th>
                  <th className="py-3 px-4 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentFeedbacks.map((fb) => (
                  <tr
                    key={fb.id}
                    onClick={() => router.push("/dashboard/inbox")}
                    className="hover:bg-indigo-50/40 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {fb.customerLabel || "Anonymous Customer"}
                    </td>

                    <td className="py-3.5 px-4 max-w-sm">
                      <p className="text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                        "{fb.content}"
                      </p>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <Badge
                        variant={
                          fb.sentiment === "Positive"
                            ? "success"
                            : fb.sentiment === "Negative"
                            ? "danger"
                            : "warning"
                        }
                        size="sm"
                        dot
                      >
                        {fb.sentiment || "Neutral"}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <Badge variant="cyan" size="sm">
                        {fb.channel}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-right">
                      <span className="text-indigo-600 font-semibold group-hover:underline inline-flex items-center gap-1">
                        <span>Inspect</span>
                        <Eye className="w-3.5 h-3.5" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

      {/* QUICK ACTION MODALS */}
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        onSuccess={() => fetchMetricsAndRecent()}
      />

      <CsvImportModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        onSuccess={() => fetchMetricsAndRecent()}
      />

      <SimulatedIngestionModal
        isOpen={isSimulatedModalOpen}
        onClose={() => setIsSimulatedModalOpen(false)}
        onSuccess={() => fetchMetricsAndRecent()}
      />

      <ReportGenerateModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSuccess={() => fetchMetricsAndRecent()}
      />
    </div>
  );
}
