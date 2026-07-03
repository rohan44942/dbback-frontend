/**
 * useBackup Hook
 */

import { useBackupStore } from '@/store/backupStore';

export function useBackup() {
  const {
    backups,
    schedules,
    isLoading,
    error,
    fetchBackups,
    addBackup,
    removeBackup,
    downloadBackup,
    restoreBackup,
    fetchSchedules,
    addSchedule,
    updateSchedule,
    removeSchedule,
    clearError,
  } = useBackupStore();

  return {
    backups,
    schedules,
    isLoading,
    error,
    fetchBackups,
    addBackup,
    removeBackup,
    downloadBackup,
    restoreBackup,
    fetchSchedules,
    addSchedule,
    updateSchedule,
    removeSchedule,
    clearError,
  };
}
