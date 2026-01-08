/**
 * Adoption Requests Review Page
 * 
 * Admin page for reviewing adoption interest submissions.
 */

'use client';

import React, { useState } from 'react';
import { Icon, Card, Button, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

// Mock adoption requests
const mockRequests = [
    {
        id: '1',
        name: 'Rahul & Priya Sharma',
        email: 'sharma.rp@email.com',
        phone: '+91 98765 43210',
        location: 'Mumbai, Maharashtra',
        agePreference: '0-2 years',
        specialCare: 'yes',
        familyDetails: 'Married couple, both IT professionals. Have a spacious 3BHK apartment. No other children.',
        submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
        status: 'pending',
    },
    {
        id: '2',
        name: 'Amit & Sunita Patel',
        email: 'patels@email.com',
        phone: '+91 87654 32109',
        location: 'Ahmedabad, Gujarat',
        agePreference: '2-5 years',
        specialCare: 'maybe',
        familyDetails: 'Joint family with grandparents. Own a house with garden. One daughter aged 8.',
        submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
        status: 'pending',
    },
    {
        id: '3',
        name: 'Dr. Kavitha Menon',
        email: 'kavitha.m@hospital.com',
        phone: '+91 76543 21098',
        location: 'Kochi, Kerala',
        agePreference: 'Any age',
        specialCare: 'yes',
        familyDetails: 'Single woman, pediatrician by profession. Experienced in child care and special needs.',
        submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
        status: 'pending',
    },
];

const statusColors = {
    pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    reviewed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    forwarded: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function AdoptionRequestsPage() {
    const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'pending' | 'reviewed'>('all');

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        }).format(date);
    };

    const handleForwardToNGO = (id: string) => {
        alert(`Request ${id} forwarded to relevant NGOs!`);
    };

    const selectedRequestData = mockRequests.find(r => r.id === selectedRequest);

    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                        Adoption Interest Requests
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Review and forward adoption interest submissions to NGOs
                    </p>
                </div>
                <Badge variant="primary" className="flex items-center gap-1.5">
                    <Icon name="inbox" size="sm" />
                    {mockRequests.length} Requests
                </Badge>
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2 mb-6">
                {['all', 'pending', 'reviewed'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f as typeof filter)}
                        className={cn(
                            'px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize',
                            filter === f
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        )}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Requests List */}
                <div className="lg:col-span-2 space-y-4">
                    {mockRequests.map((request) => (
                        <Card
                            key={request.id}
                            padding="lg"
                            className={cn(
                                'cursor-pointer transition-all hover:shadow-md',
                                selectedRequest === request.id && 'ring-2 ring-primary'
                            )}
                            onClick={() => setSelectedRequest(request.id)}
                        >
                            <div className="flex items-start gap-4">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <Icon name="person" className="text-primary" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-bold text-gray-900 dark:text-white">{request.name}</h3>
                                        <Badge className={statusColors[request.status as keyof typeof statusColors]}>
                                            {request.status}
                                        </Badge>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                            <Icon name="location_on" size="sm" />
                                            <span>{request.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                            <Icon name="cake" size="sm" />
                                            <span>{request.agePreference}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                        <Icon name="schedule" size="sm" />
                                        <span>Submitted on {formatDate(request.submittedAt)}</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Detail Panel */}
                <div className="lg:col-span-1">
                    {selectedRequestData ? (
                        <Card padding="lg" className="sticky top-6">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Request Details</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Name</label>
                                    <p className="font-medium text-gray-900 dark:text-white">{selectedRequestData.name}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Email</label>
                                        <p className="text-sm text-gray-700 dark:text-gray-300 truncate">{selectedRequestData.email}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Phone</label>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">{selectedRequestData.phone}</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Location</label>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">{selectedRequestData.location}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Age Preference</label>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">{selectedRequestData.agePreference}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Special Care</label>
                                        <Badge className={
                                            selectedRequestData.specialCare === 'yes' ? 'bg-emerald-100 text-emerald-700' :
                                                selectedRequestData.specialCare === 'no' ? 'bg-red-100 text-red-700' :
                                                    'bg-amber-100 text-amber-700'
                                        }>
                                            {selectedRequestData.specialCare}
                                        </Badge>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Family Details</label>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">{selectedRequestData.familyDetails}</p>
                                </div>

                                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                                    <Button
                                        className="w-full"
                                        icon="send"
                                        onClick={() => handleForwardToNGO(selectedRequestData.id)}
                                    >
                                        Forward to NGOs
                                    </Button>
                                    <Button variant="secondary" className="w-full" icon="archive">
                                        Mark as Reviewed
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ) : (
                        <Card padding="lg" className="text-center">
                            <Icon name="touch_app" size="xl" className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-500 dark:text-gray-400">Select a request to view details</p>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
