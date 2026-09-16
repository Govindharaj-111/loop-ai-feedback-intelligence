# Project LOOP — Security & Threat Model Documentation

## 1. Security Overview

**Project LOOP** implements defense-in-depth security principles across authentication, authorization, multi-tenant isolation, data sanitization, and AI safety.

---

## 2. Authentication & Session Security

* **Password Hashing:** Passwords are hashed using `bcryptjs` with salt rounds = 10 prior to storage. Plaintext passwords are never logged or stored.
* **Session Strategy:** Stateless JSON Web Tokens (JWT) signed via `jose` using secret key `JWT_SECRET`.
* **Cookie Flags:** Issued as HTTP-only cookies (`loop_session`) with `SameSite=Lax` and `Path=/` attributes. Prevents client-side XSS script reading.
* **Route Guards:** Server security helper `requireAuth()` verifies session validity. Unauthenticated requests to protected endpoints return **HTTP 401 Unauthorized**.

---

## 3. Role-Based Access Control (RBAC) Matrix

Server-side authorization enforcer `requireRole(allowedRoles)` validates user role claims on every request:

| Feature / API Endpoint | `ADMIN` | `ANALYST` | `VIEWER` | Forbidden HTTP Response |
| :--- | :---: | :---: | :---: | :---: |
| **View Dashboards & Reports** | ✅ | ✅ | ✅ | N/A |
| **Ask LOOP RAG Q&A** | ✅ | ✅ | ✅ | N/A |
| **Create / Edit / Delete Feedback** | ✅ | ✅ | ❌ | **403 Forbidden** |
| **Import CSV & Simulated Feeds** | ✅ | ✅ | ❌ | **403 Forbidden** |
| **Trigger Theme Clustering** | ✅ | ✅ | ❌ | **403 Forbidden** |
| **Generate VoC Reports** | ✅ | ✅ | ❌ | **403 Forbidden** |
| **User Management (`/api/users`)** | ✅ | ❌ | ❌ | **403 Forbidden** |

---

## 4. Multi-Tenant Data Isolation Model

> **Core Directive:** *"Never trust workspaceId from client URL, query parameter, request body, or frontend state. Always obtain workspaceId from the authenticated server-side session."*

### Security Enforcement Strategy:
1. **Server Session Scoping:** All API route handlers call `requireAuth()` to retrieve the authenticated `session.workspaceId`.
2. **Database Level Isolation:** Every Prisma query explicitly appends `where: { workspaceId: session.workspaceId }`.
3. **Cross-Tenant Access Checks:** Endpoint handlers (e.g., `/api/feedback/[id]`, `/api/reports/[id]`) verify `record.workspaceId === session.workspaceId`. Mismatches throw `ForbiddenError` (**HTTP 403 Forbidden**).
4. **Vector Search Isolation:** Embedding retrieval (`searchWorkspaceEmbeddings`) filters database records by `workspaceId` prior to cosine similarity calculation.

---

## 5. AI Safety & Grounding Controls

* **Server-Side API Key Secrecy:** `ANTHROPIC_API_KEY` is maintained strictly in server environment variables. Never bundled into client JS.
* **Response Validation:** All AI classification outputs pass through Zod runtime schema validation (`ClassificationSchema.safeParse`). Malformed LLM outputs are caught and replaced with fallback classification schemas.
* **Grounded RAG Rule:** Ask LOOP RAG engine is instructed to synthesize answers strictly from retrieved evidence quotes. If zero evidence is retrieved, the engine returns `hasSufficientEvidence: false` and explicitly refuses to invent customer feedback.
* **Verified VoC Statistics:** Voice-of-Customer reports calculate statistics (counts, percentages, theme shares) strictly in server application code before passing metrics to Claude for executive narrative synthesis.

---

## 6. Security Audit Results

Executed via [`tests/master_security.test.ts`](file:///c:/Users/GR/Desktop/project%20loop/tests/master_security.test.ts):
* ✅ Password Hashing & Verification — PASSED
* ✅ JWT Token Signing & Expiry Rejection — PASSED
* ✅ Unauthenticated 401 Protection — PASSED
* ✅ RBAC Role Permissions (`ADMIN`, `ANALYST`, `VIEWER`) — PASSED
* ✅ Multi-Tenant Workspace Isolation — PASSED
* ✅ Cross-Tenant RAG Vector Isolation — PASSED
* ✅ CSV Malformed Input Resilience — PASSED
