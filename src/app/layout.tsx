import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

// Load Inter font with Latin subset
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// SEO and metadata configuration
export const metadata: Metadata = {
  title: {
    default: 'Ethical AI Knowledge Base | Empowering NGOs',
    template: '%s | Ethical AI Platform',
  },
  description: 'An ethical AI-powered knowledge base platform designed for NGOs, social organizations, and adoption centers. Automate queries while ensuring privacy, accuracy, and ethical AI practices.',
  keywords: [
    'NGO AI assistant',
    'ethical AI',
    'knowledge base',
    'adoption center',
    'social organization',
    'RAG AI',
    'Microsoft Imagine Cup',
  ],
  authors: [{ name: 'NIT Agartala Team' }],
  creator: 'Ethical AI Initiative',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ethical-ai-platform.web.app',
    title: 'Ethical AI Knowledge Base | Empowering NGOs',
    description: 'Streamline operations and automate queries for your social organization securely with ethical AI.',
    siteName: 'Ethical AI Platform',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ethical AI Knowledge Base',
    description: 'Empowering NGOs with Ethical AI',
  },
  robots: {
    index: true,
    follow: true,
  },
};

/**
 * Root Layout Component
 * 
 * This is the main layout wrapper for the entire application.
 * It provides:
 * - Global font configuration
 * - Theme provider for dark/light mode
 * - Authentication context
 * - Toast notifications
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
      <head>
        {/* Preconnect to Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Material Symbols for icons */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" 
          rel="stylesheet" 
        />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#137fec" />
      </head>
      <body className="font-display bg-background-light dark:bg-background-dark text-gray-900 dark:text-white antialiased">
        <ThemeProvider>
          <AuthProvider>
            {/* Toast notification container */}
            <Toaster 
              position="top-center"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--toast-bg)',
                  color: 'var(--toast-color)',
                  borderRadius: '12px',
                },
                success: {
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#ffffff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#ffffff',
                  },
                },
              }}
            />
            
            {/* Main application content */}
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
