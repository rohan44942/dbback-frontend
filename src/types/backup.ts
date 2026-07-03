/**
 * Backup Types
 */

export interface Backup {
  id: string;
  name: string;
  dbType: string;
  size: number;
  createdAt: string;
  status: 'success' | 'failed' | 'pending';
  backupType: 'full' | 'incremental';
  location: string;
}

export interface BackupInput {
  name: string;
  dbType: string;
  source: string;
}

export interface BackupSchedule {
  id: string;
  name: string;
  dbType: string;
  source: string;
  cronExpr: string;
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string;
  retentionDays: number;
}

export interface ScheduleInput {
  dbType: string;
  source: string;
  cronExpr: string;
  retentionDays: number;
}

export interface RestoreInput {
  target: string;
}

export interface BackupState {
  backups: Backup[];
  schedules: BackupSchedule[];
  isLoading: boolean;
  error: string | null;
}
