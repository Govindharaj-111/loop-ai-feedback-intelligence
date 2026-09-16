import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole } from "@/lib/security";

export async function GET(request: Request) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || undefined;
    const sentiment = searchParams.get("sentiment") || undefined;
    const status = searchParams.get("status") || undefined;
    const channel = searchParams.get("channel") || undefined;
    const dateFrom = searchParams.get("dateFrom") || undefined;
    const dateTo = searchParams.get("dateTo") || undefined;

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    // MANDATORY workspaceId isolation filter
    const whereClause: any = {
      workspaceId: session.workspaceId,
    };

    if (search) {
      whereClause.OR = [
        { content: { contains: search } },
        { customerLabel: { contains: search } },
        { sourceRef: { contains: search } },
      ];
    }

    if (sentiment) {
      whereClause.sentiment = sentiment;
    }

    if (status) {
      whereClause.status = status;
    }

    if (channel) {
      whereClause.channel = channel;
    }

    if (dateFrom || dateTo) {
      whereClause.createdAt = {};
      if (dateFrom) whereClause.createdAt.gte = new Date(dateFrom);
      if (dateTo) whereClause.createdAt.lte = new Date(dateTo);
    }

    const [total, feedbacks] = await Promise.all([
      prisma.feedback.count({ where: whereClause }),
      prisma.feedback.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          themes: {
            include: { theme: true },
          },
        },
      }),
    ]);

    return NextResponse.json({
      feedbacks,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error: any) {
    if (error.statusCode) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error("Fetch feedback error:", error);
    return NextResponse.json({ error: "Failed to fetch feedback" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireRole(["ADMIN", "ANALYST"]);
    const body = await request.json();

    const { content, channel, sourceRef, customerLabel, sentiment, sentimentScore, status, createdAt } = body;

    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json({ error: "Content is required for feedback" }, { status: 400 });
    }

    const feedback = await prisma.feedback.create({
      data: {
        content: content.trim(),
        channel: channel || "MANUAL",
        sourceRef: sourceRef || null,
        customerLabel: customerLabel || null,
        sentiment: sentiment || "Neutral",
        sentimentScore: typeof sentimentScore === "number" ? sentimentScore : null,
        status: status || "NEW",
        createdAt: createdAt ? new Date(createdAt) : new Date(),
        workspaceId: session.workspaceId, // MANDATORY tenant isolation
      },
    });

    return NextResponse.json({ feedback }, { status: 201 });
  } catch (error: any) {
    if (error.statusCode) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error("Create feedback error:", error);
    return NextResponse.json({ error: "Failed to create feedback" }, { status: 500 });
  }
}
