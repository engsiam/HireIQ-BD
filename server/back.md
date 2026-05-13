\# 🔧 HireIQ BD — Backend Agent Instruction (Complete)



> \*\*Agent Directive:\*\* You are the backend agent. Read this file fully before writing any code. Build a production-ready Express.js + TypeScript backend. Every file must be complete — no placeholders, no truncation, no `// TODO` comments. Execute phases sequentially.



\---



\## 📁 Project Structure



```

hireiq-backend/

├── prisma/

│   └── schema.prisma

├── src/

│   ├── app.ts

│   ├── server.ts

│   ├── config/

│   │   └── index.ts

│   └── app/

│       ├── middlewares/

│       │   ├── auth.middleware.ts

│       │   ├── validate.middleware.ts

│       │   └── error.middleware.ts

│       ├── routes/

│       │   └── index.ts

│       ├── utils/

│       │   ├── ApiError.ts

│       │   ├── catchAsync.ts

│       │   ├── sendResponse.ts

│       │   └── cloudinary.ts

│       └── modules/

│           ├── auth/

│           │   ├── auth.route.ts

│           │   ├── auth.controller.ts

│           │   ├── auth.service.ts

│           │   └── auth.validation.ts

│           ├── user/

│           │   ├── user.route.ts

│           │   ├── user.controller.ts

│           │   ├── user.service.ts

│           │   └── user.validation.ts

│           ├── job/

│           │   ├── job.route.ts

│           │   ├── job.controller.ts

│           │   ├── job.service.ts

│           │   └── job.validation.ts

│           ├── application/

│           │   ├── application.route.ts

│           │   ├── application.controller.ts

│           │   └── application.service.ts

│           ├── review/

│           │   ├── review.route.ts

│           │   ├── review.controller.ts

│           │   └── review.service.ts

│           ├── blog/

│           │   ├── blog.route.ts

│           │   ├── blog.controller.ts

│           │   └── blog.service.ts

│           ├── contact/

│           │   ├── contact.route.ts

│           │   ├── contact.controller.ts

│           │   └── contact.service.ts

│           ├── stats/

│           │   ├── stats.route.ts

│           │   ├── stats.controller.ts

│           │   └── stats.service.ts

│           └── ai/

│               ├── ai.route.ts

│               ├── ai.controller.ts

│               └── ai.service.ts

├── prisma/

│   └── seed.ts

├── .env.example

├── package.json

└── tsconfig.json

```



\---



\## 🛠️ Tech Stack



\- \*\*Runtime:\*\* Node.js 20+

\- \*\*Framework:\*\* Express.js

\- \*\*Language:\*\* TypeScript (strict mode)

\- \*\*ORM:\*\* Prisma

\- \*\*Database:\*\* MongoDB (Atlas)

\- \*\*Auth:\*\* JWT (access token 7d + refresh token 30d)

\- \*\*Validation:\*\* Zod

\- \*\*File Upload:\*\* Multer + Cloudinary (CV PDF + profile images)

\- \*\*AI:\*\* Google Gemini API (`gemini-1.5-flash`)

\- \*\*Utilities:\*\* bcrypt (salt 12), cors, morgan, cookie-parser, helmet

\- \*\*Seed:\*\* faker.js (Bangladesh-specific data)



\---



\## 🗄️ Prisma Schema



