/**
 * Ethics & Transparency Page
 * 
 * Explains AI limitations, human-in-the-loop policy, privacy practices,
 * and UNESCO AI Ethics principles.
 */

'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const Navbar = dynamic(
  () => import('@/components/layout/Navbar').then((mod) => mod.Navbar),
  { ssr: false }
);

const Footer = dynamic(
  () => import('@/components/layout/Footer').then((mod) => mod.Footer),
  { ssr: false }
);

const EthicsContent = dynamic(
  () => import('@/components/ethics/EthicsContent').then((mod) => mod.EthicsContent),
  { ssr: false }
);

export default function EthicsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <Navbar />
      <main className="flex-1">
        <EthicsContent />
      </main>
      <Footer />
    </div>
  );
}
