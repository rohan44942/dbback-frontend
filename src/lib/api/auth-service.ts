/**
 * Authentication Service
 * 
 * SOLID Principle Applied: Dependency Inversion
 * Abstracts API calls for authentication.
 * Makes it easy to mock for testing.
 */

import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';
import type { LoginRequest, LoginResponse, RegisterRequest } from '@/types/auth';

/**
 * Interface for Auth Service
 * Allows for different implementations and easy testing
 */
export interface IAuthService {
  login(credentials: LoginRequest): Promise<LoginResponse>;
  register(data: RegisterRequest): Promise<LoginResponse>;
  logout(): Promise<void>;
  refreshToken(): Promise<LoginResponse>;
}

/**
 * Auth Service Implementation
 */
export const authService: IAuthService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    return response.data;
  },

  async register(data: RegisterRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      data
    );
    return response.data;
  },

  async logout(): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  },

  async refreshToken(): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      API_ENDPOINTS.AUTH.REFRESH
    );
    return response.data;
  },
};