```prisma

datasource db {

&#x20; provider = "mongodb"

&#x20; url      = env("DATABASE\_URL")

}



generator client {

&#x20; provider = "prisma-client-js"

}



enum Role {

&#x20; ADMIN

&#x20; EMPLOYER

&#x20; JOBSEEKER

}



enum JobStatus {

&#x20; OPEN

&#x20; CLOSED

&#x20; DRAFT

}



enum ApplicationStatus {

&#x20; PENDING

&#x20; SHORTLISTED

&#x20; REJECTED

&#x20; HIRED

}



enum JobType {

&#x20; FULL\_TIME

&#x20; PART\_TIME

&#x20; REMOTE

&#x20; CONTRACT

&#x20; INTERNSHIP

}



model User {

&#x20; id               String        @id @default(auto()) @map("\_id") @db.ObjectId

&#x20; name             String

&#x20; email            String        @unique

&#x20; password         String

&#x20; role             Role          @default(JOBSEEKER)

&#x20; avatar           String?

&#x20; phone            String?

&#x20; location         String?

&#x20; bio              String?

&#x20; skills           String\[]

&#x20; resumeUrl        String?

&#x20; isActive         Boolean       @default(true)

&#x20; googleId         String?       @unique

&#x20; jobs             Job\[]

&#x20; applications     Application\[]

&#x20; reviews          Review\[]

&#x20; savedJobs        String\[]

&#x20; createdAt        DateTime      @default(now())

&#x20; updatedAt        DateTime      @updatedAt

}



model Job {

&#x20; id               String        @id @default(auto()) @map("\_id") @db.ObjectId

&#x20; title            String

&#x20; description      String

&#x20; requirements     String\[]

&#x20; responsibilities String\[]

&#x20; skills           String\[]

&#x20; type             JobType

&#x20; category         String

&#x20; location         String

&#x20; district         String

&#x20; salary           String

&#x20; salaryMin        Float?

&#x20; salaryMax        Float?

&#x20; deadline         DateTime

&#x20; status           JobStatus     @default(OPEN)

&#x20; isFeatured       Boolean       @default(false)

&#x20; views            Int           @default(0)

&#x20; companyName      String

&#x20; companyLogo      String?

&#x20; companyWebsite   String?

&#x20; employerId       String        @db.ObjectId

&#x20; employer         User          @relation(fields: \[employerId], references: \[id])

&#x20; applications     Application\[]

&#x20; reviews          Review\[]

&#x20; aiTags           String\[]

&#x20; createdAt        DateTime      @default(now())

&#x20; updatedAt        DateTime      @updatedAt

}



model Application {

&#x20; id           String            @id @default(auto()) @map("\_id") @db.ObjectId

&#x20; jobId        String            @db.ObjectId

&#x20; job          Job               @relation(fields: \[jobId], references: \[id])

&#x20; userId       String            @db.ObjectId

&#x20; user         User              @relation(fields: \[userId], references: \[id])

&#x20; coverLetter  String

&#x20; resumeUrl    String

&#x20; status       ApplicationStatus @default(PENDING)

&#x20; aiScore      Float?

&#x20; aiFeedback   String?

&#x20; createdAt    DateTime          @default(now())

&#x20; updatedAt    DateTime          @updatedAt

}



model Review {

&#x20; id         String   @id @default(auto()) @map("\_id") @db.ObjectId

&#x20; userId     String   @db.ObjectId

&#x20; user       User     @relation(fields: \[userId], references: \[id])

&#x20; jobId      String   @db.ObjectId

&#x20; job        Job      @relation(fields: \[jobId], references: \[id])

&#x20; rating     Int

&#x20; comment    String

&#x20; createdAt  DateTime @default(now())

}



model Blog {

&#x20; id          String   @id @default(auto()) @map("\_id") @db.ObjectId

&#x20; title       String

&#x20; slug        String   @unique

&#x20; content     String

&#x20; coverImage  String

&#x20; category    String

&#x20; tags        String\[]

&#x20; authorId    String   @db.ObjectId

&#x20; isPublished Boolean  @default(false)

&#x20; createdAt   DateTime @default(now())

&#x20; updatedAt   DateTime @updatedAt

}



model Contact {

&#x20; id        String   @id @default(auto()) @map("\_id") @db.ObjectId

&#x20; name      String

&#x20; email     String

&#x20; subject   String

&#x20; message   String

&#x20; isRead    Boolean  @default(false)

&#x20; createdAt DateTime @default(now())

}

```



\---



\## 🔌 API Endpoints



| Method | Endpoint | Auth | Description |

|--------|----------|------|-------------|

| POST | `/api/v1/auth/register` | Public | Register |

| POST | `/api/v1/auth/login` | Public | Login |

| POST | `/api/v1/auth/google` | Public | Google OAuth |

| POST | `/api/v1/auth/refresh-token` | Public | Refresh JWT |

| GET | `/api/v1/users/me` | Any Auth | Own profile |

| PATCH | `/api/v1/users/me` | Any Auth | Update profile |

| POST | `/api/v1/users/upload-resume` | JOBSEEKER | Upload CV PDF |

| GET | `/api/v1/users` | ADMIN | All users |

| PATCH | `/api/v1/users/:id/status` | ADMIN | Toggle active |

| DELETE | `/api/v1/users/:id` | ADMIN | Delete user |

| GET | `/api/v1/jobs` | Public | List + filter |

| POST | `/api/v1/jobs` | EMPLOYER/ADMIN | Create job |

| GET | `/api/v1/jobs/:id` | Public | Job detail |

| PATCH | `/api/v1/jobs/:id` | EMPLOYER/ADMIN | Update job |

| DELETE | `/api/v1/jobs/:id` | EMPLOYER/ADMIN | Delete job |

