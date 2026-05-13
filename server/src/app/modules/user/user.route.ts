import { Router } from 'express';
import catchAsync from '../../utils/catchAsync';
import { validateRequest } from '../../middlewares/validate.middleware';
import { authGuard } from '../../middlewares/auth.middleware';
import {
  getMyProfile,
  updateMyProfile,
  uploadResume,
  uploadAvatar,
  getAllUsers,
  updateUserStatus,
  deleteUser,
  toggleSaveJob,
  getSession,
} from './user.controller';
import { updateProfileValidation, updateUserStatusValidation } from './user.validation';
import { uploadResume as resumeUpload, uploadAvatar as avatarUpload } from '../../middlewares/upload.middleware';

const router = Router();

/**
 * @swagger
 * /users/session:
 *   get:
 *     tags: [Users]
 *     summary: Check current session
 *     responses:
 *       200:
 *         description: Session info
 *       401:
 *         description: Not authenticated
 */
router.get('/session', catchAsync(getSession));

/**
 * @swagger
 * /users/me:
 *   get:
 *     tags: [Users]
 *     summary: Get current user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved
 *       401:
 *         description: Unauthorized
 */
router.get('/me', authGuard(), catchAsync(getMyProfile));

/**
 * @swagger
 * /users/me:
 *   patch:
 *     tags: [Users]
 *     summary: Update current user profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               location:
 *                 type: string
 *               bio:
 *                 type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               avatar:
 *                 type: string
 *                 format: uri
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.patch('/me', authGuard(), validateRequest(updateProfileValidation), catchAsync(updateMyProfile));

/**
 * @swagger
 * /users/upload-resume:
 *   post:
 *     tags: [Users]
 *     summary: Upload resume (Jobseeker only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - resume
 *             properties:
 *               resume:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Resume uploaded
 *       400:
 *         description: No file provided
 */
router.post('/upload-resume', authGuard('JOBSEEKER'), resumeUpload.single('resume'), catchAsync(uploadResume));

/**
 * @swagger
 * /users/upload-avatar:
 *   post:
 *     tags: [Users]
 *     summary: Upload avatar image
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - avatar
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar uploaded
 *       400:
 *         description: No file provided
 */
router.post('/upload-avatar', authGuard(), avatarUpload.single('avatar'), catchAsync(uploadAvatar));

/**
 * @swagger
 * /users/save-job:
 *   post:
 *     tags: [Users]
 *     summary: Save or unsave a job
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
 *             properties:
 *               jobId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Job saved/unsaved
 */
router.post('/save-job', authGuard(), catchAsync(toggleSaveJob));

/**
 * @swagger
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: Get all users (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [ADMIN, EMPLOYER, JOBSEEKER]
 *     responses:
 *       200:
 *         description: Users list
 *       403:
 *         description: Forbidden
 */
router.get('/', authGuard('ADMIN', 'EMPLOYER'), catchAsync(getAllUsers));

/**
 * @swagger
 * /users/{id}/status:
 *   patch:
 *     tags: [Users]
 *     summary: Toggle user active status (Admin only)
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
 *               - isActive
 *             properties:
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User status updated
 */
router.patch('/:id/status', authGuard('ADMIN'), validateRequest(updateUserStatusValidation), catchAsync(updateUserStatus));

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete user (Admin only)
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
 *         description: User deleted
 */
router.delete('/:id', authGuard('ADMIN'), catchAsync(deleteUser));

export default router;
