import { Router, Request, Response } from "express";
import { requireAuth } from "../lib/security.js";
import { askLoopRag } from "../lib/vectorRagService.js";

const router = Router();

// POST /api/ask
router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const session = await requireAuth(req);
    const { question } = req.body;

    if (!question || typeof question !== "string" || question.trim().length === 0) {
      res.status(400).json({ error: "Question is required for RAG Q&A" });
      return;
    }

    const ragResult = await askLoopRag(question.trim(), session.workspaceId);
    res.json(ragResult);
  } catch (error: any) {
    if (error.statusCode) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    console.error("Ask LOOP RAG error:", error);
    res.status(500).json({ error: "Failed to process RAG question" });
  }
});

export default router;
