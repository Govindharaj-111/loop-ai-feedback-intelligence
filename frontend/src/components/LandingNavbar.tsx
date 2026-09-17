"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Menu, X, Cpu } from "lucide-react";

export default function LandingNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="w-full max-w-[1240px] mx-auto h-[72px] px-6 glass-surface flex items-center justify-between relative z-40 rounded-[22px] border border-cyan-500/30 shadow-[0_0_30px_rgba(0,242,254,0.15)] bg-[#030712]/80 backdrop-blur-2xl">
      {/* Brand Logo */}
      <Link href="/" className="flex items-center gap-2.5 group">
        <Logo size="md" showSubtitle={false} />
      </Link>

      {/* Desktop Navigation Links */}
      <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
        <a
          href="#platform"
          className="text-xs font-bold text-slate-300 hover:text-cyan-300 transition-colors uppercase tracking-wider font-mono"
        >
          Platform
        </a>
        <a
          href="#ai-intelligence"
          className="text-xs font-bold text-slate-300 hover:text-cyan-300 transition-colors uppercase tracking-wider font-mono"
        >
          AI Intelligence
        </a>
        <a
          href="#analytics"
          className="text-xs font-bold text-slate-300 hover:text-cyan-300 transition-colors uppercase tracking-wider font-mono"
        >
          Analytics
        </a>
        <a
          href="#reports"
          className="text-xs font-bold text-slate-300 hover:text-cyan-300 transition-colors uppercase tracking-wider font-mono"
        >
          Reports
        </a>
        <a
          href="#security"
          className="text-xs font-bold text-slate-300 hover:text-cyan-300 transition-colors uppercase tracking-wider font-mono"
        >
          Security
        </a>
      </nav>

      {/* Action Buttons */}
      <div className="hidden md:flex items-center gap-3">
        <Link href="/login">
          <Button variant="ghost" size="sm" className="font-bold text-slate-300 hover:text-cyan-300">
            Sign In
          </Button>
        </Link>
        <Link href="/signup">
          <Button
            variant="primary"
            size="sm"
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            className="bg-gradient-to-r from-cyan-500 to-indigo-600 border border-cyan-400/50 shadow-[0_0_20px_rgba(0,242,254,0.4)] text-white hover:scale-105 transition-all"
          >
            Get Started
          </Button>
        </Link>
      </div>

      {/* Mobile Hamburger Toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle navigation menu"
        className="md:hidden p-2 text-cyan-300 hover:text-white bg-cyan-950/40 rounded-lg border border-cyan-500/30"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Glass Dropdown Menu */}
      {mobileOpen && (
        <div className="md:hidden absolute top-[calc(100%+12px)] left-0 right-0 p-6 space-y-4 shadow-2xl z-50 border border-cyan-500/30 bg-[#060b19] rounded-2xl animate-in fade-in zoom-in-95 duration-150">
          <nav className="flex flex-col space-y-3">
            <a
              href="#platform"
              onClick={() => setMobileOpen(false)}
              className="text-sm font-bold text-slate-300 hover:text-cyan-300 py-1"
            >
              Platform
            </a>
            <a
              href="#ai-intelligence"
              onClick={() => setMobileOpen(false)}
              className="text-sm font-bold text-slate-300 hover:text-cyan-300 py-1"
            >
              AI Intelligence
            </a>
            <a
              href="#analytics"
              onClick={() => setMobileOpen(false)}
              className="text-sm font-bold text-slate-300 hover:text-cyan-300 py-1"
            >
              Analytics
            </a>
            <a
              href="#reports"
              onClick={() => setMobileOpen(false)}
              className="text-sm font-bold text-slate-300 hover:text-cyan-300 py-1"
            >
              Reports
            </a>
            <a
              href="#security"
              onClick={() => setMobileOpen(false)}
              className="text-sm font-bold text-slate-300 hover:text-cyan-300 py-1"
            >
              Security
            </a>
          </nav>
          <div className="pt-4 border-t border-cyan-500/20 flex flex-col gap-2.5">
            <Link href="/login" className="w-full">
              <Button variant="outline" size="md" className="w-full border-cyan-500/30 text-slate-200">
                Sign In
              </Button>
            </Link>
            <Link href="/signup" className="w-full">
              <Button
                variant="primary"
                size="md"
                className="w-full bg-cyan-500 text-black font-extrabold shadow-[0_0_20px_rgba(0,242,254,0.4)]"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
