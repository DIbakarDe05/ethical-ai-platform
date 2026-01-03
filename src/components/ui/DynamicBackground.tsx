'use client';

import React, { useEffect, useState } from 'react';

/**
 * Dynamic Background Component
 * 
 * Creates an animated, scroll-responsive background with floating gradient orbs
 * that move based on scroll position. Supports both light and dark themes.
 */
export function DynamicBackground() {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Calculate parallax offsets based on scroll position
    const offset1 = scrollY * 0.15;
    const offset2 = scrollY * 0.1;
    const offset3 = scrollY * 0.08;
    const offset4 = scrollY * 0.12;

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            {/* Base gradient layer */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/3 to-transparent dark:via-primary/5" />

            {/* Floating orb 1 - Top left, moves down slowly */}
            <div
                className="absolute w-[500px] h-[500px] rounded-full blur-3xl opacity-40 dark:opacity-30 bg-gradient-to-br from-primary/20 to-blue-400/10 dark:from-primary/30 dark:to-blue-500/15"
                style={{
                    top: `${-100 + offset1}px`,
                    left: '-150px',
                    transform: `translateY(${offset1 * 0.5}px)`,
                    transition: 'transform 0.1s ease-out',
                }}
            />

            {/* Floating orb 2 - Top right, moves slower */}
            <div
                className="absolute w-[600px] h-[600px] rounded-full blur-3xl opacity-30 dark:opacity-25 bg-gradient-to-bl from-indigo-400/15 to-purple-400/10 dark:from-indigo-500/20 dark:to-purple-500/15"
                style={{
                    top: `${50 + offset2}px`,
                    right: '-200px',
                    transform: `translateY(${offset2 * 0.3}px) rotate(${scrollY * 0.01}deg)`,
                    transition: 'transform 0.1s ease-out',
                }}
            />

            {/* Floating orb 3 - Middle left */}
            <div
                className="absolute w-[400px] h-[400px] rounded-full blur-3xl opacity-35 dark:opacity-25 bg-gradient-to-tr from-cyan-400/15 to-teal-300/10 dark:from-cyan-500/20 dark:to-teal-400/15"
                style={{
                    top: `${400 + offset3 * 0.5}px`,
                    left: '-100px',
                    transform: `translateY(${-offset3 * 0.4}px)`,
                    transition: 'transform 0.1s ease-out',
                }}
            />

            {/* Floating orb 4 - Bottom right corner */}
            <div
                className="absolute w-[550px] h-[550px] rounded-full blur-3xl opacity-30 dark:opacity-20 bg-gradient-to-tl from-violet-400/15 to-fuchsia-300/10 dark:from-violet-500/20 dark:to-fuchsia-400/10"
                style={{
                    top: `${800 + offset4 * 0.3}px`,
                    right: '-150px',
                    transform: `translateY(${-offset4 * 0.5}px) scale(${1 + scrollY * 0.00005})`,
                    transition: 'transform 0.1s ease-out',
                }}
            />

            {/* Floating orb 5 - Center area, subtle */}
            <div
                className="absolute w-[350px] h-[350px] rounded-full blur-3xl opacity-20 dark:opacity-15 bg-gradient-to-r from-blue-300/20 to-indigo-300/10 dark:from-blue-400/15 dark:to-indigo-400/10"
                style={{
                    top: `${1200 - offset1 * 0.2}px`,
                    left: '30%',
                    transform: `translateX(${Math.sin(scrollY * 0.002) * 20}px)`,
                    transition: 'transform 0.15s ease-out',
                }}
            />

            {/* Subtle noise texture overlay for depth */}
            <div
                className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
            />
        </div>
    );
}

export default DynamicBackground;
