/**
 * Admin Sidebar Component
 * 
 * Sidebar navigation for admin dashboard (desktop only).
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Icon, Avatar } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';

const sidebarLinks = [
  { href: '/admin', label: 'Dashboard', icon: 'dashboard', exact: true },
  { href: '/admin/documents', label: 'Documents', icon: 'folder_open' },
  { href: '/admin/approvals', label: 'Pending Approval', icon: 'pending_actions', badge: 3 },
  { href: '/admin/analytics', label: 'Analytics', icon: 'bar_chart' },
  { href: '/admin/users', label: 'User Management', icon: 'group' },
  { href: '/admin/audit', label: 'Audit Logs', icon: 'security' },
  { href: '/admin/settings', label: 'Settings', icon: 'settings' },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, userProfile, signOut } = useAuth();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white dark:bg-surface-dark border-r border-gray-200 dark:border-gray-800">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100 dark:border-gray-800">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
          <Icon name="admin_panel_settings" className="text-white" size="lg" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">
            Admin
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Dashboard
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {sidebarLinks.map(({ href, label, icon, exact, badge }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
              isActive(href, exact)
                ? 'bg-primary/10 text-primary'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            )}
          >
            <div className="flex items-center gap-3">
              <Icon name={icon} size="md" filled={isActive(href, exact)} />
              {label}
            </div>
            {badge && (
              <span className="flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-primary text-white text-xs font-bold">
                {badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Divider */}
      <div className="px-4">
        <div className="border-t border-gray-100 dark:border-gray-800" />
      </div>

      {/* Quick links */}
      <div className="px-4 py-4 space-y-1">
        <Link
          href="/chat"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Icon name="chat" size="md" />
          Go to Chat
        </Link>
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Icon name="home" size="md" />
          Back to Site
        </Link>
      </div>

      {/* User section */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
          <Avatar
            src={user?.photoURL}
            name={user?.displayName || undefined}
            size="md"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user?.displayName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {userProfile?.role || 'Admin'}
            </p>
          </div>
          <button
            onClick={signOut}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="Sign out"
          >
            <Icon name="logout" size="md" className="text-gray-500" />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default AdminSidebar;
