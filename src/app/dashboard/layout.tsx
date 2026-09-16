import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import Sidebar from "@/components/Sidebar";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Bell, Search, Sparkles } from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const roleVariantMap: Record<string, "secondary" | "primary" | "success"> = {
    ADMIN: "secondary",
    ANALYST: "primary",
    VIEWER: "success",
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-900">
      {/* 240px Fixed Desktop Sidebar */}
      <Sidebar user={session} />

      {/* Main App Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="hidden md:flex h-16 glass-surface border-b border-slate-200/80 items-center justify-between px-8 sticky top-0 z-20 rounded-none bg-white/80 backdrop-blur-md">
          {/* Left: Breadcrumbs & Workspace Title */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-medium text-slate-400">Workspace</span>
            <span className="text-slate-300">/</span>
            <span className="font-bold text-slate-900">{session.workspaceName}</span>
          </div>

          {/* Right: AI Status, Search, Notifications, Profile */}
          <div className="flex items-center gap-4">
            {/* AI Status Indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/70 text-[11px] font-semibold text-emerald-700 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                LOOP AI Online
              </span>
            </div>

            {/* Global Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search feedback, topics... ⌘K"
                className="pl-8 pr-4 py-1.5 bg-slate-100/80 border border-slate-200/80 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white w-52 transition-all"
              />
            </div>

            {/* Notifications Button */}
            <button
              aria-label="View notifications"
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg relative transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white" />
            </button>

            <div className="h-4 w-px bg-slate-200" />

            {/* User Profile */}
            <div className="flex items-center gap-2.5">
              <Avatar name={session.name} size="sm" />
              <div className="text-xs font-bold text-slate-900">{session.name}</div>
              <Badge variant={roleVariantMap[session.role] || "neutral"} size="sm">
                {session.role}
              </Badge>
            </div>
          </div>
        </header>

        {/* Dynamic Page Canvas (max-width: 1440px) */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pt-18 md:pt-8 w-full max-w-[1440px] mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
