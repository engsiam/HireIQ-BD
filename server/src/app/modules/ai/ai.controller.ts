import { Response } from 'express';
import ApiError from '../../utils/ApiError';
import sendResponse from '../../utils/sendResponse';
import { AuthRequest } from '../../middlewares/auth.middleware';
import * as aiService from './ai.service';

export const analyzeCV = async (req: AuthRequest, res: Response) => {
  const { cvText, jobTitle } = req.body;

  try {
    const result = await aiService.analyzeCV(cvText, jobTitle);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'CV analysis completed',
      data: result,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('not configured')) {
      throw new ApiError(503, 'AI service is not configured');
    }
    throw new ApiError(500, 'Failed to analyze CV');
  }
};

export const matchJobs = async (req: AuthRequest, res: Response) => {
  const { skills, experience, preferredLocation } = req.body;

  try {
    const result = await aiService.matchJobs(skills, experience, preferredLocation);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Job matching completed',
      data: result,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('not configured')) {
      throw new ApiError(503, 'AI service is not configured');
    }
    throw new ApiError(500, 'Failed to match jobs');
  }
};

export const prepareInterview = async (req: AuthRequest, res: Response) => {
  const { jobTitle, jobDescription, experienceLevel } = req.body;

  try {
    const result = await aiService.generateInterviewPrep(jobTitle, jobDescription, experienceLevel);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Interview preparation generated',
      data: result,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('not configured')) {
      throw new ApiError(503, 'AI service is not configured');
    }
    throw new ApiError(500, 'Failed to generate interview preparation');
  }
};

export const chat = async (req: AuthRequest, res: Response) => {
  const { prompt, history } = req.body;

  try {
    const result = await aiService.chatWithAI(prompt, history || []);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'AI response generated',
      data: result,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('not configured')) {
      throw new ApiError(503, 'AI service is not configured');
    }
    throw new ApiError(500, 'Failed to get AI response');
  }
};