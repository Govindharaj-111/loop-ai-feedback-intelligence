import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/security";
import { hashPassword } from "@/lib/auth";

export async function GET() {
  try {
    // Only ADMIN can manage/list users
    const session = await requireRole(["ADMIN"]);

    const users = await prisma.user.findMany({
      where: { workspaceId: session.workspaceId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        workspaceId: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ users });
  } catch (error: any) {
    if (error.statusCode) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Failed to fetch workspace users" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireRole(["ADMIN"]);
    const body = await request.json();

    const { name, email, password, role } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Name, email, password, and role are required" },
        { status: 400 }
      );
    }

    if (!["ADMIN", "ANALYST", "VIEWER"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be ADMIN, ANALYST, or VIEWER" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        passwordHash,
        role,
        workspaceId: session.workspaceId, // Enforced to current admin's workspace
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        workspaceId: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (error: any) {
    if (error.statusCode) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
