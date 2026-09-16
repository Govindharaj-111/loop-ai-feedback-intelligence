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

    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        generator: {
          select: { name: true, email: true },
        },
      },
    });

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    // MANDATORY Multi-Tenant Access Control
    if (report.workspaceId !== session.workspaceId) {
      return NextResponse.json(
        { error: "Forbidden: Cross-workspace access attempt blocked" },
        { status: 403 }
      );
    }

    return NextResponse.json({ report });
  } catch (error: any) {
    if (error.statusCode) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Failed to fetch report" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireRole(["ADMIN", "ANALYST"]);
    const { id } = await params;

    const report = await prisma.report.findUnique({
      where: { id },
    });

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    // MANDATORY Multi-Tenant Access Control
    if (report.workspaceId !== session.workspaceId) {
      return NextResponse.json(
        { error: "Forbidden: Cross-workspace access attempt blocked" },
        { status: 403 }
      );
    }

    await prisma.report.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Report deleted successfully" });
  } catch (error: any) {
    if (error.statusCode) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Failed to delete report" }, { status: 500 });
  }
}
