# Project LOOP — Production Deployment & Environment Guide

This document provides clear instructions for deploying the **Project LOOP** decoupled architecture (Next.js Frontend + Express Backend API).

---

## 1. Quick Summary of Required Environment Variables

### A. Vercel / Netlify Frontend Environment Variables
Set these variables in your **Vercel Project Settings -> Environment Variables**:

| Variable Name | Required Value Example | Description |
| :--- | :--- | :--- |
| **`BACKEND_URL`** (or **`NEXT_PUBLIC_API_URL`**) | `https://project-loop-backend.onrender.com` | **CRITICAL:** The public base URL of your deployed Express backend API server. |
| **`NEXT_PUBLIC_APP_URL`** | `https://your-frontend.vercel.app` | The public base URL of your deployed Next.js frontend application. |

> [!IMPORTANT]
> The error `"Backend API service is unavailable. Please verify backend server is running."` occurs when **`BACKEND_URL`** or **`NEXT_PUBLIC_API_URL`** is not set on Vercel, causing Next.js to fall back to `http://127.0.0.1:5000` (which is unreachable in Vercel's serverless runtime).

---

### B. Render / Railway / Server Backend Environment Variables
Set these variables in your **Render Web Service Settings -> Environment Variables**:

| Variable Name | Required Value Example | Description |
| :--- | :--- | :--- |
| **`PORT`** | `5000` (or dynamically assigned by host) | The port Express listens on. |
| **`NODE_ENV`** | `production` | Enables production mode and secure HTTP cookies. |
| **`DATABASE_URL`** | `file:./dev.db` (or PostgreSQL URL) | Prisma database connection string. |
| **`JWT_SECRET`** | `your-secure-production-jwt-secret-key` | Secret key used to sign and verify session JWTs. |
| **`FRONTEND_URL`** | `https://your-frontend.vercel.app` | The domain of your deployed Next.js frontend application for CORS. |
| **`ANTHROPIC_API_KEY`** | `your-anthropic-claude-api-key` | Optional. Key for Anthropic Claude AI integration (vector fallback activates if unset). |

---

## 2. Step-by-Step Deployment Instructions

### Step 1: Deploy Backend API Server (`backend/`) on Render
1. Create a new **Web Service** on [Render.com](https://render.com).
2. Connect your GitHub repository: `Govindharaj-111/loop-ai-feedback-intelligence`.
3. Set the following build options:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
4. Add the Environment Variables listed in Section 1B.
5. Click **Create Web Service**. Once deployed, copy your backend service URL (e.g. `https://project-loop-backend.onrender.com`).

### Step 2: Deploy Frontend (`frontend/`) on Vercel
1. Go to [Vercel.com](https://vercel.com) and click **Add New Project**.
2. Import your GitHub repository: `Govindharaj-111/loop-ai-feedback-intelligence`.
3. In Project Settings:
   - **Root Directory:** Edit and select `frontend` (or keep root with `vercel.json`).
4. In **Environment Variables**, add:
   - Key: `BACKEND_URL`
   - Value: `https://project-loop-backend.onrender.com` (your backend URL from Step 1)
5. Click **Deploy**.

---

## 3. Local Development

To run both servers concurrently in local development:

```bash
# Push database schema & seed demo data
npm run db:push
npm run db:seed

# Start Express Backend (Port 5000) & Next.js Frontend (Port 3000)
npm run dev
```

* **Frontend UI:** `http://localhost:3000`
* **Backend API Health Check:** `http://localhost:5000/api/health`
