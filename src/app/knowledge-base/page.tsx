/**
 * Knowledge Base Search Page
 * 
 * Desktop table/grid layout for searching documents with
 * advanced filters (topic, document type, upload date).
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

const KnowledgeBaseSearch = dynamic(
  () => import('@/components/knowledge-base/KnowledgeBaseSearch').then((mod) => mod.KnowledgeBaseSearch),
  { ssr: false }
);

export default function KnowledgeBasePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <Navbar />
      <main className="flex-1">
        <KnowledgeBaseSearch />
      </main>
      <Footer />
    </div>
  );
}
