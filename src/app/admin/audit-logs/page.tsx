/**
 * Audit Logs Page
 * 
 * Admin page for viewing system audit logs.
 */

'use client';

import React, { useState } from 'react';
import { Icon, Card, Button, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

// Mock audit logs
const mockLogs = [
    {
        id: '1',
        action: 'user_login',
        user: 'admin@ethical-ai.org',
        details: 'Successful login via Google OAuth',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        severity: 'info',
        icon: 'login',
    },
    {
        id: '2',
        action: 'ngo_approved',
        user: 'admin@ethical-ai.org',
        details: 'Approved NGO: Hope Foundation',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        severity: 'success',
        icon: 'check_circle',
    },
    {
        id: '3',
        action: 'document_uploaded',
        user: 'staff@ngo.org',
        details: 'Uploaded: Annual_Report_2024.pdf',
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        severity: 'info',
        icon: 'upload_file',
    },
    {
        id: '4',
        action: 'sensitive_query',
        user: 'user@example.com',
        details: 'Query flagged for review: child location data',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        severity: 'warning',
        icon: 'warning',
    },
    {
        id: '5',
        action: 'adoption_request',
        user: 'parent@email.com',
        details: 'New adoption interest form submitted',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
        severity: 'info',
        icon: 'favorite',
    },
    {
        id: '6',
        action: 'account_locked',
        user: 'admin@ethical-ai.org',
        details: 'Locked suspicious account: spam@fake.com',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
        severity: 'error',
        icon: 'lock',
    },
    {
        id: '7',
        action: 'ngo_rejected',
        user: 'admin@ethical-ai.org',
        details: 'Rejected NGO: Unverified Org - Missing documents',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        severity: 'warning',
        icon: 'cancel',
    },
    {
        id: '8',
        action: 'user_created',
        user: 'system',
        details: 'New user registration: newuser@email.com',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26),
        severity: 'success',
        icon: 'person_add',
    },
];

const severityStyles = {
    info: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800' },
    success: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800' },
    warning: { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800' },
    error: { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400', border: 'border-red-200 dark:border-red-800' },
};

export default function AuditLogsPage() {
    const [filter, setFilter] = useState<'all' | 'info' | 'success' | 'warning' | 'error'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredLogs = mockLogs.filter(log => {
        const matchesFilter = filter === 'all' || log.severity === filter;
        const matchesSearch = log.action.includes(searchQuery.toLowerCase()) ||
            log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.details.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const formatTime = (date: Date) => {
        const now = Date.now();
        const diff = now - date.getTime();

        if (diff < 1000 * 60) return 'Just now';
        if (diff < 1000 * 60 * 60) return `${Math.floor(diff / (1000 * 60))} min ago`;
        if (diff < 1000 * 60 * 60 * 24) return `${Math.floor(diff / (1000 * 60 * 60))} hours ago`;
        return `${Math.floor(diff / (1000 * 60 * 60 * 24))} days ago`;
    };

    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                        Audit Logs
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        View all system activity and security events
                    </p>
                </div>
                <Button variant="secondary" icon="download">
                    Export Logs
                </Button>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                    <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search logs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white"
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {['all', 'info', 'success', 'warning', 'error'].map((f) => (
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
            </div>

            {/* Logs List */}
            <Card padding="none" className="overflow-hidden">
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {filteredLogs.map((log) => (
                        <div
                            key={log.id}
                            className={cn(
                                'flex items-start gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors',
                                severityStyles[log.severity as keyof typeof severityStyles].bg
                            )}
                        >
                            <div className={cn(
                                'h-10 w-10 rounded-lg flex items-center justify-center shrink-0',
                                severityStyles[log.severity as keyof typeof severityStyles].text,
                                'bg-white dark:bg-gray-900'
                            )}>
                                <Icon name={log.icon} />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {log.action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </span>
                                    <Badge
                                        variant="default"
                                        className={cn(
                                            'text-xs',
                                            severityStyles[log.severity as keyof typeof severityStyles].text,
                                            severityStyles[log.severity as keyof typeof severityStyles].border,
                                            'bg-transparent border'
                                        )}
                                    >
                                        {log.severity}
                                    </Badge>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{log.details}</p>
                                <div className="flex items-center gap-4 text-xs text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <Icon name="person" size="sm" />
                                        {log.user}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Icon name="schedule" size="sm" />
                                        {formatTime(log.timestamp)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredLogs.length === 0 && (
                    <div className="text-center py-12">
                        <Icon name="filter_list_off" size="2xl" className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">No logs matching your filters</p>
                    </div>
                )}
            </Card>

            {/* Pagination placeholder */}
            <div className="flex justify-center mt-6">
                <Button variant="ghost" icon="more_horiz">
                    Load More Logs
                </Button>
            </div>
        </div>
    );
}
