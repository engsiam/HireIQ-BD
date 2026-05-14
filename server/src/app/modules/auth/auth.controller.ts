import { Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import prisma from '../../../prisma/client';
import ApiError from '../../utils/ApiError';
import sendResponse from '../../utils/sendResponse';
import env, { getServerUrl } from '../../../config';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { getCrossDomainCookieOptions } from '../../utils/cookie';

const generateTokens = (userId: string, role: string) => {
  const accessTokenOptions: SignOptions = { expiresIn: '7d' };
  const refreshTokenOptions: SignOptions = { expiresIn: '30d' };

  const accessToken = jwt.sign(
    { id: userId, role },
    env.JWT_SECRET,
    accessTokenOptions
  );

  const refreshToken = jwt.sign(
    { id: userId, role },
    env.JWT_REFRESH_SECRET,
    refreshTokenOptions
  );

  return { accessToken, refreshToken };
};

const setTokenCookies = (res: Response, accessToken: string, refreshToken: string) => {
  const accessMaxAge = 7 * 24 * 60 * 60 * 1000;
  const refreshMaxAge = 30 * 24 * 60 * 60 * 1000;

  res.cookie('accessToken', accessToken, getCrossDomainCookieOptions(accessMaxAge / 1000));
  res.cookie('refreshToken', refreshToken, getCrossDomainCookieOptions(refreshMaxAge / 1000));
};

export const register = async (req: AuthRequest, res: Response) => {
  const { name, email, password, role } = req.body;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ApiError(409, 'Email already registered');
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role || 'JOBSEEKER',
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
    },
  });

  const { accessToken, refreshToken } = generateTokens(user.id, user.role);
  setTokenCookies(res, accessToken, refreshToken);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Registration successful',
    data: {
      ...user,
      accessToken,
    },
  });
};

export const login = async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !user.password) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'Account is deactivated');
  }

  const { accessToken, refreshToken } = generateTokens(user.id, user.role);
  setTokenCookies(res, accessToken, refreshToken);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Login successful',
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      accessToken,
    },
  });
};

export const googleAuth = async (req: AuthRequest, res: Response) => {
  const { code } = req.query;

  if (!code) {
    throw new ApiError(400, 'Authorization code is required');
  }

  const clientBase = env.CLIENT_URL || 'http://localhost:3000';
  // Must match the redirect_uri sent to Google in /auth/google (and Google Cloud Console)
  const redirectUri = `${getServerUrl()}/api/v1/auth/google/callback`;

  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: env.GOOGLE_CLIENT_ID || '',
        client_secret: env.GOOGLE_CLIENT_SECRET || '',
        code: code as string,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenRes.json() as {
      access_token?: string;
      error?: string;
      error_description?: string;
    };

    if (!tokenData.access_token) {
      console.error('[Google OAuth] token exchange failed:', tokenData);
      throw new ApiError(
        400,
        tokenData.error_description || tokenData.error || 'Failed to get access token from Google'
      );
    }

    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const userData = await userRes.json() as {
      id: string;
      email: string;
      name?: string;
      picture?: string;
    };

    if (!userData.email || !userData.id) {
      throw new ApiError(400, 'Google account did not return email or id');
    }

    let user = await prisma.user.findFirst({
      where: { googleId: userData.id },
    });

    if (!user) {
      user = await prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (user) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            googleId: userData.id,
            ...(userData.picture && { avatar: userData.picture }),
          },
        });
      } else {
        user = await prisma.user.create({
          data: {
            name: userData.name || userData.email.split('@')[0],
            email: userData.email,
            avatar: userData.picture,
            googleId: userData.id,
            role: 'JOBSEEKER',
            skills: [],
          },
        });
      }
    }

    if (!user.isActive) {
      throw new ApiError(403, 'Account is deactivated');
    }

    const { accessToken, refreshToken } = generateTokens(user.id, user.role);
    setTokenCookies(res, accessToken, refreshToken);

    res.redirect(`${clientBase}/dashboard`);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error('[Google OAuth]', error);
    throw new ApiError(400, 'Google authentication failed');
  }
};

export const refreshToken = async (req: AuthRequest, res: Response) => {
  const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

  if (!refreshToken) {
    throw new ApiError(401, 'Refresh token is required');
  }

  try {
    const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as { id: string; role: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) {
      throw new ApiError(401, 'Invalid refresh token');
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user.id, user.role);
    setTokenCookies(res, accessToken, newRefreshToken);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Token refreshed successfully',
    });
  } catch {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }
};

export const logout = async (req: AuthRequest, res: Response) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Logout successful',
  });
};

export const getMe = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'Not authenticated');
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
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
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user || !user.isActive) {
    throw new ApiError(401, 'User not found or inactive');
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User retrieved successfully',
    data: { user },
  });
};