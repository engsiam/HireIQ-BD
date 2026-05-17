import { Router } from 'express';
import { validateRequest } from '../../middlewares/validate.middleware';
import { authGuard } from '../../middlewares/auth.middleware';
import catchAsync from '../../utils/catchAsync';
import {
  getCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
  getMyCompanies,
} from './company.controller';
import { companyValidation } from './company.validation';

const router = Router();

router.get('/', catchAsync(getCompanies));
router.get('/my', authGuard('EMPLOYER', 'ADMIN'), catchAsync(getMyCompanies));
router.get('/:id', catchAsync(getCompanyById));
router.post('/', authGuard('EMPLOYER', 'ADMIN'), validateRequest(companyValidation.create), catchAsync(createCompany));
router.put('/:id', authGuard('EMPLOYER', 'ADMIN'), validateRequest(companyValidation.update), catchAsync(updateCompany));
router.delete('/:id', authGuard('EMPLOYER', 'ADMIN'), catchAsync(deleteCompany));

export default router;