/**
 * Backup Service
 * 
 * API calls for backup management
 * Following Service Pattern and SRP
 */

import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';
import type { Backup, BackupSchedule } from '@/types/backup';
import type { PaginatedResponse } from '@/types/api';

export interface IBackupService {
  listBackups(page?: number, pageSize?: number): Promise<PaginatedResponse<Backup>>;
  getBackup(id: string): Promise<Backup>;
  createBackup(name: string): Promise<Backup>;
  deleteBackup(id: string): Promise<void>;
  downloadBackup(id: string): Promise<Blob>;
}

export const backupService: IBackupService = {
  async listBackups(
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResponse<Backup>> {
    const response = await apiClient.get<PaginatedResponse<Backup>>(
      API_ENDPOINTS.BACKUPS.LIST,
      {
        params: { page, pageSize },
      }
    );
    return response.data;
  },

  async getBackup(id: string): Promise<Backup> {
    const response = await apiClient.get<Backup>(
      API_ENDPOINTS.BACKUPS.GET(id)
    );
    return response.data;
  },

  async createBackup(name: string): Promise<Backup> {
    const response = await apiClient.post<Backup>(
      API_ENDPOINTS.BACKUPS.CREATE,
      { name }
    );
    return response.data;
  },

  async deleteBackup(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.BACKUPS.DELETE(id));
  },

  async downloadBackup(id: string): Promise<Blob> {
    const response = await apiClient.get<Blob>(
      API_ENDPOINTS.BACKUPS.DOWNLOAD(id),
      {
        responseType: 'blob',
      }
    );
    return response.data;
  },
};

// Schedule Service
export interface IScheduleService {
  listSchedules(): Promise<BackupSchedule[]>;
  createSchedule(
    name: string,
    frequency: 'daily' | 'weekly' | 'monthly',
    time: string
  ): Promise<BackupSchedule>;
  updateSchedule(id: string, data: Partial<BackupSchedule>): Promise<BackupSchedule>;
  deleteSchedule(id: string): Promise<void>;
}

export const scheduleService: IScheduleService = {
  async listSchedules(): Promise<BackupSchedule[]> {
    const response = await apiClient.get<BackupSchedule[]>(
      API_ENDPOINTS.SCHEDULES.LIST
    );
    return response.data;
  },

  async createSchedule(
    name: string,
    frequency: 'daily' | 'weekly' | 'monthly',
    time: string
  ): Promise<BackupSchedule> {
    const response = await apiClient.post<BackupSchedule>(
      API_ENDPOINTS.SCHEDULES.CREATE,
      { name, frequency, time }
    );
    return response.data;
  },

  async updateSchedule(
    id: string,
    data: Partial<BackupSchedule>
  ): Promise<BackupSchedule> {
    const response = await apiClient.put<BackupSchedule>(
      API_ENDPOINTS.SCHEDULES.UPDATE(id),
      data
    );
    return response.data;
  },

  async deleteSchedule(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.SCHEDULES.DELETE(id));
  },
};
