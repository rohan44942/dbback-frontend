/**
 * useAuth Hook
 * 
 * SOLID Principle Applied: Single Responsibility
 * This hook ONLY provides access to auth state and actions.
 * 
 * Benefits:
 * - Cleaner component code
 * - Single source of truth for auth logic
 * - Easy to test
 * - Easy to refactor if implementation changes
 */

import { useAuthStore } from '@/store/authStore';

export function useAuth() {
  const {
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    logout,
    register,
    clearError,
  } = useAuthStore();

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    logout,
    register,
    clearError,
  };
}
