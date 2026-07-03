'use client';

import React from 'react';
import Link from 'next/link';
import { useBackup } from '@/hooks/useBackup';

function formatBytes(bytes: number): string {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let i = 0;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i += 1;
  }
  return `${size.toFixed(1)} ${units[i]}`;
}

function formatRelativeTime(dateStr: string): string {
  if (!dateStr) return 'Never';
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

export default function DashboardPage() {
  const { backups, schedules, isLoading, fetchBackups, fetchSchedules } = useBackup();

  React.useEffect(() => {
    fetchBackups().catch(() => undefined);
    fetchSchedules().catch(() => undefined);
  }, [fetchBackups, fetchSchedules]);

  const totalSize = backups.reduce((sum, b) => sum + (b.size || 0), 0);
  const lastBackup = backups[0]?.createdAt ?? '';
  const recent = backups.slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">
          Live status of your backups and schedules
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-lg border-2 bg-blue-50 border-blue-200">
          <p className="text-gray-600 text-sm font-medium">Total Backups</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{backups.length}</p>
        </div>
        <div className="p-6 rounded-lg border-2 bg-green-50 border-green-200">
          <p className="text-gray-600 text-sm font-medium">Last Backup</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {isLoading ? '...' : formatRelativeTime(lastBackup)}
          </p>
        </div>
        <div className="p-6 rounded-lg border-2 bg-purple-50 border-purple-200">
          <p className="text-gray-600 text-sm font-medium">Storage Used</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{formatBytes(totalSize)}</p>
        </div>
        <div className="p-6 rounded-lg border-2 bg-orange-50 border-orange-200">
          <p className="text-gray-600 text-sm font-medium">Active Schedules</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{schedules.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/dashboard/backups"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
          >
            Create Backup
          </Link>
          <Link
            href="/dashboard/schedules"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center"
          >
            Create Schedule
          </Link>
          <Link
            href="/dashboard/backups"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-center"
          >
            Restore Backup
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        {recent.length === 0 ? (
          <p className="text-gray-600 text-center py-8">
            No recent activity. Start by creating a backup!
          </p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {recent.map((backup) => (
              <li key={backup.id} className="py-3 flex justify-between text-sm">
                <span className="font-medium text-gray-900">{backup.name}</span>
                <span className="text-gray-500">
                  {backup.createdAt
                    ? new Date(backup.createdAt).toLocaleString()
                    : '-'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
