# Project LOOP — Production Deployment & Environment Guide

This document provides clear instructions for deploying the **Project LOOP** decoupled architecture (Next.js 15 Frontend + Express Backend API + PostgreSQL Prisma ORM).

---

## 1. Quick Summary of Required Environment Variables

### A. Vercel Frontend Environment Variables
Set these variables in your **Vercel Project Settings -> Environment Variables**:

| Variable Name | Required Value Example | Description |
| :--- | :--- | :--- |
| **`BACKEND_URL`** | `https://project-loop-backend.onrender.com` | **CRITICAL:** The public HTTPS base URL of your deployed Express backend API server. |
| **`NEXT_PUBLIC_BACKEND_URL`** | `https://project-loop-backend.onrender.com` | Public backend fallback URL for client-side API calls. |

> [!IMPORTANT]
> The error `"Backend API service is unavailable. Please verify backend server is running."` occurs when **`BACKEND_URL`** is missing in Vercel settings, causing Next.js serverless route handlers to fall back to `http://127.0.0.1:5000` (which is unreachable in Vercel serverless environment).

---

### B. Render Backend Environment Variables
Set these variables in your **Render Web Service Settings -> Environment Variables**:

| Variable Name | Required Value Example | Description |
| :--- | :--- | :--- |
| **`DATABASE_URL`** | `postgresql://postgres:password@ep-host.neon.tech/project_loop?sslmode=require` | **CRITICAL:** PostgreSQL database connection string (Neon, Supabase, or Render Postgres). |
| **`JWT_SECRET`** | `your-secure-random-64-char-jwt-secret-key` | Secret key used to sign and verify session JWTs. |
| **`FRONTEND_URL`** | `https://loop-ai-feedback-intelligence.vercel.app` | The domain of your deployed Next.js frontend application for CORS authorization. |
| **`NODE_ENV`** | `production` | Enables production mode, reverse proxy trust (`trust proxy 1`), and secure HTTP-only cookies. |
| **`PORT`** | `5000` (or host-assigned) | The port Express listens on. |
| **`ANTHROPIC_API_KEY`** | `sk-ant-api...` | Optional. Key for Anthropic Claude AI integration (vector fallback activates if unset). |

---

## 2. Step-by-Step Deployment Instructions

### Step 1: Deploy Backend API Server (`backend/`) on Render
1. Create a PostgreSQL Database on Neon, Supabase, or Render Postgres and copy the connection string.
2. Create a new **Web Service** on [Render.com](https://render.com).
3. Connect your GitHub repository: `Govindharaj-111/loop-ai-feedback-intelligence`.
4. Set the build settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npm run build && npm run db:setup`
   - **Start Command:** `npm start`
5. Add the Environment Variables listed in Section 1B.
6. Click **Deploy Web Service**. Render will install dependencies, build TypeScript, generate Prisma client, push database schema, seed demo accounts (`admin@acme.com`), and launch Express.
7. Copy your backend service URL (e.g. `https://project-loop-backend.onrender.com`).

### Step 2: Deploy Frontend (`frontend/`) on Vercel
1. Go to [Vercel.com](https://vercel.com) and select **Project Settings**.
2. Go to **Environment Variables** and add:
   - Key: `BACKEND_URL`
   - Value: `https://project-loop-backend.onrender.com` (from Step 1)
   - Key: `NEXT_PUBLIC_BACKEND_URL`
   - Value: `https://project-loop-backend.onrender.com`
3. Trigger a **Redeploy** on Vercel (Deployment -> Redeploy) so Next.js serverless route handlers pick up the runtime environment variable.

---

## 3. Local Development

To run both servers concurrently in local development:

```bash
# Push database schema & seed demo data
npm run --prefix backend db:setup

# Start Express Backend (Port 5000) & Next.js Frontend (Port 3000)
npm run dev
```

* **Frontend UI:** `http://localhost:3000`
* **Backend API Health Check:** `http://localhost:5000/api/health`
* **Demo Logins:** `admin@acme.com` / `admin123`, `analyst@acme.com` / `analyst123`, `viewer@acme.com` / `viewer123`
