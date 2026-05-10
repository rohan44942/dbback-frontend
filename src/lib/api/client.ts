/**
 * API Client Configuration
 * 
 * SOLID Principle Applied: Single Responsibility & Dependency Inversion
 * This module ONLY handles HTTP communication.
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import { ApiError } from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

/**
 * Creates and configures the Axios instance
 * Separated into a factory function for better testability
 */
export function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor - Add auth token
  client.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor - Handle errors
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError<{ message?: string }>) => {
      const statusCode = error.response?.status || 500;
      const message =
        error.response?.data?.message ||
        error.message ||
        'An unexpected error occurred';

      throw new ApiError(statusCode, message, error.response?.data);
    }
  );

  return client;
}

export const apiClient = createApiClient();
