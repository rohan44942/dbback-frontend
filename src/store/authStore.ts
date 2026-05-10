/**
 * Auth Store (State Management)
 * 
 * SOLID Principle Applied: Single Responsibility
 * This store ONLY manages authentication state.
 * 
 * Using Zustand for lightweight state management.
 * It's simpler than Redux but powerful enough for most needs.
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { AuthUser, AuthState } from '@/types/auth';
import { authService } from '@/lib/api/auth-service';

/**
 * Auth Store Type Definition
 */
interface AuthStore extends AuthState {
  // Actions
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  clearError: () => void;
}

/**
 * Create the store with persistence and dev tools
 * Persistence: Auth state is saved to localStorage and restored on page reload
 * Dev tools: Can inspect state changes in Redux DevTools browser extension
 */
export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        user: null,
        isLoading: false,
        error: null,
        isAuthenticated: false,

        // Actions
        setUser: (user) => {
          set({
            user,
            isAuthenticated: !!user,
            error: null,
          });
        },

        setLoading: (isLoading) => {
          set({ isLoading });
        },

        setError: (error) => {
          set({ error });
        },

        clearError: () => {
          set({ error: null });
        },

        login: async (email: string, password: string) => {
          set({ isLoading: true, error: null });
          try {
            const response = await authService.login({ email, password });
            
            // Store token in localStorage
            localStorage.setItem('authToken', response.token);
            
            set({
              user: {
                ...response.user,
                token: response.token,
                expiresAt: response.expiresAt,
              },
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : 'Login failed';
            set({
              error: errorMessage,
              isLoading: false,
              isAuthenticated: false,
            });
            throw error;
          }
        },

        register: async (email: string, password: string, name: string) => {
          set({ isLoading: true, error: null });
          try {
            const response = await authService.register({
              email,
              password,
              name,
            });
            
            localStorage.setItem('authToken', response.token);
            
            set({
              user: {
                ...response.user,
                token: response.token,
                expiresAt: response.expiresAt,
              },
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : 'Registration failed';
            set({
              error: errorMessage,
              isLoading: false,
              isAuthenticated: false,
            });
            throw error;
          }
        },

        logout: async () => {
          set({ isLoading: true });
          try {
            await authService.logout();
            localStorage.removeItem('authToken');
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            });
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : 'Logout failed';
            set({
              error: errorMessage,
              isLoading: false,
            });
            throw error;
          }
        },
      }),
      {
        name: 'auth-store', // localStorage key
      }
    )
  )
);
