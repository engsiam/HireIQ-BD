import { Response } from 'express';
import prisma from '../../../prisma/client';
import ApiError from '../../utils/ApiError';
import sendResponse from '../../utils/sendResponse';
import { AuthRequest } from '../../middlewares/auth.middleware';

export const createReview = async (req: AuthRequest, res: Response) => {
  const { jobId, rating, comment } = req.body;

  const existingReview = await prisma.review.findFirst({
    where: { jobId, userId: req.user?.id },
  });

  if (existingReview) {
    throw new ApiError(400, 'You have already reviewed this job');
  }

  const application = await prisma.application.findFirst({
    where: { jobId, userId: req.user?.id, status: 'HIRED' },
  });

  if (!application) {
    throw new ApiError(403, 'Only hired candidates can review');
  }

  const review = await prisma.review.create({
    data: {
      jobId,
      userId: req.user?.id as string,
      rating,
      comment,
    },
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Review submitted successfully',
    data: review,
  });
};

export const getJobReviews = async (req: AuthRequest, res: Response) => {
  const { jobId } = req.params;

  const reviews = await prisma.review.findMany({
    where: { jobId },
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { id: true, name: true, avatar: true } },
    },
  });

  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Job reviews retrieved successfully',
    data: reviews,
    meta: { avgRating: Number(avgRating.toFixed(1)), totalReviews: reviews.length },
  });
};