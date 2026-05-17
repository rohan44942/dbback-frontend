'use client';

import React from 'react';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">
          Runtime connection settings used by the frontend.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            API Base URL
          </label>
          <input
            value={apiUrl}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Expected Backend Routes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {[
              'GET /backups',
              'GET /schedules',
              'POST /auth/login',
              'POST /auth/register',
            ].map((route) => (
              <div
                key={route}
                className="px-3 py-2 rounded-md border border-gray-200 bg-gray-50 font-mono text-gray-700"
              >
                {route}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
