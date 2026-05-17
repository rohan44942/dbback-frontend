'use client';

import React from 'react';
import { useBackup } from '@/hooks/useBackup';
import type { BackupSchedule, ScheduleInput } from '@/types/backup';

const emptyForm: ScheduleInput = {
  dbType: 'sqlite',
  source: '',
  cronExpr: '0 2 * * *',
  retentionDays: 7,
};

export default function SchedulesPage() {
  const {
    schedules,
    isLoading,
    error,
    fetchSchedules,
    addSchedule,
    updateSchedule,
    removeSchedule,
    clearError,
  } = useBackup();
  const [form, setForm] = React.useState<ScheduleInput>(emptyForm);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetchSchedules().catch(() => undefined);
  }, [fetchSchedules]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const startEdit = (schedule: BackupSchedule) => {
    setEditingId(schedule.id);
    setForm({
      dbType: schedule.dbType || 'sqlite',
      source: schedule.source,
      cronExpr: schedule.cronExpr,
      retentionDays: schedule.retentionDays || 7,
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = {
      ...form,
      dbType: form.dbType.trim(),
      source: form.source.trim(),
      cronExpr: form.cronExpr.trim(),
      retentionDays: Number(form.retentionDays),
    };

    if (editingId) {
      await updateSchedule(editingId, data);
    } else {
      await addSchedule(data);
    }
    resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Schedules</h1>
          <p className="text-gray-600 mt-2">
            Create and manage recurring backup jobs.
          </p>
        </div>
        <button
          type="button"
          onClick={() => fetchSchedules().catch(() => undefined)}
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

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-lg p-6 space-y-4"
      >
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900">
            {editingId ? 'Edit Schedule' : 'Create Schedule'}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Cancel edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1">
              Database Type
            </span>
            <select
              value={form.dbType}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  dbType: event.target.value,
                }))
              }
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
            <span className="block text-sm font-medium text-gray-700 mb-1">
              Source
            </span>
            <input
              value={form.source}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  source: event.target.value,
                }))
              }
              placeholder="Path or connection string"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
              disabled={isLoading}
              required
            />
          </label>

          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1">
              Cron Expression
            </span>
            <input
              value={form.cronExpr}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  cronExpr: event.target.value,
                }))
              }
              placeholder="0 2 * * *"
              className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-gray-900"
              disabled={isLoading}
              required
            />
          </label>

          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1">
              Retention Days
            </span>
            <input
              type="number"
              min={1}
              value={form.retentionDays}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  retentionDays: Number(event.target.value),
                }))
              }
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
          {editingId ? 'Save Schedule' : 'Create Schedule'}
        </button>
      </form>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
              <th className="px-4 py-3 font-medium">Source</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Frequency</th>
              <th className="px-4 py-3 font-medium">Cron</th>
              <th className="px-4 py-3 font-medium">Retention</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading && schedules.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-gray-500" colSpan={6}>
                  Loading schedules...
                </td>
              </tr>
            ) : schedules.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-gray-500" colSpan={6}>
                  No schedules found.
                </td>
              </tr>
            ) : (
              schedules.map((schedule) => (
                <tr key={schedule.id} className="text-gray-800">
                  <td className="px-4 py-3 font-medium max-w-xs truncate">
                    {schedule.source || schedule.name}
                  </td>
                  <td className="px-4 py-3 uppercase">{schedule.dbType}</td>
                  <td className="px-4 py-3 capitalize">{schedule.frequency}</td>
                  <td className="px-4 py-3 font-mono">{schedule.cronExpr}</td>
                  <td className="px-4 py-3">{schedule.retentionDays} days</td>
                  <td className="px-4 py-3 text-right space-x-4">
                    <button
                      type="button"
                      onClick={() => startEdit(schedule)}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        removeSchedule(schedule.id).catch(() => undefined)
                      }
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
