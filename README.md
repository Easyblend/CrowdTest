# CrowdTest

> **Launch better products with real testers.**
> A community-driven, pre-launch bug-testing platform that connects developers with real human testers — built as a production-grade Next.js monorepo.

🌐 **Live:** [crowdtest.dev](https://crowdtest.dev)

---

## 📑 Table of Contents

- [Overview](#-overview)
- [What It Solves](#-what-it-solves)
- [Monorepo Layout](#-monorepo-layout)
- [High-Level Architecture](#-high-level-architecture)
- [End-to-End User Flow](#-end-to-end-user-flow)
- [Tech Stack](#-tech-stack)
- [Data Model (ERD)](#-data-model-erd)
- [Authentication & Authorization Flow](#-authentication--authorization-flow)
- [Bug Reporting Pipeline](#-bug-reporting-pipeline)
- [Scheduled Jobs (Cron Pipeline)](#-scheduled-jobs-cron-pipeline)
- [Audit Trail](#-audit-trail)
- [API Surface](#-api-surface)
- [Security & Reliability](#-security--reliability)
- [Local Development](#-local-development)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Roadmap](#-roadmap)

---

## 🚀 Overview

**CrowdTest** is a two-app product that lets developers ship more confidently:

1. **Marketing site (`apps/website`)** — public landing page, FAQs, feature highlights, waitlist signup.
2. **Application (`apps/app`)** — authenticated dashboard where developers create projects, share them with the tester community, receive bug reports with screenshots, triage them through a status workflow (`OPEN → IN_PROGRESS → RESOLVED → CLOSED`), and get email reminders for unresolved or stale bugs.

It is built on **Next.js 16 (App Router) + React 19 + TypeScript + Tailwind 4 + Prisma + PostgreSQL + Supabase Auth**, deployed on **Vercel** with serverless functions and scheduled cron jobs.

---

## 💡 What It Solves

| Problem | CrowdTest Approach |
|---|---|
| Pre-launch products ship with bugs no internal QA catches | Crowdsource testing from a real tester community |
| Bug reports get lost in chat apps and emails | Structured bug records with severity, status, screenshots, and project scoping |
| Devs forget to resolve stale issues | Weekly cron-driven reminder emails for `OPEN` and `RESOLVED` bugs |
| No visibility into who did what | Append-only `AuditLog` capturing actor, owner, project, action, IP, user-agent, metadata |
| Auth is hard to do correctly | Supabase Auth + middleware-guarded routes + JWT-aware API helpers |

---

## 🗂 Monorepo Layout

```
CrowdTest/
├── apps/
│   ├── website/          # Public marketing site (Next.js 16)
│   │   ├── app/          # App Router pages (landing, FAQ, sitemap, robots)
│   │   ├── component/    # Navbar, FAQ, marquee, theme toggle
│   │   └── data/         # Static content (FAQs, features, marquee)
│   │
│   └── app/              # Authenticated product (Next.js 16)
│       ├── app/
│       │   ├── api/      # Serverless API routes
│       │   │   ├── auth/callback/        # Supabase OAuth callback
│       │   │   ├── projects/[id]/bugs/   # Bug CRUD per project
│       │   │   ├── bugs/[id]/            # Bug detail / update / delete
│       │   │   ├── me/                   # Current user profile
│       │   │   ├── audit/                # Admin audit trail
│       │   │   └── cron/resolved-reminders/  # Vercel Cron entrypoint
│       │   ├── admin/                    # Admin dashboard
│       │   ├── dashboard/                # Developer dashboard + project pages
│       │   ├── component/                # BugCard, BugDetailModal, Sidebar, etc.
│       │   ├── lib/                      # prisma, supabase, auth, audit, cloudinary, email
│       │   ├── login / signup / waitlist / reset-password / forgot-password
│       │   └── error/                    # Error boundaries
│       ├── prisma/schema.prisma          # DB schema
│       ├── middleware.ts                 # Auth-gated routing
│       └── vercel.json                   # Cron schedule
```

---

## 🏗 High-Level Architecture

```mermaid
flowchart LR
  subgraph Client["🌐 Clients"]
    U1[Developer Browser]
    U2[Tester Browser]
    U3[Admin Browser]
  end

  subgraph Vercel["▲ Vercel Edge / Serverless"]
    W[apps/website<br/>Marketing Site]
    A[apps/app<br/>Next.js App Router]
    MW[middleware.ts<br/>Supabase session guard]
    API[/API Routes<br/>/api/*/]
    CRON[/Vercel Cron<br/>Weekly Thu 09:00 UTC/]
  end

  subgraph Data["🗄 Data & Services"]
    PG[(PostgreSQL<br/>via Prisma)]
    SUPA[Supabase Auth]
    CLD[Cloudinary<br/>Screenshots]
    BRV[Brevo SMTP<br/>Transactional Email]
  end

  U1 & U2 & U3 --> W
  U1 & U2 & U3 --> A
  A --> MW --> API
  CRON --> API
  API --> PG
  API --> SUPA
  API --> CLD
  API --> BRV
  MW --> SUPA
```

---

## 🔁 End-to-End User Flow

```mermaid
sequenceDiagram
  autonumber
  actor Dev as Developer
  actor Tester
  participant Web as Marketing Site
  participant App as CrowdTest App
  participant Supa as Supabase Auth
  participant DB as PostgreSQL
  participant Cld as Cloudinary
  participant Mail as Brevo SMTP

  Dev->>Web: Visits landing page, joins waitlist
  Web->>DB: Insert Waitlist(email, token)
  Web->>Mail: Send confirmation email
  Dev->>App: Sign up / log in
  App->>Supa: Authenticate (OAuth / email)
  Supa-->>App: Session cookie
  Dev->>App: Create Project (name, url, description)
  App->>DB: Insert Project (slug auto-generated)
  Tester->>App: Browse project, open Bug Report modal
  Tester->>Cld: Upload screenshots
  Cld-->>Tester: Secure URLs + public_ids
  Tester->>App: POST /api/projects/:id/bugs
  App->>DB: Insert Bug + Screenshots
  App->>DB: Insert AuditLog (action: BUG_CREATED)
  Dev->>App: Triage in dashboard (OPEN→IN_PROGRESS→RESOLVED)
  App->>DB: Update Bug.status + AuditLog
  Note over Mail,DB: Every Thursday 09:00 UTC
  Mail-->>Dev: Weekly digest of OPEN/RESOLVED bugs
```

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, RSC), React 19 |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS 4, dark-mode via React Context |
| **Forms** | React Hook Form |
| **Notifications** | React Hot Toast |
| **Icons** | Lucide React |
| **ORM** | Prisma 7 (`@prisma/client` + `@prisma/adapter-pg`) |
| **Database** | PostgreSQL |
| **Auth** | Supabase Auth (`@supabase/ssr`) + JWT (`jose`, `jsonwebtoken`) + bcrypt |
| **Media** | Cloudinary |
| **Email** | Nodemailer over Brevo (Sendinblue) SMTP |
| **Scheduling** | Vercel Cron (`vercel.json`) |
| **Hosting** | Vercel (serverless functions + edge middleware) |
| **Tooling** | ESLint 9, `eslint-config-next`, Prisma Migrate |

---

## 🧬 Data Model (ERD)

```mermaid
erDiagram
  USER ||--o{ PROJECT : owns
  USER ||--o{ BUG : reports
  PROJECT ||--o{ BUG : has
  BUG ||--o{ SCREENSHOT : contains

  USER {
    string id PK
    string auth_id UK
    string name
    string email UK
    Role   role
    string avatar_url
  }

  PROJECT {
    string id PK
    string name
    string url
    string slug UK
    string description
    string createdBy FK
    datetime createdAt
  }

  BUG {
    string id PK
    string title
    string description
    string severity
    BugStatus status
    boolean resolved
    string projectId FK
    string createdBy FK
    datetime createdAt
  }

  SCREENSHOT {
    string id PK
    string url
    string public_id
    string bugId FK
  }

  WAITLIST {
    string id PK
    string email UK
    boolean confirmed
    string confirmationToken
    datetime createdAt
  }

  AUDITLOG {
    string id PK
    string action
    string entityType
    string entityId
    string actorId
    string ownerId
    string projectId
    json   actorSnapshot
    json   ownerSnapshot
    json   metadata
    string ipAddress
    string userAgent
    datetime createdAt
  }
```

**Enums**

- `Role`: `DEV | TESTER | ADMIN`
- `BugStatus`: `OPEN | IN_PROGRESS | RESOLVED | CLOSED`

Indexes on `AuditLog` for `entityType+entityId`, `actorId`, `ownerId`, `projectId`, and `action` keep audit queries fast.

---

## 🔐 Authentication & Authorization Flow

```mermaid
flowchart TD
  R[Incoming Request] --> M{middleware.ts}
  M -->|/dashboard, /admin| C[Check Supabase session]
  C -->|No user| L[Redirect → /login]
  C -->|User present| N[Next.js handler]
  M -->|/login, /signup with active user| D[Redirect → /dashboard]
  N --> API[/API route/]
  API --> H{getUserFromCookies / getUserFromRequest}
  H -->|JWT valid| OK[Authorized handler]
  H -->|Invalid / missing| E[401 / 403]
```

- **Edge middleware** ([apps/app/middleware.ts](apps/app/middleware.ts)) guards `/dashboard/*` and `/admin/*` and prevents authenticated users from re-visiting `/login` or `/signup`.
- **`lib/auth.ts`** exposes two helpers:
  - `getUserFromCookies()` — for RSC and server actions, reads HTTP-only `token` cookie.
  - `getUserFromRequest(req)` — for API routes / external clients, supports `Authorization: Bearer <jwt>`.
- **Supabase** is the source of truth for identity; the Prisma `User.auth_id` mirrors the Supabase user id.

---

## 🐞 Bug Reporting Pipeline

```mermaid
flowchart LR
  T[Tester opens Project] --> M[BugReportModal]
  M --> U[Upload screenshots → Cloudinary]
  U --> P[POST /api/projects/:id/bugs]
  P --> V[Validate + auth check]
  V --> DB[(Insert Bug + Screenshots)]
  DB --> AU[logAudit BUG_CREATED]
  DB --> EM[Notify project owner]
  EM --> Done[✅ Bug visible in dashboard]
```

Triage continues with `PATCH /api/bugs/[id]` to move status, and every mutation writes an `AuditLog` row.

---

## ⏰ Scheduled Jobs (Cron Pipeline)

Configured in [apps/app/vercel.json](apps/app/vercel.json):

```json
{
  "crons": [
    { "path": "/api/cron/resolved-reminders", "schedule": "0 9 * * 4" }
  ]
}
```

- Runs **every Thursday at 09:00 UTC**.
- Endpoint is protected by `Authorization: Bearer ${CRON_SECRET}`.
- Pulls all `OPEN` and `RESOLVED` bugs, groups them by **project owner**, and sends each owner a digest via `sendBugReminderEmail` (Brevo SMTP).
- Logs the run to `AuditLog` for traceability.

```mermaid
sequenceDiagram
  participant V as Vercel Cron
  participant API as /api/cron/resolved-reminders
  participant DB as PostgreSQL
  participant Mail as Brevo SMTP
  V->>API: GET (Bearer CRON_SECRET)
  API->>API: Verify secret
  API->>DB: prisma.bug.findMany({status: [OPEN,RESOLVED]})
  API->>API: Group by owner + project
  loop per owner
    API->>Mail: sendBugReminderEmail(owner, bugs)
  end
  API->>DB: AuditLog (CRON_RUN)
```

---

## 🧾 Audit Trail

Every privileged action (create / update / delete project, bug status change, cron run, admin views) calls `logAudit(...)` ([apps/app/app/lib/audit.ts](apps/app/app/lib/audit.ts)) which inserts a row capturing:

- **Who** — `actorId`, `actorSnapshot` (denormalized copy at the time)
- **For whom** — `ownerId`, `ownerSnapshot`
- **What** — `action`, `entityType`, `entityId`, `metadata`
- **From where** — `ipAddress`, `userAgent`
- **When** — `createdAt`

The `/admin` dashboard renders this trail via `/api/audit`, giving operators a forensic timeline.

---

## 🔌 API Surface

| Method | Path | Purpose |
|---|---|---|
| `GET` / `POST` | `/api/projects` | List / create projects |
| `GET` / `PATCH` / `DELETE` | `/api/projects/[id]` | Project detail & mutations |
| `GET` / `POST` | `/api/projects/[id]/bugs` | List / report bugs on a project |
| `GET` / `PATCH` / `DELETE` | `/api/bugs/[id]` | Bug detail, status updates, removal |
| `GET` | `/api/me` | Current authenticated user profile |
| `GET` | `/api/audit` | Admin audit trail |
| `GET` | `/api/auth/callback` | Supabase OAuth callback |
| `GET` | `/api/cron/resolved-reminders` | Vercel Cron — weekly reminders |

---

## 🛡 Security & Reliability

- **HTTP-only JWT cookies** for session tokens; verified with `jsonwebtoken` / `jose`.
- **bcrypt** for any password hashing paths.
- **Edge middleware** enforces auth before route handlers execute.
- **Cron route is secret-gated** via `CRON_SECRET` to prevent unauthorized triggering.
- **Cascade deletes** on `Project → Bug → Screenshot` keep referential integrity.
- **Cloudinary `public_id` stored** so screenshots can be revoked/cleaned up server-side.
- **Append-only audit log** with indexed lookups for compliance and debugging.
- **Type-safe ORM**: all DB access goes through Prisma with the `@prisma/adapter-pg` driver.
- **Strict TS + ESLint** across both apps.
- **Vercel** provides zero-config TLS, automatic preview deployments per PR, and isolated serverless execution.

---

## 🧑‍💻 Local Development

### Prerequisites

- Node.js **18+**
- A PostgreSQL database (local or hosted — Neon, Supabase, RDS, etc.)
- Accounts for **Supabase**, **Cloudinary**, and **Brevo**

### Install

```bash
git clone https://github.com/Easyblend/CrowdTest.git
cd CrowdTest

# App
cd apps/app
npm install

# Website (separate workspace)
cd ../website
npm install
```

### Database

```bash
cd apps/app
npx prisma migrate dev      # apply migrations + generate client
npx prisma studio           # optional GUI
```

### Run

```bash
# in apps/app
npm run dev                 # http://localhost:3000  (product)

# in apps/website (separate port)
npm run dev
```

---

## 🔑 Environment Variables

Create `apps/app/.env.local`:

```env
# PostgreSQL
DATABASE_URL=postgresql://user:password@host:5432/crowdtest

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# JWT
JWT_SECRET=replace-with-strong-random-string

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Brevo (Sendinblue) SMTP
BREVO_SMTP_USER=...
BREVO_SMTP_PASS=...

# Cron protection
CRON_SECRET=replace-with-strong-random-string

# Public
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 🚢 Deployment

- **Platform:** Vercel (two projects — one per app under `apps/`).
- **Build:** `next build`; Prisma client is generated via the `postinstall` hook.
- **Migrations:** run `prisma migrate deploy` against the production DB before promoting a build.
- **Cron:** defined in [apps/app/vercel.json](apps/app/vercel.json) and provisioned automatically by Vercel.
- **Previews:** every PR gets an isolated preview URL with its own environment.

---

## 🗺 Roadmap

- Tester reputation & gamified leaderboards
- Slack / Discord webhook notifications
- Bug deduplication suggestions (LLM-assisted)
- Project-level invite tokens for private testing
- Public REST/GraphQL API for CI integrations

---

## 📜 License

Proprietary — © CrowdTest. All rights reserved.
