"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Zap,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  MessageSquare,
  FileText,
  Lightbulb,
  Target,
  Clock,
} from "lucide-react";

export default function AIInsightsPage() {
  const [loading, setLoading] = useState(false);
  const [insightsData, setInsightsData] = useState<any>(null);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/analytics");
      if (res.ok) {
        const data = await res.json();
        setInsightsData(data);
      }
    } catch (err) {
      console.error("Failed to fetch AI insights:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-[11px] font-bold tracking-wider uppercase flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-600 animate-pulse" />
              Claude 3.5 Sonnet NLP Engine
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            AI Customer Insights
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time synthesis of customer sentiments, pain points, emerging expectations, and strategic recommendations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchInsights}
            className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-xl transition-all shadow-xs flex items-center gap-2 text-xs font-semibold"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-indigo-600" : ""}`} />
            <span>Refresh Insights</span>
          </button>

          <Link href="/dashboard/ask-loop">
            <Button
              variant="primary"
              size="md"
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              Ask LOOP AI Chat
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero Executive AI Signal Banner */}
      <GlassCard glowColor="purple" className="p-6 bg-gradient-to-r from-purple-50/80 via-white to-indigo-50/80 border border-purple-200/90 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" size="md">
              ✦ Executive Intelligence Brief
            </Badge>
            <Badge variant="success" size="sm" dot>
              125 Verbatims Analyzed
            </Badge>
          </div>
          <span className="text-xs text-slate-500 font-medium">96.4% Grounding Score</span>
        </div>

        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          "Positive momentum around Okta SSO & Dark Mode UX, offset by Amex Checkout Friction & iOS Notification Crashes."
        </h2>

        <p className="text-xs md:text-sm text-slate-600 leading-relaxed max-w-4xl">
          Across the last 30 days of multi-channel customer signals, enterprise users praise the new SSO integration speed and dashboard responsiveness. However, 22% of support tickets report mobile crashes on iOS 17.4, and checkout billing returns HTTP 500 errors for American Express cardholders.
        </p>

        <div className="pt-2 flex items-center gap-3 flex-wrap">
          <Link href="/dashboard/reports">
            <Button variant="outline" size="sm" className="bg-white text-xs font-semibold" leftIcon={<FileText className="w-3.5 h-3.5 text-indigo-600" />}>
              View VoC Executive Report
            </Button>
          </Link>
          <Link href="/dashboard/themes">
            <Button variant="outline" size="sm" className="bg-white text-xs font-semibold" leftIcon={<TrendingUp className="w-3.5 h-3.5 text-purple-600" />}>
              Explore Theme Velocity
            </Button>
          </Link>
        </div>
      </GlassCard>

      {/* Grid Section 1: Positive vs Negative Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Positive Trends */}
        <GlassCard className="p-6 space-y-5 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Positive Trends & Drivers</h3>
                <p className="text-xs text-slate-500">Top areas generating customer delight</p>
              </div>
            </div>
            <Badge variant="success" size="sm">
              +18% Sentiment Shift
            </Badge>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900">Okta SAML 2.0 SSO Integration</h4>
                <Badge variant="success" size="sm">98% Positive</Badge>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Enterprise IT admins report flawless single sign-on deployment. 14 customer verbatims cite Okta documentation as best-in-class.
              </p>
              <div className="text-[11px] font-medium text-slate-500 italic">
                Quote: "Okta SAML 2.0 SSO setup documentation was clear and worked on first attempt."
              </div>
            </div>

            <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900">Dashboard Speed & Performance</h4>
                <Badge variant="success" size="sm">95% Positive</Badge>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Database optimization reduced query response time from 4.2s to 800ms, driving a +4.2 point increase in overall NPS score.
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Negative Trends */}
        <GlassCard className="p-6 space-y-5 border-l-4 border-l-rose-500">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
                <TrendingDown className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Negative Trends & Friction</h3>
                <p className="text-xs text-slate-500">Key sources of customer churn risk</p>
              </div>
            </div>
            <Badge variant="danger" size="sm">
              34% Volume Spike
            </Badge>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-100 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900">iOS 17.4 App Crash on Notification Launch</h4>
                <Badge variant="danger" size="sm">Critical Impact</Badge>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Mobile app crashes instantly when opening push notifications. 22% of total support volume linked to this single release bug.
              </p>
              <div className="text-[11px] font-medium text-slate-500 italic">
                Quote: "Latest iOS 17.4 mobile update crashes instantly when opening push notifications tab."
              </div>
            </div>

            <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-100 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900">Amex Card Checkout Failure</h4>
                <Badge variant="danger" size="sm">High Churn Risk</Badge>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Checkout gateway returns HTTP 500 error for American Express transactions on mobile, stranding enterprise subscription upgrades.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Grid Section 2: Complaints vs Expectations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Complaints */}
        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Top Customer Complaints</h3>
                <p className="text-xs text-slate-500">Categorized friction points across channels</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
              <div className="space-y-1">
                <div className="font-bold text-slate-900">CSV Export Timeout on Large Datasets</div>
                <div className="text-slate-600">Export requests over 25,000 feedback rows time out after 60 seconds.</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
              <div className="space-y-1">
                <div className="font-bold text-slate-900">2FA SMS Delivery Delays in UK Region</div>
                <div className="text-slate-600">SMS authentication codes take up to 4 minutes to deliver for international users.</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
              <div className="space-y-1">
                <div className="font-bold text-slate-900">Android Background Battery Consumption</div>
                <div className="text-slate-600">Android users report background battery usage reaching 45% on mobile devices.</div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Customer Expectations */}
        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Customer Expectations & Requests</h3>
                <p className="text-xs text-slate-500">Unmet feature requests & workflow needs</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-[11px]">✦</span>
              <div className="space-y-1">
                <div className="font-bold text-slate-900">Biometric Fingerprint Authentication</div>
                <div className="text-slate-600">Requesting Android & iOS Touch ID / Face ID login support for enterprise access.</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-[11px]">✦</span>
              <div className="space-y-1">
                <div className="font-bold text-slate-900">SOC2 Type II Audit Compliance Report</div>
                <div className="text-slate-600">Prospects cite missing SOC2 documentation as primary blocker for 100-seat contract closes.</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-[11px]">✦</span>
              <div className="space-y-1">
                <div className="font-bold text-slate-900">Custom Session Timeout Controls</div>
                <div className="text-slate-600">Enterprise security teams request workspace-level inactive session expiration rules.</div>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Section 3: AI Strategic Recommendations */}
      <GlassCard glowColor="indigo" className="p-6 bg-gradient-to-br from-indigo-900 to-slate-900 text-white space-y-6">
        <div className="flex items-center justify-between border-b border-indigo-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              <Lightbulb className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">AI Recommended Strategic Actions</h3>
              <p className="text-xs text-indigo-200">Prioritized product roadmap interventions generated by Claude 3.5 Sonnet</p>
            </div>
          </div>

          <Badge variant="cyan" size="md">
            Highest ROI Impact
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-indigo-950/60 border border-indigo-800/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold text-[10px] uppercase">P0 Hotfix</span>
              <span className="text-indigo-300 text-[10px]">ETA: 24 Hours</span>
            </div>
            <h4 className="font-bold text-white text-sm">Deploy iOS Hotfix for Push Crash</h4>
            <p className="text-indigo-200 leading-relaxed">
              Patch push notification launch handler in v4.2.1 build. Eliminates 22% of active support tickets.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-indigo-950/60 border border-indigo-800/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px] uppercase">P1 Billing</span>
              <span className="text-indigo-300 text-[10px]">ETA: 3 Days</span>
            </div>
            <h4 className="font-bold text-white text-sm">Audit Amex Credit Card Gateway</h4>
            <p className="text-indigo-200 leading-relaxed">
              Fix HTTP 500 error code on mobile payment processing. Restores $42,000/mo pipeline checkout conversions.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-indigo-950/60 border border-indigo-800/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px] uppercase">P2 Feature</span>
              <span className="text-indigo-300 text-[10px]">ETA: 2 Weeks</span>
            </div>
            <h4 className="font-bold text-white text-sm">Publish SOC2 Compliance Pack</h4>
            <p className="text-indigo-200 leading-relaxed">
              Upload SOC2 Type II audit report to Trust Portal to unblock pending enterprise sales deals.
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
