# 🔧 HireIQ BD — Backend Agent Master Instruction v2.0
# ⚠️ COMPLETE REWRITE — Adds Swagger, fixes all previous issues

---

## 🚨 ISSUES TO FIX FROM PREVIOUS BUILD

1. ❌ **Swagger not working** — swagger-ui-express not configured properly
2. ❌ **CORS blocking frontend** — needs proper origin whitelist
3. ❌ **Stats endpoint missing** — `/api/v1/stats/overview` not returning chart data
4. ❌ **AI responses not structured** — Gemini returning plain text not JSON
5. ❌ **Seed not running** — faker seed script has import errors
6. ❌ **Filter queries incomplete** — salary range filter not working

**READ THIS ENTIRE FILE BEFORE WRITING A SINGLE LINE OF CODE.**

---

## 🛠️ TECH STACK

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 20+ | Runtime |
| Express.js | 4.18+ | Framework |
| TypeScript | 5.3+ | Language (strict mode) |
| Prisma | 5.10+ | ORM |
| MongoDB Atlas | Latest | Database |
| JWT | 9.0+ | Auth tokens |
| bcrypt | 5.1+ | Password hashing (salt 12) |
| Zod | 3.22+ | Validation |
| Multer + Cloudinary | Latest | File upload |
| Google Gemini API | 0.3+ | AI features |
| swagger-jsdoc | 6.2+ | Swagger schema generation |
| swagger-ui-express | 5.0+ | Swagger UI server |
| cors | 2.8+ | Cross-origin |
| helmet | 7.1+ | Security headers |
| morgan | 1.10+ | HTTP logging |

---

## 📁 COMPLETE FOLDER STRUCTURE

```
hireiq-backend/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── app.ts                              ← Express app + Swagger setup
│   ├── server.ts                           ← DB connect + listen
│   ├── swagger.ts                          ← Swagger config
│   ├── config/
│   │   └── index.ts                        ← Zod env validation
│   └── app/
│       ├── middlewares/
│       │   ├── auth.middleware.ts
│       │   ├── validate.middleware.ts
│       │   └── error.middleware.ts
│       ├── routes/
│       │   └── index.ts                    ← Central aggregator
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
├── .env.example
├── package.json
└── tsconfig.json
```

---

## 📦 PACKAGE.JSON (Complete)

```json
{
  "name": "hireiq-backend",
  "version": "1.0.0",
  "description": "HireIQ BD - AI-Powered Job Portal Backend",
  "main": "dist/server.js",
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "seed": "ts-node prisma/seed.ts",
    "db:push": "npx prisma db push",
    "db:generate": "npx prisma generate",
    "db:studio": "npx prisma studio"
  },
  "dependencies": {
    "express": "^4.18.2",
    "@prisma/client": "^5.10.0",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "zod": "^3.22.4",
    "cors": "^2.8.5",
    "morgan": "^1.10.0",
    "cookie-parser": "^1.4.6",
    "helmet": "^7.1.0",
    "multer": "^1.4.5-lts.1",
    "cloudinary": "^2.0.1",
    "multer-storage-cloudinary": "^4.0.0",
    "@google/generative-ai": "^0.3.0",
    "swagger-jsdoc": "^6.2.8",
    "swagger-ui-express": "^5.0.0",
    "dotenv": "^16.4.4",
    "express-rate-limit": "^7.2.0"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "ts-node": "^10.9.2",
    "ts-node-dev": "^2.0.0",
    "@types/express": "^4.17.21",
    "@types/bcrypt": "^5.0.2",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/cors": "^2.8.17",
    "@types/morgan": "^1.9.9",
    "@types/cookie-parser": "^1.4.7",
    "@types/multer": "^1.4.11",
    "@types/swagger-jsdoc": "^6.0.4",
    "@types/swagger-ui-express": "^4.1.6",
    "prisma": "^5.10.0",
    "@faker-js/faker": "^8.4.1"
  }
}
```

---

## ⚙️ TSCONFIG.JSON

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "prisma"]
}
```

---

## 🗄️ PRISMA SCHEMA (Complete)

```prisma
datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  ADMIN
  EMPLOYER
  JOBSEEKER
}

