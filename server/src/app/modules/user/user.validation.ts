import { z } from 'zod';

export const updateProfileValidation = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
  skills: z.array(z.string()).optional(),
  avatar: z.string().url().optional(),
});

export const updateUserStatusValidation = z.object({
  isActive: z.boolean(),
});