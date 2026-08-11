/* 
Sitepaige Components v1.0.0
Sitepaige components are automatically added to your project the first time it is built, and are only added again if the "Build Components" button is 
checked in the system build settings. It is safe to modify this file without it being overwritten unless that setting is selected. 
*/

'use client';

import React, { useState } from 'react';

interface LoginProps {
  providers: ('apple' | 'facebook' | 'github' | 'google' | 'userpass')[];
}

export default function Login({ providers }: LoginProps) {
  const [error, setError] = useState<string | null>(null);
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [resendEmail, setResendEmail] = useState('');


  const handleProviderLogin = async (provider: string) => {
  
      // Generate random state for CSRF protection
      const state = Math.random().toString(36).substring(7) + Date.now().toString(36);
      sessionStorage.setItem('auth_nonce', state);
      sessionStorage.setItem('auth_provider', provider);
      
      // Construct redirect URI
      const redirectUri = `${window.location.origin}/logincallback`;
      
      // Configure OAuth URLs for different providers
      const providerUrls = {
        google: `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=email profile&state=${state}`,
        apple: `https://appleid.apple.com/auth/authorize?client_id=${process.env.NEXT_PUBLIC_APPLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=name email&state=${state}`,    
        facebook: `https://www.facebook.com/v12.0/dialog/oauth?client_id=${process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID}&redirect_uri=${redirectUri}&scope=email&state=${state}`,
        github: `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&scope=user:email&state=${state}`
      };

      // Redirect to appropriate provider
      if (provider in providerUrls) {
        window.location.href = providerUrls[provider as keyof typeof providerUrls];
      } else {
        setError(`Unsupported provider: ${provider}`);
      }
    
  };

  const handleResendVerification = async () => {
    setError(null);
    setMessage(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/Auth/resend-verification', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Include cookies in request
        body: JSON.stringify({ email: resendEmail || email })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({ type: 'success', text: data.message || 'Verification email sent! Please check your inbox.' });
        setShowResendVerification(false);
        setResendEmail('');
      } else {
        setError(data.error || 'Failed to send verification email');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUsernamePasswordAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);

    try {
      if (isSignup) {
        // Handle signup
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setIsLoading(false);
          return;
        }

        const response = await fetch('/api/Auth/signup', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json'
          },
          credentials: 'include', // Include cookies in request
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
          setMessage({ type: 'success', text: 'Verification email sent! Please check your inbox.' });
          setIsSignup(false);
          setPassword('');
          setConfirmPassword('');
        } else {
          setError(data.error || 'Signup failed');
        }
      } else {
        // Handle login
        const response = await fetch('/api/Auth', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json'
          },
          credentials: 'include', // Include cookies in request
          body: JSON.stringify({ email, password, provider: 'userpass' })
        });

        const data = await response.json();

        if (response.ok) {
          // Redirect to home or dashboard
          window.location.href = '/';
        } else {
          setError(data.error || 'Login failed');
          // Check if error is about email verification
          if (response.status === 403 || data.error?.toLowerCase().includes('verify')) {
            setShowResendVerification(true);
            setResendEmail(email);
          }
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const showUsernamePasswordForm = providers?.includes('userpass');
  const oauthProviders = providers?.filter(p => p !== 'userpass') || [];

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">{isSignup ? 'Create an account' : 'Sign in to your account'}</h2>
        </div>

        {showUsernamePasswordForm && (
          <form onSubmit={handleUsernamePasswordAuth} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isSignup ? 'new-password' : 'current-password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {isSignup && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : (isSignup ? 'Sign up' : 'Sign in')}
              </button>
            </div>

            <div className="text-center">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setIsSignup(!isSignup);
                  setError(null);
                  setMessage(null);
                }}
                className="text-sm text-indigo-600 hover:text-indigo-500 underline"
              >
                {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </a>
            </div>
          </form>
        )}

        {oauthProviders.length > 0 && (
          <div className="mt-6">
            {showUsernamePasswordForm && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>
              </>
            )}

            <div className={`mt-6 grid grid-cols-${Math.min(oauthProviders.length, 2)} gap-3`}>
              {oauthProviders.map(provider => (
                <button
                  key={provider}
                  onClick={() => handleProviderLogin(provider)}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-150 classButtonRounding classButtonBackground classButtonFontType classButtonFontSize"
                >
                  {provider}
                </button>
              ))}
            </div>
          </div>
        )}

        {message && (
          <div className={`mt-4 text-center ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {message.text}
          </div>
        )}

        {error && (
          <div className="mt-4 text-red-600 text-center">
            {error}
          </div>
        )}

        {showResendVerification && (
          <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
            <p className="text-sm text-gray-700 mb-3">
              Need a new verification email? Enter your email address and we'll send you a new link.
            </p>
            <div className="space-y-3">
              <input
                type="email"
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
                placeholder="Email address"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
              <button
                onClick={handleResendVerification}
                disabled={isLoading || !resendEmail}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? 'Sending...' : 'Resend Verification Email'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowResendVerification(false);
                  setResendEmail('');
                }}
                className="w-full text-sm text-gray-500 hover:text-gray-700 bg-transparent border-0 p-0 underline"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
