/**
 * Role-Based Authentication Guard Component
 * 
 * Protects routes based on user roles with flexible configuration.
 * Supports multiple allowed roles and NGO verification requirements.
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingPage } from '@/components/ui';
import { Icon, Button } from '@/components/ui';
import Link from 'next/link';
import { UserRole } from '@/lib/firebase/config';

interface RoleAuthGuardProps {
    children: React.ReactNode;
    allowedRoles: UserRole[];
    requireVerified?: boolean; // Require NGO to be verified
    requireActiveAccount?: boolean; // Require account to not be suspended/locked
    fallbackPath?: string; // Where to redirect if unauthorized
}

export function RoleAuthGuard({
    children,
    allowedRoles,
    requireVerified = false,
    requireActiveAccount = true,
    fallbackPath = '/',
}: RoleAuthGuardProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, userProfile, loading, isVerifiedNGO, isAccountActive } = useAuth();
    const [isRedirecting, setIsRedirecting] = useState(false);

    // Show loading state
    if (loading) {
        return <LoadingPage />;
    }

    // Not authenticated - redirect to login with return URL
    if (!user) {
        // Build login URL with redirect parameter
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
                        Please sign in to access this page.
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

    // Account suspended or locked
    if (requireActiveAccount && !isAccountActive) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-4">
                <div className="text-center max-w-md">
                    <div className="h-20 w-20 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-6">
                        <Icon name="block" size="xl" className="text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                        Account Suspended
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Your account has been suspended. Please contact support for assistance.
                    </p>
                    <Link href="/">
                        <Button variant="secondary" icon="home">
                            Go Home
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    // Check role authorization
    const userRole = userProfile?.role;
    const hasAllowedRole = userRole && allowedRoles.includes(userRole);

    if (!hasAllowedRole) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-4">
                <div className="text-center max-w-md">
                    <div className="h-20 w-20 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mx-auto mb-6">
                        <Icon name="admin_panel_settings" size="xl" className="text-orange-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                        Access Denied
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        You don't have permission to access this page.
                        Contact your administrator for access.
                    </p>
                    <div className="flex gap-3 justify-center">
                        <Link href={fallbackPath}>
                            <Button variant="secondary" icon="home">
                                Go Back
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Check NGO verification if required
    if (requireVerified && userProfile?.role === 'ngo' && !isVerifiedNGO) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-4">
                <div className="text-center max-w-md">
                    <div className="h-20 w-20 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-6">
                        <Icon name="pending" size="xl" className="text-amber-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                        Verification Pending
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Your NGO account is pending approval. You'll be notified once an administrator
                        reviews your registration.
                    </p>
                    <div className="flex gap-3 justify-center">
                        <Link href="/">
                            <Button variant="secondary" icon="home">
                                Go Home
                            </Button>
                        </Link>
                        <Link href="/documents">
                            <Button icon="upload_file">
                                Upload Documents
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

export default RoleAuthGuard;
