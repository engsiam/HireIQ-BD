import { z } from 'zod';

export const createReviewValidation = z.object({
  jobId: z.string().min(1, 'Job ID is required'),
  rating: z.number().min(1).max(5, 'Rating must be between 1 and 5'),
  comment: z.string().min(1, 'Comment is required'),
});