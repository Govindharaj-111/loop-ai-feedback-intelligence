import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/security";
import { classifyFeedbackText } from "@/lib/aiService";
import { ensureFeedbackEmbedding } from "@/lib/vectorRagService";

export async function POST(request: Request) {
  try {
    const session = await requireRole(["ADMIN", "ANALYST"]);
    const body = await request.json();
    const { feedbackId } = body;

    if (feedbackId) {
      // 1. Classify single item
      const feedback = await prisma.feedback.findUnique({
        where: { id: feedbackId },
      });

      if (!feedback || feedback.workspaceId !== session.workspaceId) {
        return NextResponse.json({ error: "Feedback item not found" }, { status: 404 });
      }

      const classification = await classifyFeedbackText(feedback.content);

      const updated = await prisma.feedback.update({
        where: { id: feedbackId },
        data: {
          sentiment: classification.sentiment,
          sentimentScore: classification.sentimentScore,
          featureArea: classification.featureArea,
          rationale: classification.rationale,
        },
      });

      // Generate & store vector embedding
      await ensureFeedbackEmbedding(feedback.id, feedback.content);

      return NextResponse.json({ feedback: updated, classification });
    } else {
      // 2. Batch classify unclassified items in workspace
      const unclassified = await prisma.feedback.findMany({
        where: { workspaceId: session.workspaceId },
      });

      let count = 0;
      for (const fb of unclassified) {
        const classification = await classifyFeedbackText(fb.content);
        await prisma.feedback.update({
          where: { id: fb.id },
          data: {
            sentiment: classification.sentiment,
            sentimentScore: classification.sentimentScore,
            featureArea: classification.featureArea,
            rationale: classification.rationale,
          },
        });
        await ensureFeedbackEmbedding(fb.id, fb.content);
        count++;
      }

      return NextResponse.json({ message: `Successfully classified ${count} feedback items`, count });
    }
  } catch (error: any) {
    if (error.statusCode) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error("Classification error:", error);
    return NextResponse.json({ error: "Failed to classify feedback" }, { status: 500 });
  }
}
