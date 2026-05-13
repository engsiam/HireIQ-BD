import { z } from 'zod';

export const createBlogValidation = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  coverImage: z.string().url('Valid image URL is required'),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).default([]),
  isPublished: z.boolean().optional().default(false),
});

export const updateBlogValidation = createBlogValidation.partial();