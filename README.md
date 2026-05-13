<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=EB4C4C&height=200&section=header&text=HireIQ%20BD&fontSize=70&fontAlignY=38&fontColor=ffffff&desc=AI-Powered%20Job%20Board%20Platform%20for%20Bangladesh&descAlignY=58&descSize=20&animation=fadeIn" width="100%" />

<br/>

<!-- Replace the image below with an actual screenshot of your app -->
<img src="https://i.ibb.co.com/9HpRKwpX/1.png" alt="HireIQ BD Landing Page" width="90%" style="border-radius:12px; margin: 20px 0;" />

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://typescriptlang.org)
[![Express](https://img.shields.io/badge/Express-4-000000?style=for-the-badge&logo=express)](https://expressjs.com)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=for-the-badge&logo=prisma)](https://prisma.io)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://mongodb.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)

<br/>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/engsiam/HireIQ-BD/pulls)
[![GitHub Stars](https://img.shields.io/github/stars/engsiam/HireIQ-BD?style=flat-square&color=EB4C4C)](https://github.com/engsiam/HireIQ-BD/stargazers)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Live Demo](#-live-demo)
- [Screenshots](#-screenshots)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 Overview

**HireIQ BD** is a full-stack, AI-powered job board platform built specifically for the Bangladesh job market. It connects job seekers with employers through a seamless, intelligent hiring experience — featuring AI-driven CV analysis, smart job matching, multi-role dashboards, and real-time application tracking.

> Built with a premium dark/light UI, role-based access control, Google OAuth, Cloudinary image uploads, and a Gemini AI integration.

---

## 🌐 Live Demo

| Service | URL |
|---|---|
| 🖥️ Frontend | `https://hire-iq-bd.vercel.app` |
| ⚙️ Backend API | `https://hireiq-bd.onrender.com` |
| 📚 API Docs | `https://hireiq-bd.onrender.com/api-docs` |

---

## 📸 Screenshots

<div align="center">

### 🛠️ Admin Dashboard
<img src="https://i.ibb.co.com/Y7sLZNpX/dashbaord-admin.png" alt="Admin Dashboard" width="90%" style="border-radius:10px; margin-bottom:16px" />

### 👤 Job Seeker Dashboard
<img src="https://i.ibb.co.com/MDPGFKqk/jppbseker.png" alt="Job Seeker Dashboard" width="90%" style="border-radius:10px; margin-bottom:16px" />

### 👤 Employee Dashboard
<img src="https://i.ibb.co.com/kgWvDw1y/employee.png" alt="Employee Dashboard" width="90%" style="border-radius:10px; margin-bottom:16px" />

### ☀️ Light Mode
<img src="https://i.ibb.co.com/kgdVfJ8L/light-mood.png" alt="Light Mode" width="90%" style="border-radius:10px; margin-bottom:16px" />

</div>

> **📌 Note:** Replace the placeholder images above with actual screenshots of your app. Use tools like [Screely](https://screely.com) or browser dev tools to capture high-quality screenshots.

---

## ✨ Features

### 🤖 AI-Powered
- **CV Analyzer** — Upload your CV and get instant AI feedback powered by Google Gemini
- **AI Interview Prep** — Practice mock interviews with AI-generated role-specific questions
- **Smart Job Matching** — AI-suggested jobs based on your profile and skills

### 👥 Multi-Role System
| Role | Capabilities |
|---|---|
| **Admin** | Full platform control — manage users, jobs, applications, blogs, analytics |
| **Employer** | Post jobs, view applicants, shortlist & hire candidates, manage company profile |
| **Job Seeker** | Browse & apply to jobs, track applications, save jobs, AI tools |

### 🔐 Authentication
- Email/Password registration & login with JWT
- **Google OAuth 2.0** single sign-on
- Secure httpOnly cookie sessions with refresh token rotation
- Role-based route protection

### 📊 Dashboards
- Real-time overview stats per role
- Application status tracking (Pending → Shortlisted → Interview → Hired/Rejected)
- **Dark Mode** and **Light Mode** with persistent theme preference
- Responsive sidebar navigation

### 🖼️ Media & Uploads
- Profile image uploads via **Cloudinary**
- Company logo management
- CV/resume file handling

### 📝 Content & Communication
- Full blog management system (Admin)
- Contact message inbox
- Employer reviews & ratings

### ⚡ Performance
- Next.js 16 App Router with server components
- Lenis smooth scrolling
- Framer Motion & GSAP animations
- Recharts data visualization

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| Next.js | 16.2 | React framework with App Router |
| TypeScript | 5 | Type safety |
| Tailwind CSS | 4 | Utility-first styling |
| shadcn/ui | 4.6 | Component library |
| Framer Motion | 12 | Animations |
| GSAP | 3.15 | Advanced animations |
| Lenis | 1.3 | Smooth scrolling |
| Zustand | 5 | Global state management |
| React Hook Form + Zod | — | Form validation |
| Recharts | 3.8 | Data visualization |
| Axios | 1.15 | HTTP client |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Express.js | 4.18 | REST API server |
| TypeScript | 5.3 | Type safety |
| Prisma ORM | 5.10 | Database abstraction |
| MongoDB Atlas | — | Primary database |
| JSON Web Token | 9 | Authentication |
| Bcrypt | 5 | Password hashing |
| Cloudinary | 1.21 | Image/file storage |
| Google Gemini AI | 0.3 | AI features |
| Multer | 1.4 | File upload middleware |
| Zod | 3.22 | Request validation |
| Swagger | 6.2 | API documentation |
| Helmet | 7 | Security headers |

---

## 📁 Project Structure

```
HireIQ-BD/
├── client/                          # Next.js 16 Frontend
│   └── src/
│       ├── app/
│       │   ├── (auth)/              # Login, Register pages
│       │   ├── (public)/            # Landing, Jobs, Blog pages
│       │   ├── dashboard/
│       │   │   ├── admin/           # Admin dashboard & sub-pages
│       │   │   ├── employer/        # Employer dashboard & sub-pages
│       │   │   └── jobseeker/       # Job seeker dashboard & sub-pages
│       │   └── globals.css          # Global styles & theme tokens
│       ├── components/
│       │   ├── shared/              # Navbar, Sidebar, Header, Footer
│       │   ├── dashboard/           # Dashboard-specific components
│       │   ├── home/                # Landing page sections
│       │   ├── jobs/                # Job listing components
│       │   └── ui/                  # shadcn/ui primitives
│       ├── store/                   # Zustand stores (auth, dashboard)
│       └── lib/                     # Axios instance, utilities
│
└── server/                          # Express.js Backend
    └── src/
        ├── app/
        │   ├── modules/
        │   │   ├── auth/            # Login, Register, OAuth
        │   │   ├── user/            # User profile, session
        │   │   ├── job/             # Job CRUD
        │   │   ├── application/     # Apply, track, status
        │   │   ├── ai/              # Gemini AI integration
        │   │   ├── blog/            # Blog management
        │   │   ├── review/          # Company reviews
        │   │   └── contact/         # Contact messages
        │   ├── middlewares/         # Auth, error, upload
        │   └── routes/              # Route registry
        ├── config/                  # Cloudinary, DB config
        ├── lib/                     # Prisma client
        └── prisma/
            ├── schema.prisma        # Database schema
            └── seed.ts              # Database seeder
```

---

## ⚙️ Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **pnpm** >= 8.x (or npm/yarn)
- **MongoDB Atlas** account
- **Cloudinary** account
- **Google Cloud** OAuth credentials
- **Google Gemini** API key

---

### 1. Clone the Repository

```bash
git clone https://github.com/engsiam/HireIQ-BD.git
cd HireIQ-BD
```

---

### 2. Setup the Backend (Server)

```bash
cd server

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# → Edit .env with your actual credentials

# Generate Prisma client
npm run prisma:generate

# Push schema to MongoDB
npm run prisma:push

# (Optional) Seed the database
npm run seed

# Start development server
npm run dev
```

The API will be available at `http://localhost:5000`  
Swagger docs at `http://localhost:5000/api-docs`

---

### 3. Setup the Frontend (Client)

```bash
cd client

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local
# → Set NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Start development server
pnpm dev
```

The frontend will be available at `http://localhost:3000`

---

## 🔐 Environment Variables

### Server (`server/.env`)

```env
NODE_ENV=development
PORT=5000

# MongoDB Atlas
DATABASE_URL=mongodb+srv://<user>:<password>@cluster.mongodb.net/hireiq_bd

# JWT
JWT_SECRET=your_jwt_secret_min_32_chars
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_secret_min_32_chars
JWT_REFRESH_EXPIRES_IN=30d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Groq AI (CV analyzer, job match, interview coach)
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# CORS
CLIENT_URL=http://localhost:3000
```

### Client (`client/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## 📡 API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user | ❌ |
| `POST` | `/api/auth/login` | Login with credentials | ❌ |
| `POST` | `/api/auth/logout` | Logout & clear session | ✅ |
| `GET` | `/api/users/session` | Get current session | ✅ |
| `GET` | `/api/jobs` | List all jobs (paginated) | ❌ |
| `POST` | `/api/jobs` | Create new job listing | ✅ Employer |
| `GET` | `/api/jobs/:id` | Get job details | ❌ |
| `PUT` | `/api/jobs/:id` | Update job listing | ✅ Employer |
| `DELETE` | `/api/jobs/:id` | Delete job listing | ✅ Admin |
| `POST` | `/api/applications` | Submit job application | ✅ Jobseeker |
| `GET` | `/api/applications` | Get applications list | ✅ |
| `PATCH` | `/api/applications/:id/status` | Update status | ✅ Employer |
| `GET` | `/api/stats/overview` | Platform stats | ✅ Admin |
| `GET` | `/api/stats/employer` | Employer stats | ✅ Employer |
| `GET` | `/api/stats/jobseeker` | Jobseeker stats | ✅ Jobseeker |
| `POST` | `/api/ai/analyze-cv` | AI CV analysis | ✅ |
| `POST` | `/api/blogs` | Create blog post | ✅ Admin |
| `GET` | `/api/blogs` | List published blogs | ❌ |

> 📚 Full interactive API docs available at `/api-docs` (Swagger UI)

---

## 🗺️ Roadmap

- [x] Authentication (JWT + Google OAuth)
- [x] Multi-role dashboard (Admin / Employer / Jobseeker)
- [x] Job posting & application system
- [x] AI CV analyzer (Gemini)
- [x] Cloudinary image uploads
- [x] Dark/Light mode theming
- [x] Blog management system
- [ ] Real-time notifications (Socket.io)
- [ ] Resume builder
- [ ] Email notifications (Resend/Nodemailer)
- [ ] Advanced job filters & full-text search
- [ ] Company pages & branding
- [ ] Mobile app (React Native)
- [ ] Payment integration (bKash/Stripe)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a **Pull Request**

Please make sure to:
- Follow the existing code style (TypeScript strict, no `any`)
- Write meaningful commit messages (conventional commits preferred)
- Update docs/README if needed

---

## 👨‍💻 Author

<div align="center">

**Siam** — [@engsiam](https://github.com/engsiam)

<br/>

*Built with ❤️ for the Bangladesh developer & job market community*

</div>

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=EB4C4C&height=120&section=footer&animation=fadeIn" width="100%" />

**⭐ If you found this project helpful, please give it a star!**

</div>
