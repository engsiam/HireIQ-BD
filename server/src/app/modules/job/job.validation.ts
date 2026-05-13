import { z } from 'zod';

export const createJobValidation = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  requirements: z.array(z.string()).default([]),
  responsibilities: z.array(z.string()).default([]),
  skills: z.array(z.string()).default([]),
  type: z.enum(['FULL_TIME', 'PART_TIME', 'REMOTE', 'CONTRACT', 'INTERNSHIP']),
  category: z.string().min(1, 'Category is required'),
  location: z.string().min(1, 'Location is required'),
  district: z.string().min(1, 'District is required'),
  salary: z.string().min(1, 'Salary is required'),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  deadline: z.string().transform((str) => new Date(str)),
  companyName: z.string().min(1, 'Company name is required'),
  companyLogo: z.string().url().optional(),
  companyWebsite: z.string().url().optional(),
});

export const updateJobValidation = createJobValidation.partial();

export const jobFiltersValidation = z.object({
  query: z.object({
    searchTerm: z.string().optional(),
    category: z.string().optional(),
    type: z.enum(['FULL_TIME', 'PART_TIME', 'REMOTE', 'CONTRACT', 'INTERNSHIP']).optional(),
    district: z.string().optional(),
    salaryMin: z.coerce.number().optional(),
    salaryMax: z.coerce.number().optional(),
    status: z.enum(['OPEN', 'CLOSED', 'DRAFT']).optional(),
    isFeatured: z.coerce.boolean().optional(),
    page: z.coerce.number().default(1),
    limit: z.coerce.number().default(12),
    sortBy: z.enum(['newest', 'salary-high', 'salary-low', 'most-viewed']).optional(),
  }),
});