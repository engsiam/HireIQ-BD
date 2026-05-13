import { z } from 'zod';

export const cvAnalyzeValidation = z.object({
  cvText: z.string().min(1, 'CV text is required').max(5000, 'CV text must be less than 5000 characters'),
  jobTitle: z.string().optional(),
});

export const jobMatchValidation = z.object({
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
  experience: z.string().min(1, 'Experience is required'),
  preferredLocation: z.string().optional(),
});

export const interviewPrepValidation = z.object({
  jobTitle: z.string().min(1, 'Job title is required'),
  jobDescription: z.string().optional(),
  experienceLevel: z.string().min(1, 'Experience level is required'),
});

export const chatValidation = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).optional(),
});