enum JobStatus {
  OPEN
  CLOSED
  DRAFT
}

enum ApplicationStatus {
  PENDING
  SHORTLISTED
  REJECTED
  HIRED
}

enum JobType {
  FULL_TIME
  PART_TIME
  REMOTE
  CONTRACT
  INTERNSHIP
}

model User {
  id           String        @id @default(auto()) @map("_id") @db.ObjectId
  name         String
  email        String        @unique
  password     String
  role         Role          @default(JOBSEEKER)
  avatar       String?
  phone        String?
  location     String?
  bio          String?
  skills       String[]
  resumeUrl    String?
  isActive     Boolean       @default(true)
  googleId     String?
  savedJobs    String[]
  jobs         Job[]
  applications Application[]
  reviews      Review[]
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
}

model Job {
  id               String        @id @default(auto()) @map("_id") @db.ObjectId
  title            String
  description      String
  requirements     String[]
  responsibilities String[]
  skills           String[]
  type             JobType
  category         String
  location         String
  district         String
  salary           String
  salaryMin        Float?
  salaryMax        Float?
  deadline         DateTime
  status           JobStatus     @default(OPEN)
  isFeatured       Boolean       @default(false)
  views            Int           @default(0)
  companyName      String
  companyLogo      String?
  companyWebsite   String?
  employerId       String        @db.ObjectId
  employer         User          @relation(fields: [employerId], references: [id])
  applications     Application[]
  reviews          Review[]
  aiTags           String[]
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt
}

model Application {
  id          String            @id @default(auto()) @map("_id") @db.ObjectId
  jobId       String            @db.ObjectId
  job         Job               @relation(fields: [jobId], references: [id])
  userId      String            @db.ObjectId
  user        User              @relation(fields: [userId], references: [id])
  coverLetter String
  resumeUrl   String
  status      ApplicationStatus @default(PENDING)
  aiScore     Float?
  aiFeedback  String?
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt
}

model Review {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  userId    String   @db.ObjectId
  user      User     @relation(fields: [userId], references: [id])
  jobId     String   @db.ObjectId
  job       Job      @relation(fields: [jobId], references: [id])
  rating    Int
  comment   String
  createdAt DateTime @default(now())
}

model Blog {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  title       String
  slug        String   @unique
  content     String
  coverImage  String
  category    String
  tags        String[]
  authorId    String   @db.ObjectId
  isPublished Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Contact {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  name      String
  email     String
  subject   String
  message   String
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())
}
```

---

## 🔑 CONFIG (`src/config/index.ts`)

```typescript
import { z } from 'zod';
import dotenv from 'dotenv';
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 chars'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 chars'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),
  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),
  GEMINI_API_KEY: z.string().min(1),
  CLIENT_URL: z.string().default('http://localhost:3000'),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const config = parsed.data;
```

---

## 🌐 APP.TS — Express + Swagger Setup

```typescript
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';
import { globalErrorHandler } from './app/middlewares/error.middleware';
import { router } from './app/routes/index';
import { config } from './config';

const app: Application = express();

// ─── Security Middlewares ──────────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: false, // disable for Swagger UI
}));

