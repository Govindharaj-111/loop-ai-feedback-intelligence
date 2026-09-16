import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/security";

export async function GET() {
  try {
    const session = await requireAuth();
    const workspaceId = session.workspaceId;

    // 1. Total Feedback
    const totalFeedback = await prisma.feedback.count({
      where: { workspaceId },
    });

    // 2. Negative Feedback %
    const negativeCount = await prisma.feedback.count({
      where: { workspaceId, sentiment: "Negative" },
    });
    const negativePercent = totalFeedback > 0 ? Math.round((negativeCount / totalFeedback) * 100) : 0;

    // 3. New Feedback This Week (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const newFeedbackThisWeek = await prisma.feedback.count({
      where: {
        workspaceId,
        createdAt: { gte: sevenDaysAgo },
      },
    });

    // 4. Channel Breakdown / Top Theme calculation
    const channelCounts = await prisma.feedback.groupBy({
      by: ["channel"],
      where: { workspaceId },
      _count: { channel: true },
      orderBy: { _count: { channel: "desc" } },
    });

    const topThemeName = channelCounts.length > 0 ? channelCounts[0].channel : "N/A";

    // 5. Volume Over Time (Last 14 days)
    const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    const rawFeedbacks = await prisma.feedback.findMany({
      where: {
        workspaceId,
        createdAt: { gte: fourteenDaysAgo },
      },
      select: { createdAt: true, sentiment: true },
      orderBy: { createdAt: "asc" },
    });

    // Group by date YYYY-MM-DD
    const dateMap: Record<string, { date: string; count: number; positive: number; negative: number; neutral: number }> = {};

    for (let i = 13; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dateStr = d.toISOString().split("T")[0];
      dateMap[dateStr] = { date: dateStr.slice(5), count: 0, positive: 0, negative: 0, neutral: 0 };
    }

    rawFeedbacks.forEach((fb) => {
      const dateStr = fb.createdAt.toISOString().split("T")[0];
      if (dateMap[dateStr]) {
        dateMap[dateStr].count += 1;
        if (fb.sentiment === "Positive") dateMap[dateStr].positive += 1;
        else if (fb.sentiment === "Negative") dateMap[dateStr].negative += 1;
        else dateMap[dateStr].neutral += 1;
      }
    });

    const volumeOverTime = Object.values(dateMap);

    // 6. Sentiment Breakdown
    const positiveCount = await prisma.feedback.count({ where: { workspaceId, sentiment: "Positive" } });
    const neutralCount = await prisma.feedback.count({ where: { workspaceId, sentiment: "Neutral" } });

    const sentimentBreakdown = [
      { name: "Positive", value: positiveCount, fill: "#10b981" },
      { name: "Neutral", value: neutralCount, fill: "#64748b" },
      { name: "Negative", value: negativeCount, fill: "#ef4444" },
    ];

    // 7. Top Channels / Themes
    const topThemes = channelCounts.map((item) => ({
      theme: item.channel,
      count: item._count.channel,
    }));

    return NextResponse.json({
      metrics: {
        totalFeedback,
        negativePercent,
        newFeedbackThisWeek,
        topTheme: topThemeName,
      },
      charts: {
        volumeOverTime,
        sentimentBreakdown,
        topThemes,
      },
    });
  } catch (error: any) {
    if (error.statusCode) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error("Analytics fetch error:", error);
    return NextResponse.json({ error: "Failed to load analytics metrics" }, { status: 500 });
  }
}
