import { create } from 'zustand';
import { User } from '../types';
import { authApi } from '../services/api';
import { tokenStorage } from '../services/tokenStorage';

const logAuthBootstrap = (...messages: unknown[]) => {
  if (__DEV__) {
    console.log('[auth-bootstrap]', ...messages);
  }
};

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isHydrated: boolean;
  isAuthenticated: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<void>;
  logout: () => Promise<void>;
  loadToken: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  isHydrated: false,
  isAuthenticated: false,
  error: null,

  loadToken: async () => {
    logAuthBootstrap('loadToken:start');

    try {
      const token = await tokenStorage.getToken();
      logAuthBootstrap('loadToken:token-read', token ? 'present' : 'missing');

      if (!token) {
        logAuthBootstrap('loadToken:no-token -> unauthenticated');
        set({ token: null, user: null, isAuthenticated: false, isHydrated: true });
        return;
      }

      // Do not block the first render on session validation; Expo Go can stall here.
      logAuthBootstrap('loadToken:optimistic-auth');
      set({ token, user: null, isAuthenticated: true, isHydrated: true });

      try {
        logAuthBootstrap('loadToken:me:start');
        const user = await authApi.me();
        logAuthBootstrap('loadToken:me:success', user.email);
        set({ token, user, isAuthenticated: true, isHydrated: true });
      } catch {
        logAuthBootstrap('loadToken:me:failed -> clearToken');
        await tokenStorage.clearToken();
        set({ token: null, user: null, isAuthenticated: false, isHydrated: true });
      }

      return;
    } catch {
      logAuthBootstrap('loadToken:failed -> clearToken');
      await tokenStorage.clearToken();
    }

    logAuthBootstrap('loadToken:fallback-unauthenticated');
    set({ token: null, user: null, isAuthenticated: false, isHydrated: true });
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { user, token } = await authApi.login({ email, password });
      await tokenStorage.setToken(token);
      set({ user, token, isAuthenticated: true, isLoading: false, isHydrated: true });
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.';
      set({ error: message, isLoading: false });
    }
  },

  register: async (name, email, password, passwordConfirmation) => {
    set({ isLoading: true, error: null });
    try {
      const { user, token } = await authApi.register({
        name, email, password, password_confirmation: passwordConfirmation,
      });
      await tokenStorage.setToken(token);
      set({ user, token, isAuthenticated: true, isLoading: false, isHydrated: true });
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Erro ao criar conta. Tente novamente.';
      set({ error: message, isLoading: false });
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch {}
    await tokenStorage.clearToken();
    set({ user: null, token: null, isAuthenticated: false, isHydrated: true });
  },

  clearError: () => set({ error: null }),
}));
