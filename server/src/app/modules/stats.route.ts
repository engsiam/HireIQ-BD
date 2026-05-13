import { Router } from 'express';
import { authGuard } from '../middlewares/auth.middleware';
import { getStatsOverview } from './stats.controller';

const router = Router();

/**
 * @swagger
 * /stats/overview:
 *   get:
 *     tags: [Stats]
 *     summary: Get dashboard statistics
 *     description: Returns overview statistics including total jobs, users, applications, hired count, monthly data, and category breakdown
 *     responses:
 *       200:
 *         description: Statistics overview
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalJobs:
 *                       type: number
 *                     totalUsers:
 *                       type: number
 *                     totalApplications:
 *                       type: number
 *                     totalHired:
 *                       type: number
 *                     jobsByCategory:
 *                       type: array
 *                     applicationsByStatus:
 *                       type: array
 *                     monthlyData:
 *                       type: array
 */
router.get('/overview', getStatsOverview);

export default router;
