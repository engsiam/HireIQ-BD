import { Router } from 'express';
import catchAsync from '../../utils/catchAsync';
import { validateRequest } from '../../middlewares/validate.middleware';
import { authGuard } from '../../middlewares/auth.middleware';
import {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlogsAdmin,
} from './blog.controller';
import { createBlogValidation, updateBlogValidation } from './blog.validation';

const router = Router();

/**
 * @swagger
 * /blogs:
 *   get:
 *     tags: [Blogs]
 *     summary: Get all published blogs
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blogs list
 */
router.get('/', catchAsync(getBlogs));

/**
 * @swagger
 * /blogs/all:
 *   get:
 *     tags: [Blogs]
 *     summary: Get all blogs (Admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All blogs
 */
router.get('/all', authGuard('ADMIN'), catchAsync(getAllBlogsAdmin));

/**
 * @swagger
 * /blogs/{slug}:
 *   get:
 *     tags: [Blogs]
 *     summary: Get blog by slug
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog details
 *       404:
 *         description: Blog not found
 */
router.get('/:slug', catchAsync(getBlogBySlug));

/**
 * @swagger
 * /blogs:
 *   post:
 *     tags: [Blogs]
 *     summary: Create a blog (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - coverImage
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               coverImage:
 *                 type: string
 *                 format: uri
 *               category:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               isPublished:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Blog created
 */
router.post('/', authGuard('ADMIN'), validateRequest(createBlogValidation), catchAsync(createBlog));

/**
 * @swagger
 * /blogs/{id}:
 *   patch:
 *     tags: [Blogs]
 *     summary: Update a blog (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               isPublished:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Blog updated
 */
router.patch('/:id', authGuard('ADMIN'), validateRequest(updateBlogValidation), catchAsync(updateBlog));

/**
 * @swagger
 * /blogs/{id}:
 *   delete:
 *     tags: [Blogs]
 *     summary: Delete a blog (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog deleted
 */
router.delete('/:id', authGuard('ADMIN'), catchAsync(deleteBlog));

export default router;
