/**
 * Backup Store
 * 
 * State management for backups
 * Follows SRP: ONLY manages backup state
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { BackupSchedule, BackupState } from '@/types/backup';
import { backupService, scheduleService } from '@/lib/api/backup-service';

interface BackupStore extends BackupState {
  // Backup actions
  fetchBackups: (page?: number, pageSize?: number) => Promise<void>;
  addBackup: (name: string) => Promise<void>;
  removeBackup: (id: string) => Promise<void>;

  // Schedule actions
  fetchSchedules: () => Promise<void>;
  addSchedule: (
    name: string,
    frequency: 'daily' | 'weekly' | 'monthly',
    time: string
  ) => Promise<void>;
  updateSchedule: (id: string, data: Partial<BackupSchedule>) => Promise<void>;
  removeSchedule: (id: string) => Promise<void>;

  // Utilities
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useBackupStore = create<BackupStore>()(
  devtools((set, get) => ({
    // Initial state
    backups: [],
    schedules: [],
    isLoading: false,
    error: null,

    // Backup actions
    fetchBackups: async (page = 1, pageSize = 10) => {
      set({ isLoading: true, error: null });
      try {
        const response = await backupService.listBackups(page, pageSize);
        set({ backups: response.items, isLoading: false });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to fetch backups';
        set({ error: errorMessage, isLoading: false });
        throw error;
      }
    },

    addBackup: async (name: string) => {
      set({ isLoading: true, error: null });
      try {
        const backup = await backupService.createBackup(name);
        const state = get();
        set({
          backups: [backup, ...state.backups],
          isLoading: false,
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to create backup';
        set({ error: errorMessage, isLoading: false });
        throw error;
      }
    },

    removeBackup: async (id: string) => {
      set({ isLoading: true, error: null });
      try {
        await backupService.deleteBackup(id);
        const state = get();
        set({
          backups: state.backups.filter((b) => b.id !== id),
          isLoading: false,
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to delete backup';
        set({ error: errorMessage, isLoading: false });
        throw error;
      }
    },

    // Schedule actions
    fetchSchedules: async () => {
      set({ isLoading: true, error: null });
      try {
        const schedules = await scheduleService.listSchedules();
        set({ schedules, isLoading: false });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to fetch schedules';
        set({ error: errorMessage, isLoading: false });
        throw error;
      }
    },

    addSchedule: async (name, frequency, time) => {
      set({ isLoading: true, error: null });
      try {
        const schedule = await scheduleService.createSchedule(
          name,
          frequency,
          time
        );
        const state = get();
        set({
          schedules: [...state.schedules, schedule],
          isLoading: false,
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to create schedule';
        set({ error: errorMessage, isLoading: false });
        throw error;
      }
    },

    updateSchedule: async (id, data) => {
      set({ isLoading: true, error: null });
      try {
        const updated = await scheduleService.updateSchedule(id, data);
        const state = get();
        set({
          schedules: state.schedules.map((s) =>
            s.id === id ? updated : s
          ),
          isLoading: false,
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to update schedule';
        set({ error: errorMessage, isLoading: false });
        throw error;
      }
    },

    removeSchedule: async (id: string) => {
      set({ isLoading: true, error: null });
      try {
        await scheduleService.deleteSchedule(id);
        const state = get();
        set({
          schedules: state.schedules.filter((s) => s.id !== id),
          isLoading: false,
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to delete schedule';
        set({ error: errorMessage, isLoading: false });
        throw error;
      }
    },

    // Utilities
    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),
  }))
);
