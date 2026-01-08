/**
 * NGO Management Component
 * 
 * Admin dashboard for managing NGO registrations and approvals.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, serverTimestamp, addDoc } from 'firebase/firestore';
import { db, COLLECTIONS } from '@/lib/firebase/config';
import { useAuth } from '@/contexts/AuthContext';
import { Icon, Card, Button, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface NGO {
    id: string;
    userId: string;
    name: string;
    location: string;
    type: 'adoption' | 'child_care' | 'welfare';
    description?: string;
    registrationNumber?: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: Date;
    reviewedAt?: Date;
    reviewedBy?: string;
}

const typeLabels = {
    adoption: { label: 'Adoption', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' },
    child_care: { label: 'Child Care', color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' },
    welfare: { label: 'Welfare', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' },
};

const statusLabels = {
    pending: { label: 'Pending Review', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400', icon: 'pending' },
    approved: { label: 'Approved', color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400', icon: 'check_circle' },
    rejected: { label: 'Rejected', color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400', icon: 'cancel' },
};

export function NGOManagement() {
    const { user } = useAuth();
    const [ngos, setNgos] = useState<NGO[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        const q = query(
            collection(db, COLLECTIONS.NGOS),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const ngoList: NGO[] = [];
            snapshot.forEach((doc) => {
                ngoList.push({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: doc.data().createdAt?.toDate() || new Date(),
                    reviewedAt: doc.data().reviewedAt?.toDate(),
                } as NGO);
            });
            setNgos(ngoList);
            setLoading(false);
        }, (error) => {
            console.error('Error fetching NGOs:', error);
            toast.error('Failed to load NGOs');
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleStatusUpdate = async (ngoId: string, userId: string, newStatus: 'approved' | 'rejected') => {
        if (!user) return;

        setProcessingId(ngoId);
        try {
            // Update NGO status
            await updateDoc(doc(db, COLLECTIONS.NGOS, ngoId), {
                status: newStatus,
                reviewedAt: serverTimestamp(),
                reviewedBy: user.uid,
            });

            // Also update user profile to reflect NGO status
            await updateDoc(doc(db, COLLECTIONS.USERS, userId), {
                ngoStatus: newStatus,
            });

            // Create audit log
            await addDoc(collection(db, COLLECTIONS.AUDIT_LOGS), {
                userId: user.uid,
                action: `NGO ${newStatus}: ${ngoId}`,
                targetId: ngoId,
                targetType: 'ngo',
                timestamp: serverTimestamp(),
                details: { previousStatus: 'pending', newStatus },
            });

            toast.success(`NGO ${newStatus === 'approved' ? 'approved' : 'rejected'} successfully`);
        } catch (error) {
            console.error('Error updating NGO status:', error);
            toast.error('Failed to update NGO status');
        } finally {
            setProcessingId(null);
        }
    };

    const filteredNgos = filter === 'all'
        ? ngos
        : ngos.filter(ngo => ngo.status === filter);

    const pendingCount = ngos.filter(n => n.status === 'pending').length;

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
                        NGO Management
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Review and manage NGO registrations
                    </p>
                </div>
                {pendingCount > 0 && (
                    <Badge variant="warning" className="flex items-center gap-1.5">
                        <Icon name="pending" size="sm" />
                        {pendingCount} Pending
                    </Badge>
                )}
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 flex-wrap">
                {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
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
                        {status} {status === 'pending' && pendingCount > 0 && `(${pendingCount})`}
                    </button>
                ))}
            </div>

            {/* NGO List */}
            <div className="space-y-4">
                {filteredNgos.length === 0 ? (
                    <Card padding="lg" className="text-center">
                        <Icon name="business" size="2xl" className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">
                            No {filter === 'all' ? '' : filter} NGOs found
                        </p>
                    </Card>
                ) : (
                    filteredNgos.map((ngo) => (
                        <Card key={ngo.id} padding="lg" className="hover:shadow-lg transition-shadow">
                            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                {/* NGO Info */}
                                <div className="flex-1">
                                    <div className="flex items-start gap-3">
                                        <div className={cn(
                                            'flex items-center justify-center h-12 w-12 rounded-xl shrink-0',
                                            ngo.type === 'adoption' && 'bg-blue-100 dark:bg-blue-900/30 text-blue-600',
                                            ngo.type === 'child_care' && 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600',
                                            ngo.type === 'welfare' && 'bg-purple-100 dark:bg-purple-900/30 text-purple-600',
                                        )}>
                                            <Icon name="business" size="lg" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="font-bold text-gray-900 dark:text-white">
                                                    {ngo.name}
                                                </h3>
                                                <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', typeLabels[ngo.type].color)}>
                                                    {typeLabels[ngo.type].label}
                                                </span>
                                                <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1', statusLabels[ngo.status].color)}>
                                                    <Icon name={statusLabels[ngo.status].icon} size="sm" />
                                                    {statusLabels[ngo.status].label}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                <span className="flex items-center gap-1">
                                                    <Icon name="location_on" size="sm" />
                                                    {ngo.location}
                                                </span>
                                                {ngo.registrationNumber && (
                                                    <span className="flex items-center gap-1">
                                                        <Icon name="badge" size="sm" />
                                                        {ngo.registrationNumber}
                                                    </span>
                                                )}
                                            </div>
                                            {ngo.description && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                                                    {ngo.description}
                                                </p>
                                            )}
                                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                                                Registered: {ngo.createdAt.toLocaleDateString()}
                                                {ngo.reviewedAt && ` • Reviewed: ${ngo.reviewedAt.toLocaleDateString()}`}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                {ngo.status === 'pending' && (
                                    <div className="flex gap-2 shrink-0">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            icon="cancel"
                                            onClick={() => handleStatusUpdate(ngo.id, ngo.userId, 'rejected')}
                                            disabled={processingId === ngo.id}
                                            className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                        >
                                            Reject
                                        </Button>
                                        <Button
                                            size="sm"
                                            icon="check_circle"
                                            onClick={() => handleStatusUpdate(ngo.id, ngo.userId, 'approved')}
                                            disabled={processingId === ngo.id}
                                        >
                                            {processingId === ngo.id ? 'Processing...' : 'Approve'}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}

export default NGOManagement;
