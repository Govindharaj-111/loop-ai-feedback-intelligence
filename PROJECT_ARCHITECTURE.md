# Project LOOP — Technical Architecture Document

## 1. System Overview

**Project LOOP** (*Learning & Optimization from Online Feedback*) is an enterprise-grade multi-tenant AI Customer-Feedback Intelligence Platform built using Next.js 15, TypeScript, Tailwind CSS, Prisma ORM, and PostgreSQL. It ingests unstructured customer feedback across multiple channels, automatically classifies sentiment and themes, analyzes period-over-period trend velocity, provides grounded vector search Q&A (Ask LOOP), and synthesizes executive Voice-of-Customer (VoC) reports.

---

## 2. Architectural Diagram

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT BROWSER UI                             │
│       React 19 App Router Components, Recharts, Lucide Icons, CSS       │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ HTTP-only Cookie (`loop_session`)
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       NEXT.JS 15 APP SERVER / API                       │
│                                                                         │
│   ┌───────────────────┐    ┌───────────────────┐    ┌───────────────┐   │
│   │ Security Helpers  │    │ AI Classification │    │ Grounded RAG  │   │
│   │ (getCurrentUser,  │    │ & Zod Validation  │    │ Vector Search │   │
│   │  requireRole)     │    │ (aiService.ts)    │    │ (vectorRag.ts)│   │
│   └─────────┬─────────┘    └─────────┬─────────┘    └───────┬───────┘   │
└─────────────┼────────────────────────┼──────────────────────┼───────────┘
              │                        │                      │
              │                        ▼                      │
              │              ┌───────────────────┐            │
              │              │  Anthropic Claude │            │
              │              │    Messages API   │            │
              │              └───────────────────┘            │
              │                                               │
              ▼                                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    PERSISTENCE LAYER (Prisma ORM)                        │
│                                                                         │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐  ┌───────────┐  │
│  │  Workspace   │───│     User     │───│   Feedback   │──│ Embedding │  │
│  └──────────────┘   └──────────────┘   └──────────────┘  └───────────┘  │
│         │                                     │                         │
│         └─────────────────────────────────────┴─────────┐               │
│                                                         ▼               │
│                                                 ┌──────────────┐        │
│                                                 │    Report    │        │
│                                                 └──────────────┘        │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Core Component Subsystems

### 3.1 Security & Multi-Tenant Isolation Layer (`src/lib/security.ts`)
* **Session Handlers:** Reads HTTP-only cookie (`loop_session`) containing signed JWT payload (`sub`, `role`, `workspaceId`).
* **Multi-Tenant Guard:** Functions `requireAuth()`, `requireRole()`, and `requireWorkspaceAccess()` unconditionally assert tenant boundary checks. URL, request body, or query param `workspaceId` values are strictly ignored.
* **Prisma Tenant Utility:** `tenantWhere(session, query)` automatically injects `workspaceId: session.workspaceId` into all database operations.

### 3.2 Ingestion & CSV Parsing Pipeline (`src/lib/csvParser.ts`, `simulatedIngestion.ts`)
* Accepts feedback via manual creation, bulk CSV upload, or simulated channel feeds.
* Validates CSV headers (`content`, `channel`, `customer_label`, `created_at`), parses rows, and isolates malformed records without throwing server errors.

### 3.3 AI Auto-Classification & Theme Engine (`src/lib/aiService.ts`, `themeService.ts`)
* Submits incoming feedback text to Anthropic Claude server-side API (`claude-3-5-sonnet-20241022`).
* Enforces **Zod runtime schema validation** (`ClassificationSchema`) to validate `{ sentiment, sentimentScore, featureArea, rationale, themes }`.
* Clusters workspace feedback into dynamic workspace themes and detects period-over-period velocity momentum (`SPIKING`, `INCREASING`, `STABLE`, `DECREASING`).

### 3.4 Grounded RAG Vector Engine (`src/lib/vectorRagService.ts`)
* Computes normalized 32-dimensional term-frequency feature vectors (`generateEmbeddingVector`).
* Performs cosine similarity vector search scoped strictly by `workspaceId`.
* Grounded Q&A rules: Synthesizes responses strictly from retrieved evidence quotes. If zero evidence is retrieved, returns `hasSufficientEvidence: false` and explicitly refuses to invent feedback.

### 3.5 Executive VoC Reporting Engine (`src/lib/reportService.ts`)
* Calculates verified database statistics (counts, sentiment %, top theme shares) server-side.
* Synthesizes executive VoC reports containing Executive Summary, Sentiment Overview, Top Themes, Trends, Customer Evidence, and Recommended Actions.
* Persists report snapshots in database and supports print/PDF export styling.

---

## 4. Data Storage & Schema Design

| Model Name | Key Fields | Multi-Tenant Relation | Description |
| :--- | :--- | :--- | :--- |
| **`Workspace`** | `id`, `name`, `createdAt` | Root Tenant Entity | Primary multi-tenant isolation unit. |
| **`User`** | `id`, `name`, `email`, `passwordHash`, `role`, `workspaceId` | Belongs to `Workspace` | Authenticated user credentials and RBAC role (`ADMIN`, `ANALYST`, `VIEWER`). |
| **`Feedback`** | `id`, `content`, `channel`, `customerLabel`, `sentiment`, `status`, `workspaceId` | Belongs to `Workspace` | Customer feedback record. |
| **`Theme`** | `id`, `name`, `description`, `workspaceId` | Belongs to `Workspace` | Categorized workspace feedback topic. |
| **`FeedbackTheme`** | `feedbackId`, `themeId`, `confidence` | Joins Feedback & Theme | Junction table linking feedback records to themes. |
| **`Embedding`** | `id`, `feedbackId`, `vector` | Linked to `Feedback` | Vector embedding payload for semantic search. |
| **`Report`** | `id`, `title`, `periodStart`, `periodEnd`, `contentJson`, `workspaceId`, `generatedBy` | Belongs to `Workspace` | Executive VoC report snapshot. |
