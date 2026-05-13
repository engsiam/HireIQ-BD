import { z } from 'zod';

export const applyJobValidation = z.object({
  jobId: z.string().min(1, 'Job ID is required'),
  coverLetter: z.string().min(1, 'Cover letter is required'),
  resumeUrl: z.string().optional(),
});

export const updateApplicationStatusValidation = z.object({
  status: z.enum(['SHORTLISTED', 'REJECTED', 'HIRED']),
});