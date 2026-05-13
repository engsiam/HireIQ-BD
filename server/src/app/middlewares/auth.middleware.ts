import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError';
import env from '../../config';
import prisma from '../../prisma/client';

export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

const getToken = (req: Request): string | null => {
  const cookieToken = req.cookies?.accessToken;
  if (cookieToken) {
    return cookieToken;
  }
  
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  
  return null;
};

export const authGuard = (...roles: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const token = getToken(req);
      
      if (!token) {
        throw new ApiError(401, 'Unauthorized: No token provided');
      }

      const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string; role: string };
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, role: true, isActive: true },
      });

      if (!user) {
        throw new ApiError(401, 'User not found');
      }

      if (!user.isActive) {
        throw new ApiError(403, 'User account is deactivated');
      }

      if (roles.length && !roles.includes(user.role)) {
        throw new ApiError(403, 'Forbidden: Insufficient permissions');
      }

      req.user = { id: user.id, role: user.role };
      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
        next(new ApiError(401, 'Unauthorized: Invalid or expired token'));
      } else {
        next(error);
      }
    }
  };
};