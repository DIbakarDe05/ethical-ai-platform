/**
 * Client Layout Wrapper
 * 
 * Wraps pages that need access to ThemeContext and AuthContext
 * and prevents SSR issues.
 */

'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamic imports with SSR disabled
const Navbar = dynamic(
  () => import('@/components/layout/Navbar').then((mod) => mod.Navbar),
  { ssr: false }
);

const Footer = dynamic(
  () => import('@/components/layout/Footer').then((mod) => mod.Footer),
  { ssr: false }
);

interface ClientLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
  className?: string;
}

export function ClientLayout({ children, showFooter = true, className = '' }: ClientLayoutProps) {
  return (
    <div className={`min-h-screen flex flex-col bg-background-light dark:bg-background-dark ${className}`}>
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}

export function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <Navbar />
      {children}
    </div>
  );
}
