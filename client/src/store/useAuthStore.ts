import { create } from 'zustand';
import { BASE_URL } from '@/lib/config';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  phone?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  isAuthenticated: boolean;
  error: string | null;

  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: { name: string; email: string; password: string; role?: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  isInitialized: false,
  isAuthenticated: false,
  error: null,

  initialize: async () => {
    if (get().isLoading || get().isInitialized) return;

    set({ isLoading: true, error: null });

    try {
      // Try /auth/me first (new endpoint)
      let response = await fetch(`${BASE_URL}/auth/me`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      // Fallback to /users/session if /auth/me not found (for older servers)
      if (response.status === 404) {
        response = await fetch(`${BASE_URL}/users/session`, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
      }

      if (response.ok) {
        const data = await response.json();
        
        // Handle both response formats:
        // 1. /auth/me: { success: true, data: { user: {...} } }
        // 2. /users/session: { success: true, data: { isAuthenticated: true, user: {...} } }
        let user = null;
        if (data.success && data.data) {
          user = data.data.user || (data.data.isAuthenticated ? data.data.user : null);
        }
        
        if (user) {
          set({ user, isAuthenticated: true, isInitialized: true, isLoading: false });
          return;
        }
      }

      set({ user: null, isAuthenticated: false, isInitialized: true, isLoading: false });
    } catch (error) {
      console.error('[Auth] Initialize failed:', error);
      set({ user: null, isInitialized: true, isLoading: false });
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        set({ error: data.error || 'Login failed', isLoading: false });
        return false;
      }

      const userData = {
        id: data.data?.id,
        name: data.data?.name,
        email: data.data?.email,
        role: data.data?.role,
        avatar: data.data?.avatar,
        isActive: true,
      };

      set({ user: userData, isAuthenticated: true, isInitialized: true, isLoading: false, error: null });
      
      return true;
    } catch (error: any) {
      console.error('[Auth] Login failed:', error);
      set({ error: error.message || 'Login failed', isLoading: false });
      return false;
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        set({ error: result.error || 'Registration failed', isLoading: false });
        return false;
      }

      set({ isLoading: false });
      return true;
    } catch (error: any) {
      console.error('[Auth] Register failed:', error);
      set({ error: error.message || 'Registration failed', isLoading: false });
      return false;
    }
  },

  logout: async () => {
    try {
      await fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('[Auth] Logout error:', error);
    }

    set({ user: null, isAuthenticated: false, isInitialized: true, isLoading: false, error: null });
  },

  clearError: () => set({ error: null }),
}));

export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);