/**
 * Top Bar Component (Simplified)
 * 
 * Minimal top bar with logo, theme toggle, and profile menu.
 * Works with sidebar navigation.
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Icon, Button } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

interface TopBarProps {
    onMenuClick: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
    const { user, userProfile, signOut } = useAuth();
    const { resolvedTheme, toggleTheme } = useTheme();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="sticky top-0 z-40 h-16 flex items-center justify-between px-4 lg:px-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
            {/* Left side - Menu button (mobile) + Logo (mobile only) */}
            <div className="flex items-center gap-3">
                {/* Hamburger menu for mobile */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Open menu"
                >
                    <Icon name="menu" size="md" className="text-gray-700 dark:text-gray-300" />
                </button>

                {/* Logo - mobile only (sidebar has logo on desktop) */}
                <Link href="/" className="lg:hidden flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
                        <Icon name="psychology" className="text-white" size="sm" />
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white">
                        Ethical AI
                    </span>
                </Link>

                {/* Page breadcrumb on desktop */}
                <div className="hidden lg:block">
                    <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Ethical AI Knowledge Base
                    </h2>
                </div>
            </div>

            {/* Right side - Theme toggle + User */}
            <div className="flex items-center gap-2">
                {/* Theme toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group"
                    aria-label="Toggle theme"
                >
                    <Icon
                        name={resolvedTheme === 'dark' ? 'light_mode' : 'dark_mode'}
                        size="md"
                        className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors"
                    />
                </button>

                {/* User section */}
                {user ? (
                    <div ref={menuRef} className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                        >
                            {/* Profile image - Fixed aspect ratio */}
                            <div className="relative h-9 w-9 rounded-xl overflow-hidden bg-gradient-to-br from-primary to-blue-600 flex-shrink-0">
                                {user.photoURL ? (
                                    <img
                                        src={user.photoURL}
                                        alt={user.displayName || 'Profile'}
                                        className="h-full w-full object-cover"
                                        referrerPolicy="no-referrer"
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-white font-medium text-sm">
                                        {user.displayName?.charAt(0) || user.email?.charAt(0) || '?'}
                                    </div>
                                )}
                            </div>

                            {/* Name - hidden on small screens */}
                            <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[120px] truncate">
                                {user.displayName?.split(' ')[0] || 'User'}
                            </span>

                            <Icon
                                name={showUserMenu ? 'expand_less' : 'expand_more'}
                                size="sm"
                                className="text-gray-400 hidden sm:block"
                            />
                        </button>

                        {/* Dropdown menu */}
                        {showUserMenu && (
                            <div className="absolute right-0 mt-2 w-64 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 py-2 overflow-hidden">
                                {/* User info header */}
                                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 rounded-xl overflow-hidden bg-gradient-to-br from-primary to-blue-600 flex-shrink-0">
                                            {user.photoURL ? (
                                                <img
                                                    src={user.photoURL}
                                                    alt={user.displayName || 'Profile'}
                                                    className="h-full w-full object-cover"
                                                    referrerPolicy="no-referrer"
                                                />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-white font-bold text-lg">
                                                    {user.displayName?.charAt(0) || '?'}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                                {user.displayName || 'User'}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                {user.email}
                                            </p>
                                            {userProfile?.role && (
                                                <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">
                                                    {userProfile.role}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Menu items */}
                                <div className="py-1">
                                    <Link
                                        href="/adoption-interest"
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        <Icon name="favorite" size="md" />
                                        Adoption Interest
                                    </Link>

                                    <Link
                                        href="/documents"
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        <Icon name="folder" size="md" />
                                        My Documents
                                    </Link>

                                    <Link
                                        href="/settings"
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        <Icon name="settings" size="md" />
                                        Settings
                                    </Link>
                                </div>

                                {/* Sign out */}
                                <div className="border-t border-gray-100 dark:border-gray-800 pt-1">
                                    <button
                                        onClick={() => {
                                            signOut();
                                            setShowUserMenu(false);
                                        }}
                                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                    >
                                        <Icon name="logout" size="md" />
                                        Sign out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link href="/login">
                        <Button size="sm" className="rounded-xl">
                            <Icon name="login" size="sm" className="mr-1.5" />
                            Log In
                        </Button>
                    </Link>
                )}
            </div>
        </header>
    );
}

export default TopBar;