| POST | `/api/v1/jobs/:id/view` | Public | Increment view |

| POST | `/api/v1/applications` | JOBSEEKER | Apply to job |

| GET | `/api/v1/applications/my` | JOBSEEKER | My applications |

| GET | `/api/v1/applications/job/:jobId` | EMPLOYER | Job applicants |

| PATCH | `/api/v1/applications/:id/status` | EMPLOYER | Update status |

| GET | `/api/v1/applications/all` | ADMIN | All applications |

| POST | `/api/v1/reviews` | JOBSEEKER | Write review |

| GET | `/api/v1/reviews/job/:id` | Public | Job reviews |

| GET | `/api/v1/blogs` | Public | Blog list |

| GET | `/api/v1/blogs/:slug` | Public | Single blog |

| POST | `/api/v1/blogs` | ADMIN | Create blog |

| PATCH | `/api/v1/blogs/:id` | ADMIN | Update blog |

| DELETE | `/api/v1/blogs/:id` | ADMIN | Delete blog |

| POST | `/api/v1/contact` | Public | Submit contact |

| GET | `/api/v1/contact` | ADMIN | View messages |

| PATCH | `/api/v1/contact/:id/read` | ADMIN | Mark read |

| GET | `/api/v1/stats/overview` | ADMIN | Dashboard stats |

| POST | `/api/v1/ai/cv-analyze` | JOBSEEKER | AI CV Analyzer |

| POST | `/api/v1/ai/job-match` | JOBSEEKER | AI Job Matcher |

| POST | `/api/v1/ai/interview-prep` | JOBSEEKER | AI Interview Coach |

| POST | `/api/v1/ai/chat` | Any Auth | AI Chat Assistant |



\---



\## ⚙️ Core Utilities



\### `ApiError.ts`

```ts

export class ApiError extends Error {

&#x20; statusCode: number;

&#x20; constructor(statusCode: number, message: string) {

&#x20;   super(message);

&#x20;   this.statusCode = statusCode;

&#x20;   Error.captureStackTrace(this, this.constructor);

&#x20; }

}

```



\### `catchAsync.ts`

```ts

import { Request, Response, NextFunction } from 'express';

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

export const catchAsync = (fn: AsyncHandler) => (req: Request, res: Response, next: NextFunction) =>

&#x20; Promise.resolve(fn(req, res, next)).catch(next);

```



\### `sendResponse.ts`

```ts

import { Response } from 'express';

type TResponse<T> = {

&#x20; statusCode: number;

&#x20; success: boolean;

&#x20; message: string;

&#x20; data?: T;

&#x20; meta?: { total: number; page: number; limit: number; totalPages: number };

};

export const sendResponse = <T>(res: Response, data: TResponse<T>) =>

&#x20; res.status(data.statusCode).json(data);

```



\---



\## 🔐 Auth \& Middleware



\### `auth.middleware.ts`

```ts

// authGuard(...roles) middleware:

// 1. Extract Bearer token from Authorization header

// 2. Verify with JWT\_SECRET

// 3. Find user in DB, check isActive

// 4. Check if user role is in allowed roles array

// 5. Attach user to req.user

// 6. Throw ApiError(401) if any step fails

```



\### `validate.middleware.ts`

```ts

// validateRequest(schema: ZodSchema):

// 1. Parse req.body against schema

// 2. If invalid, throw ApiError(400) with Zod error messages

// 3. If valid, attach parsed data to req.body and call next()

```



\### `error.middleware.ts`

```ts

// Global error handler catches:

// - ApiError → use statusCode + message

// - Prisma P2002 (unique) → 409 "Already exists"

// - Prisma P2025 (not found) → 404 "Not found"

// - JWT errors → 401

// - Zod errors → 400

// - All others → 500 "Internal server error"

// Always return { success: false, message, statusCode }

```



\---



\## 🤖 AI Module — 3 Features



\### Feature 1: AI CV Analyzer (`POST /api/v1/ai/cv-analyze`)



```ts

// Input: { cvText: string, jobTitle?: string }

// Process:

//   - Send CV text to Gemini with prompt:

//     "Analyze this CV for a {jobTitle} position in Bangladesh job market.

//      Return JSON with: overallScore (0-100), strengths (array),

//      weaknesses (array), missingSkills (array), improvementSuggestions (array),

//      atsScore (0-100), summary (string)"

// Output: Structured JSON analysis

// Constraint: cvText max 5000 chars, rate limit 10/hour per user

```



