import { Router } from 'express';
import catchAsync from '../../utils/catchAsync';
import { validateRequest } from '../../middlewares/validate.middleware';
import { authGuard } from '../../middlewares/auth.middleware';
import {
  applyToJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  getAllApplications,
} from './application.controller';
import { applyJobValidation, updateApplicationStatusValidation } from './application.validation';

const router = Router();

/**
 * @swagger
 * /applications:
 *   post:
 *     tags: [Applications]
 *     summary: Apply to a job
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - jobId
 *               - coverLetter
 *               - resumeUrl
 *             properties:
 *               jobId:
 *                 type: string
 *               coverLetter:
 *                 type: string
 *               resumeUrl:
 *                 type: string
 *                 format: uri
 *     responses:
 *       201:
 *         description: Application submitted
 *       400:
 *         description: Already applied or job not available
 */
router.post('/', authGuard('JOBSEEKER'), validateRequest(applyJobValidation), catchAsync(applyToJob));

/**
 * @swagger
 * /applications/my:
 *   get:
 *     tags: [Applications]
 *     summary: Get my applications
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: My applications list
 */
router.get('/my', authGuard('JOBSEEKER'), catchAsync(getMyApplications));

/**
 * @swagger
 * /applications/job/{jobId}:
 *   get:
 *     tags: [Applications]
 *     summary: Get job applicants
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job applicants list
 */
router.get('/job/:jobId', authGuard('EMPLOYER', 'ADMIN'), catchAsync(getJobApplications));

/**
 * @swagger
 * /applications/{id}/status:
 *   patch:
 *     tags: [Applications]
 *     summary: Update application status
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [SHORTLISTED, REJECTED, HIRED]
 *     responses:
 *       200:
 *         description: Status updated
 */
router.patch('/:id/status', authGuard('EMPLOYER', 'ADMIN'), validateRequest(updateApplicationStatusValidation), catchAsync(updateApplicationStatus));

/**
 * @swagger
 * /applications/all:
 *   get:
 *     tags: [Applications]
 *     summary: Get all applications (Admin only)
 *     security:
 *       - bearerAuth: []
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
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: jobId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: All applications
 */
router.get('/all', authGuard('ADMIN'), catchAsync(getAllApplications));

export default router;
