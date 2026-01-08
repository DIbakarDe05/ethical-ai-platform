/**
 * Adoption Interest Form Page
 * 
 * Protected page for submitting adoption interest requests.
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

const AdoptionInterestForm = dynamic(
    () => import('@/components/adoption/AdoptionInterestForm').then((mod) => mod.AdoptionInterestForm),
    { ssr: false }
);

export default function AdoptionInterestPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
                <AdoptionInterestForm />
            </main>
            <Footer />
        </div>
    );
}
