"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ReportGenerateModal from "@/components/ReportGenerateModal";
import { FileText, Plus, Calendar, User, Eye, Trash2, RefreshCw } from "lucide-react";
import { SessionUser } from "@/types";

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/reports");
      if (res.ok) {
        const data = await res.json();
        setReports(data.reports || []);
      }
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
    fetchReports();
  }, []);

  const handleDeleteReport = async (id: string) => {
    if (!confirm("Are you sure you want to delete this executive report?")) return;

    try {
      const res = await fetch(`/api/reports/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchReports();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete report");
      }
    } catch (err) {
      alert("Error deleting report");
    }
  };

  const canModify = user?.role === "ADMIN" || user?.role === "ANALYST";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            Voice-of-Customer Reports <FileText className="w-6 h-6 text-indigo-600" />
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Synthesized executive VoC reports, sentiment summaries, and strategic action plans for <span className="font-semibold text-indigo-600">{user?.workspaceName}</span>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchReports}
            aria-label="Refresh Reports"
            className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-xl transition-all shadow-2xs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          {canModify && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl shadow-md shadow-indigo-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Generate VoC Report</span>
            </button>
          )}
        </div>
      </div>

      {/* Report Cards / List */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 bg-white border border-slate-200 rounded-2xl">
          Loading workspace executive reports...
        </div>
      ) : reports.length === 0 ? (
        <div className="p-16 text-center text-slate-500 bg-white border border-slate-200 rounded-2xl space-y-3">
          <FileText className="w-10 h-10 text-indigo-400 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">No VoC Reports Generated Yet</h3>
            <p className="text-xs text-slate-500">Click "Generate VoC Report" to synthesize your first executive summary report.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-xs hover:shadow-md transition-all"
            >
              <div className="space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                  VoC Executive Snapshot
                </div>
                <h3 className="text-base font-bold text-slate-900 line-clamp-2">{report.title}</h3>

                <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {new Date(report.periodStart).toLocaleDateString()} – {new Date(report.periodEnd).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Author: {report.generator?.name || "System Admin"}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <Link
                  href={`/dashboard/reports/${report.id}`}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Full Report</span>
                </Link>

                {canModify && (
                  <button
                    onClick={() => handleDeleteReport(report.id)}
                    aria-label="Delete Report"
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <ReportGenerateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchReports()}
      />
    </div>
  );
}
