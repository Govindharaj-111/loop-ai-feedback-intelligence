import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { hashPassword, comparePassword } from "../lib/auth.js";
import { createToken, setSessionCookie, clearSessionCookie } from "../lib/session.js";
import { getCurrentUser } from "../lib/security.js";
import { Role } from "../types/index.js";

const router = Router();

// POST /api/auth/signup
router.post("/signup", async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, workspaceName } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: "Name, email, and password are required fields" });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      res.status(400).json({ error: "A user with this email address already exists" });
      return;
    }

    const passwordHash = await hashPassword(password);
    const resolvedWorkspaceName = workspaceName?.trim() || `${name}'s Workspace`;

    const result = await prisma.$transaction(async (tx: any) => {
      const workspace = await tx.workspace.create({
        data: { name: resolvedWorkspaceName },
      });

      const user = await tx.user.create({
        data: {
          name,
          email: email.toLowerCase().trim(),
          passwordHash,
          role: "ADMIN",
          workspaceId: workspace.id,
        },
      });

      return { workspace, user };
    });

    const tokenPayload = {
      sub: result.user.id,
      name: result.user.name,
      email: result.user.email,
      role: result.user.role as Role,
      workspaceId: result.workspace.id,
      workspaceName: result.workspace.name,
    };

    const token = await createToken(tokenPayload);
    setSessionCookie(res, token);

    res.status(201).json({
      message: "Account and workspace created successfully",
      token,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
        workspaceId: result.workspace.id,
        workspaceName: result.workspace.name,
      },
    });
  } catch (error: any) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "An unexpected error occurred during signup" });
  }
});

// POST /api/auth/login
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: { workspace: true },
    });

    if (!user) {
      res.status(401).json({ error: "Invalid email or password credentials" });
      return;
    }

    const isValidPassword = await comparePassword(password, user.passwordHash);
    if (!isValidPassword) {
      res.status(401).json({ error: "Invalid email or password credentials" });
      return;
    }

    const tokenPayload = {
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role as Role,
      workspaceId: user.workspaceId,
      workspaceName: user.workspace.name,
    };

    const token = await createToken(tokenPayload);
    setSessionCookie(res, token);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        workspaceId: user.workspaceId,
        workspaceName: user.workspace.name,
      },
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({ error: "An unexpected error occurred during login" });
  }
});

// POST /api/auth/logout
router.post("/logout", (req: Request, res: Response) => {
  clearSessionCookie(res);
  res.json({ message: "Logout successful" });
});

// GET /api/auth/me
router.get("/me", async (req: Request, res: Response): Promise<void> => {
  const user = await getCurrentUser(req);
  if (!user) {
    res.status(401).json({ error: "Unauthorized: No active session" });
    return;
  }
  res.json({ user });
});

export default router;