\### Feature 2: AI Job Matcher (`POST /api/v1/ai/job-match`)



```ts

// Input: { skills: string\[], experience: string, preferredLocation?: string }

// Process:

//   - Fetch top 30 OPEN jobs from DB

//   - Send user profile + job list to Gemini:

//     "Based on this candidate profile, rank the best matching jobs.

//      For each match return: jobId, matchScore (0-100), matchReason (string),

//      skillGap (array). Return top 5 matches as JSON array."

// Output: Array of job matches with scores and reasons

```



\### Feature 3: AI Interview Coach (`POST /api/v1/ai/interview-prep`)



```ts

// Input: { jobTitle: string, jobDescription?: string, experienceLevel: string }

// Process:

//   - Send to Gemini:

//     "Generate interview preparation for a {jobTitle} role ({experienceLevel} level)

//      in a Bangladesh company. Return JSON with:

//      technicalQuestions (5, each with question + modelAnswer),

//      behavioralQuestions (3, each with question + tip),

//      salaryNegotiationTips (3 strings),

//      companyResearchTips (3 strings)"

// Output: Complete interview prep guide

```



\### Feature 4: AI Chat Assistant (`POST /api/v1/ai/chat`)



```ts

// Input: { prompt: string, history: \[{role: 'user'|'model', content: string}] }

// Process:

//   - System context: "You are HireIQ's career assistant for Bangladesh job seekers.

//     You help with job search, CV writing, interview preparation, and career advice.

//     Be helpful, professional, and concise."

//   - Send history + new prompt to Gemini

// Output: { response: string }

```



\---



\## 🔍 Job Filtering (`GET /api/v1/jobs`)



Query params supported:

```

searchTerm    → title, description, companyName (case-insensitive)

category      → exact match

type          → JobType enum

district      → exact match

salaryMin     → salaryMin >= value

salaryMax     → salaryMax <= value

status        → JobStatus (default: OPEN)

isFeatured    → boolean

page          → default 1

limit         → default 12

sortBy        → newest | salary-high | salary-low | most-viewed

```



Always return pagination meta: `{ total, page, limit, totalPages }`



\---



\## 🌱 Seed Script (`prisma/seed.ts`)



Use `faker.js` with Bangladesh-specific data:



```ts

// Create:

// - 1 Admin: admin@hireiq.com / Admin@123

// - 5 Employers: employer@hireiq.com / Employer@123 (+ 4 more)

// - 15 Jobseekers: user@hireiq.com / User@123 (+ 14 more)

// - 40+ Jobs across categories:

//     Tech: Full Stack Developer, React Developer, DevOps Engineer

//     Finance: Accountant, Financial Analyst

//     Healthcare: Nurse, Doctor, Pharmacist

//     Marketing: Digital Marketer, SEO Specialist

//     Education: Teacher, Tutor

// - Districts: Dhaka, Chittagong, Sylhet, Rajshahi, Khulna, Barisal

// - Companies: realistic BD company names

// - 20+ Applications with mixed statuses

// - 10+ Reviews

// - 5+ Published blogs about BD job market

```



\---



\## 📦 `package.json` Dependencies



```json

{

&#x20; "dependencies": {

&#x20;   "express": "^4.18.2",

&#x20;   "@prisma/client": "^5.10.0",

&#x20;   "bcrypt": "^5.1.1",

&#x20;   "jsonwebtoken": "^9.0.2",

&#x20;   "zod": "^3.22.4",

&#x20;   "cors": "^2.8.5",

&#x20;   "morgan": "^1.10.0",

&#x20;   "cookie-parser": "^1.4.6",

&#x20;   "helmet": "^7.1.0",

&#x20;   "multer": "^1.4.5-lts.1",

&#x20;   "cloudinary": "^2.0.1",

&#x20;   "multer-storage-cloudinary": "^4.0.0",

&#x20;   "@google/generative-ai": "^0.3.0",

&#x20;   "dotenv": "^16.4.4"

&#x20; },

&#x20; "devDependencies": {

&#x20;   "typescript": "^5.3.3",

&#x20;   "ts-node": "^10.9.2",

&#x20;   "ts-node-dev": "^2.0.0",

&#x20;   "@types/express": "^4.17.21",

&#x20;   "@types/bcrypt": "^5.0.2",

&#x20;   "@types/jsonwebtoken": "^9.0.5",

&#x20;   "@types/cors": "^2.8.17",

&#x20;   "@types/morgan": "^1.9.9",

&#x20;   "@types/cookie-parser": "^1.4.7",

&#x20;   "@types/multer": "^1.4.11",

&#x20;   "prisma": "^5.10.0",

&#x20;   "@faker-js/faker": "^8.4.1"

&#x20; }

}

```



