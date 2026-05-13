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
     console.error('[CV Analyze Error]:', error);
     if (error instanceof Error && error.message.includes('not configured')) {
       throw new ApiError(503, 'AI service is not configured');
     }
     if (error instanceof Error && error.message.includes('invalid JSON')) {
       throw new ApiError(500, 'AI returned an unexpected response. Please try again with more CV content.');
     }
     throw new ApiError(500, error instanceof Error ? error.message : 'Failed to analyze CV');
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
     console.error('[Match Jobs Error]:', error);
     if (error instanceof Error && error.message.includes('not configured')) {
       throw new ApiError(503, 'AI service is not configured');
     }
     if (error instanceof Error && error.message.includes('invalid JSON')) {
       throw new ApiError(500, 'AI returned an unexpected response. Please try again.');
     }
     throw new ApiError(500, error instanceof Error ? error.message : 'Failed to match jobs');
   }
 };

export const prepareInterview = async (req: AuthRequest, res: Response) => {
   const { jobTitle, jobDescription, experienceLevel } = req.body;

   try {
     const result = await aiService.generateInterviewPrep(
       jobTitle,
       experienceLevel,
       jobDescription
     );

     sendResponse(res, {
       statusCode: 200,
       success: true,
       message: 'Interview preparation generated',
       data: result,
     });
   } catch (error) {
     console.error('[Interview Prep Error]:', error);
     if (error instanceof Error && error.message.includes('not configured')) {
       throw new ApiError(503, 'AI service is not configured');
     }
     if (error instanceof Error && error.message.includes('invalid JSON')) {
       throw new ApiError(500, 'AI returned an unexpected response. Please try a simpler job title.');
     }
     throw new ApiError(500, error instanceof Error ? error.message : 'Failed to generate interview preparation');
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
     console.error('[Chat Error]:', error);
     if (error instanceof Error && error.message.includes('not configured')) {
       throw new ApiError(503, 'AI service is not configured');
     }
     throw new ApiError(500, error instanceof Error ? error.message : 'Failed to get AI response');
   }
 };

export const generateCoverLetter = async (req: AuthRequest, res: Response) => {
  const { jobTitle, companyName, userName, userSkills, userExperience, jobRequirements } = req.body;

  try {
    const result = await aiService.generateCoverLetter(
      jobTitle,
      companyName,
      userName,
      userSkills || [],
      userExperience,
      jobRequirements
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Cover letter generated',
      data: result,
    });
  } catch (error) {
    console.error('[Generate Cover Letter Error]:', error);
    if (error instanceof Error && error.message.includes('not configured')) {
      throw new ApiError(503, 'AI service is not configured');
    }
    throw new ApiError(500, error instanceof Error ? error.message : 'Failed to generate cover letter');
  }
};

export const generateBio = async (req: AuthRequest, res: Response) => {
  const { userName, userSkills, currentBio } = req.body;

  try {
    const result = await aiService.generateBio(
      userName,
      userSkills || [],
      currentBio
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Bio generated',
      data: result,
    });
  } catch (error) {
    console.error('[Generate Bio Error]:', error);
    if (error instanceof Error && error.message.includes('not configured')) {
      throw new ApiError(503, 'AI service is not configured');
    }
    throw new ApiError(500, error instanceof Error ? error.message : 'Failed to generate bio');
  }
};