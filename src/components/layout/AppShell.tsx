/**
 * App Shell Component
 * 
 * Main layout wrapper combining sidebar and top bar.
 * Provides consistent layout across all pages.
 */

'use client';

import React, { useState, useCallback } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

interface AppShellProps {
    children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleOpenSidebar = useCallback(() => {
        setSidebarOpen(true);
    }, []);

    const handleCloseSidebar = useCallback(() => {
        setSidebarOpen(false);
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />

            {/* Main content area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top bar */}
                <TopBar onMenuClick={handleOpenSidebar} />

                {/* Page content */}
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default AppShell;
