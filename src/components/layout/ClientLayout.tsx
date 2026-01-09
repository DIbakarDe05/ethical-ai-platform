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
const AppShell = dynamic(
  () => import('@/components/layout/AppShell').then((mod) => mod.AppShell),
  { ssr: false }
);

const Footer = dynamic(
  () => import('@/components/layout/Footer').then((mod) => mod.Footer),
  { ssr: false }
);

// Legacy Navbar for backwards compatibility
const Navbar = dynamic(
  () => import('@/components/layout/Navbar').then((mod) => mod.Navbar),
  { ssr: false }
);

interface ClientLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
  className?: string;
}

/**
 * Main layout with sidebar navigation (ChatGPT-style)
 */
export function ClientLayout({ children, showFooter = true, className = '' }: ClientLayoutProps) {
  return (
    <>
      <AppShell>
        <div className={className}>
          {children}
        </div>
        {showFooter && <Footer />}
      </AppShell>
    </>
  );
}

/**
 * Chat-specific layout (full height, no footer)
 */
export function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell>
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </AppShell>
  );
}

/**
 * Legacy layout with top navbar only (for backwards compatibility)
 */
export function LegacyLayout({ children, showFooter = true }: ClientLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}
