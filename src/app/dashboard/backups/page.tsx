'use client';

import React from 'react';
import Link from 'next/link';
import { useBackup } from '@/hooks/useBackup';
import type { BackupInput } from '@/types/backup';

const emptyForm: BackupInput = {
  name: '',
  dbType: 'sqlite',
  source: '',
};

export default function BackupsPage() {
  const {
    backups,
    isLoading,
    error,
    fetchBackups,
    addBackup,
    removeBackup,
    downloadBackup,
    restoreBackup,
    clearError,
  } = useBackup();
  const [form, setForm] = React.useState<BackupInput>(emptyForm);
  const [restoreTarget, setRestoreTarget] = React.useState('');
  const [restoreId, setRestoreId] = React.useState<string | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetchBackups().catch(() => undefined);
  }, [fetchBackups]);

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await addBackup({
      name: form.name.trim() || 'backup',
      dbType: form.dbType.trim(),
      source: form.source.trim(),
    });
    setForm(emptyForm);
  };

  const handleRestore = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!restoreId || !restoreTarget.trim()) return;
    await restoreBackup(restoreId, restoreTarget.trim());
    setRestoreId(null);
    setRestoreTarget('');
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    await removeBackup(deleteId);
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Backups</h1>
          <p className="text-gray-600 mt-2">
            Create, download, and restore database backups.
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
          <button type="button" onClick={clearError} className="float-right font-bold">
            x
          </button>
          {error}
        </div>
      )}

      <form
        onSubmit={handleCreate}
        className="bg-white border border-gray-200 rounded-lg p-6 space-y-4"
      >
        <h2 className="text-xl font-bold text-gray-900">Create Backup</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1">Name</span>
            <input
              value={form.name}
              onChange={(e) => setForm((c) => ({ ...c, name: e.target.value }))}
              placeholder="my-backup"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
              disabled={isLoading}
            />
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1">Database Type</span>
            <select
              value={form.dbType}
              onChange={(e) => setForm((c) => ({ ...c, dbType: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900"
              disabled={isLoading}
              required
            >
              <option value="sqlite">SQLite</option>
              <option value="mysql">MySQL</option>
              <option value="postgres">Postgres</option>
              <option value="mongodb">MongoDB</option>
            </select>
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1">Source</span>
            <input
              value={form.source}
              onChange={(e) => setForm((c) => ({ ...c, source: e.target.value }))}
              placeholder="Path or connection string"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
              disabled={isLoading}
              required
            />
          </label>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          disabled={isLoading}
        >
          Create Backup
        </button>
      </form>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium">Size</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading && backups.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-gray-500" colSpan={6}>
                  Loading backups...
                </td>
              </tr>
            ) : backups.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-gray-500" colSpan={6}>
                  No backups found.
                </td>
              </tr>
            ) : (
              backups.map((backup) => (
                <tr key={backup.id} className="text-gray-800">
                  <td className="px-4 py-3 font-medium">{backup.name}</td>
                  <td className="px-4 py-3 uppercase">{backup.dbType}</td>
                  <td className="px-4 py-3">
                    {backup.createdAt
                      ? new Date(backup.createdAt).toLocaleString()
                      : '-'}
                  </td>
                  <td className="px-4 py-3">
                    {backup.size ? `${(backup.size / 1024).toFixed(1)} KB` : '-'}
                  </td>
                  <td className="px-4 py-3 max-w-xs truncate">{backup.location}</td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <button
                      type="button"
                      onClick={() =>
                        downloadBackup(backup.id, backup.name).catch(() => undefined)
                      }
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Download
                    </button>
                    <button
                      type="button"
                      onClick={() => setRestoreId(backup.id)}
                      className="text-purple-600 hover:text-purple-700 font-medium"
                    >
                      Restore
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteId(backup.id)}
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

      {restoreId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <form
            onSubmit={handleRestore}
            className="bg-white rounded-lg p-6 w-full max-w-md space-y-4"
          >
            <h3 className="text-lg font-bold text-gray-900">Restore Backup</h3>
            <p className="text-sm text-gray-600">
              Enter the target file path on the server where the backup should be restored.
            </p>
            <input
              value={restoreTarget}
              onChange={(e) => setRestoreTarget(e.target.value)}
              placeholder="/path/to/restore.db"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
              required
            />
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setRestoreId(null);
                  setRestoreTarget('');
                }}
                className="px-4 py-2 text-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                disabled={isLoading}
              >
                Restore
              </button>
            </div>
          </form>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Delete Backup?</h3>
            <p className="text-sm text-gray-600">
              This permanently removes the backup file and metadata.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-gray-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => confirmDelete().catch(() => undefined)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                disabled={isLoading}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <p className="text-sm text-gray-500">
        Need schedules? <Link href="/dashboard/schedules" className="text-blue-600">Manage schedules</Link>
      </p>
    </div>
  );
}
