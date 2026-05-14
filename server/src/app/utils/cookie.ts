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
const isDev = !isProduction;

const getBackendUrl = () => env.SERVER_URL || env.CLIENT_URL || 'http://localhost:5000';
const getFrontendUrl = () => env.CLIENT_URL || 'http://localhost:3000';

const isCrossDomain = () => {
  try {
    const backend = new URL(getBackendUrl());
    const frontend = new URL(getFrontendUrl());
    return backend.hostname !== frontend.hostname;
  } catch {
    return isProduction;
  }
};

export const getCookieOptions = (maxAge?: number): CookieOptions => {
  const isCross = isCrossDomain();
  
  const options: CookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isDev ? 'lax' : (isCross ? 'none' : 'strict'),
    path: '/',
  };

  if (maxAge) {
    options.maxAge = maxAge * 1000;
  }

  if (isProduction && env.CLIENT_URL && !isCross) {
    try {
      const url = new URL(env.CLIENT_URL);
      options.domain = url.hostname;
    } catch {
      // fallback
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
  const isCross = isCrossDomain();
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isDev ? 'lax' : (isCross ? 'none' : 'strict'),
    path: '/',
    maxAge: 0,
  };
};

export const cookieOptions = getCookieOptions();
export const accessTokenCookieOptions = getAccessTokenCookieOptions();
export const refreshTokenCookieOptions = getRefreshTokenCookieOptions();