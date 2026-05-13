import { Response } from 'express';
import prisma from '../../prisma/client';
import catchAsync from '../utils/catchAsync';
import sendResponse from '../utils/sendResponse';

export const getStatsOverview = catchAsync(async (req, res) => {
  const now = new Date();

  const [
    totalJobs,
    totalUsers,
    totalApplications,
    totalHired,
    jobsByCategory,
    applicationsByStatus,
  ] = await Promise.all([
    prisma.job.count({ where: { status: 'OPEN' } }),
    prisma.user.count({ where: { isActive: true } }),
    prisma.application.count(),
    prisma.application.count({ where: { status: 'HIRED' } }),
    prisma.job.groupBy({
      by: ['category'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 6,
    }),
    prisma.application.groupBy({
      by: ['status'],
      _count: { id: true },
    }),
  ]);

  const months = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);

    const [jobsCount, applicationsCount] = await Promise.all([
      prisma.job.count({ where: { createdAt: { gte: startOfMonth, lte: endOfMonth } } }),
      prisma.application.count({ where: { createdAt: { gte: startOfMonth, lte: endOfMonth } } }),
    ]);

    months.push({
      month: date.toLocaleString('default', { month: 'short' }),
      jobs: jobsCount,
      applications: applicationsCount,
    });
  }

  const recentApplications = await prisma.application.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true } },
      job: { select: { title: true, companyName: true } },
    },
  });

  const recentActivity = recentApplications.map((a) => ({
    user: a.user?.name || 'User',
    action: `applied to ${a.job?.title || 'job'}`,
    time: getRelativeTime(a.createdAt),
  }));

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Stats retrieved successfully',
    data: {
      totalJobs,
      totalUsers,
      totalApplications,
      totalHired,
      jobsByCategory: jobsByCategory.map(item => ({
        category: item.category,
        count: item._count.id,
      })),
      applicationsByStatus: applicationsByStatus.map(item => ({
        status: item.status,
        count: item._count.id,
      })),
      monthlyData: months,
      recentActivity,
    },
  });
});

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} mins ago`;
  if (hours < 24) return `${hours} hours ago`;
  return `${days} days ago`;
}