\---



\## 🔑 Environment Variables (`.env.example`)



```env

DATABASE\_URL=mongodb+srv://...

PORT=5000

NODE\_ENV=development



JWT\_SECRET=your\_jwt\_secret\_min\_32\_chars

JWT\_EXPIRES\_IN=7d

JWT\_REFRESH\_SECRET=your\_refresh\_secret\_min\_32\_chars

JWT\_REFRESH\_EXPIRES\_IN=30d



CLOUDINARY\_CLOUD\_NAME=

CLOUDINARY\_API\_KEY=

CLOUDINARY\_API\_SECRET=



GEMINI\_API\_KEY=



GOOGLE\_CLIENT\_ID=

GOOGLE\_CLIENT\_SECRET=



CLIENT\_URL=http://localhost:3000

```



\---



\## 🚀 Execution Phases



\### Phase 1 — Foundation

Create:

1\. `package.json` (all deps above)

2\. `tsconfig.json` (strict mode, paths alias)

3\. `prisma/schema.prisma` (full schema above)

4\. `src/server.ts` (Prisma connect + listen)

5\. `src/app.ts` (Express setup, helmet, cors, morgan, cookie-parser)

6\. `src/config/index.ts` (Zod env validation — throw if missing vars)

7\. `src/app/utils/ApiError.ts`

8\. `src/app/utils/catchAsync.ts`

9\. `src/app/utils/sendResponse.ts`

10\. `src/app/middlewares/error.middleware.ts`



Then run: `npx prisma generate \&\& npx prisma db push`



\### Phase 2 — Auth Module

Create auth module with:

\- Register: hash password (bcrypt 12), save user, return tokens

\- Login: compare password, return access + refresh tokens

\- Google OAuth: find or create user by googleId

\- Refresh token: verify refresh JWT, return new access token

\- `authGuard(...roles)` middleware

\- `validateRequest(schema)` middleware

\- Central routes `index.ts`



\### Phase 3 — User Module

\- GET /users/me → own profile

\- PATCH /users/me → update (name, phone, location, bio, skills, avatar)

\- POST /users/upload-resume → Cloudinary PDF upload, save URL

\- GET /users (ADMIN) → paginated list with filters

\- PATCH /users/:id/status (ADMIN) → toggle isActive

\- DELETE /users/:id (ADMIN)



\### Phase 4 — Job Module

\- Full CRUD

\- GET /jobs with all filters (searchTerm, category, type, district, salary range, status, featured, pagination, sort)

\- POST /jobs/:id/view → increment views counter

\- Cloudinary for company logo upload



\### Phase 5 — Application Module

\- POST /applications → jobseeker applies (cover letter + resume URL)

\- GET /applications/my → own applications with job details

\- GET /applications/job/:jobId → employer sees all applicants

\- PATCH /applications/:id/status → employer updates (SHORTLISTED/REJECTED/HIRED)

\- GET /applications/all (ADMIN) → all applications paginated



\### Phase 6 — Reviews, Blog, Contact, Stats

\- Reviews CRUD with avg rating aggregation on Job

\- Blog CRUD with auto slug generation from title

\- Contact form → save to DB, mark read endpoint

\- Stats: aggregate total jobs, users, applications, hired count, revenue (if applicable), jobs by category (for charts), applications by status (for pie chart), monthly job posts (for line chart)



\### Phase 7 — AI Module

Build all 4 AI features (CV Analyzer, Job Matcher, Interview Coach, Chat).

Use `@google/generative-ai` SDK.

Always parse Gemini JSON response safely with try/catch.

Return structured error if Gemini API fails.



\### Phase 8 — Seed + Final

\- Write `prisma/seed.ts` with faker.js Bangladesh data

\- Add `"seed": "ts-node prisma/seed.ts"` to package.json

\- Final check: no console.logs, all routes in index.ts, CORS allows client URL



\---



\## 🚫 Absolute Rules



| Rule | Detail |

|------|--------|

| ❌ No `any` types | Strict TypeScript everywhere |

| ❌ No console.log | Remove all debug logs |

| ❌ No hardcoded values | All config from .env |

| ✅ Every route validated | Zod schema for all POST/PATCH |

| ✅ Every route protected | authGuard on all non-public routes |

| ✅ Pagination on all lists | Always return meta object |

| ✅ Gemini JSON safe parse | Always wrap JSON.parse in try/catch |



