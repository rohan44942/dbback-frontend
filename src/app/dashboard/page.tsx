/**
 * Dashboard Home Page
 * 
 * This is the main dashboard page that users see after logging in.
 * It displays key metrics and statistics.
 */

'use client';

import React from 'react';

interface StatCard {
  title: string;
  value: string;
  icon: string;
  color: string;
}

const stats: StatCard[] = [
  {
    title: 'Total Backups',
    value: '24',
    icon: '💾',
    color: 'bg-blue-50 border-blue-200',
  },
  {
    title: 'Last Backup',
    value: '2 hours ago',
    icon: '⏱️',
    color: 'bg-green-50 border-green-200',
  },
  {
    title: 'Storage Used',
    value: '128 GB',
    icon: '📊',
    color: 'bg-purple-50 border-purple-200',
  },
  {
    title: 'Active Schedules',
    value: '5',
    icon: '🔄',
    color: 'bg-orange-50 border-orange-200',
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">
          Here&apos;s what&apos;s happening with your backups today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className={`p-6 rounded-lg border-2 ${stat.color} hover:shadow-lg transition-shadow`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stat.value}
                </p>
              </div>
              <span className="text-3xl">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            ➕ Create Backup
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            ⏱️ Create Schedule
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            📥 Restore Backup
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        <p className="text-gray-600 text-center py-8">
          No recent activity. Start by creating a backup!
        </p>
      </div>
    </div>
  );
}
