import { Router } from 'express';
import catchAsync from '../../utils/catchAsync';
import { authGuard } from '../../middlewares/auth.middleware';
import { getSettings, updateSettings, uploadHeroVideo } from './settings.controller';
import { upload } from '../../middlewares/upload.middleware';

const router = Router();

router.get('/', catchAsync(getSettings));

router.patch('/', authGuard('ADMIN'), catchAsync(updateSettings));

router.post('/herovideos', authGuard('ADMIN'), upload.array('videos', 5), catchAsync(uploadHeroVideo));

export default router;