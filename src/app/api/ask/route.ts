import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/security";
import { askLoopRag } from "@/lib/vectorRagService";

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const { question } = body;

    if (!question || typeof question !== "string" || question.trim().length === 0) {
      return NextResponse.json({ error: "Question is required for RAG Q&A" }, { status: 400 });
    }

    // Grounded RAG search strictly scoped to authenticated workspaceId
    const ragResult = await askLoopRag(question.trim(), session.workspaceId);

    return NextResponse.json(ragResult);
  } catch (error: any) {
    if (error.statusCode) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error("Ask LOOP RAG error:", error);
    return NextResponse.json({ error: "Failed to process RAG question" }, { status: 500 });
  }
}
