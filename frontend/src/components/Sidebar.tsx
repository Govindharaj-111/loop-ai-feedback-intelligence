"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import {
  LayoutDashboard,
  Inbox,
  MessageSquare,
  TrendingUp,
  Sparkles,
  FileText,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Building2,
  ChevronRight,
  Layers,
  Cpu,
} from "lucide-react";
import { SessionUser } from "@/types";

interface SidebarProps {
  user: SessionUser;
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error("Logout request error:", e);
    } finally {
      router.push("/login");
      router.refresh();
    }
  };

  const roleVariantMap: Record<string, "secondary" | "primary" | "success"> = {
    ADMIN: "secondary",
    ANALYST: "primary",
    VIEWER: "success",
  };

  interface NavItem {
    name: string;
    href: string;
    icon: any;
    adminOnly?: boolean;
  }

  interface NavGroup {
    groupLabel: string;
    items: NavItem[];
  }

  const navGroups: NavGroup[] = [
    {
      groupLabel: "OVERVIEW",
      items: [
        {
          name: "Dashboard",
          href: "/dashboard",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      groupLabel: "INTELLIGENCE",
      items: [
        {
          name: "Feedback",
          href: "/dashboard/feedback",
          icon: MessageSquare,
        },
        {
          name: "AI Insights",
          href: "/dashboard/ai-insights",
          icon: Sparkles,
        },
        {
          name: "Themes",
          href: "/dashboard/themes",
          icon: Layers,
        },
        {
          name: "Ask LOOP RAG",
          href: "/dashboard/ask-loop",
          icon: Inbox,
        },
        {
          name: "Trends",
          href: "/dashboard/trends",
          icon: TrendingUp,
        },
      ],
    },
    {
      groupLabel: "OUTPUT & CONTROL",
      items: [
        {
          name: "Reports",
          href: "/dashboard/reports",
          icon: FileText,
        },
        {
          name: "Users",
          href: "/dashboard/users",
          icon: Users,
          adminOnly: true,
        },
        {
          name: "Settings",
          href: "/dashboard/settings",
          icon: Settings,
        },
      ],
    },
  ];

  const sidebarInnerContent = (
    <div className="flex flex-col h-full border-r border-cyan-500/20 bg-[#060b19]/90 backdrop-blur-2xl text-slate-200 relative overflow-hidden">
      {/* Laser accent line on side */}
      <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-cyan-400 via-purple-500 to-pink-500 opacity-60 shadow-[0_0_12px_#00f2fe]" />

      {/* Brand Header */}
      <div className="p-5 border-b border-cyan-500/20 space-y-4">
        <Link href="/dashboard" className="block">
          <Logo size="md" showSubtitle={true} />
        </Link>

        {/* Active Workspace Selector Card */}
        <div className="p-3 bg-cyan-950/20 border border-cyan-500/30 rounded-xl flex items-center justify-between shadow-[0_0_15px_rgba(0,242,254,0.15)] transition-all hover:border-cyan-400/60 hover:bg-cyan-900/30 group">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 bg-cyan-500/20 text-cyan-300 rounded-lg shrink-0 border border-cyan-400/40 shadow-[0_0_15px_rgba(0,242,254,0.3)]">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate font-heading tracking-wide">
                {user.workspaceName}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping shadow-[0_0_8px_#00f2fe]" />
                <span className="text-[10px] text-cyan-300 uppercase tracking-widest font-extrabold">
                  CYBER TENANT
                </span>
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-cyan-400/70 group-hover:text-cyan-300 transition-colors shrink-0" />
        </div>
      </div>

      {/* Categorized Navigation Link Groups */}
      <nav className="flex-1 px-3 py-5 space-y-6 overflow-y-auto" aria-label="Main Navigation">
        {navGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1.5">
            <div className="px-3 text-[10px] font-black text-cyan-400/70 uppercase tracking-widest">
              {group.groupLabel}
            </div>
            {group.items.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              const isLocked = item.adminOnly && user.role !== "ADMIN";

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all duration-200 group relative ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-500/20 via-purple-500/15 to-transparent text-white font-bold border border-cyan-400/50 shadow-[0_0_25px_rgba(0,242,254,0.25)]"
                      : "text-slate-400 hover:text-cyan-200 hover:bg-white/5 font-medium"
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-7 bg-cyan-400 rounded-r-full shadow-[0_0_15px_#00f2fe]" />
                  )}
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? "text-cyan-300 shadow-[0_0_10px_#00f2fe]" : "text-slate-400 group-hover:text-cyan-300"
                    }`}
                  />
                  <span className="truncate">{item.name}</span>

                  {isLocked && (
                    <span className="ml-auto text-[9px] font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                      Admin
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Cyber AI Core Widget */}
      <div className="px-4 py-3 mx-3 my-2 bg-gradient-to-r from-cyan-950/40 via-purple-950/30 to-black border border-cyan-500/30 rounded-xl flex items-center justify-between text-xs shadow-[0_0_15px_rgba(0,242,254,0.15)]">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-[11px] font-bold text-cyan-200 tracking-wider">CYBER AI RAG</span>
        </div>
        <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 px-2 py-0.5 rounded-full font-black tracking-widest shadow-[0_0_10px_rgba(0,242,254,0.3)]">
          ONLINE
        </span>
      </div>

      {/* Bottom User Session Summary Footer */}
      <div className="p-4 border-t border-cyan-500/20 space-y-3 bg-[#040814]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar name={user.name} size="sm" status="online" />
            <div className="truncate min-w-0">
              <div className="text-xs font-bold text-white truncate">
                {user.name}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {user.email}
              </div>
            </div>
          </div>

          <Badge variant={roleVariantMap[user.role] || "neutral"} size="sm">
            {user.role}
          </Badge>
        </div>

        <button
          onClick={handleLogout}
          aria-label="Sign out of workspace"
          className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-slate-300 hover:text-rose-400 hover:bg-rose-500/10 border border-cyan-500/20 hover:border-rose-500/40 rounded-xl transition-all bg-cyan-950/10 shadow-sm"
        >
          <LogOut className="w-3.5 h-3.5" />
          Disconnect Session
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Width Sidebar (~240px) */}
      <aside className="hidden md:block w-[240px] h-screen sticky top-0 shrink-0 z-30">
        {sidebarInnerContent}
      </aside>

      {/* Mobile Top Navigation Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-[#060b19]/95 backdrop-blur-xl border-b border-cyan-500/20 flex items-center justify-between px-4 z-40">
        <Logo size="sm" showSubtitle={false} />
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle Navigation Drawer"
          className="p-2 text-cyan-300 hover:text-white bg-cyan-950/40 rounded-lg border border-cyan-500/30"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer Modal */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-lg flex animate-in fade-in duration-150">
          <div className="w-[270px] h-full bg-[#060b19] shadow-2xl relative">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white"
              aria-label="Close Navigation"
            >
              <X className="w-5 h-5" />
            </button>
            {sidebarInnerContent}
          </div>
          <div className="flex-1" onClick={() => setMobileOpen(false)} />
        </div>
      )}
    </>
  );
}
