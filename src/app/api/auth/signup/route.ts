import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { createToken, setSessionCookie } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, workspaceName } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required fields" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this email address already exists" },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);
    const resolvedWorkspaceName = workspaceName?.trim() || `${name}'s Workspace`;

    // Atomic creation of Workspace + User as ADMIN
    const result = await prisma.$transaction(async (tx) => {
      const workspace = await tx.workspace.create({
        data: {
          name: resolvedWorkspaceName,
        },
      });

      const user = await tx.user.create({
        data: {
          name,
          email: email.toLowerCase().trim(),
          passwordHash,
          role: "ADMIN", // Always set role = ADMIN on workspace creation
          workspaceId: workspace.id,
        },
      });

      return { workspace, user };
    });

    const tokenPayload = {
      sub: result.user.id,
      name: result.user.name,
      email: result.user.email,
      role: result.user.role as "ADMIN",
      workspaceId: result.workspace.id,
      workspaceName: result.workspace.name,
    };

    const token = await createToken(tokenPayload);
    await setSessionCookie(token);

    return NextResponse.json(
      {
        message: "Account and workspace created successfully",
        user: {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          role: result.user.role,
          workspaceId: result.workspace.id,
          workspaceName: result.workspace.name,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during signup" },
      { status: 500 }
    );
  }
}
