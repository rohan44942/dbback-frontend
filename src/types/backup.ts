/**
 * Backup Types
 */

export interface Backup {
  id: string;
  name: string;
  size: number;
  createdAt: string;
  status: 'success' | 'failed' | 'pending';
  backupType: 'full' | 'incremental';
  location: string;
}

export interface BackupSchedule {
  id: string;
  name: string;
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string;
  retentionDays: number;
}

export interface BackupState {
  backups: Backup[];
  schedules: BackupSchedule[];
  isLoading: boolean;
  error: string | null;
}
