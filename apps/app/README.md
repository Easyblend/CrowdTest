# CrowdTest 🚀

> **Launch better products with real testers**

CrowdTest is a community-driven bug testing platform that connects developers with real testers to catch bugs before launch. Get pre-launch feedback from passionate testers and ensure your application is production-ready.

**Website:** [crowdtest.dev](https://crowdtest.dev)

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
  - [Running Locally](#running-locally)
- [Project Structure](#project-structure)
- [Core Features](#core-features)
- [Database](#database)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [Deployment](#deployment)

---

## ✨ Features

- **Project Management**: Developers can create projects and submit them for testing
- **Bug Reporting**: Real testers report bugs with detailed descriptions and screenshots
- **Waitlist Management**: Email verification and confirmation workflow
- **User Roles**: Support for Developer, Tester, and Admin roles
- **Cloudinary Integration**: Screenshot uploads and management
- **Email Notifications**: Confirmation emails via Brevo SMTP
- **Dark Mode**: Responsive UI with theme toggle
- **JWT Authentication**: Secure user authentication and session management

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **React Hook Form** - Form state management
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icon library

### Backend
- **Next.js API Routes** - Serverless functions
- **Node.js** - Runtime

### Database
- **PostgreSQL** - Relational database
- **Prisma ORM** - Database toolkit and query builder

### External Services
- **Cloudinary** - Image hosting and management
- **Brevo (Sendinblue)** - Email delivery

### Development & Deployment
- **ESLint** - Code linting
- **Vercel** - Hosting and deployment

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and **npm** (or yarn, pnpm, bun)
- **PostgreSQL** database (local or cloud)
- Environment variables configured (see Environment Setup)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Easyblend/CrowdTest.git
cd CrowdTest
```

2. Install dependencies:
```bash
npm install
```

### Environment Setup

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/crowdtest

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Brevo)
BREVO_SMTP_USER=your_brevo_email
BREVO_SMTP_PASS=your_brevo_password

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Database Setup

1. Run migrations:
```bash
npx prisma migrate dev
```

2. (Optional) Open Prisma Studio to view data:
```bash
npx prisma studio
```

### Running Locally

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/              # Authentication endpoints
│   │   ├── admin/             # Admin operations
│   │   ├── projects/          # Project management
│   │   ├── bugs/              # Bug reporting
│   │   ├── me/                # User profile
│   │   └── waitlist/          # Waitlist management
│   ├── component/             # Reusable components
│   ├── dashboard/             # Dashboard pages
│   ├── login/                 # Login page
│   ├── signup/                # Signup page
│   ├── waitlist/              # Waitlist pages
│   ├── lib/                   # Utilities
│   └── globals.css            # Global styles
├── context/                   # React Context providers
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
└── public/                    # Static assets
```

---

## 🎯 Core Features

### For Developers
- Create and manage projects
- Submit projects for beta testing
- Track bug reports with detailed information
- Download or view test reports

### For Testers
- Join the waitlist for early access
- Browse available projects to test
- Report bugs with screenshots
- Contribute to product quality

### For Admins
- Manage users and roles
- Monitor platform activity
- Update token management

---

## 🗄️ Database

The project uses **PostgreSQL** with **Prisma ORM**. Key models:

- **User**: Dev, Tester, and Admin accounts
- **Project**: Projects submitted for testing
- **Bug**: Bug reports with severity levels
- **Screenshot**: Image uploads for bug reports
- **Waitlist**: Email verification flow

---

## 🔐 Authentication

- JWT-based authentication
- Email/password sign-up and login
- Secure password hashing with bcrypt
- Confirmation email workflow for waitlist

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Projects
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `GET /api/projects/[id]` - Get project details
- `GET /api/projects/[id]/bugs` - Get project bugs

### Bugs
- `GET /api/bugs/[id]` - Get bug details
- `POST /api/projects/[id]/bugs` - Report bug

### Waitlist
- `POST /api/waitlist` - Join waitlist
- `GET /api/waitlist/confirm` - Confirm email

### User
- `GET /api/me` - Get current user profile

---

## 🚢 Deployment

### Deploy on Vercel

The easiest way to deploy CrowdTest is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

For more details, see [Next.js Deployment Docs](https://nextjs.org/docs/app/building-your-application/deploying).

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

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