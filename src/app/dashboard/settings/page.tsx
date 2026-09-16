"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Settings,
  Building2,
  Users,
  Key,
  Bot,
  ShieldCheck,
  Check,
  RefreshCw,
  Sparkles,
  Save,
  Lock,
  Database,
  Globe,
  Sliders,
} from "lucide-react";
import { SessionUser } from "@/types";

export default function SettingsPage() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"workspace" | "ai" | "team" | "api">("workspace");

  // Form State
  const [workspaceName, setWorkspaceName] = useState("Acme Feedback Intelligence");
  const [aiModel, setAiModel] = useState("claude-3-5-sonnet");
  const [confidenceThreshold, setConfidenceThreshold] = useState("0.85");
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          if (data.user?.workspaceName) {
            setWorkspaceName(data.user.workspaceName);
          }
        }
      } catch (err) {
        console.error("Failed to fetch session:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSession();
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const teamMembers = [
    { name: "Sarah Jenkins", email: "admin@acme.com", role: "ADMIN", status: "Active" },
    { name: "Marcus Vance", email: "analyst@acme.com", role: "ANALYST", status: "Active" },
    { name: "Elena Rostova", email: "viewer@acme.com", role: "VIEWER", status: "Active" },
  ];

  return (
    <div className="space-y-8 pb-12 max-w-5xl">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            Settings & Governance <Settings className="w-6 h-6 text-indigo-600" />
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage workspace security parameters, AI model selections, team roles, and API integrations.
          </p>
        </div>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("workspace")}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === "workspace"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-bold"
              : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Workspace Profile</span>
        </button>

        <button
          onClick={() => setActiveTab("ai")}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === "ai"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-bold"
              : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200"
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>AI Models & Prompt Engine</span>
        </button>

        <button
          onClick={() => setActiveTab("team")}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === "team"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-bold"
              : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Team Roles & Permissions</span>
        </button>

        <button
          onClick={() => setActiveTab("api")}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === "api"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-bold"
              : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200"
          }`}
        >
          <Key className="w-4 h-4" />
          <span>API Keys & Ingestion Webhooks</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Workspace settings updated successfully!</span>
        </div>
      )}

      {/* TAB 1: WORKSPACE PROFILE */}
      {activeTab === "workspace" && (
        <GlassCard className="p-6 space-y-6">
          <div className="space-y-1 border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900">Workspace Organization Profile</h3>
            <p className="text-xs text-slate-500">General settings for your multi-tenant intelligence workspace.</p>
          </div>

          <form onSubmit={handleSave} className="space-y-5 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 uppercase">Workspace Name</label>
              <input
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                className="w-full max-w-md px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 uppercase">Workspace ID (Tenant Key)</label>
              <input
                type="text"
                disabled
                value="05161aed-1eca-43c0-87e3-e0a57292e3cc"
                className="w-full max-w-md px-3.5 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-mono"
              />
              <p className="text-[11px] text-slate-400">Strictly enforced server-side for database row isolation.</p>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <Button variant="primary" size="md" type="submit" leftIcon={<Save className="w-4 h-4" />}>
                Save Workspace Profile
              </Button>
            </div>
          </form>
        </GlassCard>
      )}

      {/* TAB 2: AI MODELS */}
      {activeTab === "ai" && (
        <GlassCard className="p-6 space-y-6">
          <div className="space-y-1 border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900">AI Intelligence Engine & Models</h3>
            <p className="text-xs text-slate-500">Select underlying LLM model engines and grounding confidence thresholds.</p>
          </div>

          <form onSubmit={handleSave} className="space-y-6 text-xs">
            <div className="space-y-3">
              <label className="font-bold text-slate-700 uppercase">Selected Classification Model</label>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  onClick={() => setAiModel("claude-3-5-sonnet")}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    aiModel === "claude-3-5-sonnet"
                      ? "bg-indigo-50 border-indigo-600 text-indigo-900 shadow-sm"
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span>Claude 3.5 Sonnet</span>
                    <Badge variant="secondary" size="sm">Recommended</Badge>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">
                    Highest precision for multi-theme sentiment extraction and RAG grounding citations.
                  </p>
                </div>

                <div
                  onClick={() => setAiModel("gpt-4o")}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    aiModel === "gpt-4o"
                      ? "bg-indigo-50 border-indigo-600 text-indigo-900 shadow-sm"
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span>OpenAI GPT-4o</span>
                    <Badge variant="neutral" size="sm">Supported</Badge>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">
                    High throughput classification for bulk CSV ingestion streams.
                  </p>
                </div>

                <div
                  onClick={() => setAiModel("llama-3-70b")}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    aiModel === "llama-3-70b"
                      ? "bg-indigo-50 border-indigo-600 text-indigo-900 shadow-sm"
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span>Llama 3 70B (On-Prem)</span>
                    <Badge variant="neutral" size="sm">Private Cloud</Badge>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">
                    Self-hosted LLM deployment for strict zero-data-egress compliance environments.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="font-bold text-slate-700 uppercase">Minimum RAG Citation Confidence Threshold</label>
              <select
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(e.target.value)}
                className="w-full max-w-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold"
              >
                <option value="0.75">75% Precision Match (Broader context)</option>
                <option value="0.85">85% Precision Match (Recommended)</option>
                <option value="0.92">92% High Precision Match (Strict grounding)</option>
              </select>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <Button variant="primary" size="md" type="submit" leftIcon={<Save className="w-4 h-4" />}>
                Save AI Model Preferences
              </Button>
            </div>
          </form>
        </GlassCard>
      )}

      {/* TAB 3: TEAM ROLES */}
      {activeTab === "team" && (
        <GlassCard className="p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Workspace Team Members</h3>
              <p className="text-xs text-slate-500">Role-based access control permissions for workspace users.</p>
            </div>

            <Button variant="outline" size="sm" className="bg-white text-xs font-semibold" leftIcon={<Users className="w-3.5 h-3.5 text-indigo-600" />}>
              Invite Team Member
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <th className="py-3 px-4">User Name</th>
                  <th className="py-3 px-4">Email Address</th>
                  <th className="py-3 px-4">Role Permission</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {teamMembers.map((m, idx) => (
                  <tr key={idx}>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{m.name}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono">{m.email}</td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={m.role === "ADMIN" ? "secondary" : m.role === "ANALYST" ? "primary" : "success"}
                        size="sm"
                      >
                        {m.role}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-emerald-600 font-bold">{m.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* TAB 4: API KEYS */}
      {activeTab === "api" && (
        <GlassCard className="p-6 space-y-6">
          <div className="space-y-1 border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900">API Keys & Ingestion Webhooks</h3>
            <p className="text-xs text-slate-500">Connect Zendesk, Salesforce, App Store API, and custom feedback streams.</p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Live Production Ingestion API Key</span>
                <Badge variant="success" size="sm">Active</Badge>
              </div>
              <div className="p-2.5 bg-white border border-slate-200 rounded-lg font-mono text-slate-700 flex items-center justify-between">
                <span>loop_live_pk_99482710495827361928374</span>
                <span className="text-indigo-600 font-bold hover:underline cursor-pointer">Copy Key</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="font-bold text-slate-900">Zendesk / Support Ticket Webhook URL</div>
              <div className="p-2.5 bg-white border border-slate-200 rounded-lg font-mono text-slate-700 flex items-center justify-between">
                <span>https://projectloop.ai/api/v1/ingest/zendesk</span>
                <span className="text-indigo-600 font-bold hover:underline cursor-pointer">Copy URL</span>
              </div>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
