'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { useAuth } from '@/hooks/useAuth';
import type { RegisterFormData } from '@/lib/validators/auth';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, error, clearError, isAuthenticated } = useAuth();
  const [localError, setLocalError] = useState<string | null>(null);

  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleRegister = async (data: RegisterFormData) => {
    try {
      setLocalError(null);
      await register(data.email, data.password, data.name);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Registration failed. Please try again.';
      setLocalError(message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">
            DBBack
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Create your backup management account
          </p>

          <RegisterForm
            onSubmit={handleRegister}
            isLoading={isLoading}
            error={localError || error}
            onErrorDismiss={() => {
              setLocalError(null);
              clearError();
            }}
          />

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>Secure backup management for your databases</p>
        </div>
      </div>
    </div>
  );
}
