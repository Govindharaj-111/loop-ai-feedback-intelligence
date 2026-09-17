# Project LOOP — AI Customer-Feedback Intelligence Platform

[![Next.js 15](https://img.shields.io/badge/Frontend-Next.js_15-black?logo=next.js)](https://nextjs.org/)
[![Express.js](https://img.shields.io/badge/Backend-Express.js_4-green?logo=express)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.4-2D3748?logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Project LOOP** (*Learning & Optimization from Online Feedback*) is an enterprise-ready, multi-tenant AI Customer-Feedback Intelligence Platform.

It is decoupled into an **independent Next.js Frontend (`frontend/`)** and an **Express.js Backend API Server (`backend/`)** for flexible, scalable, and independent deployment.

---

## 1. System Architecture

```text
┌────────────────────────────────────────┐     HTTP-only Cookies / API Proxy     ┌────────────────────────────────────────┐
│          FRONTEND APPLICATION          │ ────────────────────────────────────> │          BACKEND API SERVER            │
│         (Next.js 15 / React 19)        │                                       │        (Express.js / TypeScript)       │
│                                        │ <──────────────────────────────────── │                                        │
│  - Landing Page & Authentication UI    │         JSON API Responses            │  - Prisma ORM & Database Persistence   │
│  - Analytics Dashboard & Recharts      │                                       │  - JWT Session Auth & Security Guards  │
│  - Feedback Inbox & Triage Controls    │                                       │  - AI Auto-Classification Engine       │
│  - Ask LOOP Grounded RAG Chat UI       │                                       │  - Vector Embedding Search & RAG       │
│  - VoC Executive Report Viewer & PDF   │                                       │  - Automated QA Security Test Suites   │
└────────────────────────────────────────┘                                       └────────────────────────────────────────┘
```

---

## 2. Directory Layout

```text
project-loop/
├── frontend/                     # Standalone Next.js 15 Web Application
│   ├── src/
│   │   ├── app/                 # Next.js App Router (Landing, Login, Dashboard)
│   │   ├── components/          # React Components & UI System
│   │   └── types/               # TypeScript Type Definitions
│   ├── next.config.ts           # API Proxy configuration to Backend Server
│   ├── tailwind.config.ts       # Design System & Styling configuration
│   └── package.json             # Frontend Dependencies & Scripts
│
├── backend/                      # Standalone Express.js + TypeScript API Server
│   ├── src/
│   │   ├── routes/              # Express API Route Handlers
│   │   ├── lib/                 # Core Business Logic (Prisma, Auth, AI, RAG)
│   │   ├── types/               # Server Type Definitions
│   │   └── server.ts            # Main Server Entrypoint
│   ├── prisma/                  # Database Schema, Seed Script & SQLite DB
│   ├── tests/                   # Automated Security & Quality Test Suites
│   └── package.json             # Backend Dependencies & Scripts
│
├── package.json                  # Root Monorepo Orchestration Scripts
└── README.md                     # Project & Deployment Documentation
```

---

## 3. Quick Start & Local Development

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher

### Running Frontend and Backend Together
```bash
# Install root dependencies
npm install

# Push database schema & seed demo data in backend
npm run db:push
npm run db:seed

# Run both Backend (Port 5000) and Frontend (Port 3000) concurrently
npm run dev
```

* **Frontend UI:** `http://localhost:3000`
* **Backend API:** `http://localhost:5000/api`
* **Health Check:** `http://localhost:5000/api/health`

### Demo Credentials
* **ADMIN Account:** `admin@acme.com` / `AdminPass123!`
* **ANALYST Account:** `analyst@acme.com` / `AnalystPass123!`
* **VIEWER Account:** `viewer@acme.com` / `ViewerPass123!`

---

## 4. Independent Deployment Guide

### A. Deploying the Backend API Server (`backend/`)
The backend is a Node.js/Express application with Prisma ORM.

**Target Services:** Render, Railway, AWS ECS, Heroku, Docker, or DigitalOcean App Platform.

1. **Build Step:**
   ```bash
   cd backend
   npm install
   npx prisma db push
   npx prisma db seed
   npm run build
   ```
2. **Start Command:**
   ```bash
   npm start   # Runs `node dist/server.js`
   ```
3. **Environment Variables:**
   ```env
   PORT=5000
   DATABASE_URL="file:./dev.db" # or PostgreSQL URL: postgresql://user:pass@host:5432/dbname
   JWT_SECRET="your-production-jwt-secret-key"
   ANTHROPIC_API_KEY="your-anthropic-api-key"
   FRONTEND_URL="https://your-frontend-domain.vercel.app"
   ```

### B. Deploying the Frontend Application (`frontend/`)
The frontend is a Next.js 15 application.

**Target Services:** Vercel, Netlify, Cloudflare Pages, or AWS Amplify.

1. **Build Step:**
   ```bash
   cd frontend
   npm install
   npm run build
   ```
2. **Environment Variables:**
   ```env
   NEXT_PUBLIC_API_URL="https://your-backend-api-domain.onrender.com"
   BACKEND_URL="https://your-backend-api-domain.onrender.com"
   ```

---

## 5. Automated Security & QA Tests

Execute the master security test suite in the backend service:

```bash
# Run backend security test suite
npm test

# Run individual test phases
npm --prefix backend run test:phase1
npm --prefix backend run test:phase2
npm --prefix backend run test:phase3
npm --prefix backend run test:phase4
```

---

## 6. Key Platform Capabilities

* 🔒 **Multi-Tenant Security Architecture:** Unconditional session `workspaceId` enforcement across all database queries and vector RAG searches.
* 👥 **Role-Based Access Control (RBAC):** Granular permissions for `ADMIN`, `ANALYST`, and `VIEWER` roles.
* 📥 **Multi-Channel Ingestion:** Bulk CSV parsing with row-by-row error reporting, manual entry, and simulated channel feeds.
* 🤖 **AI Auto-Classification:** Anthropic Claude API sentiment analysis with Zod runtime schema validation.
* 💬 **Ask LOOP (Grounded RAG):** Vector cosine similarity search with grounded evidence quotes and zero-hallucination controls.
* 📄 **Executive VoC Reports:** Verified server-side database statistics + structured executive VoC synthesis with print/PDF export.

---

## License
[MIT](LICENSE) © 2026 Project LOOP Team
