import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '../api/client';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'customer';
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  setAuth: (token: string, user: AuthUser) => void;
  logout: () => void;
  isAdmin: () => boolean;
  isLoggedIn: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,

      setAuth: (token, user) => {
        localStorage.setItem('auth_token', token);
        set({ token, user });
      },

      logout: () => {
        localStorage.removeItem('auth_token');
        set({ token: null, user: null });
        // Fire-and-forget
        apiClient.post('/auth/logout').catch(() => undefined);
      },

      isAdmin: () => get().user?.role === 'admin',
      isLoggedIn: () => Boolean(get().token && get().user),
    }),
    {
      name: 'noir-auth-v1',
      partialize: (s) => ({ token: s.token, user: s.user }),
    }
  )
);
