"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import {
  Layers,
  Sparkles,
  TrendingUp,
  MessageSquare,
  ArrowRight,
  Filter,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  ChevronRight,
  ShieldCheck,
  Tag,
} from "lucide-react";

export default function ThemesPage() {
  const [loading, setLoading] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<string>("Product Quality");
  const [searchQuery, setSearchQuery] = useState("");

  const themeCategories = [
    {
      id: "Product Quality",
      name: "Product Quality",
      count: 42,
      percent: 34,
      sentiment: "Negative",
      velocity: "+24%",
      color: "rose",
      description: "Mobile crashes on iOS 17.4, push notification bugs, and battery drain reported by mobile app users.",
      examples: [
        { text: "Latest iOS 17.4 mobile update crashes instantly when opening push notifications tab.", customer: "App Store User @tech_guru", channel: "App Review" },
        { text: "Android application consumes 45% battery in background mode. High battery drain reported.", customer: "Android User Mark_S", channel: "Support Ticket" },
      ],
      aiExplanation: "Product Quality theme is heavily impacted by the recent v4.2.0 iOS update. Push notification click handlers throw unhandled exceptions, causing 22% of total workspace support volume.",
    },
    {
      id: "Pricing & Billing",
      name: "Pricing & Billing",
      count: 31,
      percent: 25,
      sentiment: "Negative",
      velocity: "+34%",
      color: "amber",
      description: "Credit card checkout errors, Amex payment gateway failures, and subscription auto-renewal invoice requests.",
      examples: [
        { text: "Unable to process payment using American Express card on mobile checkout page. Keeps returning HTTP 500 error.", customer: "Enterprise Client - Acme Retail", channel: "Support Ticket" },
        { text: "Subscription auto-renewal failed without sending notification email. Almost lost access to project workspace.", customer: "GlobalTech Systems", channel: "Support Ticket" },
      ],
      aiExplanation: "Pricing & Billing friction stems from an API gateway timeout during Amex credit card tokenization. Resolving this API issue will prevent subscription upgrade drop-offs.",
    },
    {
      id: "Customer Support",
      name: "Customer Support",
      count: 22,
      percent: 18,
      sentiment: "Positive",
      velocity: "+12%",
      color: "emerald",
      description: "Response speed of support engineers, SAML SSO integration assistance, and resolution times.",
      examples: [
        { text: "Okta SAML 2.0 Single Sign-On setup documentation was clear and worked on first attempt.", customer: "IT SecAdmin @ Horizon", channel: "Community Post" },
        { text: "Support team resolved our custom session timeout question in under 15 minutes!", customer: "Enterprise Admin Sarah_M", channel: "Support Ticket" },
      ],
      aiExplanation: "Customer Support scores are very high (+0.88 sentiment score). Technical documentation clarity around Okta SSO integration is driving strong enterprise customer loyalty.",
    },
    {
      id: "Delivery & Performance",
      name: "Delivery & Performance",
      count: 18,
      percent: 14,
      sentiment: "Positive",
      velocity: "-5%",
      color: "cyan",
      description: "Database query speeds, dashboard loading latency, and bulk CSV export processing times.",
      examples: [
        { text: "Dashboard loading time reduced from 4.2 seconds to 800ms after recent database migration. Great work!", customer: "NPS Respondent (Score: 10)", channel: "NPS Survey" },
        { text: "CSV export times out when exporting datasets with over 25,000 feedback records.", customer: "Analytics Lead @ DataCorp", channel: "Support Ticket" },
      ],
      aiExplanation: "Performance sentiment improved significantly after recent database migrations. However, dataset exports exceeding 25,000 rows still require queue backgrounding.",
    },
    {
      id: "User Experience",
      name: "User Experience",
      count: 12,
      percent: 9,
      sentiment: "Positive",
      velocity: "+15%",
      color: "purple",
      description: "Natural language RAG search, dark mode interface redesign, and VoC PDF report layout usability.",
      examples: [
        { text: "Ask LOOP natural language RAG search provides accurate citations from customer feedback tickets!", customer: "NPS Respondent (Score: 10)", channel: "NPS Survey" },
        { text: "Loved the new mobile dark mode interface overhaul! Navigation is twice as fast.", customer: "Google Play User Sarah_K", channel: "App Review" },
      ],
      aiExplanation: "User Experience is a major differentiator. The Ask LOOP RAG AI assistant and dark mode interface overhaul receive consistent praise from product managers.",
    },
  ];

  const activeThemeObj = themeCategories.find((t) => t.id === selectedTheme) || themeCategories[0];

  const filteredThemes = themeCategories.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Customer Feedback Themes
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Automated topic clustering powered by Claude 3.5 Sonnet NLP classification engines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/dashboard/ask-loop">
            <Button variant="primary" size="md" leftIcon={<Sparkles className="w-4 h-4" />}>
              Ask LOOP Copilot
            </Button>
          </Link>
        </div>
      </div>

      {/* Control Bar: Search Filter */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center justify-between gap-4 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter theme categories..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
          />
        </div>

        <div className="text-xs text-slate-500 font-semibold">
          Showing 5 Active Customer Clusters
        </div>
      </div>

      {/* Main Theme Selection Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {filteredThemes.map((th) => {
          const isSelected = th.id === selectedTheme;
          return (
            <div
              key={th.id}
              onClick={() => setSelectedTheme(th.id)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                isSelected
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/25 scale-[1.02]"
                  : "bg-white text-slate-900 border-slate-200 hover:border-indigo-300 hover:shadow-md"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-extrabold uppercase tracking-wider ${isSelected ? "text-indigo-200" : "text-slate-400"}`}>
                  {th.percent}% Volume
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isSelected
                    ? "bg-white/20 text-white"
                    : th.sentiment === "Negative"
                    ? "bg-rose-50 text-rose-700"
                    : "bg-emerald-50 text-emerald-700"
                }`}>
                  {th.sentiment}
                </span>
              </div>

              <div className="mt-3 space-y-1">
                <h3 className={`text-base font-bold tracking-tight ${isSelected ? "text-white" : "text-slate-900"}`}>
                  {th.name}
                </h3>
                <div className={`text-2xl font-extrabold ${isSelected ? "text-white" : "text-slate-900"}`}>
                  {th.count} <span className="text-xs font-normal opacity-80">verbatims</span>
                </div>
              </div>

              <div className={`text-[11px] font-semibold mt-2 ${isSelected ? "text-indigo-200" : "text-indigo-600"}`}>
                Velocity: {th.velocity}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Theme Deep-Dive Details Drawer */}
      <GlassCard className="p-6 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="cyan" size="md">
                Active Theme Analysis
              </Badge>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-600 font-bold">
                {activeThemeObj.count} Customer Records
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {activeThemeObj.name}
            </h2>
            <p className="text-xs md:text-sm text-slate-600">
              {activeThemeObj.description}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Velocity</div>
              <div className="text-sm font-extrabold text-indigo-600">{activeThemeObj.velocity}</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sentiment</div>
              <div className="text-sm font-extrabold text-slate-900">{activeThemeObj.sentiment}</div>
            </div>
          </div>
        </div>

        {/* AI Synthesis Explanation */}
        <div className="p-5 rounded-2xl bg-purple-50/70 border border-purple-200/80 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-900">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>AI Cause & Effect Explanation</span>
          </div>
          <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-normal">
            {activeThemeObj.aiExplanation}
          </p>
        </div>

        {/* Example Customer Verbatims */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Representative Customer Quotes
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeThemeObj.examples.map((ex, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <p className="text-xs text-slate-900 font-medium leading-relaxed italic">
                  "{ex.text}"
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                  <span className="font-bold text-slate-700">{ex.customer}</span>
                  <Badge variant="neutral" size="sm">{ex.channel}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action Footer */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <Link href="/dashboard/feedback">
            <Button variant="outline" size="sm" className="bg-white text-xs font-semibold" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Filter All Feedback by "{activeThemeObj.name}"
            </Button>
          </Link>

          <Link href="/dashboard/ask-loop">
            <Button variant="primary" size="sm" className="text-xs font-semibold" leftIcon={<Sparkles className="w-3.5 h-3.5" />}>
              Ask LOOP AI About This Theme
            </Button>
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}
