import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/security";

export async function GET() {
  try {
    const session = await requireAuth();

    const reports = await prisma.report.findMany({
      where: { workspaceId: session.workspaceId },
      orderBy: { createdAt: "desc" },
      include: {
        generator: {
          select: { name: true, email: true },
        },
      },
    });

    return NextResponse.json({ reports });
  } catch (error: any) {
    if (error.statusCode) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
  }
}
