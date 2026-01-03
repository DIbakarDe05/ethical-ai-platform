'use client';

import dynamic from 'next/dynamic';

// Dynamically import DynamicBackground with no SSR
const DynamicBackground = dynamic(
    () => import('@/components/ui/DynamicBackground').then((mod) => mod.DynamicBackground),
    { ssr: false }
);

/**
 * Background Wrapper for Main Layout
 * Client-side wrapper to include the dynamic scroll background
 */
export function BackgroundWrapper({ children }: { children: React.ReactNode }) {
    return (
        <>
            <DynamicBackground />
            {children}
        </>
    );
}

export default BackgroundWrapper;
