"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { safeFetchJson } from "@/lib/api";
import {
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  Zap,
  MessageSquareCode,
  FileText,
  CheckCircle2,
  Sparkles,
  Lock,
  Layers,
  Cpu,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Background warmup ping to wake sleeping backend instances (e.g. Render free tier)
  useEffect(() => {
    fetch("/api/health").catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await safeFetchJson("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        setError(response.error || "Invalid credentials");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Deep Glassmorphism Ambient Orbs */}
      <div className="absolute top-10 left-10 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-600/05 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Glass Split Card */}
      <div className="w-full max-w-5xl rounded-3xl bg-[#0b132b]/80 backdrop-blur-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[660px] relative z-10 border border-cyan-500/30 shadow-[0_0_60px_rgba(0,242,254,0.18)]">
        {/* LEFT COLUMN: Brand & Intelligence Graphic Showcase */}
        <div className="lg:col-span-6 bg-gradient-to-br from-[#060b19] via-[#091124] to-[#040814] p-8 lg:p-12 text-white flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-cyan-500/20">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <Link href="/" className="inline-block">
              <Logo size="lg" showSubtitle={false} />
            </Link>

            <div className="space-y-3 pt-2">
              <h1 className="text-2xl lg:text-3xl font-black tracking-tight leading-tight text-white font-heading">
                Your customers are already <br />
                <span className="text-gradient">
                  telling you what to build.
                </span>
              </h1>
              <p className="text-xs lg:text-sm text-slate-400 leading-relaxed font-normal">
                Turn customer feedback into actionable product intelligence with grounded AI vector classification, trend velocity analysis, and executive VoC reports.
              </p>
            </div>

            {/* Visual Intelligence Graphic Pipeline */}
            <div className="p-4 bg-white/5 border border-cyan-500/30 rounded-2xl space-y-3 backdrop-blur-md shadow-inner">
              <div className="text-[11px] font-bold uppercase tracking-widest text-cyan-300 flex items-center gap-1.5 font-mono">
                <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>Vector Intelligence Pipeline</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 space-y-1">
                  <div className="text-[10px] font-mono text-slate-400">STAGE 01</div>
                  <div className="font-bold text-white text-[11px]">Signal Ingestion</div>
                </div>

                <div className="p-2.5 bg-cyan-500/20 rounded-xl border border-cyan-400/40 space-y-1 shadow-[0_0_15px_rgba(0,242,254,0.2)]">
                  <div className="text-[10px] font-mono text-cyan-300">STAGE 02</div>
                  <div className="font-bold text-cyan-200 text-[11px]">RAG Vector AI</div>
                </div>

                <div className="p-2.5 bg-purple-500/20 rounded-xl border border-purple-400/40 space-y-1 shadow-[0_0_15px_rgba(157,78,225,0.2)]">
                  <div className="text-[10px] font-mono text-purple-300">STAGE 03</div>
                  <div className="font-bold text-purple-200 text-[11px]">Product Insights</div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6 border-t border-white/10 flex items-center gap-2 text-xs text-slate-400 font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Strict Workspace Data Isolation & Session Auth</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Glass Form Panel */}
        <div className="lg:col-span-6 p-8 lg:p-12 bg-[#080d1e]/90 backdrop-blur-2xl flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full space-y-6">
            {/* Header */}
            <div className="space-y-1 text-center sm:text-left">
              <div className="inline-flex items-center justify-center sm:justify-start gap-2 mb-1">
                <Logo size="sm" showSubtitle={false} />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight font-heading">
                Workspace Sign In
              </h2>
              <p className="text-xs text-slate-400">
                Enter your credentials to access your tenant intelligence platform.
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="p-3.5 bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold rounded-xl animate-in fade-in duration-150">
                {error}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-cyan-300/80 uppercase tracking-widest font-mono">
                  WORK EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@acme.com"
                  className="w-full text-xs bg-white/5 border border-cyan-500/30 rounded-xl px-4 py-3 text-white placeholder-slate-500 transition-all duration-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 shadow-inner"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="login-password" className="text-[11px] font-bold text-cyan-300/80 uppercase tracking-widest font-mono">
                    PASSWORD
                  </label>
                  <span className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 cursor-pointer">
                    Forgot password?
                  </span>
                </div>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full text-xs bg-white/5 border border-cyan-500/30 rounded-xl px-4 py-3 pr-10 text-white placeholder-slate-500 transition-all duration-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-cyan-500 bg-white/5 rounded border-cyan-500/40 focus:ring-cyan-400"
                  />
                  <span>Remember session</span>
                </label>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={loading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full h-11 text-xs font-black uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-indigo-600 border border-cyan-400/50 shadow-[0_0_25px_rgba(0,242,254,0.4)] text-white hover:scale-[1.02] transition-all"
              >
                Sign In To Workspace
              </Button>
            </form>

            {/* Quick Fill Demo Credentials Assistant */}
            <div className="p-4 bg-cyan-950/20 border border-cyan-500/30 rounded-2xl space-y-2.5 text-xs">
              <div className="font-bold text-cyan-300 flex items-center justify-between text-[11px] font-mono">
                <span>DEMO CREDENTIALS (CLICK TO AUTO-FILL)</span>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 px-1.5 py-0.5 rounded font-bold">
                  Instant Access
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEmail("admin@acme.com");
                    setPassword("AdminPass123!");
                  }}
                  className="p-2.5 bg-white/5 border border-cyan-500/30 hover:border-cyan-400 rounded-xl text-left transition-all hover:bg-cyan-500/20 hover:scale-105"
                >
                  <div className="text-cyan-300 font-black text-[11px]">ADMIN</div>
                  <div className="truncate text-slate-400 text-[10px]">admin@acme.com</div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail("analyst@acme.com");
                    setPassword("AnalystPass123!");
                  }}
                  className="p-2.5 bg-white/5 border border-purple-500/30 hover:border-purple-400 rounded-xl text-left transition-all hover:bg-purple-500/20 hover:scale-105"
                >
                  <div className="text-purple-300 font-black text-[11px]">ANALYST</div>
                  <div className="truncate text-slate-400 text-[10px]">analyst@acme.com</div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail("viewer@acme.com");
                    setPassword("ViewerPass123!");
                  }}
                  className="p-2.5 bg-white/5 border border-emerald-500/30 hover:border-emerald-400 rounded-xl text-left transition-all hover:bg-emerald-500/20 hover:scale-105"
                >
                  <div className="text-emerald-300 font-black text-[11px]">VIEWER</div>
                  <div className="truncate text-slate-400 text-[10px]">viewer@acme.com</div>
                </button>
              </div>
            </div>

            {/* Secondary Action */}
            <div className="text-center pt-2 text-xs text-slate-400">
              Need a new tenant workspace?{" "}
              <Link href="/signup" className="text-cyan-400 font-bold hover:underline">
                Create new workspace
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
