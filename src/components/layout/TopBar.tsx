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
        <header className="sticky top-0 z-40 h-14 flex items-center justify-between px-4 lg:px-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
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
            <div className="flex items-center gap-1">
                {/* Theme toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                    aria-label="Toggle theme"
                >
                    <Icon
                        name={resolvedTheme === 'dark' ? 'light_mode' : 'dark_mode'}
                        size="sm"
                        className="text-gray-500 dark:text-gray-400"
                    />
                </button>

                {/* User section */}
                {user ? (
                    <div ref={menuRef} className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center gap-1.5 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                        >
                            {/* Profile image - Circular, clean */}
                            <div className="relative h-8 w-8 rounded-full overflow-hidden ring-2 ring-transparent hover:ring-primary/20 transition-all">
                                {user.photoURL ? (
                                    <img
                                        src={user.photoURL}
                                        alt={user.displayName || 'Profile'}
                                        className="h-full w-full object-cover"
                                        referrerPolicy="no-referrer"
                                    />
                                ) : (
                                    <div className="h-full w-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-medium text-sm">
                                        {user.displayName?.charAt(0) || user.email?.charAt(0) || '?'}
                                    </div>
                                )}
                            </div>
                        </button>

                        {/* Dropdown menu - Seamless design */}
                        {showUserMenu && (
                            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/30 border border-gray-100 dark:border-gray-800 overflow-hidden">
                                {/* User profile card - Seamless header */}
                                <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-850">
                                    <div className="flex items-center gap-3">
                                        {/* Larger profile image */}
                                        <div className="h-14 w-14 rounded-full overflow-hidden ring-4 ring-white dark:ring-gray-900 shadow-lg flex-shrink-0">
                                            {user.photoURL ? (
                                                <img
                                                    src={user.photoURL}
                                                    alt={user.displayName || 'Profile'}
                                                    className="h-full w-full object-cover"
                                                    referrerPolicy="no-referrer"
                                                />
                                            ) : (
                                                <div className="h-full w-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold text-xl">
                                                    {user.displayName?.charAt(0) || '?'}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-900 dark:text-white truncate">
                                                {user.displayName || 'User'}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                                {user.email}
                                            </p>
                                            {userProfile?.role && (
                                                <span className="inline-flex items-center mt-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-primary mr-1.5" />
                                                    {userProfile.role}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Quick actions */}
                                <div className="p-2">
                                    <Link
                                        href="/adoption-interest"
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        <div className="h-9 w-9 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                                            <Icon name="favorite" size="sm" className="text-pink-600 dark:text-pink-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Adoption Interest</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-500">Submit your application</p>
                                        </div>
                                    </Link>

                                    <Link
                                        href="/documents"
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        <div className="h-9 w-9 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                            <Icon name="folder" size="sm" className="text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium">My Documents</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-500">Manage your files</p>
                                        </div>
                                    </Link>

                                    <Link
                                        href="/settings"
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        <div className="h-9 w-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                            <Icon name="settings" size="sm" className="text-gray-600 dark:text-gray-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Settings</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-500">Preferences & account</p>
                                        </div>
                                    </Link>
                                </div>

                                {/* Sign out - Clean separator */}
                                <div className="p-2 border-t border-gray-100 dark:border-gray-800">
                                    <button
                                        onClick={() => {
                                            signOut();
                                            setShowUserMenu(false);
                                        }}
                                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors group"
                                    >
                                        <div className="h-9 w-9 rounded-lg bg-gray-100 dark:bg-gray-800 group-hover:bg-red-100 dark:group-hover:bg-red-900/30 flex items-center justify-center transition-colors">
                                            <Icon name="logout" size="sm" className="text-gray-600 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors" />
                                        </div>
                                        <span className="font-medium">Sign out</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link href="/login">
                        <Button size="sm" className="rounded-full px-4">
                            Log In
                        </Button>
                    </Link>
                )}
            </div>
        </header>
    );
}

export default TopBar;
