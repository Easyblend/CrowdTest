# CrowdTest

CrowdTest helps teams collect bug reports and review automated checks for their projects.

Website: [crowdtest.dev](https://crowdtest.dev)

## How It Works

```mermaid
flowchart TB
  User[User] --> App

  subgraph CrowdTest
    App[Website and API]
    DB[(PostgreSQL)]
    App <-->|Projects, bugs, and scan records| DB
  end

  App -->|Scan request| Queue[RabbitMQ queue]

  subgraph ScanServices[Scan services]
    Queue --> Worker[External scan worker]
  end

  Worker -->|Scan results| App
  User -->|Sign in| Auth[Supabase Auth]
  Auth -->|Session| App
```

- Supabase handles sign-in and keeps the user's session.
- The app uses Prisma to read and write PostgreSQL data.
- Creating a project also creates a queued scan and sends a message to RabbitMQ.
- A separate scan worker reads the message and checks the project. The worker is not included in this repository.
- The worker sends its results to CrowdTest, where the app saves findings and sends a report email.
- Bug screenshots are stored in Cloudinary. Email is sent through Brevo SMTP.

## Main Parts

- `app/`: website pages and API routes
- `app/api/`: server-side requests for projects, bugs, scans, and account data
- `app/lib/`: shared code for the database, sign-in, email, images, and RabbitMQ
- `prisma/schema.prisma`: database tables and relationships
- `prisma/migrations/`: database change history
- `public/`: static files such as images

## Run Locally

### Requirements

- Node.js 20.9 or newer
- npm
- A PostgreSQL database
- A Supabase project for sign-in

RabbitMQ, Cloudinary, email, and AI services are needed only for the features that use them.

### Setup

1. Install packages:

   ```bash
   npm install
   ```

2. Create `.env.local` in this folder. Add the values for the services you use:

   ```env
   DATABASE_LIVE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

   # Needed to queue automated scans
   RABBITMQ_URL=amqps://USER:PASSWORD@HOST/VHOST
   SCANNER_INTERNAL_SECRET=replace-with-a-long-random-secret

   # Needed for project and scan emails
   BREVO_SMTP_USER=YOUR_SMTP_USER
   BREVO_SMTP_PASS=YOUR_SMTP_PASSWORD
   EMAIL_SENDER=YOUR_VERIFIED_SENDER_EMAIL
   SITE_URL=http://localhost:3000
   NEXT_PUBLIC_SITE_URL=http://localhost:3000

   # Needed for bug screenshot uploads
   CLOUDINARY_CLOUD_NAME=YOUR_CLOUD_NAME
   CLOUDINARY_API_KEY=YOUR_API_KEY
   CLOUDINARY_API_SECRET=YOUR_API_SECRET

   # Optional: AI-assisted text improvements
   GROQ_API_KEY=YOUR_GROQ_API_KEY
   ```

   Keep real credentials out of source control. `DATABASE_LIVE_URL` must be a PostgreSQL connection string. The app adds `pgbouncer=true` when it connects.

3. Apply database migrations:

   ```bash
   npx prisma migrate dev
   ```

4. Start the website:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

To open a database browser, run `npx prisma studio`.

## Sign-In

Supabase Auth handles email/password and Google sign-in. After sign-in, CrowdTest matches the Supabase account to a `User` row in PostgreSQL. Dashboard and admin pages require a signed-in user. Set up any sign-in providers you plan to use in the Supabase project.

## API Routes

Routes that change or show a user's data require a valid Supabase session, unless noted otherwise.

| Route | What it does |
| --- | --- |
| `GET /api/projects` | List the signed-in user's projects |
| `POST /api/projects` | Create a project and queue an automated scan |
| `GET /api/projects/[id]` | Get a project |
| `POST /api/projects/[id]/bugs` | Submit a bug report; accepts form data and an optional screenshot |
| `GET /api/bugs/[id]` | Get a bug report |
| `GET /api/me` | Get the signed-in user's account |
| `GET /api/audit` | Read audit events |
| `POST /api/ai/improve-bug` | Improve bug report text with AI |
| `POST /api/ai/improve-project` | Improve project text with AI |
| `GET /api/auth/callback` | Finish Supabase sign-in |
| `POST /api/internal/scans/result` | Receive scan results; requires the scanner secret |
| `GET /api/cron/resolved-reminders` | Send reminders for resolved bugs; requires the cron secret |
| `GET /api/cron/project-inactivity-warning` | Send project inactivity emails; requires the cron secret |

## Request Examples

### Create a project

Send JSON to `POST /api/projects` with a signed-in session:

```json
{
  "name": "Shop Demo",
  "url": "https://shop.example.com",
  "description": "A demo online shop"
}
```

The app creates the project and a scan record. It then sends this message to the RabbitMQ queue named `scan-requests`:

```json
{
  "eventId": "a-generated-uuid",
  "scanId": "scan-id-from-the-database",
  "projectId": "project-id-from-the-database",
  "url": "https://shop.example.com",
  "requestedAt": "2026-10-31T12:00:00.000Z"
}
```

### Send scan results

The scan worker posts to `POST /api/internal/scans/result` with this header:

```text
Authorization: Bearer YOUR_SCANNER_INTERNAL_SECRET
```

Successful scan body:

```json
{
  "success": true,
  "scanId": "scan-id-from-the-queue-message",
  "projectId": "project-id-from-the-queue-message",
  "startedAt": "2026-10-31T12:01:00.000Z",
  "pagesScanned": 12,
  "findings": [
    {
      "category": "broken-link",
      "severity": "medium",
      "confidence": "high",
      "url": "https://shop.example.com/cart",
      "description": "The checkout link returned an error.",
      "request": "GET /cart",
      "statusCode": 404
    }
  ]
}
```

Each finding needs `category`, `severity`, `confidence`, `url`, and `description`. `request`, `statusCode`, `error`, and `stack` are optional. The app looks up the project owner itself; the worker does not need to send an email address or project name.

For a failed scan, send `success: false`, the `scanId`, the `projectId`, and an `error` message. The app marks that scan as failed.

## Database Records

The main records are users, projects, bug reports, screenshots, scans, scan findings, and audit events. The database also has waitlist records, but there is no waitlist API route in this app.

## Checks and Deployment

Run the code checks with:

```bash
npm run lint
npm run build
```

The app can be deployed to Vercel or another host that supports Next.js. Add the required environment variables to the host. Automated scans also need a reachable RabbitMQ service and a separate worker configured to read `scan-requests` and call the scan results route. Vercel cron runs the reminder routes on the schedule in `vercel.json`.

---

## 📄 License

This project is private and proprietary.

---

## 🙋 Support

For support, questions, or feedback, visit [crowdtest.dev](https://crowdtest.dev) or join our waitlist to stay updated!


### Migrate DB flow
- npx prisma migrate dev --name add_automated_findings
- npx prisma generate   
- npx prisma migrate deploy 