app.use(cors({
  origin: [
    config.CLIENT_URL,
    'http://localhost:3000',
    'http://localhost:3001',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Request Parsing ──────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ─── Logging ──────────────────────────────────────────────────────────────────
if (config.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ─── Swagger UI ───────────────────────────────────────────────────────────────
// Accessible at: http://localhost:5000/api-docs
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: `
      .swagger-ui .topbar { background-color: #EB4C4C; }
      .swagger-ui .topbar-wrapper img { content: url(''); }
      .swagger-ui .topbar-wrapper::after { content: 'HireIQ BD API'; color: white; font-size: 20px; font-weight: bold; }
    `,
    customSiteTitle: 'HireIQ BD API Documentation',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
    },
  })
);

// Swagger JSON endpoint
app.get('/api-docs.json', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'HireIQ BD API is running',
    environment: config.NODE_ENV,
    timestamp: new Date().toISOString(),
    swagger: '/api-docs',
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/v1', router);

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(globalErrorHandler);

export default app;
```

---

## 📖 SWAGGER CONFIG (`src/swagger.ts`)

```typescript
import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HireIQ BD API',
      version: '1.0.0',
      description: `
## HireIQ BD — AI-Powered Job Portal API

### Authentication
Use the \`/auth/login\` endpoint to get a JWT token, then click **Authorize** and enter: \`Bearer <your_token>\`

### Demo Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@hireiq.com | Admin@123 |
| Employer | employer@hireiq.com | Employer@123 |
| Jobseeker | user@hireiq.com | User@123 |
      `,
      contact: {
        name: 'HireIQ BD Team',
        email: 'api@hireiq.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1',
        description: 'Development Server',
      },
      {
        url: 'https://your-production-url.com/api/v1',
        description: 'Production Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT access token',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '65f1a2b3c4d5e6f7a8b9c0d1' },
            name: { type: 'string', example: 'Rahul Ahmed' },
            email: { type: 'string', example: 'rahul@example.com' },
            role: { type: 'string', enum: ['ADMIN', 'EMPLOYER', 'JOBSEEKER'] },
            avatar: { type: 'string', nullable: true },
            skills: { type: 'array', items: { type: 'string' } },
            isActive: { type: 'boolean' },
          },
        },
        Job: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string', example: 'Senior React Developer' },
            description: { type: 'string' },
            type: { type: 'string', enum: ['FULL_TIME', 'PART_TIME', 'REMOTE', 'CONTRACT', 'INTERNSHIP'] },
            category: { type: 'string', example: 'Technology' },
            district: { type: 'string', example: 'Dhaka' },
            salary: { type: 'string', example: '80,000-120,000 BDT' },
            salaryMin: { type: 'number', example: 80000 },
            salaryMax: { type: 'number', example: 120000 },
            status: { type: 'string', enum: ['OPEN', 'CLOSED', 'DRAFT'] },
            isFeatured: { type: 'boolean' },
            companyName: { type: 'string', example: 'Pathao Ltd' },
          },
        },
        Application: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            jobId: { type: 'string' },
            userId: { type: 'string' },
            coverLetter: { type: 'string' },
            resumeUrl: { type: 'string' },
            status: { type: 'string', enum: ['PENDING', 'SHORTLISTED', 'REJECTED', 'HIRED'] },
            aiScore: { type: 'number', nullable: true },
          },
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' },
            meta: {
              type: 'object',
              properties: {
                total: { type: 'number' },
                page: { type: 'number' },
                limit: { type: 'number' },
                totalPages: { type: 'number' },
              },
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Unauthorized' },
            statusCode: { type: 'number', example: 401 },
          },
        },
      },
    },
  },
  apis: ['./src/app/modules/**/*.route.ts', './src/app/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
```

---

## 🔒 MIDDLEWARES

### `auth.middleware.ts`
```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { ApiError } from '../utils/ApiError';
import { catchAsync } from '../utils/catchAsync';
import { config } from '../../config';

const prisma = new PrismaClient();

export interface AuthRequest extends Request {
  user?: { id: string; role: string; email: string };
}

export const authGuard = (...roles: string[]) =>
  catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new ApiError(401, 'No token provided');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.JWT_SECRET) as { id: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, role: true, email: true, isActive: true },
    });

    if (!user) throw new ApiError(401, 'User not found');
    if (!user.isActive) throw new ApiError(403, 'Account is deactivated');
    if (roles.length && !roles.includes(user.role)) {
      throw new ApiError(403, `Access denied. Required roles: ${roles.join(', ')}`);
    }

    req.user = { id: user.id, role: user.role, email: user.email };
    next();
  });
