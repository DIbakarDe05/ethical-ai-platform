/**
 * Admin Setup Page
 * 
 * One-time setup page to promote the first user to admin role.
 * This page should be disabled or removed after initial setup.
 * 
 * SECURITY: Uses a secret code to prevent unauthorized access.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db, COLLECTIONS, USER_ROLES } from '@/lib/firebase/config';
import { useAuth } from '@/contexts/AuthContext';
import { Icon, Card, Button } from '@/components/ui';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

// Secret setup code - change this to something only you know!
const SETUP_SECRET_CODE = 'ETHICAL-AI-ADMIN-2024';

export default function AdminSetupPage() {
    const router = useRouter();
    const { user, userProfile, refreshUserProfile, isAuthenticated, loading } = useAuth();
    const [secretCode, setSecretCode] = useState('');
    const [processing, setProcessing] = useState(false);
    const [adminExists, setAdminExists] = useState<boolean | null>(null);
    const [setupComplete, setSetupComplete] = useState(false);

    // Check if any admin already exists
    useEffect(() => {
        const checkAdminExists = async () => {
            try {
                const q = query(
                    collection(db, COLLECTIONS.USERS),
                    where('role', '==', USER_ROLES.ADMIN)
                );
                const snapshot = await getDocs(q);
                setAdminExists(!snapshot.empty);
            } catch (error) {
                console.error('Error checking admin:', error);
                setAdminExists(false);
            }
        };
        checkAdminExists();
    }, []);

    const handlePromoteToAdmin = async () => {
        if (!user || !userProfile) {
            toast.error('Please login first');
            return;
        }

        if (secretCode !== SETUP_SECRET_CODE) {
            toast.error('Invalid setup code');
            return;
        }

        setProcessing(true);

        try {
            // Update user role to admin in Firestore
            const userRef = doc(db, COLLECTIONS.USERS, user.uid);
            await setDoc(userRef, {
                role: USER_ROLES.ADMIN,
            }, { merge: true });

            // Refresh user profile to get updated role
            await refreshUserProfile();

            setSetupComplete(true);
            toast.success('🎉 You are now an admin!');

            // Redirect to admin panel after 2 seconds
            setTimeout(() => {
                router.push('/admin');
            }, 2000);

        } catch (error) {
            console.error('Error promoting to admin:', error);
            toast.error('Failed to promote to admin. Check console for details.');
        } finally {
            setProcessing(false);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
            </div>
        );
    }

    // Not logged in
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
                <Card padding="lg" className="max-w-md w-full text-center">
                    <Icon name="login" size="2xl" className="text-primary mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Login Required
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Please login first to set up admin access.
                    </p>
                    <Button onClick={() => router.push('/login?redirect=/admin-setup')}>
                        Go to Login
                    </Button>
                </Card>
            </div>
        );
    }

    // Already admin
    if (userProfile?.role === USER_ROLES.ADMIN) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
                <Card padding="lg" className="max-w-md w-full text-center">
                    <Icon name="check_circle" size="2xl" className="text-green-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Already Admin!
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        You already have admin access.
                    </p>
                    <Button onClick={() => router.push('/admin')}>
                        Go to Admin Panel
                    </Button>
                </Card>
            </div>
        );
    }

    // Setup complete
    if (setupComplete) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
                <Card padding="lg" className="max-w-md w-full text-center">
                    <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                        <Icon name="verified" size="2xl" className="text-green-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Setup Complete! 🎉
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                        You are now an admin.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                        Redirecting to admin panel...
                    </p>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
            <Card padding="lg" className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4">
                        <Icon name="admin_panel_settings" size="2xl" className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Admin Setup
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Promote your account to administrator
                    </p>
                </div>

                {/* Warning about existing admin */}
                {adminExists && (
                    <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800/50">
                        <div className="flex items-start gap-3">
                            <Icon name="warning" className="text-amber-600 dark:text-amber-400 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                                    Admin already exists
                                </p>
                                <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                                    An admin account has already been set up. You can still create additional admins with the secret code.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Current user info */}
                <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Logged in as:</p>
                    <p className="font-medium text-gray-900 dark:text-white">{user?.displayName}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{user?.email}</p>
                    <span className="inline-flex items-center mt-2 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                        Current role: {userProfile?.role || 'user'}
                    </span>
                </div>

                {/* Secret code input */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Enter Setup Code
                    </label>
                    <input
                        type="password"
                        value={secretCode}
                        onChange={(e) => setSecretCode(e.target.value)}
                        placeholder="Enter secret setup code..."
                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-white"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        Hint: Check the source code or ask the developer for the setup code.
                    </p>
                </div>

                {/* Action button */}
                <Button
                    onClick={handlePromoteToAdmin}
                    disabled={processing || !secretCode}
                    className="w-full"
                    size="lg"
                >
                    {processing ? (
                        <>
                            <span className="animate-spin mr-2">⏳</span>
                            Processing...
                        </>
                    ) : (
                        <>
                            <Icon name="verified_user" size="sm" className="mr-2" />
                            Activate Admin Access
                        </>
                    )}
                </Button>

                {/* Back link */}
                <div className="mt-4 text-center">
                    <button
                        onClick={() => router.push('/')}
                        className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        ← Back to Home
                    </button>
                </div>
            </Card>
        </div>
    );
}
