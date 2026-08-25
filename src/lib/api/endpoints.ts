/**
 * API Endpoints Configuration
 * 
 * SOLID Principle Applied: Single Responsibility
 * This module ONLY defines endpoint paths and their methods.
 * Keeps endpoints DRY and maintainable.
 */

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    GOOGLE: '/auth/google',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },
  BACKUPS: {
    LIST: '/backups',
    CREATE: '/backups',
    GET: (id: string) => `/backups/${id}`,
    DELETE: (id: string) => `/backups/${id}`,
    DOWNLOAD: (id: string) => `/backups/${id}/download`,
    RESTORE: (id: string) => `/backups/${id}/restore`,
  },
  SCHEDULES: {
    LIST: '/schedules',
    CREATE: '/schedules',
    UPDATE: (id: string) => `/schedules/${id}`,
    DELETE: (id: string) => `/schedules/${id}`,
  },
} as const;
