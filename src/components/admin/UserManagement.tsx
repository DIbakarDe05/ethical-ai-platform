/**
 * User Management Component
 * 
 * Admin dashboard for managing user accounts.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, serverTimestamp, addDoc, deleteDoc } from 'firebase/firestore';
import { db, COLLECTIONS, USER_ROLES } from '@/lib/firebase/config';
import { useAuth } from '@/contexts/AuthContext';
import { Icon, Card, Button, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface UserAccount {
    id: string;
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    role: string;
    provider: string;
    createdAt: Date;
    lastLoginAt: Date;
    accountStatus?: 'active' | 'suspended' | 'locked';
    ngoStatus?: 'pending' | 'approved' | 'rejected';
}

const roleLabels: Record<string, { label: string; color: string; icon: string }> = {
    admin: { label: 'Admin', color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400', icon: 'admin_panel_settings' },
    ngo: { label: 'NGO', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400', icon: 'business' },
    prospective_parent: { label: 'Prospective Parent', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400', icon: 'family_restroom' },
    user: { label: 'User', color: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400', icon: 'person' },
    guest: { label: 'Guest', color: 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-500', icon: 'person_outline' },
};

const statusLabels: Record<string, { label: string; color: string; icon: string }> = {
    active: { label: 'Active', color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400', icon: 'check_circle' },
    suspended: { label: 'Suspended', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400', icon: 'pause_circle' },
    locked: { label: 'Locked', color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400', icon: 'lock' },
};

export function UserManagement() {
    const { user } = useAuth();
    const [users, setUsers] = useState<UserAccount[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'admin' | 'ngo' | 'user' | 'suspended'>('all');
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const q = query(
            collection(db, COLLECTIONS.USERS),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const userList: UserAccount[] = [];
            snapshot.forEach((docSnap) => {
                userList.push({
                    id: docSnap.id,
                    uid: docSnap.id,
                    ...docSnap.data(),
                    createdAt: docSnap.data().createdAt?.toDate() || new Date(),
                    lastLoginAt: docSnap.data().lastLoginAt?.toDate() || new Date(),
                } as UserAccount);
            });
            setUsers(userList);
            setLoading(false);
        }, (error) => {
            console.error('Error fetching users:', error);
            toast.error('Failed to load users');
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleStatusUpdate = async (userId: string, newStatus: 'active' | 'suspended' | 'locked') => {
        if (!user) return;

        setProcessingId(userId);
        try {
            await updateDoc(doc(db, COLLECTIONS.USERS, userId), {
                accountStatus: newStatus,
            });

            // Create audit log
            await addDoc(collection(db, COLLECTIONS.AUDIT_LOGS), {
                userId: user.uid,
                action: `User ${newStatus}: ${userId}`,
                targetId: userId,
                targetType: 'user',
                timestamp: serverTimestamp(),
                details: { newStatus },
            });

            toast.success(`User account ${newStatus}`);
        } catch (error) {
            console.error('Error updating user status:', error);
            toast.error('Failed to update user status');
        } finally {
            setProcessingId(null);
        }
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        if (!user || userId === user.uid) {
            toast.error('Cannot change your own role');
            return;
        }

        setProcessingId(userId);
        try {
            await updateDoc(doc(db, COLLECTIONS.USERS, userId), {
                role: newRole,
            });

            // Create audit log
            await addDoc(collection(db, COLLECTIONS.AUDIT_LOGS), {
                userId: user.uid,
                action: `Role changed to ${newRole}: ${userId}`,
                targetId: userId,
                targetType: 'user',
                timestamp: serverTimestamp(),
                details: { newRole },
            });

            toast.success(`User role updated to ${newRole}`);
        } catch (error) {
            console.error('Error updating user role:', error);
            toast.error('Failed to update user role');
        } finally {
            setProcessingId(null);
        }
    };

    const filteredUsers = users
        .filter(u => {
            if (filter === 'all') return true;
            if (filter === 'suspended') return u.accountStatus === 'suspended' || u.accountStatus === 'locked';
            return u.role === filter;
        })
        .filter(u => {
            if (!searchQuery) return true;
            const q = searchQuery.toLowerCase();
            return u.email?.toLowerCase().includes(q) || u.displayName?.toLowerCase().includes(q);
        });

    const suspendedCount = users.filter(u => u.accountStatus === 'suspended' || u.accountStatus === 'locked').length;

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        User Management
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Manage user accounts and permissions
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="info" className="flex items-center gap-1.5">
                        <Icon name="group" size="sm" />
                        {users.length} Users
                    </Badge>
                    {suspendedCount > 0 && (
                        <Badge variant="warning" className="flex items-center gap-1.5">
                            <Icon name="warning" size="sm" />
                            {suspendedCount} Suspended
                        </Badge>
                    )}
                </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl border-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white placeholder-gray-500"
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {(['all', 'admin', 'ngo', 'user', 'suspended'] as const).map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={cn(
                                'px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize',
                                filter === status
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                            )}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* User List */}
            <div className="space-y-3">
                {filteredUsers.length === 0 ? (
                    <Card padding="lg" className="text-center">
                        <Icon name="person_search" size="2xl" className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">
                            No users found
                        </p>
                    </Card>
                ) : (
                    filteredUsers.map((userAccount) => {
                        const role = roleLabels[userAccount.role] || roleLabels.user;
                        const status = statusLabels[userAccount.accountStatus || 'active'];
                        const isCurrentUser = userAccount.uid === user?.uid;

                        return (
                            <Card key={userAccount.id} padding="md" className="hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-4">
                                    {/* Avatar */}
                                    <div className="shrink-0">
                                        {userAccount.photoURL ? (
                                            <img
                                                src={userAccount.photoURL}
                                                alt={userAccount.displayName || 'User'}
                                                className="h-12 w-12 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                                <Icon name="person" className="text-gray-500" />
                                            </div>
                                        )}
                                    </div>

                                    {/* User Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                                                {userAccount.displayName || 'Unnamed User'}
                                            </h3>
                                            {isCurrentUser && (
                                                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">You</span>
                                            )}
                                            <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1', role.color)}>
                                                <Icon name={role.icon} size="sm" />
                                                {role.label}
                                            </span>
                                            <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1', status.color)}>
                                                <Icon name={status.icon} size="sm" />
                                                {status.label}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                            {userAccount.email}
                                        </p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                            Joined: {userAccount.createdAt.toLocaleDateString()} •
                                            Last login: {userAccount.lastLoginAt.toLocaleDateString()}
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    {!isCurrentUser && (
                                        <div className="flex items-center gap-2 shrink-0">
                                            {/* Role Dropdown */}
                                            <select
                                                value={userAccount.role}
                                                onChange={(e) => handleRoleChange(userAccount.uid, e.target.value)}
                                                disabled={processingId === userAccount.uid}
                                                className="text-sm px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 border-none focus:ring-2 focus:ring-primary/50"
                                            >
                                                {Object.entries(USER_ROLES).map(([key, value]) => (
                                                    <option key={key} value={value}>{roleLabels[value]?.label || value}</option>
                                                ))}
                                            </select>

                                            {/* Status Actions */}
                                            {userAccount.accountStatus === 'active' || !userAccount.accountStatus ? (
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    icon="pause_circle"
                                                    onClick={() => handleStatusUpdate(userAccount.uid, 'suspended')}
                                                    disabled={processingId === userAccount.uid}
                                                    className="text-amber-600"
                                                >
                                                    Suspend
                                                </Button>
                                            ) : (
                                                <Button
                                                    size="sm"
                                                    icon="check_circle"
                                                    onClick={() => handleStatusUpdate(userAccount.uid, 'active')}
                                                    disabled={processingId === userAccount.uid}
                                                >
                                                    Activate
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default UserManagement;
