import env from '../../config';

export interface CookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'strict' | 'lax' | 'none';
  path: string;
  maxAge?: number;
  domain?: string;
}

const isProduction = process.env.NODE_ENV === 'production';

const isCrossDomain = (): boolean => {
  const backendUrl = env.SERVER_URL || env.CLIENT_URL || '';
  const frontendUrl = env.CLIENT_URL || 'http://localhost:3000';
  
  if (!backendUrl || !frontendUrl) return false;
  
  try {
    const backend = new URL(backendUrl);
    const frontend = new URL(frontendUrl);
    return backend.hostname !== frontend.hostname;
  } catch {
    return isProduction;
  }
};

export const getCookieOptions = (maxAge?: number): CookieOptions => {
  const crossDomain = isCrossDomain();
  
  // For cross-domain (Vercel <-> Render): sameSite: 'none', secure: true
  // For same-domain: sameSite: 'strict' or 'lax'
  const options: CookieOptions = {
    httpOnly: true,
    secure: true, // Always true in production
    sameSite: crossDomain ? 'none' : 'lax',
    path: '/',
  };

  if (maxAge) {
    options.maxAge = maxAge * 1000;
  }

  // Only set domain for same-domain deployments
  if (!crossDomain && isProduction && env.CLIENT_URL) {
    try {
      const url = new URL(env.CLIENT_URL);
      options.domain = url.hostname;
    } catch {
      // skip
    }
  }

  return options;
};

export const getCrossDomainCookieOptions = (maxAge: number): CookieOptions => {
  return getCookieOptions(maxAge);
};

export const getAccessTokenCookieOptions = (): CookieOptions => {
  return getCookieOptions(60 * 60 * 24 * 7);
};

export const getRefreshTokenCookieOptions = (): CookieOptions => {
  return getCookieOptions(60 * 60 * 24 * 30);
};

export const clearCookieOptions = (): CookieOptions => {
  const crossDomain = isCrossDomain();
  return {
    httpOnly: true,
    secure: true,
    sameSite: crossDomain ? 'none' : 'lax',
    path: '/',
    maxAge: 0,
  };
};

export const cookieOptions = getCookieOptions();
export const accessTokenCookieOptions = getAccessTokenCookieOptions();
export const refreshTokenCookieOptions = getRefreshTokenCookieOptions();