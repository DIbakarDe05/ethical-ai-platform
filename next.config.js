/** @type {import('next').NextConfig} */

/**
 * Security Headers Configuration
 * 
 * These headers protect against common web vulnerabilities:
 * - XSS attacks
 * - Clickjacking
 * - MIME type sniffing
 * - Insecure connections
 */
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  {
    // Content Security Policy
    // Adjust as needed for your application
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://*.firebaseapp.com https://*.firebase.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://*.firebase.com wss://*.firebaseio.com https://generativelanguage.googleapis.com",
      "frame-src 'self' https://*.firebaseapp.com https://*.firebase.com https://accounts.google.com",
      "frame-ancestors 'self'",
      "form-action 'self'",
      "base-uri 'self'",
      "object-src 'none'",
    ].join('; '),
  },
];

/**
 * API-specific security headers
 */
const apiSecurityHeaders = [
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'Cache-Control',
    value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
  },
  {
    key: 'Pragma',
    value: 'no-cache',
  },
  {
    key: 'Expires',
    value: '0',
  },
];

const nextConfig = {
  // Enable React Strict Mode for better development experience
  reactStrictMode: true,

  // Security headers for all routes
  async headers() {
    return [
      {
        // Apply general security headers to all routes
        source: '/:path*',
        headers: securityHeaders,
      },
      {
        // Apply stricter headers to API routes
        source: '/api/:path*',
        headers: [
          ...apiSecurityHeaders,
          // CORS headers are handled in middleware/route handlers
          // but we can add default restrictive ones here
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
        ],
      },
    ];
  },

  // Image optimization configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/**',
      },
    ],
  },

  // Environment variables that are safe to expose to the browser
  env: {
    NEXT_PUBLIC_APP_NAME: 'Ethical AI Knowledge Base',
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
  },

  // Experimental features for Next.js 15
  experimental: {
    // Enable server actions
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

module.exports = nextConfig;
