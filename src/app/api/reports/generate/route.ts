import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/security";
import { calculateVerifiedStats, generateVocReportContent } from "@/lib/reportService";

export async function POST(request: Request) {
  try {
    const session = await requireRole(["ADMIN", "ANALYST"]);
    const body = await request.json();

    const { title, periodStart, periodEnd } = body;

    if (!periodStart || !periodEnd) {
      return NextResponse.json(
        { error: "Start date and end date are required for report generation" },
        { status: 400 }
      );
    }

    const startDate = new Date(periodStart);
    const endDate = new Date(periodEnd);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json({ error: "Invalid date format specified" }, { status: 400 });
    }

    // 1. Calculate verified database statistics server-side
    const stats = await calculateVerifiedStats(session.workspaceId, startDate, endDate);

    // 2. Synthesize VoC report content
    const vocContent = await generateVocReportContent(stats);

    const reportTitle = title?.trim() || `Voice-of-Customer Report (${startDate.toISOString().split("T")[0]} to ${endDate.toISOString().split("T")[0]})`;

    // 3. Store report in database
    const report = await prisma.report.create({
      data: {
        title: reportTitle,
        periodStart: startDate,
        periodEnd: endDate,
        contentJson: JSON.stringify({ stats, content: vocContent }),
        workspaceId: session.workspaceId, // Enforced tenant scope
        generatedBy: session.id,
      },
    });

    return NextResponse.json({ report }, { status: 201 });
  } catch (error: any) {
    if (error.statusCode) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error("Report generation error:", error);
    return NextResponse.json({ error: "Failed to generate VoC report" }, { status: 500 });
  }
}
