# Project LOOP — REST API Specification

## 1. Authentication Endpoints

### `POST /api/auth/signup`
Creates a new workspace and registers an initial `ADMIN` user.
* **Access:** Public
* **Request Body:**
  ```json
  {
    "name": "Sarah Jenkins",
    "email": "admin@acme.com",
    "password": "AdminPass123!",
    "workspaceName": "Acme Feedback Intelligence"
  }
  ```
* **Response (201 Created):**
  ```json
  {
    "user": {
      "id": "usr-123",
      "name": "Sarah Jenkins",
      "email": "admin@acme.com",
      "role": "ADMIN",
      "workspaceId": "ws-123",
      "workspaceName": "Acme Feedback Intelligence"
    }
  }
  ```

---

### `POST /api/auth/login`
Authenticates user credentials and issues HTTP-only JWT cookie (`loop_session`).
* **Access:** Public
* **Request Body:**
  ```json
  {
    "email": "admin@acme.com",
    "password": "AdminPass123!"
  }
  ```
* **Response (200 OK):** Sets `loop_session` cookie and returns user profile payload.

---

### `POST /api/auth/logout`
Clears HTTP-only `loop_session` cookie.
* **Access:** Authenticated

---

### `GET /api/auth/me`
Returns current authenticated session user profile.
* **Access:** Authenticated (401 if missing)

---

## 2. Feedback Endpoints

### `GET /api/feedback`
Retrieves paginated feedback records for active workspace.
* **Access:** Authenticated
* **Query Parameters:** `page`, `limit`, `search`, `sentiment`, `status`, `channel`
* **Response (200 OK):**
  ```json
  {
    "feedbacks": [...],
    "pagination": { "total": 125, "page": 1, "totalPages": 13, "limit": 10 }
  }
  ```

---

### `POST /api/feedback`
Creates a new customer feedback record.
* **Access:** `ADMIN` or `ANALYST` (403 if `VIEWER`)
* **Request Body:**
  ```json
  {
    "content": "Checkout UI is fast and responsive.",
    "channel": "App Review",
    "customerLabel": "Enterprise Client A",
    "sentiment": "Positive"
  }
  ```

---

### `POST /api/feedback/import`
Bulk imports customer feedback records from CSV file.
* **Access:** `ADMIN` or `ANALYST` (403 if `VIEWER`)

---

### `POST /api/feedback/simulate`
Generates simulated demo channel feedback records.
* **Access:** `ADMIN` or `ANALYST` (403 if `VIEWER`)

---

## 3. AI & RAG Endpoints

### `POST /api/ask`
Executes grounded semantic vector search and synthesizes evidence-cited answer.
* **Access:** Authenticated
* **Request Body:**
  ```json
  {
    "question": "What issues are reported regarding mobile payment?"
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "answer": "Users report mobile payment errors on iOS checkout...",
    "evidence": [
      {
        "id": "fb-1",
        "quote": "Unable to process payment...",
        "channel": "Support Ticket",
        "customer": "Enterprise Client",
        "similarity": 0.85
      }
    ],
    "hasSufficientEvidence": true
  }
  ```

---

## 4. Reports Endpoints

### `GET /api/reports`
Lists all VoC report snapshots for active workspace.
* **Access:** Authenticated

---

### `POST /api/reports/generate`
Calculates verified server statistics and synthesizes VoC report snapshot.
* **Access:** `ADMIN` or `ANALYST` (403 if `VIEWER`)
* **Request Body:**
  ```json
  {
    "title": "Q3 Executive Summary",
    "periodStart": "2026-08-01",
    "periodEnd": "2026-08-30"
  }
  ```

---

## 5. User Management Endpoints

### `GET /api/users`
Lists all users in current workspace.
* **Access:** `ADMIN` only (403 if `ANALYST` or `VIEWER`)

---

### `POST /api/users`
Creates a new team member in current workspace with specified role (`ADMIN`, `ANALYST`, `VIEWER`).
* **Access:** `ADMIN` only (403 if `ANALYST` or `VIEWER`)
