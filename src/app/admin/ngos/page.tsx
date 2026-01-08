/**
 * NGO Management Page
 * 
 * Admin page for reviewing and approving NGO registrations.
 */

'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const NGOManagement = dynamic(
    () => import('@/components/admin/NGOManagement').then((mod) => mod.NGOManagement),
    { ssr: false }
);

export default function NGOManagementPage() {
    return <NGOManagement />;
}
