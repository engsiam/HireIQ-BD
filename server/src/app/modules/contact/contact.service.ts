import prisma from '../../../prisma/client';
import ApiError from '../../utils/ApiError';

export const submitContact = async (data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) => {
  const result = await prisma.contact.create({
    data: {
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
    },
  });

  return result;
};

export const getContacts = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  
  const [contacts, total] = await Promise.all([
    prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.contact.count(),
  ]);

  return {
    contacts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getContactById = async (id: string) => {
  const contact = await prisma.contact.findUnique({
    where: { id },
  });

  if (!contact) {
    throw new ApiError(404, 'Contact not found');
  }

  return contact;
};

export const markAsRead = async (id: string) => {
  const contact = await prisma.contact.findUnique({
    where: { id },
  });

  if (!contact) {
    throw new ApiError(404, 'Contact not found');
  }

  return prisma.contact.update({
    where: { id },
    data: { isRead: true },
  });
};

export const replyToContact = async (id: string, reply: string) => {
  const contact = await prisma.contact.findUnique({
    where: { id },
  });

  if (!contact) {
    throw new ApiError(404, 'Contact not found');
  }

  return prisma.contact.update({
    where: { id },
    data: {
      reply,
      repliedAt: new Date(),
    },
  });
};

export const deleteContact = async (id: string) => {
  const contact = await prisma.contact.findUnique({
    where: { id },
  });

  if (!contact) {
    throw new ApiError(404, 'Contact not found');
  }

  return prisma.contact.delete({
    where: { id },
  });
};