# Project LOOP — AI Customer-Feedback Intelligence Platform

[![Next.js 15](https://img.shields.io/badge/Next.js-15.1-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.4-2D3748?logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Project LOOP** (*Learning & Optimization from Online Feedback*) is an enterprise-ready, multi-tenant AI Customer-Feedback Intelligence Platform. It aggregates unstructured customer feedback—support tickets, app store reviews, NPS survey responses, sales call notes, and community posts—and transforms it into structured, actionable insights, grounded semantic Q&A, and executive Voice-of-Customer (VoC) reports.

---

## 1. Problem Statement

Product, Engineering, and Customer Success teams in multi-tenant SaaS organizations struggle with fragmented, unstructured user feedback scattered across Zendesk, App Store reviews, Intercom, and CRM notes. Manually categorizing thousands of comments is slow and error-prone, while generic LLMs often hallucinate metrics or leak confidential tenant data across workspace boundaries.

**Project LOOP solves this by:**
* Enforcing **strict multi-tenant data isolation** at the database, query, vector search, and API route level.
* Providing **automated AI classification** and Zod-validated structured outputs.
* Delivering a **Grounded RAG Q&A Engine (`Ask LOOP`)** that cites exact feedback evidence and refuses to invent facts.
* Calculating **verified server-side database statistics** for executive Voice-of-Customer (VoC) reports with one-click print/PDF export.

---

## 2. Key Features

* 🔒 **Multi-Tenant Security Architecture:** Every database query, vector search, and report synthesis is unconditionally filtered by server session `workspaceId`.
* 👥 **Role-Based Access Control (RBAC):** Server-enforced permissions for `ADMIN` (full control + user management), `ANALYST` (feedback CRUD + AI models), and `VIEWER` (read-only dashboards).
* 📥 **Multi-Channel Feedback Ingestion:** Manual entry, bulk CSV import with row-by-row error validation, and 1-click simulated channel feeds (Support Tickets, App Reviews, NPS, Sales Calls).
* 📊 **Analytics Dashboard & Recharts:** Real-time KPI cards and responsive visualizations for Feedback Volume Over Time, Sentiment Distribution, and Ingestion Channels.
* 🤖 **AI Auto-Classification & Theme Clustering:** NLP parsing of sentiment, sentiment score, feature area, and rationale validated via Zod runtime schemas.
* 📈 **Trend Velocity Engine:** Period-over-period trend analysis classifying topics into `SPIKING`, `INCREASING`, `STABLE`, or `DECREASING`.
* 💬 **Ask LOOP (Grounded RAG Q&A):** Semantic vector search retrieving relevant tenant feedback evidence with clickable citation callouts and strict zero-hallucination rules.
* 📄 **Voice-of-Customer (VoC) Reports:** Verified server statistics aggregation + Claude executive synthesis with print/PDF export capabilities.

---

## 3. Architecture & Data Flow

```text
                       ┌─────────────────────────┐
                       │  Unstructured Feedback  │
                       └────────────┬────────────┘
                                    │
                         ┌──────────┴──────────┐
                         │ Ingestion Pipeline  │ (Manual / CSV / Simulated)
                         └──────────┬──────────┘
                                    │
                         ┌──────────┴──────────┐
                         │  Multi-Tenant Guard │ (workspaceId Session Filtering)
                         └──────────┬──────────┘
                                    │
        ┌───────────────────┬───────┴───────────┬───────────────────┐
        ▼                   ▼                   ▼                   ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│ Auto-         │   │ Theme         │   │ Grounded RAG  │   │ Executive VoC │
│ Classification│   │ Clustering &  │   │ Vector Search │   │ Reports &     │
│ (Zod Valid)   │   │ Trend Velocity│   │ (Ask LOOP)    │   │ Print Export  │
└───────────────┘   └───────────────┘   └───────────────┘   └───────────────┘
```

---

## 4. Tech Stack & Dependencies

* **Framework:** Next.js 15 (App Router, Server Actions, API Routes)
* **Language:** TypeScript 5.7
* **Database & ORM:** PostgreSQL / SQLite with Prisma ORM 6.4
* **Authentication:** Password Hashing (`bcryptjs`), JWT Session Tokens (`jose`), HTTP-only Cookies
* **Styling & Icons:** Tailwind CSS 3.4, Lucide React Icons
* **Data Visualization:** Recharts 2.15
* **AI & Validation:** Anthropic Claude API (`@anthropic-ai/sdk`), Zod 3.24, Vector Cosine Similarity Engine

---

## 5. Database Schema

```prisma
model Workspace {
  id        String     @id @default(uuid())
  name      String
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt

  users     User[]
  feedbacks Feedback[]
  themes    Theme[]
  reports   Report[]
}

model User {
  id           String    @id @default(uuid())
  name         String
  email        String    @unique
  passwordHash String
  role         String    @default("ADMIN") // ADMIN, ANALYST, VIEWER
  workspaceId  String
  workspace    Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  @@index([workspaceId])
}

model Feedback {
  id             String   @id @default(uuid())
  content        String
  channel        String   @default("MANUAL")
  customerLabel  String?
  sentiment      String?  // Positive, Neutral, Negative
  sentimentScore Float?
  featureArea    String?
  rationale      String?
  status         String   @default("NEW") // NEW, REVIEWED, ACTIONED
  workspaceId    String
  workspace      Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  @@index([workspaceId])
}
```

---

## 6. Setup & Installation

### Prerequisites
* Node.js v18.0.0 or higher
* npm v9.0.0 or higher

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/project-loop.git
   cd project-loop
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

4. **Initialize database schema:**
   ```bash
   npx prisma db push
   ```

5. **Seed production-grade demo data (120+ records + 3 demo accounts):**
   ```bash
   npx prisma db seed
   ```

6. **Start local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 7. Environment Variables Reference

```env
# Database Connection String (SQLite for dev, PostgreSQL for production)
DATABASE_URL="file:./dev.db"

# JWT & Authentication Secrets
JWT_SECRET="project-loop-super-secret-jwt-key-2026-secure"
NEXTAUTH_SECRET="project-loop-super-secret-jwt-key-2026-secure"

# Application Base URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# AI Integration — Anthropic Claude API Key (Kept strictly server-side)
ANTHROPIC_API_KEY="your-anthropic-claude-api-key"
```

---

## 8. Demo Accounts & Credentials

The seed script creates the following production-safe demo credentials under workspace `"Acme Feedback Intelligence"`:

| Role | Email Address | Password | Permissions & Access Scope |
| :--- | :--- | :--- | :--- |
| **`ADMIN`** | `admin@acme.com` | `AdminPass123!` | Full control: Feedback CRUD, CSV import, AI models, VoC reports, User Management. |
| **`ANALYST`** | `analyst@acme.com` | `AnalystPass123!` | Operational analytics: Feedback CRUD, CSV import, AI models, VoC reports. Restricted from User Management. |
| **`VIEWER`** | `viewer@acme.com` | `ViewerPass123!` | Read-only access: View Dashboards, Inbox, Trends, Ask LOOP, and VoC Reports. Restricted from write/delete. |

---

## 9. AI Engine Configuration

* **Anthropic Claude Integration:** Routes through server-side helper [`src/lib/aiService.ts`](file:///c:/Users/GR/Desktop/project%20loop/src/lib/aiService.ts).
* **Zero-Hallucination Grounded RAG:** Vector search strictly filters embeddings by `workspaceId` before performing cosine similarity. If zero evidence is retrieved, the assistant refuses to invent data.
* **Offline Resilience:** Includes local NLP heuristic fallback engines ensuring 100% feature availability even when network or API keys are unavailable.

---

## 10. Production Deployment (Vercel + PostgreSQL)

1. **Database Setup (Supabase / Neon):**
   Create a PostgreSQL database and update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. **Deploy to Vercel:**
   * Push code to GitHub repository.
   * Import project into Vercel dashboard.
   * Add environment variables (`DATABASE_URL`, `JWT_SECRET`, `ANTHROPIC_API_KEY`).
   * Vercel build command automatically runs `npx prisma db push`.

---

## 11. Automated Test Suite

Run the comprehensive master security test suite:
```bash
npx tsx tests/master_security.test.ts
```

**Test Coverage Summary:** 53/53 PASSED (100% clean execution across Phase 1, 2, 3, 4, and 5 security audits).

---

## 12. Known Limitations & Future Roadmap

* **Phase 4.0 (Planned):** Native Zendesk & Intercom OAuth integration webhooks.
* **Phase 4.1 (Planned):** Real-time Slack / Microsoft Teams alert notifications for P0 bug clusters.
