import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth, requireRole } from "../lib/security.js";
import { calculateVerifiedStats, generateVocReportContent } from "../lib/reportService.js";

const router = Router();

// GET /api/reports
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const session = await requireAuth(req);

    const reports = await prisma.report.findMany({
      where: { workspaceId: session.workspaceId },
      orderBy: { createdAt: "desc" },
      include: {
        generator: {
          select: { name: true, email: true },
        },
      },
    });

    res.json({ reports });
  } catch (error: any) {
    if (error.statusCode) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

// POST /api/reports/generate
router.post("/generate", async (req: Request, res: Response): Promise<void> => {
  try {
    const session = await requireRole(["ADMIN", "ANALYST"], req);
    const { title, periodStart, periodEnd } = req.body;

    if (!periodStart || !periodEnd) {
      res.status(400).json({ error: "Start date and end date are required for report generation" });
      return;
    }

    const startDate = new Date(periodStart);
    const endDate = new Date(periodEnd);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      res.status(400).json({ error: "Invalid date format specified" });
      return;
    }

    const stats = await calculateVerifiedStats(session.workspaceId, startDate, endDate);
    const vocContent = await generateVocReportContent(stats);

    const reportTitle = title?.trim() || `Voice-of-Customer Report (${startDate.toISOString().split("T")[0]} to ${endDate.toISOString().split("T")[0]})`;

    const report = await prisma.report.create({
      data: {
        title: reportTitle,
        periodStart: startDate,
        periodEnd: endDate,
        contentJson: JSON.stringify({ stats, content: vocContent }),
        workspaceId: session.workspaceId,
        generatedBy: session.id,
      },
    });

    res.status(201).json({ report });
  } catch (error: any) {
    if (error.statusCode) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    console.error("Report generation error:", error);
    res.status(500).json({ error: "Failed to generate VoC report" });
  }
});

// GET /api/reports/:id
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const session = await requireAuth(req);
    const { id } = req.params;

    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        generator: {
          select: { name: true, email: true },
        },
      },
    });

    if (!report) {
      res.status(404).json({ error: "Report not found" });
      return;
    }

    if (report.workspaceId !== session.workspaceId) {
      res.status(403).json({ error: "Forbidden: Cross-workspace access attempt blocked" });
      return;
    }

    res.json({ report });
  } catch (error: any) {
    if (error.statusCode) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Failed to fetch report" });
  }
});

// DELETE /api/reports/:id
router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const session = await requireRole(["ADMIN", "ANALYST"], req);
    const { id } = req.params;

    const report = await prisma.report.findUnique({ where: { id } });

    if (!report) {
      res.status(404).json({ error: "Report not found" });
      return;
    }

    if (report.workspaceId !== session.workspaceId) {
      res.status(403).json({ error: "Forbidden: Cross-workspace access attempt blocked" });
      return;
    }

    await prisma.report.delete({ where: { id } });

    res.json({ message: "Report deleted successfully" });
  } catch (error: any) {
    if (error.statusCode) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Failed to delete report" });
  }
});

export default router;
