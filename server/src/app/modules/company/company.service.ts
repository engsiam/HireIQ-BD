import prisma from '../../../prisma/client';

export const companyService = {
  create: async (data: {
    name: string;
    logo?: string;
    website?: string;
    description?: string;
    industry?: string;
    size?: string;
    location?: string;
    district?: string;
    foundedYear?: number;
    employerId: string;
  }) => {
    return prisma.company.create({
      data: {
        name: data.name,
        logo: data.logo,
        website: data.website,
        description: data.description,
        industry: data.industry,
        size: data.size,
        location: data.location,
        district: data.district,
        foundedYear: data.foundedYear,
        employerId: data.employerId,
      },
    });
  },

  findAll: async (options: {
    search?: string;
    industry?: string;
    size?: string;
    district?: string;
    sort?: string;
    page?: number;
    limit?: number;
  }) => {
    const { search, industry, size, district, sort = 'newest', page = 1, limit = 12 } = options;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (industry) where.industry = industry;
    if (size) where.size = size;
    if (district) where.district = district;

    let orderBy: Record<string, string> = { createdAt: 'desc' };
    if (sort === 'name_asc') orderBy = { name: 'asc' };
    if (sort === 'name_desc') orderBy = { name: 'desc' };

    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          employer: {
            select: { id: true, name: true, avatar: true },
          },
          _count: { select: { jobs: true } },
        },
      }),
      prisma.company.count({ where }),
    ]);

    return {
      companies,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  findById: async (id: string) => {
    return prisma.company.findUnique({
      where: { id },
      include: {
        employer: {
          select: { id: true, name: true, avatar: true },
        },
        _count: { select: { jobs: true } },
        jobs: {
          where: { status: 'OPEN' },
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            _count: { select: { applications: true } },
          },
        },
      },
    });
  },

  update: async (id: string, data: {
    name?: string;
    logo?: string;
    website?: string;
    description?: string;
    industry?: string;
    size?: string;
    location?: string;
    district?: string;
    foundedYear?: number;
  }) => {
    return prisma.company.update({
      where: { id },
      data,
    });
  },

  delete: async (id: string) => {
    return prisma.company.delete({
      where: { id },
    });
  },

  findByEmployer: async (employerId: string) => {
    return prisma.company.findMany({
      where: { employerId },
      orderBy: { createdAt: 'desc' },
    });
  },
};