```

### `error.middleware.ts`
```typescript
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Internal server error';

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') { statusCode = 409; message = 'Record already exists'; }
    else if (err.code === 'P2025') { statusCode = 404; message = 'Record not found'; }
    else if (err.code === 'P2003') { statusCode = 400; message = 'Invalid relation reference'; }
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401; message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401; message = 'Token expired';
  }

  res.status(statusCode).json({ success: false, statusCode, message });
};
```

---

## 🔌 ALL API ROUTES WITH SWAGGER JSDoc

### `auth.route.ts` (with Swagger annotations)

```typescript
import { Router } from 'express';
import { AuthController } from './auth.controller';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password, role]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Rahul Ahmed
 *               email:
 *                 type: string
 *                 example: rahul@example.com
 *               password:
 *                 type: string
 *                 example: Password@123
 *               role:
 *                 type: string
 *                 enum: [JOBSEEKER, EMPLOYER]
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       409:
 *         description: Email already exists
 */
router.post('/register', AuthController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login and get JWT tokens
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@hireiq.com
 *               password:
 *                 type: string
 *                 example: User@123
 *     responses:
 *       200:
 *         description: Login successful, returns accessToken and refreshToken
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', AuthController.login);

/**
 * @swagger
 * /auth/google:
 *   post:
 *     summary: Google OAuth login/register
 *     tags: [Auth]
 */
router.post('/google', AuthController.googleAuth);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 */
router.post('/refresh-token', AuthController.refreshToken);

export default router;
```

### `job.route.ts` (with Swagger annotations)

```typescript
/**
 * @swagger
 * /jobs:
 *   get:
 *     summary: Get all jobs with filtering and pagination
 *     tags: [Jobs]
 *     parameters:
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *         description: Search in title, description, companyName
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           example: Technology
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [FULL_TIME, PART_TIME, REMOTE, CONTRACT, INTERNSHIP]
 *       - in: query
 *         name: district
 *         schema:
 *           type: string
 *           example: Dhaka
 *       - in: query
 *         name: salaryMin
 *         schema:
 *           type: number
 *           example: 50000
 *       - in: query
 *         name: salaryMax
 *         schema:
 *           type: number
 *           example: 150000
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [OPEN, CLOSED, DRAFT]
 *           default: OPEN
 *       - in: query
 *         name: isFeatured
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 12
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [newest, salary-high, salary-low, most-viewed]
 *           default: newest
 *     responses:
 *       200:
 *         description: List of jobs with pagination meta
 */
```

---

## 📊 STATS SERVICE (FIX — was missing chart data)

```typescript
// stats/stats.service.ts — COMPLETE IMPLEMENTATION

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getStatsOverview = async () => {
  // Run all queries in parallel for performance
  const [
    totalJobs,
    totalUsers,
    totalApplications,
    totalHired,
    jobsByCategory,
    applicationsByStatus,
  ] = await Promise.all([
    prisma.job.count({ where: { status: 'OPEN' } }),
    prisma.user.count({ where: { isActive: true } }),
    prisma.application.count(),
    prisma.application.count({ where: { status: 'HIRED' } }),
    prisma.job.groupBy({
      by: ['category'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 6,
    }),
    prisma.application.groupBy({
      by: ['status'],
      _count: { id: true },
    }),
  ]);

  // Build monthly data for last 6 months
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);

    const [jobsCount, applicationsCount] = await Promise.all([
      prisma.job.count({ where: { createdAt: { gte: startOfMonth, lte: endOfMonth } } }),
      prisma.application.count({ where: { createdAt: { gte: startOfMonth, lte: endOfMonth } } }),
    ]);

    months.push({
      month: date.toLocaleString('default', { month: 'short' }),
      jobs: jobsCount,
      applications: applicationsCount,
    });
  }

  return {
    totalJobs,
    totalUsers,
    totalApplications,
    totalHired,
    jobsByCategory: jobsByCategory.map(item => ({
      category: item.category,
      count: item._count.id,
    })),
    applicationsByStatus: applicationsByStatus.map(item => ({
      status: item.status,
      count: item._count.id,
    })),
    monthlyData: months,
  };
};
```

---

## 🤖 AI SERVICE (FIX — structured JSON responses)

```typescript
// ai/ai.service.ts — COMPLETE IMPLEMENTATION

import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaClient } from '@prisma/client';
import { config } from '../../config';

const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
const prisma = new PrismaClient();

// ── Helper: Safe JSON parse from Gemini ────────────────────────────────────
const parseGeminiJSON = <T>(text: string): T => {
  // Remove markdown code blocks if present
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    throw new Error('AI returned invalid JSON. Please try again.');
  }
};

