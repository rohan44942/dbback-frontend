/**
 * API Client Configuration
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiError } from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
const BACKUP_TIMEOUT_MS = 10 * 60 * 1000;

function clearAuthStorage() {
  localStorage.removeItem('authToken');
  document.cookie = 'authToken=; Path=/; Max-Age=0; SameSite=Strict';
}

export function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      if (config.url?.includes('/backups') && config.method === 'post') {
        config.timeout = BACKUP_TIMEOUT_MS;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError<{ message?: string }>) => {
      const statusCode = error.response?.status || 500;

      if (statusCode === 401 && typeof window !== 'undefined') {
        clearAuthStorage();
        if (!window.location.pathname.startsWith('/login')) {
          window.location.href = '/login';
        }
      }

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
