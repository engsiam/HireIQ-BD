import { Response } from 'express';
import sendResponse from '../../utils/sendResponse';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { companyService } from './company.service';
import ApiError from '../../utils/ApiError';

export const getCompanies = async (req: AuthRequest, res: Response) => {
  const { search, industry, size, district, sort, page, limit } = req.query as Record<string, string>;

  const result = await companyService.findAll({
    search,
    industry,
    size,
    district,
    sort,
    page: Number(page) || 1,
    limit: Number(limit) || 12,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Companies retrieved successfully',
    data: result.companies,
    meta: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    },
  });
};

export const getCompanyById = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const company = await companyService.findById(id);

  if (!company) {
    throw new ApiError(404, 'Company not found');
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Company retrieved successfully',
    data: company,
  });
};

export const createCompany = async (req: AuthRequest, res: Response) => {
  const employerId = req.user?.id;

  if (!employerId) {
    throw new ApiError(401, 'Unauthorized');
  }

  const company = await companyService.create({
    ...req.body,
    employerId,
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Company created successfully',
    data: company,
  });
};

export const updateCompany = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const employerId = req.user?.id;

  const existing = await companyService.findById(id);

  if (!existing) {
    throw new ApiError(404, 'Company not found');
  }

  if (existing.employerId !== employerId) {
    throw new ApiError(403, 'You can only update your own company');
  }

  const company = await companyService.update(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Company updated successfully',
    data: company,
  });
};

export const deleteCompany = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const employerId = req.user?.id;

  const existing = await companyService.findById(id);

  if (!existing) {
    throw new ApiError(404, 'Company not found');
  }

  if (existing.employerId !== employerId) {
    throw new ApiError(403, 'You can only delete your own company');
  }

  await companyService.delete(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Company deleted successfully',
  });
};

export const getMyCompanies = async (req: AuthRequest, res: Response) => {
  const employerId = req.user?.id;

  if (!employerId) {
    throw new ApiError(401, 'Unauthorized');
  }

  const companies = await companyService.findByEmployer(employerId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Companies retrieved successfully',
    data: companies,
  });
};