import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth, requireRole } from "../lib/security.js";
import { clusterWorkspaceFeedback } from "../lib/themeService.js";

const router = Router();

// GET /api/themes
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const session = await requireAuth(req);

    const themes = await prisma.theme.findMany({
      where: { workspaceId: session.workspaceId },
      include: {
        feedbacks: {
          include: { feedback: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ themes });
  } catch (error: any) {
    if (error.statusCode) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Failed to fetch themes" });
  }
});

// POST /api/themes
router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const session = await requireRole(["ADMIN", "ANALYST"], req);
    const { name, description } = req.body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      res.status(400).json({ error: "Theme name is required" });
      return;
    }

    const theme = await prisma.theme.create({
      data: {
        name: name.trim(),
        description: description || null,
        workspaceId: session.workspaceId,
      },
    });

    res.status(201).json({ theme });
  } catch (error: any) {
    if (error.statusCode) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Failed to create theme" });
  }
});

// POST /api/themes/cluster
router.post("/cluster", async (req: Request, res: Response): Promise<void> => {
  try {
    const session = await requireRole(["ADMIN", "ANALYST"], req);
    const clusters = await clusterWorkspaceFeedback(session.workspaceId);

    res.json({
      message: "AI Theme Clustering completed successfully",
      clustersCount: clusters.length,
      clusters,
    });
  } catch (error: any) {
    if (error.statusCode) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    console.error("Theme clustering error:", error);
    res.status(500).json({ error: "Failed to run AI theme clustering" });
  }
});

export default router;
