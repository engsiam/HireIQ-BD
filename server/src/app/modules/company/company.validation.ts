import { z } from 'zod';

export const companyValidation = {
  create: z.object({
    body: z.object({
      name: z.string().min(1, 'Company name is required'),
      logo: z.string().optional(),
      website: z.string().url().optional().or(z.literal('')),
      description: z.string().optional(),
      industry: z.string().optional(),
      size: z.string().optional(),
      location: z.string().optional(),
      district: z.string().optional(),
      foundedYear: z.number().optional(),
    }),
  }),

  update: z.object({
    body: z.object({
      name: z.string().min(1).optional(),
      logo: z.string().optional(),
      website: z.string().url().optional().or(z.literal('')),
      description: z.string().optional(),
      industry: z.string().optional(),
      size: z.string().optional(),
      location: z.string().optional(),
      district: z.string().optional(),
      foundedYear: z.number().optional(),
    }),
  }),
};