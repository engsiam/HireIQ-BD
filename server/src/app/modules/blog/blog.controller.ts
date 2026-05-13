import { Response } from 'express';
import prisma from '../../../prisma/client';
import ApiError from '../../utils/ApiError';
import sendResponse from '../../utils/sendResponse';
import { AuthRequest } from '../../middlewares/auth.middleware';

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') +
    '-' +
    Date.now().toString(36);
};

export const getBlogs = async (req: AuthRequest, res: Response) => {
  const { page = 1, limit = 12, category } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const where: Record<string, unknown> = { isPublished: true };
  if (category) where.category = category;

  const [blogs, total] = await Promise.all([
    prisma.blog.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
      },
    }),
    prisma.blog.count({ where }),
  ]);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Blogs retrieved successfully',
    data: blogs,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  });
};

export const getBlogBySlug = async (req: AuthRequest, res: Response) => {
  const { slug } = req.params;

  const blog = await prisma.blog.findUnique({
    where: { slug },
    include: {
      author: { select: { id: true, name: true, avatar: true } },
    },
  });

  if (!blog) {
    throw new ApiError(404, 'Blog not found');
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Blog retrieved successfully',
    data: blog,
  });
};

export const createBlog = async (req: AuthRequest, res: Response) => {
  const blogData = req.body;

  const blog = await prisma.blog.create({
    data: {
      ...blogData,
      slug: generateSlug(blogData.title),
      authorId: req.user?.id as string,
    },
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Blog created successfully',
    data: blog,
  });
};

export const updateBlog = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const blogData = req.body;

  const existingBlog = await prisma.blog.findUnique({
    where: { id },
    select: { authorId: true },
  });

  if (!existingBlog) {
    throw new ApiError(404, 'Blog not found');
  }

  if (existingBlog.authorId !== req.user?.id && req.user?.role !== 'ADMIN') {
    throw new ApiError(403, 'You can only update your own blogs');
  }

  const blog = await prisma.blog.update({
    where: { id },
    data: blogData,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Blog updated successfully',
    data: blog,
  });
};

export const deleteBlog = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const existingBlog = await prisma.blog.findUnique({
    where: { id },
    select: { authorId: true },
  });

  if (!existingBlog) {
    throw new ApiError(404, 'Blog not found');
  }

  if (existingBlog.authorId !== req.user?.id && req.user?.role !== 'ADMIN') {
    throw new ApiError(403, 'You can only delete your own blogs');
  }

  await prisma.blog.delete({ where: { id } });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Blog deleted successfully',
  });
};

export const getAllBlogsAdmin = async (req: AuthRequest, res: Response) => {
  const { page = 1, limit = 12 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const [blogs, total] = await Promise.all([
    prisma.blog.findMany({
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { id: true, name: true } },
      },
    }),
    prisma.blog.count(),
  ]);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All blogs retrieved successfully',
    data: blogs,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  });
};