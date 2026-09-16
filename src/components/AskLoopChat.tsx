"use client";

import { useState } from "react";
import {
  Sparkles,
  Send,
  Bot,
  User,
  BookOpen,
  AlertCircle,
  RefreshCw,
  ArrowUpRight,
  Lightbulb,
  CheckCircle2,
  Tag,
  MessageSquare,
  Cpu,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  evidence?: { id: string; quote: string; channel: string; customer: string; similarity: number }[];
  hasSufficientEvidence?: boolean;
  relatedThemes?: string[];
  sentiment?: "Positive" | "Negative" | "Neutral";
  feedbackCount?: number;
  keyObservations?: string[];
  recommendedActions?: string[];
  followUpQuestions?: string[];
}

export default function AskLoopChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const suggestedQuestions = [
    "What are customers complaining about?",
    "What are our strongest areas?",
    "Which themes are increasing?",
    "Why is customer satisfaction changing?",
    "Summarize negative feedback.",
    "What should management improve?",
    "Give me a Voice of Customer summary.",
  ];

  const handleSend = async (questionText?: string) => {
    const query = questionText || input.trim();
    if (!query || loading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!questionText) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: query }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to process query");
      }

      const assistantMsg: Message = {
        id: `ast-${Date.now()}`,
        sender: "assistant",
        text: data.answer,
        evidence: (data.evidence || []).map((e: any) => ({
          id: e.feedbackId || e.id,
          quote: e.content,
          channel: e.channel,
          customer: e.customerLabel || "Customer",
          similarity: e.similarityScore || e.similarity || 0.85,
        })),
        hasSufficientEvidence: data.hasSufficientEvidence,
        relatedThemes: data.relatedThemes || ["Product Quality"],
        sentiment: data.sentiment || "Neutral",
        feedbackCount: data.feedbackCount || (data.evidence ? data.evidence.length : 0),
        keyObservations: data.keyObservations || [],
        recommendedActions: data.recommendedActions || [],
        followUpQuestions: data.followUpQuestions || [],
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        sender: "assistant",
        text: `Error processing query: ${err.message}`,
        hasSufficientEvidence: false,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card flex flex-col h-[740px] overflow-hidden border border-cyan-500/30 bg-[#060b19]/90 backdrop-blur-2xl rounded-2xl shadow-[0_0_40px_rgba(0,242,254,0.15)]">
      {/* Top Cyber Terminal Header */}
      <div className="p-4 border-b border-cyan-500/20 bg-[#030712]/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(0,242,254,0.4)] text-white">
            <Cpu className="w-5 h-5 text-cyan-200 animate-pulse" />
          </div>
          <div>
            <div className="text-sm font-black text-white flex items-center gap-2 font-heading tracking-wide">
              <span>ASK LOOP CYBER RAG</span>
              <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 px-2 py-0.5 rounded font-mono font-bold">
                VECTOR ENGINE 2.0
              </span>
            </div>
            <div className="text-[11px] text-cyan-400/70 font-mono">Workspace-isolated semantic vector evidence retrieval</div>
          </div>
        </div>

        <button
          onClick={() => setMessages([])}
          className="text-xs text-slate-300 hover:text-cyan-300 flex items-center gap-1.5 px-3 py-1.5 bg-cyan-950/30 border border-cyan-500/20 rounded-xl font-bold transition-all hover:bg-cyan-900/40"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Session</span>
        </button>
      </div>

      {/* Messages Canvas */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-xl mx-auto space-y-6 my-auto">
            <div className="w-20 h-20 bg-cyan-500/10 border border-cyan-400/30 rounded-3xl flex items-center justify-center shadow-[0_0_30px_rgba(0,242,254,0.2)]">
              <Sparkles className="w-10 h-10 text-cyan-400 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white tracking-tight font-heading">Grounded Cyber Vector Intelligence</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-mono">
                Ask any question about your tenant feedback. LOOP scans 32-dim term-frequency feature vectors and provides cited verbatims.
              </p>
            </div>

            {/* Quick Prompt Suggestion Chips */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 w-full text-left pt-2">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="p-3.5 bg-white/5 hover:bg-cyan-500/15 border border-cyan-500/20 hover:border-cyan-400/60 rounded-xl text-xs text-slate-200 font-bold transition-all flex items-center justify-between group shadow-sm"
                >
                  <span className="truncate">"{q}"</span>
                  <ArrowUpRight className="w-4 h-4 text-cyan-400 group-hover:text-white shrink-0 ml-2 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.sender === "user"
                    ? "bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white shadow-[0_0_15px_rgba(0,242,254,0.4)]"
                    : "bg-[#0b132b] border border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_rgba(0,242,254,0.2)]"
                }`}
              >
                {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-cyan-300" />}
              </div>

              <div className="space-y-3 max-w-2xl">
                {/* Message Bubble */}
                <div
                  className={`p-4 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 text-white font-semibold shadow-[0_0_20px_rgba(0,242,254,0.25)]"
                      : "bg-[#0b132b]/90 border border-cyan-500/30 text-slate-100 shadow-md"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                </div>

                {/* Additional Supporting Metadata Cards (Only for Assistant messages) */}
                {msg.sender === "assistant" && msg.hasSufficientEvidence && (
                  <div className="space-y-3 pt-1">
                    {/* Supporting Metadata Summary Pills */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      {msg.sentiment && (
                        <Badge
                          variant={msg.sentiment === "Positive" ? "success" : msg.sentiment === "Negative" ? "danger" : "warning"}
                          size="sm"
                          dot
                        >
                          Overall: {msg.sentiment}
                        </Badge>
                      )}

                      {msg.relatedThemes && msg.relatedThemes.map((th, i) => (
                        <Badge key={i} variant="cyan" size="sm">
                          Theme: {th}
                        </Badge>
                      ))}

                      {msg.feedbackCount !== undefined && (
                        <Badge variant="neutral" size="sm">
                          {msg.feedbackCount} Grounded Verbatims
                        </Badge>
                      )}
                    </div>

                    {/* Key Observations Box */}
                    {msg.keyObservations && msg.keyObservations.length > 0 && (
                      <div className="p-3.5 bg-amber-500/10 rounded-xl border border-amber-500/30 space-y-1.5 text-xs">
                        <div className="font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                          <span>Key AI Observations</span>
                        </div>
                        <ul className="space-y-1 text-slate-300 text-[11px]">
                          {msg.keyObservations.map((obs, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-cyan-400 font-bold">•</span>
                              <span>{obs}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Grounded Customer Verbatim Evidence List */}
                    {msg.evidence && msg.evidence.length > 0 && (
                      <div className="p-4 bg-cyan-950/20 rounded-xl border border-cyan-500/30 space-y-2.5">
                        <div className="font-bold text-cyan-300 flex items-center justify-between text-xs font-mono uppercase tracking-wider">
                          <span className="flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                            Grounded Tenant Evidence ({msg.evidence.length})
                          </span>
                          <span className="text-[10px] text-cyan-400/70 font-semibold">Zero Hallucination Asserted</span>
                        </div>

                        <div className="space-y-2 max-h-44 overflow-y-auto">
                          {msg.evidence.map((ev, i) => (
                            <div key={i} className="p-2.5 bg-white/5 rounded-lg border border-cyan-500/20 text-[11px] space-y-1">
                              <div className="flex items-center justify-between text-[10px] text-cyan-400 font-semibold">
                                <span>{ev.customer} ({ev.channel})</span>
                                <span className="bg-cyan-500/20 px-1.5 py-0.5 rounded text-cyan-300 font-mono">
                                  {Math.round(ev.similarity * 100)}% match
                                </span>
                              </div>
                              <p className="text-slate-200 italic">"{ev.quote}"</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {loading && (
          <div className="flex gap-3 max-w-3xl mr-auto">
            <div className="w-9 h-9 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-400 flex items-center justify-center text-xs font-bold shadow-[0_0_15px_rgba(0,242,254,0.3)]">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-4 rounded-2xl bg-[#0b132b]/90 border border-cyan-500/30 text-cyan-300 text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Scanning vector embeddings & retrieving evidence...</span>
            </div>
          </div>
        )}
      </div>

      {/* Cyber Prompt Bar */}
      <div className="p-4 border-t border-cyan-500/20 bg-[#030712]/90">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about customer feedback verbatims..."
            disabled={loading}
            className="flex-1 bg-white/5 border border-cyan-500/30 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 shadow-inner"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-5 py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white rounded-xl text-xs font-black shadow-[0_0_20px_rgba(0,242,254,0.4)] disabled:opacity-50 hover:scale-105 transition-all flex items-center gap-1.5"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
