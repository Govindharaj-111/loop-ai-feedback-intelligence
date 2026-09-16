"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Printer,
  ArrowLeft,
  Calendar,
  User,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function ReportDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchReportDetail() {
      setLoading(true);
      try {
        const res = await fetch(`/api/reports/${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load report");
        }

        setReport(data.report);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchReportDetail();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-slate-400 bg-white border border-slate-200 rounded-2xl">
        Loading executive VoC report details...
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="p-8 max-w-xl mx-auto my-12 bg-rose-50 border border-rose-200 rounded-2xl space-y-4 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Report Access Error</h2>
        <p className="text-sm text-rose-700">{error || "Report not found"}</p>
        <Link href="/dashboard/reports" className="inline-block text-xs text-indigo-600 font-semibold hover:underline pt-2">
          ← Back to Reports List
        </Link>
      </div>
    );
  }

  let parsedContent: any = {};
  try {
    parsedContent = JSON.parse(report.contentJson);
  } catch {
    parsedContent = {};
  }

  const stats = parsedContent.stats || {};
  const voc = parsedContent.content || {};

  return (
    <div className="max-w-5xl mx-auto space-y-8 print:p-0 print:m-0 print:max-w-none">
      {/* Top Action Bar (Hidden on print) */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-6 print:hidden">
        <Link
          href="/dashboard/reports"
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Reports</span>
        </Link>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-600/20 transition-all"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Export PDF</span>
        </button>
      </div>

      {/* Printable Report Canvas */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 lg:p-12 space-y-8 shadow-md print:bg-white print:text-black print:border-none print:shadow-none print:p-0">
        {/* Report Header */}
        <div className="border-b border-slate-200 pb-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Project LOOP — Voice-of-Customer Executive Report
            </span>
            <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Multi-Tenant Verified Snapshot
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">{report.title}</h1>

          <div className="flex flex-wrap gap-4 text-xs text-slate-500 pt-1">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>
                Period: <strong>{new Date(report.periodStart).toLocaleDateString()}</strong> to <strong>{new Date(report.periodEnd).toLocaleDateString()}</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-indigo-600" />
              <span>Author: <strong>{report.generator?.name || "System Admin"}</strong> ({report.generator?.email})</span>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="bg-indigo-50/60 border border-indigo-100 p-6 rounded-2xl space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>Executive Summary</span>
          </div>
          <p className="text-sm text-slate-800 leading-relaxed font-medium">
            {voc.executiveSummary || "Summary not available."}
          </p>
        </div>

        {/* Verified Database Metrics */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Verified Database Metrics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <div className="text-[10px] text-slate-500 font-semibold uppercase">Total Feedback</div>
              <div className="text-2xl font-extrabold text-slate-900">{stats.totalFeedback || 0}</div>
            </div>

            <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-1">
              <div className="text-[10px] text-emerald-700 font-bold uppercase">Positive %</div>
              <div className="text-2xl font-extrabold text-emerald-700">{stats.positivePercent || 0}%</div>
            </div>

            <div className="p-4 bg-rose-50/60 border border-rose-200 rounded-xl space-y-1">
              <div className="text-[10px] text-rose-700 font-bold uppercase">Negative %</div>
              <div className="text-2xl font-extrabold text-rose-700">{stats.negativePercent || 0}%</div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <div className="text-[10px] text-slate-500 font-semibold uppercase">Neutral %</div>
              <div className="text-2xl font-extrabold text-slate-800">{stats.neutralPercent || 0}%</div>
            </div>
          </div>
        </div>

        {/* Top Customer Themes */}
        {voc.topCustomerThemes && voc.topCustomerThemes.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Top Customer Themes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {voc.topCustomerThemes.map((theme: any, idx: number) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-900 text-sm">
                    <span>{theme.name}</span>
                    <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-mono">
                      {theme.count} records
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{theme.summary}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Important Trends & Pain Points */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <span>Important Trends</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-700">
              {(voc.importantTrends || []).map((trend: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span>{trend}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-rose-600" />
              <span>Key Customer Pain Points</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-700">
              {(voc.keyPainPoints || []).map((pain: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">•</span>
                  <span>{pain}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Representative Customer Feedback Evidence */}
        {voc.representativeFeedback && voc.representativeFeedback.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              <span>Representative Customer Evidence</span>
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {voc.representativeFeedback.map((fb: any, idx: number) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <p className="text-xs italic text-slate-800">"{fb.quote}"</p>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500 pt-1">
                    <span>Channel: {fb.channel}</span>
                    <span>•</span>
                    <span>Customer: {fb.customer}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommended Actions */}
        {voc.recommendedActions && voc.recommendedActions.length > 0 && (
          <div className="p-6 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-3">
            <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Recommended Strategic Actions</span>
            </h3>
            <div className="space-y-2">
              {voc.recommendedActions.map((action: string, idx: number) => (
                <div key={idx} className="flex items-start gap-3 text-xs text-slate-800 font-medium">
                  <span className="font-bold text-emerald-700">{idx + 1}.</span>
                  <span>{action}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Report Footer */}
        <div className="pt-6 border-t border-slate-200 text-center text-[10px] text-slate-500">
          Generated automatically by Project LOOP Customer Intelligence Platform on {new Date(report.createdAt).toLocaleString()}. All records verified and strictly isolated.
        </div>
      </div>
    </div>
  );
}
