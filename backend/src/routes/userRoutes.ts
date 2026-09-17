```ts
import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { requireRole } from "../lib/security.js";
import { hashPassword } from "../lib/auth.js";

const router = Router();

// GET /api/users
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const session = await requireRole(["ADMIN"], req);

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

    res.json({ users });
  } catch (error: any) {
    if (error.statusCode) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }

    res.status(500).json({
      error: "Failed to fetch workspace users",
    });
  }
});

// POST /api/users
router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const session = await requireRole(["ADMIN"], req);
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      res.status(400).json({
        error: "Name, email, password, and role are required",
      });
      return;
    }

    if (!["ADMIN", "ANALYST", "VIEWER"].includes(role)) {
      res.status(400).json({
        error: "Invalid role. Must be ADMIN, ANALYST, or VIEWER",
      });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase().trim(),
      },
    });

    if (existingUser) {
      res.status(400).json({
        error: "User with this email already exists",
      });
      return;
    }

    const passwordHash = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        passwordHash,
        role,
        workspaceId: session.workspaceId,
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

    res.status(201).json({
      user: newUser,
    });
  } catch (error: any) {
    if (error.statusCode) {
      res.status(error.statusCode).json({
        error: error.message,
      });
      return;
    }

    res.status(500).json({
      error: "Failed to create user",
    });
  }
});

// PATCH /api/users/:id
router.patch("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const session = await requireRole(["ADMIN"], req);

    // Convert Express route parameter to a string
    const id = String(req.params.id);

    const targetUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!targetUser) {
      res.status(404).json({
        error: "User not found",
      });
      return;
    }

    if (targetUser.workspaceId !== session.workspaceId) {
      res.status(403).json({
        error: "Forbidden: Cross-workspace access attempt blocked",
      });
      return;
    }

    const { role, name } = req.body;

    if (role && !["ADMIN", "ANALYST", "VIEWER"].includes(role)) {
      res.status(400).json({
        error: "Invalid role specified",
      });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(role && { role }),
        ...(name && { name }),
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

    res.json({
      user: updatedUser,
    });
  } catch (error: any) {
    if (error.statusCode) {
      res.status(error.statusCode).json({
        error: error.message,
      });
      return;
    }

    res.status(500).json({
      error: "Failed to update user",
    });
  }
});

// DELETE /api/users/:id
router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const session = await requireRole(["ADMIN"], req);

    // Convert Express route parameter to a string
    const id = String(req.params.id);

    const targetUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!targetUser) {
      res.status(404).json({
        error: "User not found",
      });
      return;
    }

    if (targetUser.workspaceId !== session.workspaceId) {
      res.status(403).json({
        error: "Forbidden: Cross-workspace access attempt blocked",
      });
      return;
    }

    if (targetUser.id === session.id) {
      res.status(400).json({
        error: "Cannot delete your own active admin account",
      });
      return;
    }

    await prisma.user.delete({
      where: { id },
    });

    res.json({
      message: "User removed successfully",
    });
  } catch (error: any) {
    if (error.statusCode) {
      res.status(error.statusCode).json({
        error: error.message,
      });
      return;
    }

    res.status(500).json({
      error: "Failed to delete user",
    });
  }
});

export default router;
```
