import { Response } from 'express';
import prisma from '../../../prisma/client';
import ApiError from '../../utils/ApiError';
import sendResponse from '../../utils/sendResponse';
import { AuthRequest } from '../../middlewares/auth.middleware';

export const getJobs = async (req: AuthRequest, res: Response) => {
  const {
    searchTerm,
    category,
    type,
    district,
    salaryMin,
    salaryMax,
    status = 'OPEN',
    isFeatured,
    page = 1,
    limit = 12,
    sortBy = 'newest',
  } = req.query as Record<string, string>;

  const skip = (Number(page) - 1) * Number(limit);

  const where: Record<string, unknown> = {
    status: status || 'OPEN',
  };

  if (searchTerm) {
    where.OR = [
      { title: { contains: searchTerm, mode: 'insensitive' } },
      { description: { contains: searchTerm, mode: 'insensitive' } },
      { companyName: { contains: searchTerm, mode: 'insensitive' } },
    ];
  }

  if (category) where.category = category;
  if (type) where.type = type;
  if (district) where.district = district;
  if (isFeatured !== undefined) where.isFeatured = isFeatured === 'true';

  if (salaryMin) {
    where.salaryMin = { ...(where.salaryMin as object), gte: Number(salaryMin) };
  }

  if (salaryMax) {
    where.salaryMax = { ...(where.salaryMax as object), lte: Number(salaryMax) };
  }

  let orderBy: Record<string, string> = { createdAt: 'desc' };
  if (sortBy === 'salary-high') orderBy = { salaryMax: 'desc' };
  if (sortBy === 'salary-low') orderBy = { salaryMin: 'asc' };
  if (sortBy === 'most-viewed') orderBy = { views: 'desc' };

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy,
      include: {
        employer: {
          select: { id: true, name: true, avatar: true },
        },
        _count: { select: { applications: true } },
      },
    }),
    prisma.job.count({ where }),
  ]);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Jobs retrieved successfully',
    data: jobs,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  });
};

export const getJobById = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      employer: {
        select: { id: true, name: true, avatar: true },
      },
      _count: { select: { applications: true, reviews: true } },
    },
  });

  if (!job) {
    throw new ApiError(404, 'Job not found');
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Job retrieved successfully',
    data: job,
  });
};

export const createJob = async (req: AuthRequest, res: Response) => {
  const jobData = req.body;

  const job = await prisma.job.create({
    data: {
      ...jobData,
      employerId: req.user?.id,
    },
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Job created successfully',
    data: job,
  });
};

export const updateJob = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const jobData = req.body;

  const existingJob = await prisma.job.findUnique({
    where: { id },
    select: { employerId: true },
  });

  if (!existingJob) {
    throw new ApiError(404, 'Job not found');
  }

  if (existingJob.employerId !== req.user?.id && req.user?.role !== 'ADMIN') {
    throw new ApiError(403, 'You can only update your own jobs');
  }

  const job = await prisma.job.update({
    where: { id },
    data: jobData,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Job updated successfully',
    data: job,
  });
};

export const deleteJob = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const existingJob = await prisma.job.findUnique({
    where: { id },
    select: { employerId: true },
  });

  if (!existingJob) {
    throw new ApiError(404, 'Job not found');
  }

  if (existingJob.employerId !== req.user?.id && req.user?.role !== 'ADMIN') {
    throw new ApiError(403, 'You can only delete your own jobs');
  }

  await prisma.job.delete({ where: { id } });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Job deleted successfully',
  });
};

export const incrementJobViews = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const job = await prisma.job.update({
    where: { id },
    data: { views: { increment: 1 } },
    select: { id: true, views: true },
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'View count updated',
    data: { views: job.views },
  });
};

export const getMyJobs = async (req: AuthRequest, res: Response) => {
  const { page = 1, limit = 12 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where: { employerId: req.user?.id },
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { applications: true } },
      },
    }),
    prisma.job.count({ where: { employerId: req.user?.id } }),
  ]);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'My jobs retrieved successfully',
    data: jobs,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  });
};