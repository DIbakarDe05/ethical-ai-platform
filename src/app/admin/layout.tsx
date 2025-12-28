/**
 * Admin Dashboard Layout
 * 
 * Layout wrapper for all admin pages with sidebar navigation.
 */

'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const AdminSidebar = dynamic(
  () => import('@/components/layout/AdminSidebar').then((mod) => mod.AdminSidebar),
  { ssr: false }
);

const AdminAuthGuard = dynamic(
  () => import('@/components/admin/AdminAuthGuard').then((mod) => mod.AdminAuthGuard),
  { ssr: false }
);

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <AdminSidebar />
        <main className="lg:pl-64">
          {children}
        </main>
      </div>
    </AdminAuthGuard>
  );
}
