// Use proxy route in production to avoid CORS issues
const isProduction = process.env.NODE_ENV === 'production';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// In production, use Vercel's proxy route; in dev, use direct backend
export const BASE_URL = isProduction ? '/api/v1' : apiUrl || 'http://localhost:5000/api/v1';