// ── Feature 1: CV Analyzer ─────────────────────────────────────────────────
export const analyzeCv = async (cvText: string, jobTitle?: string) => {
  const prompt = `
You are an expert HR consultant and ATS specialist for the Bangladesh job market.
Analyze this CV${jobTitle ? ` for a ${jobTitle} position` : ''} and return ONLY valid JSON (no markdown, no explanation):

CV Text:
${cvText.substring(0, 4000)}

Return this exact JSON structure:
{
  "overallScore": <number 0-100>,
  "atsScore": <number 0-100>,
  "summary": "<2-3 sentence overall assessment>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>", "<weakness 3>"],
  "missingSkills": ["<skill 1>", "<skill 2>", "<skill 3>"],
  "improvementSuggestions": [
    "<specific actionable suggestion 1>",
    "<specific actionable suggestion 2>",
    "<specific actionable suggestion 3>",
    "<specific actionable suggestion 4>"
  ]
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return parseGeminiJSON<{
    overallScore: number; atsScore: number; summary: string;
    strengths: string[]; weaknesses: string[]; missingSkills: string[];
    improvementSuggestions: string[];
  }>(text);
};

// ── Feature 2: Job Matcher ─────────────────────────────────────────────────
export const matchJobs = async (
  skills: string[],
  experience: string,
  preferredLocation?: string
) => {
  const jobs = await prisma.job.findMany({
    where: { status: 'OPEN' },
    take: 30,
    select: { id: true, title: true, skills: true, category: true, district: true, salary: true, companyName: true },
  });

  const prompt = `
You are a job matching AI for Bangladesh job market.
Candidate profile:
- Skills: ${skills.join(', ')}
- Experience: ${experience}
- Preferred location: ${preferredLocation || 'Any'}

Available jobs:
${JSON.stringify(jobs, null, 2)}

Return ONLY valid JSON (no markdown):
{
  "matches": [
    {
      "jobId": "<job id>",
      "matchScore": <number 0-100>,
      "matchReason": "<1-2 sentence explanation>",
      "skillGap": ["<missing skill 1>", "<missing skill 2>"]
    }
  ]
}
Return top 5 matches ordered by matchScore descending.`;

  const result = await model.generateContent(prompt);
  const parsed = parseGeminiJSON<{ matches: Array<{ jobId: string; matchScore: number; matchReason: string; skillGap: string[] }> }>(result.response.text());

  // Hydrate with full job data
  const hydratedMatches = await Promise.all(
    parsed.matches.map(async (match) => {
      const job = await prisma.job.findUnique({ where: { id: match.jobId } });
      return { ...match, job };
    })
  );

  return hydratedMatches.filter(m => m.job !== null);
};

// ── Feature 3: Interview Coach ─────────────────────────────────────────────
export const getInterviewPrep = async (jobTitle: string, experienceLevel: string, jobDescription?: string) => {
  const prompt = `
You are an expert interview coach for Bangladesh job market.
Generate interview preparation for: ${jobTitle} (${experienceLevel} level)
${jobDescription ? `Job description context: ${jobDescription.substring(0, 500)}` : ''}

Return ONLY valid JSON (no markdown):
{
  "technicalQuestions": [
    { "question": "<question>", "modelAnswer": "<detailed model answer>", "difficulty": "easy|medium|hard" },
    { "question": "<question>", "modelAnswer": "<detailed model answer>", "difficulty": "easy|medium|hard" },
    { "question": "<question>", "modelAnswer": "<detailed model answer>", "difficulty": "easy|medium|hard" },
    { "question": "<question>", "modelAnswer": "<detailed model answer>", "difficulty": "easy|medium|hard" },
    { "question": "<question>", "modelAnswer": "<detailed model answer>", "difficulty": "easy|medium|hard" }
  ],
  "behavioralQuestions": [
    { "question": "<question>", "tip": "<how to answer this type of question>" },
    { "question": "<question>", "tip": "<tip>" },
    { "question": "<question>", "tip": "<tip>" }
  ],
  "salaryNegotiationTips": ["<tip 1>", "<tip 2>", "<tip 3>"],
  "companyResearchTips": ["<tip 1>", "<tip 2>", "<tip 3>"]
}`;

  const result = await model.generateContent(prompt);
  return parseGeminiJSON<{
    technicalQuestions: Array<{ question: string; modelAnswer: string; difficulty: string }>;
    behavioralQuestions: Array<{ question: string; tip: string }>;
    salaryNegotiationTips: string[];
    companyResearchTips: string[];
  }>(result.response.text());
};

// ── Feature 4: AI Chat ─────────────────────────────────────────────────────
export const chatWithAI = async (
  prompt: string,
  history: Array<{ role: 'user' | 'model'; content: string }>
) => {
  const chat = model.startChat({
    history: history.map(h => ({
      role: h.role,
      parts: [{ text: h.content }],
    })),
    generationConfig: { maxOutputTokens: 1000 },
    systemInstruction: `You are HireIQ's career assistant for Bangladesh job seekers and employers.
Help with: job search, CV writing, interview preparation, career advice, salary expectations in Bangladesh.
Be professional, helpful, and concise. Keep responses under 200 words.`,
  });

  const result = await chat.sendMessage(prompt);
  return { response: result.response.text() };
};
```

---

## 🌱 SEED SCRIPT (FIX — was failing due to import errors)

```typescript
// prisma/seed.ts — COMPLETE WORKING IMPLEMENTATION

import { PrismaClient, Role, JobType, JobStatus } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const DISTRICTS = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh'];
const CATEGORIES = ['Technology', 'Finance', 'Healthcare', 'Marketing', 'Education', 'Engineering', 'Design', 'Sales'];
const COMPANIES = ['Pathao Ltd', 'bKash Limited', 'Daraz Bangladesh', 'Grameenphone', 'BRAC', 'Shohoz', 'Chaldal', 'ShajGoj', 'Shajgoj', 'Kaan Pete Roi', 'Shikho', 'Maya', 'Truck Lagbe'];
const JOB_TYPES: JobType[] = ['FULL_TIME', 'PART_TIME', 'REMOTE', 'CONTRACT', 'INTERNSHIP'];

const HASH = async (pass: string) => bcrypt.hash(pass, 12);

async function main() {
  // Clear existing data
  await prisma.application.deleteMany();
  await prisma.review.deleteMany();
  await prisma.blog.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.job.deleteMany();
  await prisma.user.deleteMany();

  console.log('🗑️  Cleared existing data');

  // Create Admin
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@hireiq.com',
      password: await HASH('Admin@123'),
      role: Role.ADMIN,
      isActive: true,
    },
  });
  console.log('✅ Admin created');

  // Create 5 Employers
  const employers = await Promise.all(
    Array.from({ length: 5 }, async (_, i) => prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: i === 0 ? 'employer@hireiq.com' : faker.internet.email(),
        password: await HASH('Employer@123'),
        role: Role.EMPLOYER,
        phone: `+880${faker.string.numeric(10)}`,
        location: faker.helpers.arrayElement(DISTRICTS),
        isActive: true,
      },
    }))
  );
  console.log('✅ Employers created');

  // Create 15 Jobseekers
  const jobseekers = await Promise.all(
    Array.from({ length: 15 }, async (_, i) => prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: i === 0 ? 'user@hireiq.com' : faker.internet.email(),
        password: await HASH('User@123'),
        role: Role.JOBSEEKER,
        phone: `+880${faker.string.numeric(10)}`,
        location: faker.helpers.arrayElement(DISTRICTS),
        bio: faker.lorem.sentences(2),
        skills: faker.helpers.arrayElements(
          ['React', 'Node.js', 'Python', 'TypeScript', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'Java', 'PHP'],
          faker.number.int({ min: 3, max: 6 })
        ),
        isActive: true,
      },
    }))
  );
  console.log('✅ Jobseekers created');

  // Create 40+ Jobs
  const jobs = await Promise.all(
    Array.from({ length: 40 }, async (_, i) => {
      const employer = faker.helpers.arrayElement(employers);
      const category = faker.helpers.arrayElement(CATEGORIES);
      const salaryMin = faker.number.int({ min: 25000, max: 100000 });
      const salaryMax = salaryMin + faker.number.int({ min: 20000, max: 80000 });

      return prisma.job.create({
        data: {
          title: `${faker.helpers.arrayElement(['Senior', 'Junior', 'Mid-level', 'Lead'])} ${faker.helpers.arrayElement(['React Developer', 'Node.js Engineer', 'Product Manager', 'Data Analyst', 'DevOps Engineer', 'UI/UX Designer', 'Marketing Manager', 'Sales Executive', 'Accountant', 'HR Manager'])}`,
          description: faker.lorem.paragraphs(3),
          requirements: Array.from({ length: 4 }, () => faker.lorem.sentence()),
          responsibilities: Array.from({ length: 4 }, () => faker.lorem.sentence()),
          skills: faker.helpers.arrayElements(['React', 'Node.js', 'Python', 'TypeScript', 'MongoDB', 'AWS', 'Docker', 'Java', 'PHP', 'Vue.js'], 4),
          type: faker.helpers.arrayElement(JOB_TYPES),
          category,
          location: `${faker.helpers.arrayElement(DISTRICTS)}, Bangladesh`,
          district: faker.helpers.arrayElement(DISTRICTS),
          salary: `${salaryMin.toLocaleString()}-${salaryMax.toLocaleString()} BDT`,
          salaryMin,
          salaryMax,
          deadline: faker.date.future({ years: 0.5 }),
          status: JobStatus.OPEN,
          isFeatured: i < 8,
          companyName: faker.helpers.arrayElement(COMPANIES),
          employerId: employer.id,
          aiTags: [],
        },
      });
    })
  );
  console.log(`✅ ${jobs.length} Jobs created`);

  // Create Applications
  await Promise.all(
    Array.from({ length: 30 }, async () => {
      const jobseeker = faker.helpers.arrayElement(jobseekers);
      const job = faker.helpers.arrayElement(jobs);
      return prisma.application.create({
        data: {
          jobId: job.id,
          userId: jobseeker.id,
          coverLetter: faker.lorem.paragraph(),
          resumeUrl: faker.internet.url(),
          status: faker.helpers.arrayElement(['PENDING', 'SHORTLISTED', 'REJECTED', 'HIRED']),
        },
      }).catch(() => null); // ignore duplicates
    })
  );
  console.log('✅ Applications created');

  // Create 5 Blogs
  const blogTopics = [
    { title: 'Top 10 In-Demand Tech Skills in Bangladesh 2025', category: 'Career Tips' },
    { title: 'How to Write a CV That Gets You Hired in Dhaka', category: 'CV Writing' },
    { title: 'Salary Guide: What to Expect in Bangladesh IT Sector', category: 'Salary' },
    { title: 'Remote Work Opportunities for Bangladeshi Professionals', category: 'Remote Work' },
    { title: 'Interview Tips for Top Companies in Bangladesh', category: 'Interview' },
  ];

  await Promise.all(
    blogTopics.map(async (topic, i) => prisma.blog.create({
      data: {
        title: topic.title,
        slug: topic.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        content: faker.lorem.paragraphs(8),
        coverImage: `https://picsum.photos/seed/${i + 10}/800/400`,
        category: topic.category,
        tags: [topic.category, 'Bangladesh', 'Career'],
        authorId: admin.id,
        isPublished: true,
      },
    }))
  );
  console.log('✅ Blogs created');

  console.log('\n🎉 Seed complete!');
  console.log('📧 Demo credentials:');
  console.log('   Admin:     admin@hireiq.com / Admin@123');
  console.log('   Employer:  employer@hireiq.com / Employer@123');
  console.log('   Jobseeker: user@hireiq.com / User@123');
  console.log('\n📖 Swagger docs: http://localhost:5000/api-docs');
}

