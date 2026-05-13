import { Router } from 'express';
import catchAsync from '../../utils/catchAsync';
import { validateRequest } from '../../middlewares/validate.middleware';
import { authGuard } from '../../middlewares/auth.middleware';
import { rateLimiter } from '../../middlewares/rateLimiter';
import {
  analyzeCV,
  matchJobs,
  prepareInterview,
  chat,
} from './ai.controller';
import {
  cvAnalyzeValidation,
  jobMatchValidation,
  interviewPrepValidation,
  chatValidation,
} from './ai.validation';

const router = Router();

router.post(
  '/cv-analyze',
  rateLimiter(10, 3600000),
  validateRequest(cvAnalyzeValidation),
  catchAsync(analyzeCV)
);

router.post(
  '/job-match',
  validateRequest(jobMatchValidation),
  catchAsync(matchJobs)
);

router.post(
  '/interview-prep',
  validateRequest(interviewPrepValidation),
  catchAsync(prepareInterview)
);

router.post(
  '/chat',
  authGuard(),
  rateLimiter(10, 60000),
  validateRequest(chatValidation),
  catchAsync(chat)
);

export default router;
