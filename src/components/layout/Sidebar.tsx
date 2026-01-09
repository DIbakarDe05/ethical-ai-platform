/**
 * App Sidebar Component (ChatGPT-style)
 * 
 * Collapsible sidebar navigation with glassmorphism effect.
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';

const navLinks = [
    { href: '/', label: 'Home', icon: 'home' },
    { href: '/chat', label: 'AI Chat', icon: 'chat' },
    { href: '/knowledge-base', label: 'Knowledge Base', icon: 'auto_stories' },
    { href: '/ngo-directory', label: 'NGO Directory', icon: 'location_city' },
    { href: '/ethics', label: 'Ethics', icon: 'verified' },
];

const userLinks = [
    { href: '/adoption-interest', label: 'Adoption Interest', icon: 'favorite' },
    { href: '/documents', label: 'My Documents', icon: 'folder' },
];

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const { user, isAdmin } = useAuth();

    // Close sidebar on route change (mobile)
    useEffect(() => {
        onClose();
    }, [pathname, onClose]);

    // Prevent body scroll when sidebar is open on mobile
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    return (
        <>
            {/* Backdrop for mobile */}
            <div
                className={cn(
                    'fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity lg:hidden',
                    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                )}
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Sidebar */}
            <aside
                className={cn(
                    // Base styles
                    'fixed lg:sticky top-0 left-0 z-50 lg:z-30',
                    'h-screen w-72 lg:w-64',
                    'flex flex-col',
                    // Glassmorphism effect
                    'bg-white/80 dark:bg-gray-900/80',
                    'backdrop-blur-xl',
                    'border-r border-gray-200/50 dark:border-gray-700/50',
                    // Shadow for depth
                    'shadow-xl lg:shadow-none',
                    // Transition
                    'transition-transform duration-300 ease-out',
                    // Mobile positioning
                    isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200/50 dark:border-gray-700/50">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/25">
                            <Icon name="psychology" className="text-white" size="lg" />
                        </div>
                        <div>
                            <h1 className="text-base font-bold text-gray-900 dark:text-white">
                                Ethical AI
                            </h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Knowledge Base
                            </p>
                        </div>
                    </Link>

                    {/* Close button (mobile only) */}
                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        aria-label="Close sidebar"
                    >
                        <Icon name="close" size="md" className="text-gray-500" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-3 space-y-1">
                    {/* Main nav links */}
                    <div className="space-y-1">
                        <p className="px-3 py-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                            Navigation
                        </p>
                        {navLinks.map(({ href, label, icon }) => {
                            const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={cn(
                                        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                                        isActive
                                            ? 'bg-primary/10 text-primary shadow-sm'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                                    )}
                                >
                                    <Icon
                                        name={icon}
                                        size="md"
                                        filled={isActive}
                                        className={cn(
                                            'transition-transform',
                                            isActive && 'scale-110'
                                        )}
                                    />
                                    <span>{label}</span>
                                    {isActive && (
                                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* User links (only if logged in) */}
                    {user && (
                        <div className="pt-4 space-y-1">
                            <p className="px-3 py-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                                Your Account
                            </p>
                            {userLinks.map(({ href, label, icon }) => {
                                const isActive = pathname === href;
                                return (
                                    <Link
                                        key={href}
                                        href={href}
                                        className={cn(
                                            'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                                            isActive
                                                ? 'bg-primary/10 text-primary shadow-sm'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                                        )}
                                    >
                                        <Icon name={icon} size="md" filled={isActive} />
                                        <span>{label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    )}

                    {/* Admin link */}
                    {isAdmin && (
                        <div className="pt-4 space-y-1">
                            <p className="px-3 py-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                                Administration
                            </p>
                            <Link
                                href="/admin"
                                className={cn(
                                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                                    pathname.startsWith('/admin')
                                        ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 shadow-sm'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                                )}
                            >
                                <Icon
                                    name="admin_panel_settings"
                                    size="md"
                                    filled={pathname.startsWith('/admin')}
                                />
                                <span>Admin Panel</span>
                                {pathname.startsWith('/admin') && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500" />
                                )}
                            </Link>
                        </div>
                    )}
                </nav>

                {/* Footer - Quick actions */}
                <div className="p-3 border-t border-gray-200/50 dark:border-gray-700/50">
                    <div className="px-3 py-2 rounded-xl bg-gradient-to-r from-primary/10 to-blue-500/10 dark:from-primary/20 dark:to-blue-500/20">
                        <div className="flex items-center gap-2 text-sm font-medium text-primary">
                            <Icon name="tips_and_updates" size="md" />
                            <span>AI-Powered</span>
                        </div>
                        <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                            Ethical & transparent AI assistance
                        </p>
                    </div>
                </div>
            </aside>
        </>
    );
}

export default Sidebar;
