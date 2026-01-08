/**
 * NGO Directory Page Component
 * 
 * Public page displaying verified NGOs with search and filter capabilities.
 * No child photos or personal data shown publicly.
 * Only approved NGOs are displayed - fetched from Firestore.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, COLLECTIONS } from '@/lib/firebase/config';
import { useAuth } from '@/contexts/AuthContext';
import { Icon, Card, Button, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface NGO {
    id: string;
    userId: string;
    name: string;
    location: string;
    type: 'adoption' | 'child_care' | 'welfare';
    description?: string;
    status: string;
}

const typeLabels = {
    adoption: { label: 'Adoption', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' },
    child_care: { label: 'Child Care', color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' },
    welfare: { label: 'Welfare', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' },
};

const typeIcons = {
    adoption: 'family_restroom',
    child_care: 'child_care',
    welfare: 'volunteer_activism',
};

export function NGODirectoryPage() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const [ngos, setNgos] = useState<NGO[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [showContactModal, setShowContactModal] = useState<NGO | null>(null);
    const [contactMessage, setContactMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Fetch approved NGOs from Firestore
    useEffect(() => {
        const q = query(
            collection(db, COLLECTIONS.NGOS),
            where('status', '==', 'approved')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const ngoList: NGO[] = [];
            snapshot.forEach((doc) => {
                ngoList.push({
                    id: doc.id,
                    ...doc.data(),
                } as NGO);
            });
            setNgos(ngoList);
            setLoading(false);
        }, (error) => {
            console.error('Error fetching NGOs:', error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const filteredNGOs = ngos.filter(ngo => {
        const matchesSearch = ngo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ngo.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = !selectedType || ngo.type === selectedType;
        return matchesSearch && matchesType;
    });

    const handleContactRequest = async () => {
        if (!showContactModal) return;

        if (!isAuthenticated) {
            router.push('/login?redirect=/ngo-directory');
            return;
        }

        if (!contactMessage.trim()) {
            toast.error('Please enter a message');
            return;
        }

        setSubmitting(true);
        try {
            await addDoc(collection(db, COLLECTIONS.CONTACT_REQUESTS), {
                userId: user?.uid,
                userEmail: user?.email,
                userName: user?.displayName,
                ngoId: showContactModal.id,
                ngoUserId: showContactModal.userId,
                ngoName: showContactModal.name,
                message: contactMessage.trim(),
                status: 'pending',
                createdAt: serverTimestamp(),
            });

            toast.success('Contact request sent successfully!');
            setShowContactModal(null);
            setContactMessage('');
        } catch (error) {
            console.error('Error sending contact request:', error);
            toast.error('Failed to send request. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark">
            {/* Header */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                                NGO Directory
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">
                                Find verified organizations for adoption, child care, and welfare services
                            </p>
                        </div>
                        <Badge variant="success" className="flex items-center gap-1.5">
                            <Icon name="public" size="sm" />
                            Public
                        </Badge>
                    </div>

                    {/* Search and Filter */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search NGOs by name or location..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl border-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white placeholder-gray-500"
                            />
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            <button
                                onClick={() => setSelectedType(null)}
                                className={cn(
                                    'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                                    !selectedType
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                )}
                            >
                                All
                            </button>
                            {Object.entries(typeLabels).map(([key, { label }]) => (
                                <button
                                    key={key}
                                    onClick={() => setSelectedType(key)}
                                    className={cn(
                                        'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                                        selectedType === key
                                            ? 'bg-primary text-white'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                    )}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Privacy Notice */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800/50">
                    <Icon name="info" className="text-amber-600 dark:text-amber-400" />
                    <p className="text-sm text-amber-800 dark:text-amber-300">
                        No child photos or personal data shown publicly. Contact NGOs through secure request forms.
                    </p>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
                </div>
            )}

            {/* NGO Grid */}
            {!loading && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredNGOs.map((ngo) => (
                            <Card
                                key={ngo.id}
                                padding="lg"
                                className="group hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className={cn(
                                        'flex items-center justify-center h-12 w-12 rounded-xl',
                                        ngo.type === 'adoption' && 'bg-blue-100 dark:bg-blue-900/30 text-blue-600',
                                        ngo.type === 'child_care' && 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600',
                                        ngo.type === 'welfare' && 'bg-purple-100 dark:bg-purple-900/30 text-purple-600',
                                    )}>
                                        <Icon name={typeIcons[ngo.type]} size="lg" />
                                    </div>
                                    <span className={cn('px-2.5 py-1 rounded-full text-xs font-semibold', typeLabels[ngo.type].color)}>
                                        {typeLabels[ngo.type].label}
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                    {ngo.name}
                                </h3>

                                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-4">
                                    <Icon name="location_on" size="sm" />
                                    <span>{ngo.location}</span>
                                </div>

                                {ngo.description && (
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-5 line-clamp-2">
                                        {ngo.description}
                                    </p>
                                )}

                                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs mb-4">
                                    <Icon name="verified" size="sm" />
                                    <span className="font-medium">Verified Organization</span>
                                </div>

                                <Button
                                    variant="secondary"
                                    className="w-full group-hover:bg-primary group-hover:text-white"
                                    icon="mail"
                                    onClick={() => setShowContactModal(ngo)}
                                >
                                    Contact Request
                                </Button>
                            </Card>
                        ))}
                    </div>

                    {filteredNGOs.length === 0 && !loading && (
                        <div className="text-center py-12">
                            <Icon name="search_off" size="2xl" className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-500 dark:text-gray-400">No NGOs found matching your criteria</p>
                        </div>
                    )}
                </div>
            )}

            {/* Footer Notice */}
            <div className="border-t border-gray-200 dark:border-gray-800 mt-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
                        <Icon name="verified_user" size="sm" />
                        All NGOs are verified and accredited. No personal data is shared publicly.
                    </p>
                </div>
            </div>

            {/* Contact Request Modal */}
            {showContactModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card padding="lg" className="max-w-md w-full">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                Contact {showContactModal.name}
                            </h3>
                            <button
                                onClick={() => setShowContactModal(null)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                            >
                                <Icon name="close" />
                            </button>
                        </div>

                        {!isAuthenticated ? (
                            <div className="text-center py-4">
                                <Icon name="lock" size="2xl" className="text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    Please sign in to send a contact request.
                                </p>
                                <Button onClick={() => router.push('/login?redirect=/ngo-directory')}>
                                    Sign In to Continue
                                </Button>
                            </div>
                        ) : (
                            <>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    Your contact request will be sent securely. The NGO will respond within 3-5 business days.
                                </p>
                                <textarea
                                    placeholder="Write a brief message about your inquiry..."
                                    value={contactMessage}
                                    onChange={(e) => setContactMessage(e.target.value)}
                                    className="w-full p-3 bg-gray-100 dark:bg-gray-800 rounded-xl border-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white placeholder-gray-500 resize-none"
                                    rows={4}
                                />
                                <div className="flex gap-3 mt-4">
                                    <Button
                                        variant="secondary"
                                        className="flex-1"
                                        onClick={() => setShowContactModal(null)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        className="flex-1"
                                        icon="send"
                                        onClick={handleContactRequest}
                                        disabled={submitting}
                                    >
                                        {submitting ? 'Sending...' : 'Send Request'}
                                    </Button>
                                </div>
                            </>
                        )}
                    </Card>
                </div>
            )}
        </div>
    );
}

export default NGODirectoryPage;
