import { z } from 'zod';

export const registerValidation = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['EMPLOYER', 'JOBSEEKER']).optional().default('JOBSEEKER'),
});

export const loginValidation = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

/** Body optional: refresh token may be sent only via httpOnly cookie (browser clients). */
export const refreshTokenValidation = z.object({
  refreshToken: z.string().min(1).optional(),
});