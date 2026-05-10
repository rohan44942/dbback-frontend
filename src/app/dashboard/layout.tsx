/**
 * Dashboard Layout
 * 
 * This layout wraps all dashboard routes.
 * It includes the navigation sidebar and header.
 * 
 * Note: This is a protected route - users must be logged in to see this.
 */

'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  // Client-side authentication check
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!isAuthenticated) {
    return null; // or a loading spinner
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">DBBack</h2>
          <p className="text-gray-400 text-sm">Dashboard</p>
        </div>

        <nav className="space-y-2">
          <Link
            href="/dashboard"
            className="block px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            📊 Overview
          </Link>
          <Link
            href="/dashboard/backups"
            className="block px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            💾 Backups
          </Link>
          <Link
            href="/dashboard/schedules"
            className="block px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            ⏱️ Schedules
          </Link>
          <Link
            href="/dashboard/settings"
            className="block px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            ⚙️ Settings
          </Link>
        </nav>

        <div className="absolute bottom-6 left-6 right-6 space-y-4">
          <div className="border-t border-gray-700 pt-4">
            <p className="text-sm text-gray-400">Logged in as</p>
            <p className="text-sm font-medium truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome, {user?.name}!
          </h1>
          <div className="text-sm text-gray-600">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
