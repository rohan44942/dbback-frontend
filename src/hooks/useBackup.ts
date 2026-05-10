/**
 * useBackup Hook
 * 
 * Provides access to backup state and actions
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
    fetchSchedules,
    addSchedule,
    updateSchedule,
    removeSchedule,
    clearError,
  } = useBackupStore();

  return {
    // State
    backups,
    schedules,
    isLoading,
    error,

    // Actions
    fetchBackups,
    addBackup,
    removeBackup,
    fetchSchedules,
    addSchedule,
    updateSchedule,
    removeSchedule,
    clearError,
  };
}
