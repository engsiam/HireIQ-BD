import prisma from '../../../prisma/client';
import ApiError from '../../utils/ApiError';

export const createReview = async (
  userId: string,
  jobId: string,
  rating: number,
  comment: string
) => {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
  });

  if (!job) {
    throw new ApiError(404, 'Job not found');
  }

  const existingReview = await prisma.review.findFirst({
    where: { userId, jobId },
  });

  if (existingReview) {
    throw new ApiError(400, 'You have already reviewed this job');
  }

  const review = await prisma.review.create({
    data: {
      userId,
      jobId,
      rating,
      comment,
    },
    include: {
      user: {
        select: { id: true, name: true, avatar: true },
      },
    },
  });

  return review;
};

export const getJobReviews = async (jobId: string) => {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
  });

  if (!job) {
    throw new ApiError(404, 'Job not found');
  }

  return prisma.review.findMany({
    where: { jobId },
    include: {
      user: {
        select: { id: true, name: true, avatar: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};