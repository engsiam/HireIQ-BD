import { Router } from 'express';
import catchAsync from '../../utils/catchAsync';
import { validateRequest } from '../../middlewares/validate.middleware';
import { authGuard } from '../../middlewares/auth.middleware';
import {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  incrementJobViews,
  getMyJobs,
  getJobsByCompany,
} from './job.controller';
import { createJobValidation, updateJobValidation } from './job.validation';

const router = Router();

/**
 * @swagger
 * /jobs:
 *   get:
 *     tags: [Jobs]
 *     summary: Get all jobs with filters
 *     parameters:
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [FULL_TIME, PART_TIME, REMOTE, CONTRACT, INTERNSHIP]
 *       - in: query
 *         name: district
 *         schema:
 *           type: string
 *       - in: query
 *         name: salaryMin
 *         schema:
 *           type: number
 *       - in: query
 *         name: salaryMax
 *         schema:
 *           type: number
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [OPEN, CLOSED, DRAFT]
 *       - in: query
 *         name: isFeatured
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 12
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [newest, salary-high, salary-low, most-viewed]
 *     responses:
 *       200:
 *         description: Jobs list
 */
router.get('/', catchAsync(getJobs));

/**
 * @swagger
 * /jobs/my:
 *   get:
 *     tags: [Jobs]
 *     summary: Get my posted jobs
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: My jobs list
 */
router.get('/my', authGuard('EMPLOYER', 'ADMIN'), catchAsync(getMyJobs));

router.get('/company/:companyId', catchAsync(getJobsByCompany));

/**
 * @swagger
 * /jobs/{id}:
 *   get:
 *     tags: [Jobs]
 *     summary: Get job by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job details
 *       404:
 *         description: Job not found
 */
router.get('/:id', catchAsync(getJobById));

/**
 * @swagger
 * /jobs/view/{id}:
 *   post:
 *     tags: [Jobs]
 *     summary: Increment job view count
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: View count updated
 */
router.post('/view/:id', catchAsync(incrementJobViews));

/**
 * @swagger
 * /jobs:
 *   post:
 *     tags: [Jobs]
 *     summary: Create a new job
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
 *               - description
 *               - type
 *               - category
 *               - location
 *               - district
 *               - salary
 *               - companyName
 *               - deadline
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               requirements:
 *                 type: array
 *                 items:
 *                   type: string
 *               responsibilities:
 *                 type: array
 *                 items:
 *                   type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               type:
 *                 type: string
 *                 enum: [FULL_TIME, PART_TIME, REMOTE, CONTRACT, INTERNSHIP]
 *               category:
 *                 type: string
 *               location:
 *                 type: string
 *               district:
 *                 type: string
 *               salary:
 *                 type: string
 *               salaryMin:
 *                 type: number
 *               salaryMax:
 *                 type: number
 *               deadline:
 *                 type: string
 *                 format: date-time
 *               companyName:
 *                 type: string
 *               companyLogo:
 *                 type: string
 *               companyWebsite:
 *                 type: string
 *     responses:
 *       201:
 *         description: Job created
 */
router.post('/', authGuard('EMPLOYER', 'ADMIN'), validateRequest(createJobValidation), catchAsync(createJob));

/**
 * @swagger
 * /jobs/{id}:
 *   patch:
 *     tags: [Jobs]
 *     summary: Update a job
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
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [OPEN, CLOSED, DRAFT]
 *     responses:
 *       200:
 *         description: Job updated
 */
router.patch('/:id', authGuard('EMPLOYER', 'ADMIN'), validateRequest(updateJobValidation), catchAsync(updateJob));

/**
 * @swagger
 * /jobs/{id}:
 *   delete:
 *     tags: [Jobs]
 *     summary: Delete a job
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
 *         description: Job deleted
 */
router.delete('/:id', authGuard('EMPLOYER', 'ADMIN'), catchAsync(deleteJob));

export default router;
