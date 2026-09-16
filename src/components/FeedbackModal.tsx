"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export default function FeedbackModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: FeedbackModalProps) {
  const [content, setContent] = useState("");
  const [channel, setChannel] = useState("MANUAL");
  const [customerLabel, setCustomerLabel] = useState("");
  const [sourceRef, setSourceRef] = useState("");
  const [sentiment, setSentiment] = useState("Neutral");
  const [status, setStatus] = useState("NEW");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setContent(initialData.content || "");
      setChannel(initialData.channel || "MANUAL");
      setCustomerLabel(initialData.customerLabel || "");
      setSourceRef(initialData.sourceRef || "");
      setSentiment(initialData.sentiment || "Neutral");
      setStatus(initialData.status || "NEW");
    } else {
      setContent("");
      setChannel("MANUAL");
      setCustomerLabel("");
      setSourceRef("");
      setSentiment("Neutral");
      setStatus("NEW");
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const url = initialData ? `/api/feedback/${initialData.id}` : "/api/feedback";
      const method = initialData ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          channel,
          customerLabel: customerLabel || null,
          sourceRef: sourceRef || null,
          sentiment,
          status,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save feedback");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="glass-card-solid bg-white border border-slate-200/90 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <h3 className="text-lg font-bold text-slate-900">
            {initialData ? "Edit Feedback Entry" : "Create New Feedback Entry"}
          </h3>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="fb-content" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Feedback Content *
            </label>
            <textarea
              id="fb-content"
              required
              aria-required="true"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter verbatim customer feedback..."
              className="w-full px-3.5 py-2.5 glass-input text-slate-900 placeholder-slate-400 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="fb-channel" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Ingestion Channel
              </label>
              <select
                id="fb-channel"
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                className="w-full px-3 py-2 glass-input text-slate-900 text-xs"
              >
                <option value="MANUAL">Manual Entry</option>
                <option value="Support Ticket">Support Ticket</option>
                <option value="App Review">App Review</option>
                <option value="NPS Survey">NPS Survey</option>
                <option value="Sales Call">Sales Call</option>
                <option value="CSV">CSV Import</option>
                <option value="API">API Integration</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="fb-sentiment" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Sentiment
              </label>
              <select
                id="fb-sentiment"
                value={sentiment}
                onChange={(e) => setSentiment(e.target.value)}
                className="w-full px-3 py-2 glass-input text-slate-900 text-xs"
              >
                <option value="Positive">Positive</option>
                <option value="Neutral">Neutral</option>
                <option value="Negative">Negative</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="fb-customer" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Customer Identifier
              </label>
              <input
                id="fb-customer"
                type="text"
                value={customerLabel}
                onChange={(e) => setCustomerLabel(e.target.value)}
                placeholder="Enterprise Customer A"
                className="w-full px-3 py-2 glass-input text-slate-900 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="fb-status" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Status
              </label>
              <select
                id="fb-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 glass-input text-slate-900 text-xs"
              >
                <option value="NEW">New</option>
                <option value="REVIEWED">Reviewed</option>
                <option value="ACTIONED">Actioned</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 btn-secondary-glass text-xs font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 btn-primary text-xs font-semibold rounded-xl shadow-md shadow-indigo-600/20 disabled:opacity-50"
            >
              {loading ? "Saving..." : initialData ? "Update Feedback" : "Create Feedback"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
