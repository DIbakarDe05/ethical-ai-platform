/**
 * User Documents Page
 * 
 * Private page for uploading verification documents.
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

const UserDocumentUpload = dynamic(
    () => import('@/components/documents/UserDocumentUpload').then((mod) => mod.UserDocumentUpload),
    { ssr: false }
);

export default function DocumentsPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
                <UserDocumentUpload />
            </main>
            <Footer />
        </div>
    );
}
