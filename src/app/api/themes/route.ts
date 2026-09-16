import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole } from "@/lib/security";

export async function GET() {
  try {
    const session = await requireAuth();

    const themes = await prisma.theme.findMany({
      where: { workspaceId: session.workspaceId },
      include: {
        feedbacks: {
          include: { feedback: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ themes });
  } catch (error: any) {
    if (error.statusCode) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Failed to fetch themes" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireRole(["ADMIN", "ANALYST"]);
    const body = await request.json();
    const { name, description } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Theme name is required" }, { status: 400 });
    }

    const theme = await prisma.theme.create({
      data: {
        name: name.trim(),
        description: description || null,
        workspaceId: session.workspaceId, // MANDATORY isolation
      },
    });

    return NextResponse.json({ theme }, { status: 201 });
  } catch (error: any) {
    if (error.statusCode) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Failed to create theme" }, { status: 500 });
  }
}
