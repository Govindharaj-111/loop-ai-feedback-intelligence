import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import themeRoutes from "./routes/themeRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import askRoutes from "./routes/askRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// Middleware
app.use(
  cors({
    origin: [FRONTEND_URL, "http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health Check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "Project LOOP API Backend", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/themes", themeRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/ask", askRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/users", userRoutes);

// 404 Handler
app.use((_req, res) => {
  res.status(404).json({ error: "API endpoint not found" });
});

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(`  Project LOOP Backend API Server running on port ${PORT}`);
    console.log(`  Health Check: http://localhost:${PORT}/api/health`);
    console.log(`=================================================`);
  });
}

export default app;
