/**
 * Login Page
 * 
 * This page demonstrates:
 * - Using client components for interactivity
 * - Composing smaller components together
 * - Using custom hooks for logic
 * - Proper error handling
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LoginForm } from '@/components/auth/LoginForm';
import { useAuth } from '@/hooks/useAuth';
import type { LoginFormData } from '@/lib/validators/auth';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError, isAuthenticated } = useAuth();
  const [localError, setLocalError] = useState<string | null>(null);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (data: LoginFormData) => {
    try {
      setLocalError(null);
      await login(data.email, data.password);
      // Note: Redirect happens via useEffect watching isAuthenticated
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Login failed. Please try again.';
      setLocalError(message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">
            DBBack
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Backup Management System
          </p>

          <LoginForm
            onSubmit={handleLogin}
            isLoading={isLoading}
            error={localError || error}
            onErrorDismiss={() => {
              setLocalError(null);
              clearError();
            }}
          />

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer with info */}
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>Secure backup management for your databases</p>
        </div>
      </div>
    </div>
  );
}
