/**
 * User Management Page
 * 
 * Admin page for managing user accounts.
 */

'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const UserManagement = dynamic(
    () => import('@/components/admin/UserManagement').then((mod) => mod.UserManagement),
    { ssr: false }
);

export default function UserManagementPage() {
    return <UserManagement />;
}
