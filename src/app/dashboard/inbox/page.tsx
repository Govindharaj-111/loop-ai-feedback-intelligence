"use client";

import { useState, useEffect } from "react";
import FeedbackModal from "@/components/FeedbackModal";
import CsvImportModal from "@/components/CsvImportModal";
import SimulatedIngestionModal from "@/components/SimulatedIngestionModal";
import {
  Search,
  Plus,
  Upload,
  Zap,
  Filter,
  Trash2,
  Edit,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  Tag,
  Calendar,
  User,
  MessageSquare,
} from "lucide-react";
import { SessionUser } from "@/types";

export default function FeedbackInboxPage() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [sentiment, setSentiment] = useState("");
  const [status, setStatus] = useState("");
  const [channel, setChannel] = useState("");

  // Modals & Drawers
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [isSimulatedModalOpen, setIsSimulatedModalOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null);
  const [detailDrawerItem, setDetailDrawerItem] = useState<any>(null);

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

  const fetchFeedbacks = async (page = 1) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(search && { search }),
        ...(sentiment && { sentiment }),
        ...(status && { status }),
        ...(channel && { channel }),
      });

      const res = await fetch(`/api/feedback?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setFeedbacks(data.feedbacks || []);
        setPagination(data.pagination || { page: 1, totalPages: 1, total: 0 });
      }
    } catch (err) {
      console.error("Failed to fetch feedback inbox:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFeedbacks(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, sentiment, status, channel]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this customer feedback record?")) return;

    try {
      const res = await fetch(`/api/feedback/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchFeedbacks(pagination.page);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete record");
      }
    } catch (err) {
      alert("Error deleting record");
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/feedback/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchFeedbacks(pagination.page);
        if (detailDrawerItem?.id === id) {
          setDetailDrawerItem({ ...detailDrawerItem, status: newStatus });
        }
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setSentiment("");
    setStatus("");
    setChannel("");
  };

  const canModify = user?.role === "ADMIN" || user?.role === "ANALYST";
  const activeFilterCount = (search ? 1 : 0) + (sentiment ? 1 : 0) + (status ? 1 : 0) + (channel ? 1 : 0);

  const sentimentBadgeStyles: Record<string, string> = {
    Positive: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Neutral: "bg-slate-100 text-slate-700 border-slate-200",
    Negative: "bg-rose-50 text-rose-700 border-rose-200",
  };

  const statusBadgeStyles: Record<string, string> = {
    NEW: "bg-sky-50 text-sky-700 border-sky-200",
    REVIEWED: "bg-amber-50 text-amber-700 border-amber-200",
    ACTIONED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  return (
    <div className="space-y-8">
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Feedback Inbox</h1>
          <p className="text-sm text-slate-500 mt-1">
            Review, classify, and triage customer feedback records for <span className="font-semibold text-indigo-600">{user?.workspaceName}</span>.
          </p>
        </div>

        {canModify && (
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setIsSimulatedModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all shadow-2xs"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Simulate Feed</span>
            </button>

            <button
              onClick={() => setIsCsvModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all shadow-2xs"
            >
              <Upload className="w-3.5 h-3.5 text-indigo-600" />
              <span>Import CSV</span>
            </button>

            <button
              onClick={() => {
                setSelectedFeedback(null);
                setIsFeedbackModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-600/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Feedback</span>
            </button>
          </div>
        )}
      </div>

      {/* Control Bar: Search & Filters */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl space-y-3 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Bar */}
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search feedback content..."
              className="w-full pl-10 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sentiment Filter */}
          <div className="md:col-span-2">
            <select
              value={sentiment}
              onChange={(e) => setSentiment(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            >
              <option value="">All Sentiments</option>
              <option value="Positive">Positive</option>
              <option value="Neutral">Neutral</option>
              <option value="Negative">Negative</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-2">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            >
              <option value="">All Triage Status</option>
              <option value="NEW">New</option>
              <option value="REVIEWED">Reviewed</option>
              <option value="ACTIONED">Actioned</option>
            </select>
          </div>

          {/* Channel Filter */}
          <div className="md:col-span-2">
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            >
              <option value="">All Channels</option>
              <option value="Support Ticket">Support Ticket</option>
              <option value="App Review">App Review</option>
              <option value="NPS Survey">NPS Survey</option>
              <option value="Sales Call">Sales Call</option>
              <option value="Community Post">Community Post</option>
              <option value="MANUAL">Manual Entry</option>
            </select>
          </div>

          {/* Active Filter Clear */}
          <div className="md:col-span-2 flex items-center justify-end">
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 px-2 py-1 bg-rose-50 rounded-lg"
              >
                <X className="w-3.5 h-3.5" />
                <span>Clear ({activeFilterCount})</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Data Table Container */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-slate-400">Loading customer feedback records...</div>
        ) : feedbacks.length === 0 ? (
          <div className="p-16 text-center text-slate-500 space-y-3">
            <MessageSquare className="w-10 h-10 text-indigo-400 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">No Feedback Records Found</h3>
              <p className="text-xs text-slate-500">Try clearing active search filters or add a new customer feedback entry.</p>
            </div>
            {canModify && (
              <button
                onClick={() => setIsFeedbackModalOpen(true)}
                className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl"
              >
                Add Feedback Record
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4">Feedback Content</th>
                  <th className="py-3.5 px-4">Channel</th>
                  <th className="py-3.5 px-4">Sentiment</th>
                  <th className="py-3.5 px-4">Feature Area</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Created Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {feedbacks.map((fb) => (
                  <tr key={fb.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-4 max-w-xs">
                      <div className="font-medium text-slate-900 line-clamp-2">{fb.content}</div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">{fb.customerLabel || "Anonymous Customer"}</div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-medium rounded-lg">
                        {fb.channel}
                      </span>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border ${sentimentBadgeStyles[fb.sentiment] || "bg-slate-100 text-slate-700 border-slate-200"}`}>
                        {fb.sentiment || "Neutral"}
                      </span>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap text-slate-600 font-medium">
                      {fb.featureArea || "General"}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <select
                        value={fb.status || "NEW"}
                        disabled={!canModify}
                        onChange={(e) => handleStatusChange(fb.id, e.target.value)}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border focus:outline-none cursor-pointer ${statusBadgeStyles[fb.status] || "bg-slate-100 text-slate-700"}`}
                      >
                        <option value="NEW">NEW</option>
                        <option value="REVIEWED">REVIEWED</option>
                        <option value="ACTIONED">ACTIONED</option>
                      </select>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                      {new Date(fb.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap text-right space-x-1">
                      <button
                        onClick={() => setDetailDrawerItem(fb)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {canModify && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedFeedback(fb);
                              setIsFeedbackModalOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Edit Record"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDelete(fb.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Server Pagination Bar */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-600">
            <div>
              Showing page <strong>{pagination.page}</strong> of <strong>{pagination.totalPages}</strong> ({pagination.total} records total)
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => fetchFeedbacks(pagination.page - 1)}
                className="p-2 bg-white border border-slate-200 rounded-lg disabled:opacity-50 hover:bg-slate-100"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => fetchFeedbacks(pagination.page + 1)}
                className="p-2 bg-white border border-slate-200 rounded-lg disabled:opacity-50 hover:bg-slate-100"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Slide-over Detail Drawer */}
      {detailDrawerItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md h-full bg-white border-l border-slate-200 shadow-2xl p-6 flex flex-col justify-between space-y-6 overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Feedback Details</span>
                <button onClick={() => setDetailDrawerItem(null)} className="text-slate-400 hover:text-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="text-xs font-semibold text-slate-500 uppercase">Verbatim Content</div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 leading-relaxed">
                  "{detailDrawerItem.content}"
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="text-slate-400 font-semibold uppercase">Channel</div>
                  <div className="font-bold text-slate-900">{detailDrawerItem.channel}</div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="text-slate-400 font-semibold uppercase">Sentiment</div>
                  <div className="font-bold text-slate-900">{detailDrawerItem.sentiment || "Neutral"}</div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="text-slate-400 font-semibold uppercase">Feature Area</div>
                  <div className="font-bold text-slate-900">{detailDrawerItem.featureArea || "General"}</div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="text-slate-400 font-semibold uppercase">Customer</div>
                  <div className="font-bold text-slate-900 truncate">{detailDrawerItem.customerLabel || "Anonymous"}</div>
                </div>
              </div>

              {detailDrawerItem.rationale && (
                <div className="space-y-2 text-xs">
                  <div className="font-bold text-slate-700 uppercase">AI Classification Rationale</div>
                  <p className="text-slate-600 bg-indigo-50/60 p-3 rounded-xl border border-indigo-100">
                    {detailDrawerItem.rationale}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setDetailDrawerItem(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        onSuccess={() => fetchFeedbacks(pagination.page)}
        initialData={selectedFeedback}
      />

      <CsvImportModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        onSuccess={() => fetchFeedbacks(1)}
      />

      <SimulatedIngestionModal
        isOpen={isSimulatedModalOpen}
        onClose={() => setIsSimulatedModalOpen(false)}
        onSuccess={() => fetchFeedbacks(1)}
      />
    </div>
  );
}
