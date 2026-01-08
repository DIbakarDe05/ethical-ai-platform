/**
 * NGO Directory Page
 * 
 * Public page for browsing verified NGOs.
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

const NGODirectoryPage = dynamic(
    () => import('@/components/ngo/NGODirectoryPage').then((mod) => mod.NGODirectoryPage),
    { ssr: false }
);

export default function NGODirectoryRoute() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
                <NGODirectoryPage />
            </main>
            <Footer />
        </div>
    );
}
