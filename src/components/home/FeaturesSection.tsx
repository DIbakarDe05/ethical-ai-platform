/**
 * Features Section Component
 * 
 * Key features showcase on landing page.
 */

import React from 'react';
import Link from 'next/link';
import { Icon, Card, Button } from '@/components/ui';

const features = [
  {
    icon: 'chat',
    title: 'AI Chat Assistant',
    description: 'Full-featured chatbot with voice input, multilingual support, and inline citations from verified documents.',
    href: '/chat',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: 'library_books',
    title: 'Knowledge Base Search',
    description: 'Advanced full-text and vector search across your document library with smart filtering and AI summaries.',
    href: '/knowledge-base',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: 'admin_panel_settings',
    title: 'Admin Dashboard',
    description: 'Upload documents, manage approvals, view analytics, and monitor bias audit logs in one place.',
    href: '/admin',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: 'security',
    title: 'Enterprise Security',
    description: 'Role-based access control, encrypted storage, and GDPR-compliant data handling.',
    href: '/ethics',
    color: 'from-green-500 to-teal-500',
  },
];

const capabilities = [
  { icon: 'psychology', label: 'RAG-Powered Responses' },
  { icon: 'translate', label: 'Multilingual Support' },
  { icon: 'mic', label: 'Voice Input' },
  { icon: 'verified', label: 'Source Citations' },
  { icon: 'speed', label: '10K Concurrent Users' },
  { icon: 'cloud_done', label: 'Firebase Hosted' },
];

export function FeaturesSection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Icon name="auto_awesome" size="sm" />
            Powered by Gemini 1.5 Flash
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Everything You Need for Ethical AI
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            A complete platform designed specifically for NGOs and social organizations, 
            with built-in privacy controls and ethical AI practices.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-16">
          {features.map(({ icon, title, description, href, color }) => (
            <Link key={title} href={href}>
              <Card hover className="h-full p-6 lg:p-8 group">
                <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon name={icon} className="text-white" size="lg" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {description}
                </p>
                <div className="flex items-center text-primary font-medium group-hover:gap-3 transition-all">
                  <span>Learn more</span>
                  <Icon name="arrow_forward" size="sm" className="ml-2" />
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Capabilities grid */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8 lg:p-12">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Platform Capabilities
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {capabilities.map(({ icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-3 p-4 bg-white dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-gray-700"
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon name={icon} className="text-primary" size="md" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
