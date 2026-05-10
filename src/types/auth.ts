/**
 * Authentication Types
 * 
 * These types represent the shape of authentication-related data.
 * This follows the Interface Segregation Principle - we separate
 * concerns into focused, minimal interfaces.
 */

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthUser extends UserProfile {
  token: string;
  refreshToken?: string;
  expiresAt: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: UserProfile;
  token: string;
  refreshToken?: string;
  expiresAt: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}
