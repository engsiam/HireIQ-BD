import { Response } from 'express';
import prisma from '../../../prisma/client';
import sendResponse from '../../utils/sendResponse';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { uploadToCloudinary } from '../../utils/cloudinary';

let settingsCache: Record<string, unknown> = {
  siteName: 'HireIQ BD',
  supportEmail: 'support@hireiqbd.com',
  heroTitle: 'Find Your Dream Job in Bangladesh',
  heroSubtitle: 'AI-powered job matching for the next generation of professionals in Bangladesh.',
  heroVideos: [],
  sliderInterval: 8,
  sliderAutoPlay: true,
};

export const getSettings = async (req: AuthRequest, res: Response) => {
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Settings retrieved successfully',
    data: settingsCache,
  });
};

export const updateSettings = async (req: AuthRequest, res: Response) => {
  const { siteName, supportEmail, heroTitle, heroSubtitle, heroVideos, sliderInterval, sliderAutoPlay } = req.body;

  settingsCache = {
    ...settingsCache,
    ...(siteName && { siteName }),
    ...(supportEmail && { supportEmail }),
    ...(heroTitle && { heroTitle }),
    ...(heroSubtitle && { heroSubtitle }),
    ...(heroVideos && { heroVideos }),
    ...(sliderInterval !== undefined && { sliderInterval }),
    ...(sliderAutoPlay !== undefined && { sliderAutoPlay }),
  };

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Settings updated successfully',
    data: settingsCache,
  });
};

export const uploadHeroVideo = async (req: AuthRequest, res: Response) => {
  const files = req.files as Express.Multer.File[];
  
  if (!files || files.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No video files provided',
    });
  }

  const videoUrls: string[] = [];
  
  for (const file of files) {
    const result = await uploadToCloudinary(file.path, 'herovideos', 'video');
    videoUrls.push(result.secure_url);
  }

  const existingVideos = (settingsCache.heroVideos as string[]) || [];
  settingsCache.heroVideos = [...existingVideos, ...videoUrls];

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Videos uploaded successfully',
    data: {
      heroVideos: settingsCache.heroVideos,
    },
  });
};