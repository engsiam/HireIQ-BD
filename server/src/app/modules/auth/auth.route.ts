import { Router } from 'express';
import catchAsync from '../../utils/catchAsync';
import { validateRequest } from '../../middlewares/validate.middleware';
import { registerValidation, loginValidation, refreshTokenValidation } from './auth.validation';
import { register, login, googleAuth, refreshToken, logout, getMe } from './auth.controller';
import { authGuard } from '../../middlewares/auth.middleware';
import env, { getServerUrl } from '../../../config';

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               role:
 *                 type: string
 *                 enum: [EMPLOYER, JOBSEEKER]
 *     responses:
 *       201:
 *         description: User registered successfully
 *       409:
 *         description: Email already registered
 */
router.post('/register', validateRequest(registerValidation), catchAsync(register));

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', validateRequest(loginValidation), catchAsync(login));

/**
 * @swagger
 * /auth/google:
 *   get:
 *     tags: [Auth]
 *     summary: Redirect to Google OAuth
 *     responses:
 *       302:
 *         description: Redirect to Google
 */
router.get('/google', (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const clientUrl = isProduction
    ? 'https://hire-iq-bd.vercel.app'
    : (env.CLIENT_URL || 'http://localhost:3000');
  const googleClientId = env.GOOGLE_CLIENT_ID;

  if (!googleClientId) {
    return res.redirect(`${clientUrl}/login?error=google_not_configured`);
  }

  // Must match exactly one "Authorized redirect URI" in Google Cloud Console
  const serverBase = isProduction
    ? 'https://hireiq-bd.onrender.com'
    : getServerUrl();

  const redirectUri = `${serverBase}/api/v1/auth/google/callback`;
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid%20email%20profile&access_type=offline&prompt=consent`;

  res.redirect(googleAuthUrl);
});

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     tags: [Auth]
 *     summary: Google OAuth callback
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirect to client
 */
router.get('/google/callback', catchAsync(googleAuth));

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     tags: [Auth]
 *     summary: Refresh access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Invalid refresh token
 */
router.post('/refresh-token', validateRequest(refreshTokenValidation), catchAsync(refreshToken));

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post('/logout', authGuard(), catchAsync(logout));

/**
 * @swagger
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get current authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User data retrieved successfully
 *       401:
 *         description: Not authenticated
 */
router.get('/me', authGuard(), catchAsync(getMe));

export default router;
