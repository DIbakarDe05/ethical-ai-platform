/**
 * Desktop Navbar Component
 * 
 * Main navigation header for desktop layouts.
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Icon, Button, Avatar } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

const navLinks = [
  { href: '/', label: 'Home', icon: 'home' },
  { href: '/chat', label: 'AI Chat', icon: 'chat' },
  { href: '/knowledge-base', label: 'Knowledge Base', icon: 'library_books' },
  { href: '/ethics', label: 'Ethics', icon: 'policy' },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, userProfile, signOut, isAdmin } = useAuth();
  const { resolvedTheme, toggleTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 glass border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
              <Icon name="psychology" className="text-white" size="lg" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                Ethical AI
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 -mt-0.5">
                Knowledge Base
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label, icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  )}
                >
                  <Icon name={icon} size="md" filled={isActive} />
                  {label}
                </Link>
              );
            })}
            
            {/* Admin link */}
            {isAdmin && (
              <Link
                href="/admin"
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname.startsWith('/admin')
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                )}
              >
                <Icon name="admin_panel_settings" size="md" />
                Admin
              </Link>
            )}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              <Icon
                name={resolvedTheme === 'dark' ? 'light_mode' : 'dark_mode'}
                size="md"
                className="text-gray-600 dark:text-gray-300"
              />
            </button>

            {/* User section */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <Avatar
                    src={user.photoURL}
                    name={user.displayName || undefined}
                    size="md"
                  />
                  <Icon
                    name="expand_more"
                    size="sm"
                    className="text-gray-500 hidden sm:block"
                  />
                </button>

                {/* Dropdown menu */}
                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-surface-dark rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {user.displayName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user.email}
                        </p>
                        {userProfile?.role && (
                          <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {userProfile.role}
                          </span>
                        )}
                      </div>
                      
                      <Link
                        href="/settings"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Icon name="settings" size="md" />
                        Settings
                      </Link>
                      
                      <button
                        onClick={() => {
                          signOut();
                          setShowUserMenu(false);
                        }}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Icon name="logout" size="md" />
                        Sign out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link href="/login">
                <Button size="sm">
                  Log In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
