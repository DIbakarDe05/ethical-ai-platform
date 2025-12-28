/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React Strict Mode for better development experience
  reactStrictMode: true,
  
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
