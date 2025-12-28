/**
 * Admin Dashboard Home Page
 * 
 * Overview of analytics, pending approvals, and quick actions.
 */

'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const DashboardOverview = dynamic(
  () => import('@/components/admin/DashboardOverview').then((mod) => mod.DashboardOverview),
  { ssr: false }
);

export default function AdminDashboardPage() {
  return <DashboardOverview />;
}
