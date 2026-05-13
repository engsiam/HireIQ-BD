export type UserRole = 'ADMIN' | 'EMPLOYER' | 'JOBSEEKER' | 'AGENT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  bio?: string;
  skills?: string[];
  location?: string;
  resume?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Company {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  description?: string;
  industry?: string;
  size?: string;
  location?: string;
  foundedYear?: number;
  employerId: string;
  createdAt: string;
}

export type JobType = 'FULL_TIME' | 'PART_TIME' | 'REMOTE' | 'CONTRACT' | 'INTERNSHIP';

export type JobStatus = 'ACTIVE' | 'OPEN' | 'CLOSED' | 'DRAFT';

export interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  skills: string[];
  jobType: JobType;
  salaryMin?: number;
  salaryMax?: number;
  location: string;
  district: string;
  deadline: string;
  status: JobStatus;
  isFeatured: boolean;
  categoryId: string;
  category?: Category;
  companyId: string;
  company: Company;
  employerId: string;
  employer?: User;
  _count?: {
    applications: number;
  };
  views?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  jobCount?: number;
  createdAt: string;
}

export type ApplicationStatus = 'PENDING' | 'SHORTLISTED' | 'INTERVIEW' | 'REJECTED' | 'HIRED';

export interface Application {
  id: string;
  userId: string;
  jobId: string;
  coverLetter: string;
  resume: string;
  status: ApplicationStatus;
  aiScore?: number;
  job: {
    id: string;
    title: string;
    company: {
      id: string;
      name: string;
      logo?: string;
    };
  };
  user?: User;
  createdAt: string;
  updatedAt?: string;
}

export interface Review {
  id: string;
  userId: string;
  jobId?: string;
  companyId?: string;
  rating: number;
  comment: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage: string;
  category: string;
  tags: string[];
  authorId: string;
  author?: {
    id: string;
    name: string;
    avatar?: string;
  };
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  reply?: string;
  repliedAt?: string;
  isRead: boolean;
  status?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Booking {
  id: string;
  userId: string;
  propertyId: string;
  amount: number;
  status: 'PENDING' | 'PAID' | 'CANCELLED' | 'REFUNDED';
  bKashTrxId?: string;
  paymentPhone?: string;
  createdAt: string;
  updatedAt?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  property?: {
    id: string;
    title: string;
    image?: string;
    location?: string;
  };
}

export interface Testimonial {
  id: string;
  name: string;
  avatar?: string;
  company?: string;
  position?: string;
  rating: number;
  comment: string;
  isActive: boolean;
  createdAt: string;
}

export interface Stats {
  totalJobs: number;
  totalCompanies: number;
  totalJobseekers: number;
  hiredThisMonth: number;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price?: number;
  size?: number;
  bhk?: number;
  city?: string;
  district?: string;
  location?: string;
  area?: string;
  type?: string;
  status?: string;
  amenities?: string[];
  images?: string[];
  agent?: {
    id?: string;
    name?: string;
    phone?: string;
    email?: string;
  };
  reviews?: Review[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AICVAnalysis {
  id: string;
  overallScore: number;
  atsScore: number;
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  improvementSuggestions: string[];
  summary: string;
  atsBreakdown?: {
    formatting: number;
    keywords: number;
    impact: number;
    clarity: number;
    relevance: number;
  };
  createdAt: string;
}

export interface AIJobMatch {
  jobId: string;
  matchPercentage: number;
  job: Job;
}

export interface AIInterviewPrep {
  technicalQuestions: { question: string; answer: string }[];
  behavioralQuestions: { question: string; answer: string }[];
  salaryTips: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface JobFilterParams {
  search?: string;
  category?: string;
  jobType?: JobType;
  district?: string;
  salaryMin?: number;
  salaryMax?: number;
  sort?: 'newest' | 'salary_high' | 'most_viewed';
  page?: number;
  limit?: number;
}