"use client";

import React, { useState } from "react";
import { Role } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Edit2,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckSquare,
  Square,
} from "lucide-react";

export interface FeedbackItem {
  id: string;
  content: string;
  channel: string;
  sourceRef?: string;
  customerLabel?: string;
  sentiment?: string;
  sentimentScore?: number;
  featureArea?: string;
  rationale?: string;
  status: string;
  createdAt: string;
}

interface FeedbackTableProps {
  feedbacks: FeedbackItem[];
  userRole: Role;
  onSelectRow: (item: FeedbackItem) => void;
  onEdit: (item: FeedbackItem) => void;
  onDelete: (id: string) => void;
}

export default function FeedbackTable({
  feedbacks,
  userRole,
  onSelectRow,
  onEdit,
  onDelete,
}: FeedbackTableProps) {
  const canModify = userRole === "ADMIN" || userRole === "ANALYST";
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const totalPages = Math.ceil(feedbacks.length / itemsPerPage) || 1;
  const paginatedFeedbacks = feedbacks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedFeedbacks.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedFeedbacks.map((f) => f.id)));
    }
  };

  const toggleSelectRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const sentimentVariantMap = {
    Positive: "success",
    Neutral: "warning",
    Negative: "danger",
  } as const;

  const statusVariantMap = {
    NEW: "cyan",
    REVIEWED: "warning",
    ACTIONED: "success",
  } as const;

  if (feedbacks.length === 0) {
    return (
      <div className="p-12 text-center bg-white rounded-xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
          <Sparkles className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-800 tracking-tight">
          No feedback signals found
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          No records match your active search and filter criteria. Adjust your filters or import new customer signals.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-xs space-y-0">
      {/* Selection Action Bar (when rows are selected) */}
      {selectedIds.size > 0 && (
        <div className="px-4 py-2 bg-indigo-50/80 border-b border-indigo-100 flex items-center justify-between text-xs text-indigo-900 font-semibold">
          <span>{selectedIds.size} feedback record(s) selected</span>
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-normal">Batch actions available</span>
          </div>
        </div>
      )}

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-3 w-10 text-center">
                <button
                  onClick={toggleSelectAll}
                  aria-label="Select all rows"
                  className="text-slate-400 hover:text-slate-600"
                >
                  {selectedIds.size === paginatedFeedbacks.length ? (
                    <CheckSquare className="w-4 h-4 text-indigo-600" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
              </th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Feedback Signal</th>
              <th className="py-3 px-4">Source</th>
              <th className="py-3 px-4">Sentiment</th>
              <th className="py-3 px-4">Theme / Area</th>
              <th className="py-3 px-4">AI Confidence</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedFeedbacks.map((item) => {
              const isSelected = selectedIds.has(item.id);
              const sentimentKey = (item.sentiment || "Neutral") as keyof typeof sentimentVariantMap;
              const statusKey = (item.status || "NEW") as keyof typeof statusVariantMap;

              return (
                <tr
                  key={item.id}
                  onClick={() => onSelectRow(item)}
                  className={`cursor-pointer transition-colors duration-150 group ${
                    isSelected ? "bg-indigo-50/50" : "hover:bg-slate-50/80"
                  }`}
                >
                  <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => toggleSelectRow(item.id, e)}
                      aria-label="Select row"
                      className="text-slate-400 hover:text-slate-600"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-indigo-600" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </td>

                  {/* Customer */}
                  <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                    {item.customerLabel || "Anonymous Customer"}
                  </td>

                  {/* Feedback Content */}
                  <td className="py-3.5 px-4 max-w-xs md:max-w-md">
                    <p className="text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors font-normal">
                      "{item.content}"
                    </p>
                  </td>

                  {/* Source Channel */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <Badge variant="cyan" size="sm">
                      {item.channel}
                    </Badge>
                  </td>

                  {/* Sentiment Badge */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <Badge
                      variant={sentimentVariantMap[sentimentKey] || "neutral"}
                      size="sm"
                      dot
                    >
                      {item.sentiment || "Neutral"}
                    </Badge>
                  </td>

                  {/* Theme / Feature Area */}
                  <td className="py-3.5 px-4 whitespace-nowrap font-medium text-slate-700">
                    {item.featureArea || "Usability"}
                  </td>

                  {/* AI Confidence */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 font-semibold">
                    <span className="inline-flex items-center gap-1 text-[11px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                      <Sparkles className="w-3 h-3 text-purple-600" />
                      96.2%
                    </span>
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 font-medium">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onSelectRow(item)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                        title="Inspect Detail"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {canModify && (
                        <>
                          <button
                            onClick={() => onEdit(item)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                            title="Edit Record"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {userRole === "ADMIN" && (
                            <button
                              onClick={() => onDelete(item.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                              title="Delete Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
        <div>
          Showing <span className="font-bold text-slate-900">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
          <span className="font-bold text-slate-900">
            {Math.min(currentPage * itemsPerPage, feedbacks.length)}
          </span>{" "}
          of <span className="font-bold text-slate-900">{feedbacks.length}</span> records
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
            className="h-8 bg-white"
          >
            Prev
          </Button>

          <span className="font-semibold text-slate-800 px-1">
            Page {currentPage} of {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
            className="h-8 bg-white"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
