import { Response } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../../../prisma/client';
import ApiError from '../../utils/ApiError';
import sendResponse from '../../utils/sendResponse';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { uploadToCloudinary } from '../../utils/cloudinary';
import env from '../../../config';

export const getSession = async (req: AuthRequest, res: Response) => {
  const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies?.accessToken;
  
  if (!token) {
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'No session',
      data: { isAuthenticated: false, user: null },
    });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        phone: true,
        location: true,
        bio: true,
        skills: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'User not found',
        data: { isAuthenticated: false, user: null },
      });
    }

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Session valid',
      data: { isAuthenticated: true, user },
    });
  } catch {
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Invalid token',
      data: { isAuthenticated: false, user: null },
    });
  }
};

export const getMyProfile = async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user?.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
      phone: true,
      location: true,
      bio: true,
      skills: true,
      resumeUrl: true,
      savedJobs: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Profile retrieved successfully',
    data: user,
  });
};

export const updateMyProfile = async (req: AuthRequest, res: Response) => {
  const { name, phone, location, bio, skills, avatar } = req.body;

  const user = await prisma.user.update({
    where: { id: req.user?.id },
    data: {
      ...(name && { name }),
      ...(phone && { phone }),
      ...(location && { location }),
      ...(bio && { bio }),
      ...(skills && { skills }),
      ...(avatar && { avatar }),
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
      phone: true,
      location: true,
      bio: true,
      skills: true,
    },
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Profile updated successfully',
    data: user,
  });
};

export const uploadResume = async (req: AuthRequest, res: Response) => {
  const file = req.file;

  if (!file) {
    throw new ApiError(400, 'Resume file is required');
  }

  const result = await uploadToCloudinary(file.path, 'resumes', 'raw');

  const user = await prisma.user.update({
    where: { id: req.user?.id },
    data: { resumeUrl: result.secure_url },
    select: {
      id: true,
      resumeUrl: true,
    },
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Resume uploaded successfully',
    data: user,
  });
};

export const uploadAvatar = async (req: AuthRequest, res: Response) => {
  const file = req.file;

  if (!file) {
    throw new ApiError(400, 'Avatar file is required');
  }

  const result = await uploadToCloudinary(file.path, 'avatars', 'image');

  const user = await prisma.user.update({
    where: { id: req.user?.id },
    data: { avatar: result.secure_url },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
      phone: true,
      location: true,
      bio: true,
      skills: true,
    },
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Avatar uploaded successfully',
    data: user,
  });
};

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  const { page = 1, limit = 12, search, role } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { name: { contains: search as string, mode: 'insensitive' } },
      { email: { contains: search as string, mode: 'insensitive' } },
    ];
  }

  if (role) {
    where.role = role;
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: Number(limit),
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where }),
  ]);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Users retrieved successfully',
    data: users,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  });
};

export const updateUserStatus = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { isActive } = req.body;

  const user = await prisma.user.update({
    where: { id },
    data: { isActive },
    select: {
      id: true,
      name: true,
      email: true,
      isActive: true,
    },
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
    data: user,
  });
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  await prisma.user.delete({
    where: { id },
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User deleted successfully',
  });
};

export const toggleSaveJob = async (req: AuthRequest, res: Response) => {
  const { jobId } = req.body;
  const userId = req.user?.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { savedJobs: true },
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const savedJobs = user.savedJobs || [];
  const isSaved = savedJobs.includes(jobId);

  let updatedJobs: string[];
  if (isSaved) {
    updatedJobs = savedJobs.filter((id) => id !== jobId);
  } else {
    updatedJobs = [...savedJobs, jobId];
  }

  await prisma.user.update({
    where: { id: userId },
    data: { savedJobs: updatedJobs },
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: isSaved ? 'Job removed from saved' : 'Job saved successfully',
  });
};