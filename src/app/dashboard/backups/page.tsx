'use client';

import React from 'react';
import { useBackup } from '@/hooks/useBackup';

export default function BackupsPage() {
  const { backups, isLoading, error, fetchBackups, removeBackup, clearError } =
    useBackup();

  React.useEffect(() => {
    fetchBackups().catch(() => undefined);
  }, [fetchBackups]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Backups</h1>
          <p className="text-gray-600 mt-2">
            Review completed backups and download restore points.
          </p>
        </div>
        <button
          type="button"
          onClick={() => fetchBackups().catch(() => undefined)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          disabled={isLoading}
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-lg border border-red-200 bg-red-50 text-red-700">
          <button
            type="button"
            onClick={clearError}
            className="float-right font-bold"
          >
            x
          </button>
          {error}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading && backups.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-gray-500" colSpan={5}>
                  Loading backups....
                </td>
              </tr>
            ) : backups.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-gray-500" colSpan={5}>
                  No backups found.
                </td>
              </tr>
            ) : (
              backups.map((backup) => (
                <tr key={backup.id} className="text-gray-800">
                  <td className="px-4 py-3 font-medium">{backup.name}</td>
                  <td className="px-4 py-3">{backup.backupType}</td>
                  <td className="px-4 py-3">
                    {backup.createdAt
                      ? new Date(backup.createdAt).toLocaleString()
                      : '-'}
                  </td>
                  <td className="px-4 py-3 max-w-md truncate">
                    {backup.location}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => removeBackup(backup.id).catch(() => undefined)}
                      className="text-red-600 hover:text-red-700 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
