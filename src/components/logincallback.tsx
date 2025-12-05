/* 
Sitepaige Components v1.0.0
Sitepaige components are automatically added to your project the first time it is built, and are only added again if the "Build Components" button is 
checked in the system build settings. It is safe to modify this file without it being overwritten unless that setting is selected. 
*/

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface LoginCallbackProps {
  code?: string | null;
  state?: string | null;
}

export default function LoginCallback({ code, state }: LoginCallbackProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    // Only run the callback if we have either a code or state parameter
    if (!code) {
      return;
    }

    const handleCallback = async () => {
      const nonce = sessionStorage.getItem('auth_nonce');
      const provider = sessionStorage.getItem('auth_provider');
      
      if (state) {
        // Verify state matches to prevent CSRF
        if (!nonce || state !== nonce) {
          return;
        }
      }

      try {

        // Regular OAuth flow
        const response = await fetch('/api/Auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            code,
            provider
          }),
        });
    

        if (!response.ok) {
          throw new Error('Authentication failed');
        }

        const data = await response.json();
        
        if (data.success) {
          // Show spinner while logging in
          setIsLoggingIn(true);
          
          // Clear OAuth state
          sessionStorage.removeItem('auth_nonce');
          sessionStorage.removeItem('auth_provider');
          
          window.location.href = '/dashboard';
        
        } else {
          throw new Error(data.error || 'Authentication failed');
        }
      
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'Authentication failed');
      }
    };

    handleCallback();
  }, [code, state]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] p-4">
        <div className="text-red-600 mb-4">Login Failed: {error}</div>
        <button
          onClick={() => router.push('/login')}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-150 classButtonRounding classButtonBackground classButtonFontType classButtonFontSize"
        >
          Return to Login
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      {isLoggingIn && (
        <div className="mt-4 text-gray-600">
          Logging you in...
        </div>
      )}
    </div>
  );
}
