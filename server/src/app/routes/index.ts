import { Router } from 'express';

const router = Router();

import authRoute from '../modules/auth/auth.route';
import userRoute from '../modules/user/user.route';
import jobRoute from '../modules/job/job.route';
import applicationRoute from '../modules/application/application.route';
import reviewRoute from '../modules/review/review.route';
import blogRoute from '../modules/blog/blog.route';
import contactRoute from '../modules/contact/contact.route';
import aiRoute from '../modules/ai/ai.route';
import statsRoute from '../modules/stats.route';
import settingsRoute from '../modules/settings/settings.route';
import companyRoute from '../modules/company/company.route';

router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/jobs', jobRoute);
router.use('/applications', applicationRoute);
router.use('/reviews', reviewRoute);
router.use('/blogs', blogRoute);
router.use('/contact', contactRoute);
router.use('/ai', aiRoute);
router.use('/stats', statsRoute);
router.use('/settings', settingsRoute);
router.use('/companies', companyRoute);

export default router;