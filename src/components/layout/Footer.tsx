/**
 * Footer Component
 * 
 * Site footer with links and trust badges.
 */

import React from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui';

const footerLinks = {
  Product: [
    { label: 'Features', href: '/#features' },
    { label: 'AI Chat', href: '/chat' },
    { label: 'Knowledge Base', href: '/knowledge-base' },
    { label: 'Pricing', href: '/pricing' },
  ],
  Resources: [
    { label: 'Documentation', href: '/docs' },
    { label: 'API Reference', href: '/api-docs' },
    { label: 'Ethics Policy', href: '/ethics' },
    { label: 'FAQ', href: '/faq' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'GDPR', href: '/gdpr' },
  ],
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-background-dark border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand column */}
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
                <Icon name="psychology" className="text-white" size="lg" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Ethical AI
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Knowledge Base Platform
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-xs">
              Empowering NGOs and social organizations with ethical AI solutions. 
              Built with privacy, transparency, and human oversight at its core.
            </p>
            
            {/* Trust badges */}
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium">
                GDPR Compliant
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium">
                SOC2 Type II
              </span>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                {category}
              </h4>
              <ul className="space-y-2">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-800 mt-10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center md:text-left">
              © {currentYear} Ethical AI Initiative. All rights reserved.
            </p>
            
            {/* UNESCO alignment */}
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Icon name="public" size="md" className="text-primary" />
              <span>Aligned with UNESCO AI Ethics Recommendations</span>
            </div>

            {/* Microsoft Imagine Cup badge */}
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Icon name="emoji_events" size="md" className="text-primary" />
              <span>Microsoft Imagine Cup 2025</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
