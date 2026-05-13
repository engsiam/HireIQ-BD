import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000'),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('7d'),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  GROQ_API_KEY: z.string().optional(),
  GROQ_MODEL: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  CLIENT_URL: z.string().optional(),
  SERVER_URL: z.string().optional(),
});

const env = envSchema.parse(process.env);

export function getClientUrl(): string {
  if (!env.CLIENT_URL) {
    throw new Error('CLIENT_URL environment variable is required');
  }
  return env.CLIENT_URL;
}

export function getServerUrl(): string {
  if (!env.SERVER_URL) {
    return `http://localhost:${env.PORT}`;
  }
  return env.SERVER_URL;
}

export default env;