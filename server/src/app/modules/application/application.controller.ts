import { Response } from 'express';
import prisma from '../../../prisma/client';
import ApiError from '../../utils/ApiError';
import sendResponse from '../../utils/sendResponse';
import { AuthRequest } from '../../middlewares/auth.middleware';

export const applyToJob = async (req: AuthRequest, res: Response) => {
  const { jobId, coverLetter, resumeUrl } = req.body;
  const userId = req.user?.id;

  const existingApplication = await prisma.application.findFirst({
    where: { jobId, userId },
  });

  if (existingApplication) {
    throw new ApiError(400, 'You have already applied to this job');
  }

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: { status: true, employerId: true },
  });

  if (!job || job.status !== 'OPEN') {
    throw new ApiError(400, 'Job is not available for applications');
  }

  const application = await prisma.application.create({
    data: {
      jobId,
      userId: userId as string,
      coverLetter,
      resumeUrl,
    },
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Application submitted successfully',
    data: application,
  });
};

export const getMyApplications = async (req: AuthRequest, res: Response) => {
  const { page = 1, limit = 12 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const [applications, total] = await Promise.all([
    prisma.application.findMany({
      where: { userId: req.user?.id },
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            companyName: true,
            companyLogo: true,
            location: true,
            type: true,
          },
        },
      },
    }),
    prisma.application.count({ where: { userId: req.user?.id } }),
  ]);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'My applications retrieved successfully',
    data: applications,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  });
};

export const getJobApplications = async (req: AuthRequest, res: Response) => {
  const { jobId } = req.params;
  const { page = 1, limit = 12 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: { employerId: true },
  });

  if (!job) {
    throw new ApiError(404, 'Job not found');
  }

  if (job.employerId !== req.user?.id && req.user?.role !== 'ADMIN') {
    throw new ApiError(403, 'You can only view applications for your own jobs');
  }

  const [applications, total] = await Promise.all([
    prisma.application.findMany({
      where: { jobId },
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            phone: true,
            skills: true,
            resumeUrl: true,
          },
        },
      },
    }),
    prisma.application.count({ where: { jobId } }),
  ]);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Job applications retrieved successfully',
    data: applications,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  });
};

export const updateApplicationStatus = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const application = await prisma.application.findUnique({
    where: { id },
    include: { job: { select: { employerId: true } } },
  });

  if (!application) {
    throw new ApiError(404, 'Application not found');
  }

  if (application.job.employerId !== req.user?.id && req.user?.role !== 'ADMIN') {
    throw new ApiError(403, 'You can only update applications for your own jobs');
  }

  const updatedApplication = await prisma.application.update({
    where: { id },
    data: { status },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Application status updated successfully',
    data: updatedApplication,
  });
};

export const getAllApplications = async (req: AuthRequest, res: Response) => {
  const { page = 1, limit = 12, status, jobId } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const where: Record<string, unknown> = {};

  if (status) where.status = status;
  if (jobId) where.jobId = jobId;

  const [applications, total] = await Promise.all([
    prisma.application.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true } },
        job: { select: { id: true, title: true, companyName: true } },
      },
    }),
    prisma.application.count({ where }),
  ]);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All applications retrieved successfully',
    data: applications,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  });
};