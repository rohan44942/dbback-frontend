'use client';

import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { LoginForm } from '@/components/auth/LoginForm';
import {
  AuthDivider,
  GoogleSignInButton,
} from '@/components/auth/GoogleSignInButton';
import { useAuth } from '@/hooks/useAuth';
import type { LoginFormData } from '@/lib/validators/auth';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';
  const {
    login,
    loginWithGoogle,
    isLoading,
    error,
    clearError,
    isAuthenticated,
  } = useAuth();
  const [localError, setLocalError] = useState<string | null>(null);

  React.useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, router, redirectTo]);

  const handleLogin = async (data: LoginFormData) => {
    try {
      setLocalError(null);
      await login(data.email, data.password);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Login failed. Please try again.';
      setLocalError(message);
    }
  };

  const handleGoogle = async (credential: string) => {
    try {
      setLocalError(null);
      await loginWithGoogle(credential);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Google sign-in failed. Please try again.';
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

          <GoogleSignInButton
            onSuccess={handleGoogle}
            onError={setLocalError}
            disabled={isLoading}
          />
          <AuthDivider />

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
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-gray-600">
          Loading...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
