const isProduction = process.env.NODE_ENV === 'production';

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
export const APP_PROD_URL = process.env.NEXT_PUBLIC_APP_PROD_URL || 'https://hire-iq-bd.vercel.app';
export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';
export const SERVER_PROD_URL = process.env.NEXT_PUBLIC_SERVER_PROD_URL || 'https://hireiq-bd.onrender.com';
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
export const API_PROD_URL = process.env.NEXT_PUBLIC_API_PROD_URL || 'https://hireiq-bd.onrender.com/api/v1';

export const BASE_URL = isProduction ? API_PROD_URL : API_URL;
export const GOOGLE_AUTH_URL = isProduction
  ? `${SERVER_PROD_URL}/api/v1/auth/google`
  : `${SERVER_URL}/api/v1/auth/google`;

export const isProd = isProduction;