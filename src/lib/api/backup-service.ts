/**
 * Backup Service
 * 
 * API calls for backup management
 * Following Service Pattern and SRP
 */

import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';
import type {
  Backup,
  BackupInput,
  BackupSchedule,
  ScheduleInput,
} from '@/types/backup';
import type { PaginatedResponse } from '@/types/api';

interface BackendBackup {
  ID?: string;
  id?: string;
  Name?: string;
  name?: string;
  Type?: string;
  type?: string;
  StoragePath?: string;
  storagePath?: string;
  FinishedAt?: string;
  finishedAt?: string;
  StartedAt?: string;
  startedAt?: string;
  Size?: number;
  size?: number;
}

interface BackendSchedule {
  ID?: string;
  id?: string;
  DBType?: string;
  db_type?: string;
  Source?: string;
  source?: string;
  CronExpr?: string;
  cron_expr?: string;
  RetentionDays?: number;
  retention_days?: number;
  LastRun?: unknown;
}

export interface IBackupService {
  listBackups(page?: number, pageSize?: number): Promise<PaginatedResponse<Backup>>;
  getBackup(id: string): Promise<Backup>;
  createBackup(data: BackupInput): Promise<Backup>;
  deleteBackup(id: string): Promise<void>;
  downloadBackup(id: string): Promise<Blob>;
  restoreBackup(id: string, target: string): Promise<void>;
}

export const backupService: IBackupService = {
  async listBackups(
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResponse<Backup>> {
    const response = await apiClient.get<PaginatedResponse<Backup> | BackendBackup[] | null>(
      API_ENDPOINTS.BACKUPS.LIST,
      {
        params: { page, pageSize },
      }
    );
    const data = response.data ?? [];
    if (Array.isArray(data)) {
      const backups = data.map(mapBackup);
      return {
        items: backups,
        total: backups.length,
        page,
        pageSize,
        hasMore: false,
      };
    }
    return data;
  },

  async getBackup(id: string): Promise<Backup> {
    const response = await apiClient.get<Backup | BackendBackup>(
      API_ENDPOINTS.BACKUPS.GET(id)
    );
    return mapBackup(response.data);
  },

  async createBackup(data: BackupInput): Promise<Backup> {
    const response = await apiClient.post<Backup | BackendBackup>(
      API_ENDPOINTS.BACKUPS.CREATE,
      {
        name: data.name,
        db_type: data.dbType,
        source: data.source,
      }
    );
    return mapBackup(response.data);
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

  async restoreBackup(id: string, target: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.BACKUPS.RESTORE(id), { target });
  },
};

// Schedule Service
export interface IScheduleService {
  listSchedules(): Promise<BackupSchedule[]>;
  createSchedule(data: ScheduleInput): Promise<BackupSchedule>;
  updateSchedule(id: string, data: ScheduleInput): Promise<BackupSchedule>;
  deleteSchedule(id: string): Promise<void>;
}

export const scheduleService: IScheduleService = {
  async listSchedules(): Promise<BackupSchedule[]> {
    const response = await apiClient.get<BackupSchedule[] | BackendSchedule[] | null>(
      API_ENDPOINTS.SCHEDULES.LIST
    );
    return (response.data ?? []).map(mapSchedule);
  },

  async createSchedule(data: ScheduleInput): Promise<BackupSchedule> {
    const response = await apiClient.post<BackupSchedule | BackendSchedule>(
      API_ENDPOINTS.SCHEDULES.CREATE,
      scheduleInputToBackend(data)
    );
    return mapSchedule(response.data);
  },

  async updateSchedule(
    id: string,
    data: ScheduleInput
  ): Promise<BackupSchedule> {
    const response = await apiClient.put<BackupSchedule | BackendSchedule>(
      API_ENDPOINTS.SCHEDULES.UPDATE(id),
      scheduleInputToBackend(data)
    );
    return mapSchedule(response.data);
  },

  async deleteSchedule(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.SCHEDULES.DELETE(id));
  },
};

function mapBackup(backup: Backup | BackendBackup): Backup {
  const raw = backup as BackendBackup;
  const id = raw.id ?? raw.ID ?? '';
  const name = raw.name ?? raw.Name ?? 'backup';
  const finishedAt = raw.finishedAt ?? raw.FinishedAt ?? raw.startedAt ?? raw.StartedAt ?? '';
  const dbType = raw.type ?? raw.Type ?? '';

  return {
    id,
    name,
    dbType,
    size: raw.size ?? raw.Size ?? 0,
    createdAt: finishedAt,
    status: 'success',
    backupType: 'full',
    location: raw.storagePath ?? raw.StoragePath ?? '',
  };
}

function mapSchedule(schedule: BackupSchedule | BackendSchedule): BackupSchedule {
  const raw = schedule as BackendSchedule;
  const cron = raw.cron_expr ?? raw.CronExpr ?? '';
  const dbType = raw.db_type ?? raw.DBType ?? '';
  const source = raw.source ?? raw.Source ?? '';

  return {
    id: raw.id ?? raw.ID ?? '',
    name: source || dbType || 'schedule',
    dbType,
    source,
    cronExpr: cron,
    enabled: true,
    frequency: cronToFrequency(cron),
    time: cron,
    retentionDays: raw.retention_days ?? raw.RetentionDays ?? 0,
  };
}

function cronToFrequency(cron: string): 'daily' | 'weekly' | 'monthly' {
  const parts = cron.trim().split(/\s+/);
  if (parts.length >= 5 && parts[2] !== '*') {
    return 'monthly';
  }
  if (parts.length >= 5 && parts[4] !== '*') {
    return 'weekly';
  }
  return 'daily';
}

function scheduleInputToBackend(data: ScheduleInput) {
  return {
    db_type: data.dbType,
    source: data.source,
    cron_expr: data.cronExpr,
    retention_days: data.retentionDays,
  };
}