main()
  .catch((e) => { console.error('❌ Seed failed:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
```

---

## 🔑 ENVIRONMENT VARIABLES (`.env.example`)

```env
# Database
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/hireiq?retryWrites=true&w=majority

# Server
PORT=5000
NODE_ENV=development

# JWT (MUST be at least 32 characters)
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_here
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_super_secret_refresh_key_minimum_32_chars_here
JWT_REFRESH_EXPIRES_IN=30d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:3000

# Google OAuth (optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

---

## 🚀 EXECUTION PHASES

### Phase 1 — Foundation
```bash
mkdir hireiq-backend && cd hireiq-backend
npm init -y
npm install [all deps from package.json above]
# Create tsconfig.json, .env from examples above
# Create src/config/index.ts
# Create src/app/utils/ApiError.ts, catchAsync.ts, sendResponse.ts
# Create src/app/middlewares/error.middleware.ts, auth.middleware.ts, validate.middleware.ts
# Create prisma/schema.prisma
npx prisma generate
npx prisma db push
```

### Phase 2 — Swagger + App Setup
```
1. Create src/swagger.ts (exact code above)
2. Create src/app.ts (exact code above with Swagger UI at /api-docs)
3. Create src/server.ts (Prisma connect + listen)
4. Create src/app/routes/index.ts (empty initially)
VERIFY: GET http://localhost:5000/health returns success JSON
VERIFY: GET http://localhost:5000/api-docs shows Swagger UI
```

### Phase 3 — Auth Module
```
All 4 files: auth.route.ts, auth.controller.ts, auth.service.ts, auth.validation.ts
Every route has @swagger JSDoc annotation
VERIFY: POST /api/v1/auth/register → creates user
VERIFY: POST /api/v1/auth/login → returns tokens
VERIFY: Swagger shows both endpoints with correct schemas
```

### Phase 4 — User + Job Modules
```
user module: profile CRUD, resume upload
job module: full CRUD + ALL filters working:
  searchTerm (case-insensitive contains on title/description/companyName)
  category (exact match)
  type (exact enum match)
  district (exact match)
  salaryMin (job.salaryMin >= value)
  salaryMax (job.salaryMax <= value)
  status (default OPEN)
  isFeatured (boolean)
  page + limit (default 1, 12)
  sortBy: newest=createdAt desc | salary-high=salaryMax desc | salary-low=salaryMin asc | most-viewed=views desc
VERIFY: All filters work in Swagger, pagination meta always returned
```

### Phase 5 — Application Module
```
All CRUD endpoints
VERIFY: Jobseeker can apply, Employer can update status
```

### Phase 6 — Reviews, Blog, Contact, Stats
```
Stats: complete implementation from stats.service.ts above
VERIFY: /api/v1/stats/overview returns:
  totalJobs, totalUsers, totalApplications, totalHired,
  jobsByCategory (array), applicationsByStatus (array), monthlyData (6 months array)
```

### Phase 7 — AI Module
```
All 4 features using exact ai.service.ts code above
VERIFY: CV Analyzer returns valid JSON with all fields
VERIFY: Job Matcher returns 5 matches with jobId, matchScore, matchReason, skillGap
VERIFY: Interview Coach returns technicalQuestions, behavioralQuestions, salaryNegotiationTips
```

### Phase 8 — Seed + Final
```
Run: npm run seed
VERIFY: 
  Admin login works: admin@hireiq.com / Admin@123
  Employer login: employer@hireiq.com / Employer@123
  Jobseeker login: user@hireiq.com / User@123
  GET /api/v1/jobs returns 40 jobs
  GET /api/v1/stats/overview returns all chart data
  Swagger UI at /api-docs shows all routes organized by tag
```

---

## 🚫 ABSOLUTE RULES

| ❌ NEVER | ✅ ALWAYS |
|----------|----------|
| Use `any` TypeScript type | Strict interfaces everywhere |
| Leave console.log in production | Remove all debug logs |
| Return Gemini raw text as AI response | Always parseGeminiJSON() |
| Skip @swagger JSDoc on routes | Every route has swagger annotation |
| Hardcode credentials | Use config object from config/index.ts |
| Skip error handling on Gemini calls | Wrap in try/catch, return ApiError |
| Return 200 on errors | Correct status codes always |
| Skip pagination meta | Always return { total, page, limit, totalPages } |
