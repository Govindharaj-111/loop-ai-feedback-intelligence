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
const allowedOrigins = Array.from(new Set([
  FRONTEND_URL,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
].filter(Boolean)));

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server proxy)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive for local dev & proxies while credentials enabled
    },
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

// Global Error Handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Unhandled Backend API Server Error:", err);
  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    error: err.message || "An unexpected internal server error occurred",
  });
});

if (process.env.NODE_ENV !== "test") {
  const HOST = process.env.HOST || "0.0.0.0";
  app.listen(Number(PORT), HOST, () => {
    console.log(`=================================================`);
    console.log(`  Project LOOP Backend API Server running on ${HOST}:${PORT}`);
    console.log(`  Health Check: http://localhost:${PORT}/api/health`);
    console.log(`=================================================`);
  });
}

export default app;
