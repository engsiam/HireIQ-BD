# HireIQ BD - Backend

A production-ready Express.js + TypeScript backend for a job board platform in Bangladesh.

## Tech Stack

- **Runtime:** Node.js 20+
- **Framework:** Express.js
- **Language:** TypeScript (strict mode)
- **ORM:** Prisma
- **Database:** MongoDB (Atlas)
- **Auth:** JWT (access token 7d + refresh token 30d)
- **Validation:** Zod
- **File Upload:** Multer + Cloudinary
- **AI:** Google Gemini API

## Project Structure

```
hireiq-backend/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── config/
│   │   └── index.ts
│   ├── prisma/
│   │   └── client.ts
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
│           ├── user/
│           ├── job/
│           ├── application/
│           ├── review/
│           ├── blog/
│           ├── contact/
│           ├── stats/
│           └── ai/
├── .env.example
├── package.json
└── tsconfig.json
```

## Installation

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Run seed script (optional)
npm run seed

# Start development server
npm run dev
```

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```env
NODE_ENV=development
PORT=5000

DATABASE_URL=mongodb+srv://...

JWT_SECRET=your_jwt_secret_min_32_chars
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_secret_min_32_chars
JWT_REFRESH_EXPIRES_IN=30d

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

GEMINI_API_KEY=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

CLIENT_URL=http://localhost:3000
```

## API Endpoints

### Auth
- `POST /api/v1/auth/register` - Register
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/google` - Google OAuth
- `POST /api/v1/auth/refresh-token` - Refresh JWT
- `POST /api/v1/auth/logout` - Logout

### Users
- `GET /api/v1/users/me` - Get own profile
- `PATCH /api/v1/users/me` - Update profile
- `POST /api/v1/users/upload-resume` - Upload resume (Jobseeker)
- `POST /api/v1/users/save-job` - Save/unsave job
- `GET /api/v1/users` - Get all users (Admin)
- `PATCH /api/v1/users/:id/status` - Toggle user status (Admin)
- `DELETE /api/v1/users/:id` - Delete user (Admin)

### Jobs
- `GET /api/v1/jobs` - List jobs (with filters)
- `GET /api/v1/jobs/my` - Get my jobs (Employer/Admin)
- `GET /api/v1/jobs/:id` - Get job details
- `POST /api/v1/jobs` - Create job (Employer/Admin)
- `PATCH /api/v1/jobs/:id` - Update job
- `DELETE /api/v1/jobs/:id` - Delete job
- `POST /api/v1/jobs/view/:id` - Increment views

### Applications
- `POST /api/v1/applications` - Apply to job (Jobseeker)
- `GET /api/v1/applications/my` - My applications (Jobseeker)
- `GET /api/v1/applications/job/:jobId` - Job applicants (Employer)
- `PATCH /api/v1/applications/:id/status` - Update status (Employer)
- `GET /api/v1/applications/all` - All applications (Admin)

### Reviews
- `POST /api/v1/reviews` - Create review (Jobseeker)
- `GET /api/v1/reviews/job/:jobId` - Get job reviews

### Blogs
- `GET /api/v1/blogs` - List blogs
- `GET /api/v1/blogs/:slug` - Get blog by slug
- `POST /api/v1/blogs` - Create blog (Admin)
- `PATCH /api/v1/blogs/:id` - Update blog (Admin)
- `DELETE /api/v1/blogs/:id` - Delete blog (Admin)

### Contact
- `POST /api/v1/contact` - Submit contact form
- `GET /api/v1/contact` - Get all messages (Admin)
- `PATCH /api/v1/contact/:id/read` - Mark as read (Admin)

### Stats
- `GET /api/v1/stats/overview` - Dashboard stats (Admin)

### AI
- `POST /api/v1/ai/cv-analyze` - CV Analyzer (Jobseeker)
- `POST /api/v1/ai/job-match` - Job Matcher (Jobseeker)
- `POST /api/v1/ai/interview-prep` - Interview Coach (Jobseeker)
- `POST /api/v1/ai/chat` - AI Chat Assistant

## Job Filtering

`GET /api/v1/jobs` supports:
- `searchTerm` - Search in title, description, companyName
- `category` - Exact match
- `type` - JobType enum
- `district` - Exact match
- `salaryMin` / `salaryMax` - Salary range
- `status` - JobStatus (default: OPEN)
- `isFeatured` - Boolean
- `page` / `limit` - Pagination
- `sortBy` - newest | salary-high | salary-low | most-viewed

## Seed Data

Run `npm run seed` to create:
- 1 Admin: admin@hireiq.com / Password123
- 5 Employers: employer1@hireiq.com - employer5@hireiq.com / Password123
- 15 Jobseekers: user1@hireiq.com - user15@hireiq.com / Password123
- 40+ Jobs across various categories
- 25 Applications with mixed statuses
- 12 Reviews
- 8 Blog posts
- 5 Contact messages

## Scripts

```json
{
  "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js",
  "prisma:generate": "prisma generate",
  "prisma:push": "prisma db push",
  "seed": "ts-node prisma/seed.ts"
}
```

## License

ISC