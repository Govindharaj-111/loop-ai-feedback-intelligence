import Link from "next/link";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import Logo from "@/components/Logo";
import LandingNavbar from "@/components/LandingNavbar";
import HeroDashboardPreview from "@/components/HeroDashboardPreview";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  MessageSquare,
  FileText,
  TrendingUp,
  Lock,
  Users,
  Database,
  Check,
  CheckCircle2,
  Search,
  Activity,
  Layers,
  ArrowDown,
  ChevronRight,
  Filter,
  Cpu,
} from "lucide-react";

export default async function HomePage() {
  const session = await getSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white relative overflow-hidden flex flex-col justify-between">
      {/* Deep Glassmorphism Ambient Radials */}
      <div className="absolute top-0 left-1/4 w-[700px] h-[700px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse" />
      <div className="absolute top-1/3 right-10 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-[700px] h-[700px] bg-pink-500/08 rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* Floating Glass Navbar Header */}
      <div className="pt-5">
        <LandingNavbar />
      </div>

      {/* Main Content Body */}
      <main className="flex-1 space-y-28 md:space-y-36">
        {/* HERO SECTION */}
        <section className="pt-16 md:pt-24 pb-12 page-container text-center space-y-8 relative z-10">
          {/* Small AI Badge */}
          <div className="inline-flex items-center gap-2 px-4.5 py-2 rounded-full bg-cyan-950/40 backdrop-blur-xl border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold shadow-[0_0_20px_rgba(0,242,254,0.2)]">
            <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>✦ CYBER-GROUNDED CUSTOMER FEEDBACK INTELLIGENCE</span>
          </div>

          {/* Hero Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-[64px] font-black text-white tracking-tight leading-[1.08] max-w-[960px] mx-auto font-heading">
            Turn Customer Signals <br />
            Into{" "}
            <span className="text-gradient">
              Product Intelligence.
            </span>
          </h1>

          {/* Description */}
          <p className="text-base md:text-lg text-slate-400 max-w-[760px] mx-auto leading-relaxed font-normal">
            Centralize feedback across channels, analyze period-over-period trend velocity, query grounded vector verbatims with zero hallucination, and synthesize executive Voice-of-Customer reports.
          </p>

          {/* Hero Call to Action Buttons */}
          <div className="flex flex-wrap justify-center items-center gap-4 pt-3">
            <Link href="/login">
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="px-8 h-13 text-sm font-black bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 border border-cyan-400/50 shadow-[0_0_30px_rgba(0,242,254,0.4)] hover:scale-105 transition-all text-white"
              >
                Open LOOP Cockpit
              </Button>
            </Link>

            <a href="#platform">
              <Button
                variant="glass"
                size="lg"
                rightIcon={<ChevronRight className="w-4 h-4 text-cyan-400" />}
                className="px-8 h-13 text-sm border-cyan-500/30 bg-white/5 text-slate-200 hover:bg-white/10"
              >
                Explore Intelligence Engine
              </Button>
            </a>
          </div>

          {/* Trust Checkmarks */}
          <div className="flex flex-wrap justify-center items-center gap-8 pt-4 text-xs font-mono font-bold text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shadow-[0_0_8px_#00f2fe]" />
              <span>Multi-Tenant Workspace Guard</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shadow-[0_0_8px_#00f2fe]" />
              <span>Grounded Vector RAG Copilot</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shadow-[0_0_8px_#00f2fe]" />
              <span>Role-Based RBAC Permissions</span>
            </div>
          </div>

          {/* Product Dashboard Visual Preview */}
          <div id="platform" className="pt-8">
            <HeroDashboardPreview />
          </div>
        </section>

        {/* 4 FEATURE SECTIONS WITH VISUAL PREVIEWS */}
        <section id="features" className="page-container space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <Badge variant="cyan" size="md">
              Core Capabilities
            </Badge>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight font-heading">
              Engineered for Modern Product Teams
            </h2>
            <p className="text-sm md:text-base text-slate-400">
              Four enterprise intelligence engines designed to translate raw feedback signals into strategic product decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feature 1: AI Classification */}
            <GlassCard hoverable className="p-8 space-y-6 flex flex-col justify-between border-cyan-500/30 bg-[#060b19]/80">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_20px_rgba(0,242,254,0.3)]">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-white font-heading">AI Signal Classification</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Automated sentiment and multi-theme tagging validated via Zod runtime schemas. Categorize incoming support tickets, App Store reviews, and CRM call notes in real-time.
                </p>
              </div>

              {/* Visual Preview Box */}
              <div className="bg-[#030712] p-4.5 rounded-2xl border border-cyan-500/30 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-cyan-300 font-bold">Support Signal #4920</span>
                  <Badge variant="success" size="sm" dot>
                    Positive (+0.85)
                  </Badge>
                </div>
                <p className="text-xs text-slate-300 italic">
                  "The SAML SSO setup was completely seamless for our IT team!"
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="cyan" size="sm">Security & Auth</Badge>
                  <Badge variant="neutral" size="sm">Enterprise SSO</Badge>
                </div>
              </div>
            </GlassCard>

            {/* Feature 2: Ask LOOP */}
            <GlassCard hoverable className="p-8 space-y-6 flex flex-col justify-between border-purple-500/30 bg-[#060b19]/80">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-400/40 flex items-center justify-center shadow-[0_0_20px_rgba(157,78,225,0.3)]">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-white font-heading">Ask LOOP Grounded RAG</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Natural-language vector search copilot. Query complex customer feedback questions and receive cited verbatims with zero hallucination guardrails.
                </p>
              </div>

              {/* Visual Preview Box */}
              <div className="bg-[#030712] p-4.5 rounded-2xl border border-purple-500/30 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-300 font-mono">
                  <Search className="w-4 h-4 text-purple-400" />
                  <span>"What are customers saying about billing?"</span>
                </div>
                <div className="bg-purple-950/20 p-3 rounded-xl border border-purple-500/20 text-xs text-slate-200">
                  <p className="font-bold text-purple-300 mb-1">Based on 4 cited verbatims:</p>
                  <p className="text-[11px] text-slate-300">Customers report friction regarding invoice payment options for Amex cards.</p>
                </div>
              </div>
            </GlassCard>

            {/* Feature 3: Trend Velocity */}
            <GlassCard hoverable className="p-8 space-y-6 flex flex-col justify-between border-cyan-500/30 bg-[#060b19]/80">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/40 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-white font-heading">Trend Velocity Engine</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Period-over-period trend analysis classifying topics into SPIKING, INCREASING, STABLE, or DECREASING momentum before they impact user retention.
                </p>
              </div>

              {/* Visual Preview Box */}
              <div className="bg-[#030712] p-4.5 rounded-2xl border border-indigo-500/30 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white font-mono">Onboarding Friction</span>
                  <span className="text-emerald-400 font-extrabold shadow-[0_0_8px_#00ff88]">+24% Velocity</span>
                </div>
                <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-cyan-400 to-indigo-600 h-full w-[78%]" />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>Last Period: 42 items</span>
                  <span>Current Period: 68 items</span>
                </div>
              </div>
            </GlassCard>

            {/* Feature 4: Voice of Customer Reports */}
            <GlassCard hoverable className="p-8 space-y-6 flex flex-col justify-between border-emerald-500/30 bg-[#060b19]/80">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center justify-center shadow-[0_0_20px_rgba(0,255,136,0.3)]">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-white font-heading">Voice-of-Customer Reports</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Synthesize executive VoC summaries backed by verified server-calculated database statistics, representative verbatims, and 1-click PDF export.
                </p>
              </div>

              {/* Visual Preview Box */}
              <div className="bg-[#030712] p-4.5 rounded-2xl border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-white font-mono">
                  <span>Executive VoC Report (Q3)</span>
                  <Badge variant="success" size="sm">Verified Database Stats</Badge>
                </div>
                <p className="text-[11px] text-slate-300 line-clamp-2">
                  "Workspace aggregated 1,284 records. Verified sentiment breakdown: 68% Positive, 18% Negative, 14% Neutral."
                </p>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* HOW LOOP WORKS (VISUAL PIPELINE FLOW) */}
        <section id="ai-intelligence" className="page-container space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <Badge variant="cyan" size="md">
              Automated Flow
            </Badge>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight font-heading">
              How Project LOOP Works
            </h2>
            <p className="text-sm md:text-base text-slate-400">
              A 6-stage automated intelligence pipeline turning raw customer signals into strategic action.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 relative">
            {[
              { step: "01", title: "FEEDBACK", desc: "Ingest CSV, Zendesk & API streams" },
              { step: "02", title: "AI CLASSIFY", desc: "Claude NLP sentiment & theme parsing" },
              { step: "03", title: "THEMES", desc: "Cluster feedback into topic groups" },
              { step: "04", title: "TRENDS", desc: "Track velocity & volume shifts" },
              { step: "05", title: "RAG SEARCH", desc: "Grounded vector verbatims Q&A" },
              { step: "06", title: "VoC REPORT", desc: "Generate executive VoC reports" },
            ].map((st, idx) => (
              <GlassCard
                key={idx}
                hoverable
                className="p-5 rounded-2xl space-y-2 text-center border border-cyan-500/20 bg-[#060b19]/80"
              >
                <div className="text-xs font-mono font-black text-cyan-300 bg-cyan-500/20 px-2.5 py-0.5 rounded-full inline-block border border-cyan-400/30">
                  {st.step}
                </div>
                <h4 className="text-xs font-black text-white tracking-wider font-heading">
                  {st.title}
                </h4>
                <p className="text-[11px] text-slate-400 leading-tight">
                  {st.desc}
                </p>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* TRUST SECTION */}
        <section id="security" className="page-container space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <Badge variant="neutral" size="md">
              Enterprise Data Governance
            </Badge>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight font-heading">
              Enterprise Data Security & Privacy
            </h2>
            <p className="text-sm md:text-base text-slate-400">
              Architected from the ground up for strict multi-tenant data governance and workspace isolation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard hoverable className="p-8 space-y-4 border-cyan-500/30 bg-[#060b19]/80">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_20px_rgba(0,242,254,0.3)]">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white font-heading">Unconditional Workspace Boundary</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every database query, vector embedding lookup, and VoC report calculation is strictly scoped to the server session `workspaceId`.
              </p>
            </GlassCard>

            <GlassCard hoverable className="p-8 space-y-4 border-indigo-500/30 bg-[#060b19]/80">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/40 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white font-heading">Role-Based Access Control (RBAC)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Granular user roles for ADMIN (full control & team management), ANALYST (feedback CRUD & AI generation), and VIEWER (read-only dashboards).
              </p>
            </GlassCard>

            <GlassCard hoverable className="p-8 space-y-4 border-purple-500/30 bg-[#060b19]/80">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-400/40 flex items-center justify-center shadow-[0_0_20px_rgba(157,78,225,0.3)]">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white font-heading">Zero-Hallucination RAG Guard</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ask LOOP explicitly refuses to invent feedback when zero evidence is retrieved from vector search, guaranteeing truthful executive insights.
              </p>
            </GlassCard>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="mt-28 border-t border-cyan-500/20 bg-[#030712] py-12">
        <div className="page-container flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <Logo size="sm" showSubtitle={false} />
            <span>— AI Customer-Feedback Intelligence Platform</span>
          </div>

          <div className="flex items-center gap-6 font-mono text-[11px]">
            <Link href="/login" className="hover:text-cyan-300 transition-colors">
              Sign In
            </Link>
            <Link href="/signup" className="hover:text-cyan-300 transition-colors">
              Create Workspace
            </Link>
            <a href="#platform" className="hover:text-cyan-300 transition-colors">
              Platform
            </a>
          </div>

          <div>
            © {new Date().getFullYear()} Project LOOP. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
