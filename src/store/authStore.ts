import { create } from 'zustand';
import { User } from '../types';
import { authApi } from '../services/api';
import { tokenStorage } from '../services/tokenStorage';

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
    try {
      const token = await tokenStorage.getToken();
      if (token) {
        const user = await authApi.me();
        set({ token, user, isAuthenticated: true, isHydrated: true });
        return;
      }
    } catch {
      await tokenStorage.clearToken();
    }

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
