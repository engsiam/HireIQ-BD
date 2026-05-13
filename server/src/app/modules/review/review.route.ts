import { Router } from 'express';
import catchAsync from '../../utils/catchAsync';
import { validateRequest } from '../../middlewares/validate.middleware';
import { authGuard } from '../../middlewares/auth.middleware';
import { createReview, getJobReviews } from './review.controller';
import { createReviewValidation } from './review.validation';

const router = Router();

/**
 * @swagger
 * /reviews:
 *   post:
 *     tags: [Reviews]
 *     summary: Create a review (Hired candidates only)
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
 *               - rating
 *               - comment
 *             properties:
 *               jobId:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review created
 *       400:
 *         description: Already reviewed
 *       403:
 *         description: Only hired candidates can review
 */
router.post('/', authGuard('JOBSEEKER'), validateRequest(createReviewValidation), catchAsync(createReview));

/**
 * @swagger
 * /reviews/job/{jobId}:
 *   get:
 *     tags: [Reviews]
 *     summary: Get job reviews
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job reviews
 */
router.get('/job/:jobId', catchAsync(getJobReviews));

export default router;
