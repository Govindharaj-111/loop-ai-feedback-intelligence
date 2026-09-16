import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole } from "@/lib/security";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    const feedback = await prisma.feedback.findUnique({
      where: { id },
      include: {
        themes: {
          include: { theme: true },
        },
      },
    });

    if (!feedback) {
      return NextResponse.json({ error: "Feedback item not found" }, { status: 404 });
    }

    // MANDATORY Multi-Tenancy Check: Prevent cross-tenant data leaks
    if (feedback.workspaceId !== session.workspaceId) {
      return NextResponse.json(
        { error: "Forbidden: Cross-workspace access attempt blocked" },
        { status: 403 }
      );
    }

    return NextResponse.json({ feedback });
  } catch (error: any) {
    if (error.statusCode) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Failed to fetch feedback" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireRole(["ADMIN", "ANALYST"]);
    const { id } = await params;

    const existingFeedback = await prisma.feedback.findUnique({
      where: { id },
    });

    if (!existingFeedback) {
      return NextResponse.json({ error: "Feedback item not found" }, { status: 404 });
    }

    // MANDATORY Multi-Tenancy Check
    if (existingFeedback.workspaceId !== session.workspaceId) {
      return NextResponse.json(
        { error: "Forbidden: Cross-workspace access attempt blocked" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { content, channel, sourceRef, customerLabel, sentiment, sentimentScore, status } = body;

    const updatedFeedback = await prisma.feedback.update({
      where: { id },
      data: {
        ...(content !== undefined && { content }),
        ...(channel !== undefined && { channel }),
        ...(sourceRef !== undefined && { sourceRef }),
        ...(customerLabel !== undefined && { customerLabel }),
        ...(sentiment !== undefined && { sentiment }),
        ...(sentimentScore !== undefined && { sentimentScore }),
        ...(status !== undefined && { status }),
      },
    });

    return NextResponse.json({ feedback: updatedFeedback });
  } catch (error: any) {
    if (error.statusCode) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Failed to update feedback" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireRole(["ADMIN", "ANALYST"]);
    const { id } = await params;

    const existingFeedback = await prisma.feedback.findUnique({
      where: { id },
    });

    if (!existingFeedback) {
      return NextResponse.json({ error: "Feedback item not found" }, { status: 404 });
    }

    // MANDATORY Multi-Tenancy Check
    if (existingFeedback.workspaceId !== session.workspaceId) {
      return NextResponse.json(
        { error: "Forbidden: Cross-workspace access attempt blocked" },
        { status: 403 }
      );
    }

    await prisma.feedback.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Feedback deleted successfully" });
  } catch (error: any) {
    if (error.statusCode) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Failed to delete feedback" }, { status: 500 });
  }
}
