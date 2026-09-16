import AskLoopChat from "@/components/AskLoopChat";
import { Sparkles } from "lucide-react";

export default function AskLoopPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="border-b border-slate-200/80 pb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          Ask LOOP <Sparkles className="w-6 h-6 text-indigo-600" />
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Grounded semantic vector search & Q&A assistant. Ask questions and get evidence-backed answers cited directly from customer feedback.
        </p>
      </div>

      <AskLoopChat />
    </div>
  );
}
