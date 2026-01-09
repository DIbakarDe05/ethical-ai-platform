/**
 * Login Form Component
 * 
 * Authentication form with OAuth providers and email/password.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Card, Button, Icon } from '@/components/ui';
import toast from 'react-hot-toast';

type AuthMode = 'signin' | 'signup' | 'reset';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    user,
    signInWithGoogle,
    signInWithMicrosoft,
    signInWithEmail,
    signUpWithEmail,
    resetPassword,
    loading: authLoading
  } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  /**
   * Validate redirect URL to prevent open redirect attacks
   */
  const validateRedirectUrl = (url: string | null): string => {
    const defaultPath = '/chat';
    if (!url) return defaultPath;
    if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(url)) return defaultPath;
    if (url.startsWith('//')) return defaultPath;
    if (!url.startsWith('/')) return defaultPath;
    if (url.includes('%00') || url.includes('%0d') || url.includes('%0a')) return defaultPath;
    return url.replace(/\/+/g, '/');
  };

  const redirectTo = validateRedirectUrl(searchParams.get('redirect'));

  useEffect(() => {
    if (user && !authLoading) {
      // Use replace instead of push to prevent back button issues
      router.replace(redirectTo);
    }
  }, [user, authLoading, router, redirectTo]);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
      // Don't manually redirect here - useEffect will handle it after user state updates
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      setIsLoading(false);
    }
  };

  const handleMicrosoftSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithMicrosoft();
      // Don't manually redirect here - useEffect will handle it after user state updates
    } catch (error: any) {
      console.error('Microsoft sign-in error:', error);
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    try {
      setIsLoading(true);
      await signInWithEmail(email, password);
      // Don't manually redirect here - useEffect will handle it after user state updates
    } catch (error: any) {
      console.error('Email sign-in error:', error);
      setIsLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !displayName) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    try {
      setIsLoading(true);
      await signUpWithEmail(email, password, displayName);
      // Don't manually redirect here - useEffect will handle it after user state updates
    } catch (error: any) {
      console.error('Email sign-up error:', error);
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }
    try {
      setIsLoading(true);
      await resetPassword(email);
      setAuthMode('signin');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-primary to-indigo-600 flex items-center justify-center">
            <Icon name="psychology" className="text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            EthicalAI KB
          </span>
        </Link>

        <Card padding="lg" className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {authMode === 'signin' && 'Welcome Back'}
            {authMode === 'signup' && 'Create Account'}
            {authMode === 'reset' && 'Reset Password'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {authMode === 'signin' && 'Sign in to access the ethical AI knowledge base'}
            {authMode === 'signup' && 'Create an account to get started'}
            {authMode === 'reset' && 'Enter your email to reset your password'}
          </p>

          {/* Email/Password Form */}
          {authMode === 'signin' && (
            <form onSubmit={handleEmailSignIn} className="space-y-4 mb-6">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={isLoading}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={isLoading}
              />
              <Button type="submit" fullWidth disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
              <button
                type="button"
                onClick={() => setAuthMode('reset')}
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </button>
            </form>
          )}

          {authMode === 'signup' && (
            <form onSubmit={handleEmailSignUp} className="space-y-4 mb-6">
              <input
                type="text"
                placeholder="Full name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={isLoading}
              />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={isLoading}
              />
              <input
                type="password"
                placeholder="Password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={isLoading}
              />
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={isLoading}
              />
              <Button type="submit" fullWidth disabled={isLoading}>
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
          )}

          {authMode === 'reset' && (
            <form onSubmit={handlePasswordReset} className="space-y-4 mb-6">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={isLoading}
              />
              <Button type="submit" fullWidth disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
              <button
                type="button"
                onClick={() => setAuthMode('signin')}
                className="text-sm text-primary hover:underline"
              >
                Back to sign in
              </button>
            </form>
          )}

          {/* Divider */}
          {authMode !== 'reset' && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white dark:bg-gray-900 text-gray-500">
                    or continue with
                  </span>
                </div>
              </div>

              {/* OAuth Buttons */}
              <div className="space-y-3">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  <div className="flex items-center justify-center gap-3">
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span>Google</span>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  fullWidth
                  onClick={handleMicrosoftSignIn}
                  disabled={isLoading}
                >
                  <div className="flex items-center justify-center gap-3">
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path fill="#F25022" d="M1 1h10v10H1z" />
                      <path fill="#00A4EF" d="M1 13h10v10H1z" />
                      <path fill="#7FBA00" d="M13 1h10v10H13z" />
                      <path fill="#FFB900" d="M13 13h10v10H13z" />
                    </svg>
                    <span>Microsoft</span>
                  </div>
                </Button>
              </div>

              {/* Toggle Auth Mode */}
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-6">
                {authMode === 'signin' ? (
                  <>
                    Don't have an account?{' '}
                    <button
                      onClick={() => setAuthMode('signup')}
                      className="text-primary hover:underline font-medium"
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button
                      onClick={() => setAuthMode('signin')}
                      className="text-primary hover:underline font-medium"
                    >
                      Sign in
                    </button>
                  </>
                )}
              </p>
            </>
          )}

          {/* Privacy Notice */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
              <Icon name="verified_user" size="sm" />
              <p className="text-xs">
                Your data is protected under our privacy policy.
              </p>
            </div>
          </div>
        </Card>

        {/* Terms */}
        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6">
          By signing in, you agree to our{' '}
          <Link href="/ethics" className="text-primary hover:underline">
            Ethics Policy
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;
