import { Router } from 'express';
import catchAsync from '../../utils/catchAsync';
import { validateRequest } from '../../middlewares/validate.middleware';
import { authGuard } from '../../middlewares/auth.middleware';
import * as contactController from './contact.controller';
import { submitContactValidation } from './contact.validation';

const router = Router();

/**
 * @swagger
 * /contact:
 *   post:
 *     tags: [Contact]
 *     summary: Submit contact form
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - subject
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               subject:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message sent
 */
router.post('/', validateRequest(submitContactValidation), catchAsync(contactController.submitContact));

/**
 * @swagger
 * /contact:
 *   get:
 *     tags: [Contact]
 *     summary: Get all contact messages (Admin only)
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
 *     responses:
 *       200:
 *         description: Contact messages
 */
router.get('/', authGuard('ADMIN'), catchAsync(contactController.getContacts));

/**
 * @swagger
 * /contact/{id}:
 *   get:
 *     tags: [Contact]
 *     summary: Get contact message by ID (Admin only)
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
 *         description: Contact message
 */
router.get('/:id', authGuard('ADMIN'), catchAsync(contactController.getContactById));

/**
 * @swagger
 * /contact/{id}/read:
 *   patch:
 *     tags: [Contact]
 *     summary: Mark contact as read (Admin only)
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
 *         description: Marked as read
 */
router.patch('/:id/read', authGuard('ADMIN'), catchAsync(contactController.markAsRead));

/**
 * @swagger
 * /contact/{id}/reply:
 *   post:
 *     tags: [Contact]
 *     summary: Reply to contact (Admin only)
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
 *               - reply
 *             properties:
 *               reply:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reply sent
 */
router.post('/:id/reply', authGuard('ADMIN'), catchAsync(contactController.replyToContact));

/**
 * @swagger
 * /contact/{id}:
 *   delete:
 *     tags: [Contact]
 *     summary: Delete contact message (Admin only)
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
 *         description: Message deleted
 */
router.delete('/:id', authGuard('ADMIN'), catchAsync(contactController.deleteContact));

export default router;
