/**
 * Admin Auth Guard Component
 * 
 * Protects admin routes from unauthorized access.
 */

'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingPage } from '@/components/ui';
import { Icon, Button } from '@/components/ui';
import Link from 'next/link';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const { user, userProfile, loading, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Show loading state
  if (loading) {
    return <LoadingPage />;
  }

  // Not authenticated - redirect to login with return URL
  if (!user) {
    const loginUrl = `/login?redirect=${encodeURIComponent(pathname)}`;

    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-4">
        <div className="text-center max-w-md">
          <div className="h-20 w-20 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-6">
            <Icon name="lock" size="xl" className="text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Authentication Required
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please sign in to access the admin dashboard.
          </p>
          <Link href={loginUrl}>
            <Button icon="login">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Not an admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-4">
        <div className="text-center max-w-md">
          <div className="h-20 w-20 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mx-auto mb-6">
            <Icon name="admin_panel_settings" size="xl" className="text-orange-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Admin Access Required
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You don't have permission to access the admin dashboard.
            Contact your organization administrator for access.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/">
              <Button variant="secondary" icon="home">
                Go Home
              </Button>
            </Link>
            <Link href="/chat">
              <Button icon="chat">
                Use AI Chat
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Authorized - render children
  return <>{children}</>;
}

export default AdminAuthGuard;
