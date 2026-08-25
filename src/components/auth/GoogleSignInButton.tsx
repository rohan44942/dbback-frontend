'use client';

import React from 'react';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';

type GoogleSignInButtonProps = {
  onSuccess: (credential: string) => Promise<void> | void;
  onError?: (message: string) => void;
  disabled?: boolean;
};

export function GoogleSignInButton({
  onSuccess,
  onError,
  disabled = false,
}: GoogleSignInButtonProps) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) {
    return null;
  }

  return (
    <div className={`w-full flex justify-center ${disabled ? 'pointer-events-none opacity-60' : ''}`}>
      <GoogleLogin
        onSuccess={async (response: CredentialResponse) => {
          if (!response.credential) {
            onError?.('Google did not return a credential');
            return;
          }
          try {
            await onSuccess(response.credential);
          } catch (err) {
            const message =
              err instanceof Error ? err.message : 'Google sign-in failed';
            onError?.(message);
          }
        }}
        onError={() => onError?.('Google sign-in was cancelled or failed')}
        useOneTap={false}
        theme="outline"
        size="large"
        width="320"
        text="continue_with"
        shape="rectangular"
      />
    </div>
  );
}

export function AuthDivider() {
  if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
    return null;
  }

  return (
    <div className="my-6 flex items-center gap-3">
      <div className="h-px flex-1 bg-gray-200" />
      <span className="text-xs uppercase tracking-wide text-gray-500">or</span>
      <div className="h-px flex-1 bg-gray-200" />
    </div>
  );
}
