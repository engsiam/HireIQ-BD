import axios from 'axios';
import { BASE_URL } from './config';

// withCredentials: true is REQUIRED for cross-origin cookie sharing
// Without it, browser won't send cookies to different origin (Vercel → Render)
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

let retryCount = 0;
const MAX_RETRIES = 3;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (status === 503 && retryCount < MAX_RETRIES) {
      retryCount++;
      console.log(`[API] Backend sleeping, retry ${retryCount}/${MAX_RETRIES}...`);
      await new Promise(resolve => setTimeout(resolve, 3000));
      return axiosInstance(originalRequest);
    }

    retryCount = 0;

    if (status === 401 && !originalRequest._retry) {
      if (String(originalRequest.url ?? '').includes('refresh-token')) {
        return Promise.reject(error);
      }
      originalRequest._retry = true;

      try {
        // Cookie-based auth: refresh access token (server reads httpOnly refreshToken cookie)
        const response = await axiosInstance.post('/auth/refresh-token', {});

        if (response.data.success) {
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error('[API] Session refresh failed:', refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
