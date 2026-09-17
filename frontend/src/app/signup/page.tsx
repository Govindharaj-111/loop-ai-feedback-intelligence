"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Building,
  User,
  Mail,
  Lock,
} from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, workspaceName }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create account");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Deep Glassmorphism Ambient Orbs */}
      <div className="absolute top-10 left-10 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Glass Split Card */}
      <div className="w-full max-w-5xl rounded-3xl bg-[#0b132b]/80 backdrop-blur-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[660px] relative z-10 border border-cyan-500/30 shadow-[0_0_60px_rgba(0,242,254,0.18)]">
        {/* LEFT COLUMN: Brand Showcase Panel */}
        <div className="lg:col-span-6 bg-gradient-to-br from-[#060b19] via-[#091124] to-[#040814] p-8 lg:p-12 text-white flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-cyan-500/20">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <Link href="/" className="inline-block">
              <Logo size="lg" showSubtitle={false} />
            </Link>

            <div className="space-y-3 pt-2">
              <h1 className="text-2xl lg:text-3xl font-black tracking-tight leading-tight text-white font-heading">
                Create your isolated <br />
                <span className="text-gradient">
                  workspace today.
                </span>
              </h1>
              <p className="text-xs lg:text-sm text-slate-400 leading-relaxed font-normal">
                Join product and engineering leaders turning raw customer feedback into strategic product roadmap decisions.
              </p>
            </div>

            {/* Benefit Checkmarks */}
            <div className="space-y-3 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 shadow-[0_0_8px_#00f2fe]" />
                <span>Instant multi-tenant workspace creation</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 shadow-[0_0_8px_#00f2fe]" />
                <span>Automatic ADMIN role assignment & full RBAC control</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 shadow-[0_0_8px_#00f2fe]" />
                <span>Anthropic Claude AI & Grounded RAG integration</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 shadow-[0_0_8px_#00f2fe]" />
                <span>Executive Voice-of-Customer report generation</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6 border-t border-white/10 flex items-center gap-2 text-xs text-slate-400 font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Encrypted HTTP-Only Session Cookies & Tenant Guard</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Signup Glass Form Panel */}
        <div className="lg:col-span-6 p-8 lg:p-12 bg-[#080d1e]/90 backdrop-blur-2xl flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full space-y-6">
            {/* Header */}
            <div className="space-y-1 text-center sm:text-left">
              <div className="inline-flex items-center justify-center sm:justify-start gap-2 mb-1">
                <Logo size="sm" showSubtitle={false} />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight font-heading">
                Create your workspace
              </h2>
              <p className="text-xs text-slate-400">
                Start transforming customer feedback into actionable intelligence.
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="p-3.5 bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold rounded-xl animate-in fade-in duration-150">
                {error}
              </div>
            )}

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-cyan-300/80 uppercase tracking-widest font-mono">
                  FULL NAME
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Sarah Jenkins"
                  className="w-full text-xs bg-white/5 border border-cyan-500/30 rounded-xl px-4 py-3 text-white placeholder-slate-500 transition-all duration-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 shadow-inner"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-cyan-300/80 uppercase tracking-widest font-mono">
                  WORK EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sarah@company.com"
                  className="w-full text-xs bg-white/5 border border-cyan-500/30 rounded-xl px-4 py-3 text-white placeholder-slate-500 transition-all duration-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 shadow-inner"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-cyan-300/80 uppercase tracking-widest font-mono">
                  WORKSPACE NAME
                </label>
                <input
                  type="text"
                  required
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  placeholder="Acme Product Intelligence"
                  className="w-full text-xs bg-white/5 border border-cyan-500/30 rounded-xl px-4 py-3 text-white placeholder-slate-500 transition-all duration-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 shadow-inner"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="signup-password" className="text-[11px] font-bold text-cyan-300/80 uppercase tracking-widest font-mono">
                  PASSWORD
                </label>
                <div className="relative">
                  <input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
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

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={loading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full h-11 text-xs font-black uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-indigo-600 border border-cyan-400/50 shadow-[0_0_25px_rgba(0,242,254,0.4)] text-white hover:scale-[1.02] transition-all mt-2"
              >
                Create Workspace
              </Button>
            </form>

            {/* Secondary Action */}
            <div className="text-center pt-2 text-xs text-slate-400">
              Already have an account?{" "}
              <Link href="/login" className="text-cyan-400 font-bold hover:underline">
                Sign in to existing workspace
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
