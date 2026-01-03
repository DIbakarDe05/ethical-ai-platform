/**
 * Home Page (Landing Page)
 * 
 * Desktop-first landing page for the Ethical AI Knowledge Base platform.
 * Features hero section, demo chatbot, impact stats, and trust badges.
 */

'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Icon, Button, Badge } from '@/components/ui';

// Dynamic imports with SSR disabled for components using context
const Navbar = dynamic(
  () => import('@/components/layout/Navbar').then((mod) => mod.Navbar),
  { ssr: false }
);

const Footer = dynamic(
  () => import('@/components/layout/Footer').then((mod) => mod.Footer),
  { ssr: false }
);

const DemoChatWidget = dynamic(
  () => import('@/components/home/DemoChatWidget').then((mod) => mod.DemoChatWidget),
  { ssr: false }
);

const StatsSection = dynamic(
  () => import('@/components/home/StatsSection').then((mod) => mod.StatsSection),
  { ssr: false }
);

const FeaturesSection = dynamic(
  () => import('@/components/home/FeaturesSection').then((mod) => mod.FeaturesSection),
  { ssr: false }
);

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5" />

          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Hero Text */}
              <div className="text-center lg:text-left">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                  <Icon name="emoji_events" size="sm" className="text-primary" />
                  <span className="text-sm font-bold text-primary uppercase tracking-wide">
                    Microsoft Imagine Cup 2025
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white leading-tight tracking-tight mb-6">
                  Empower NGOs with{' '}
                  <span className="gradient-text">Ethical AI</span>
                </h1>

                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto lg:mx-0">
                  Streamline operations and automate queries for your social organization
                  securely. Built with privacy, transparency, and human oversight at its core.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link href="/chat">
                    <Button size="lg" icon="chat" className="w-full sm:w-auto">
                      Try AI Assistant
                    </Button>
                  </Link>
                  <Link href="/knowledge-base">
                    <Button
                      size="lg"
                      variant="secondary"
                      icon="library_books"
                      className="w-full sm:w-auto"
                    >
                      Explore Knowledge Base
                    </Button>
                  </Link>
                </div>

                {/* Trust indicators */}
                <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-800">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 font-medium">
                    Trusted by non-profits worldwide
                  </p>
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 opacity-60">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-700" />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">UNICEF</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-md bg-gray-300 dark:bg-gray-700" />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Red Cross</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-sm bg-gray-300 dark:bg-gray-700" />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">WHO</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Demo Chat Widget */}
              <div className="lg:pl-8">
                <DemoChatWidget />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <StatsSection />

        {/* Features Section */}
        <FeaturesSection />

        {/* Ethics & Trust Section */}
        <section className="py-16 lg:py-24 relative overflow-hidden">
          {/* Softer gradient overlay that blends with main background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-blue-600/70 to-indigo-700/80 backdrop-blur-sm" />
          {/* Subtle animated gradient orbs for continuity */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-10 left-20 w-64 h-64 bg-white/20 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-20 w-80 h-80 bg-indigo-300/20 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-white">
                <Badge variant="primary" className="bg-white/20 text-white border-white/30 mb-4">
                  UNESCO Aligned
                </Badge>
                <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                  Ethics & Transparency at the Core
                </h2>
                <p className="text-lg text-blue-100 mb-8">
                  Our platform strictly adheres to the UNESCO Recommendation on the Ethics
                  of Artificial Intelligence, prioritizing human rights, fairness, and transparency.
                </p>

                <div className="space-y-4">
                  {[
                    { icon: 'balance', title: 'Fairness', desc: 'Bias-free, inclusive responses' },
                    { icon: 'security', title: 'Privacy', desc: 'No PII in embeddings or logs' },
                    { icon: 'visibility', title: 'Transparency', desc: 'Full audit trails' },
                    { icon: 'person', title: 'Human Oversight', desc: 'Human-in-the-loop for sensitive queries' },
                  ].map(({ icon, title, desc }) => (
                    <div key={title} className="flex items-start gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-white/20 backdrop-blur-sm">
                        <Icon name={icon} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{title}</h4>
                        <p className="text-sm text-blue-100">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Link href="/ethics" className="inline-block mt-8">
                  <Button
                    variant="secondary"
                    className="bg-white/90 text-primary hover:bg-white backdrop-blur-sm"
                    icon="arrow_forward"
                    iconPosition="right"
                  >
                    Read Our Ethics Policy
                  </Button>
                </Link>
              </div>

              {/* Ethics illustration */}
              <div className="relative hidden lg:block">
                <div className="absolute inset-0 bg-white/10 rounded-3xl backdrop-blur-md border border-white/20" />
                <div className="relative p-8">
                  <div className="flex items-center justify-center">
                    <div className="relative">
                      <div className="h-48 w-48 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center animate-float border border-white/30">
                        <Icon name="public" size="2xl" className="text-white text-6xl" />
                      </div>
                      {/* Orbiting elements */}
                      <div className="absolute -top-4 -right-4 h-16 w-16 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center border border-white/40">
                        <Icon name="verified_user" className="text-white" />
                      </div>
                      <div className="absolute -bottom-4 -left-4 h-12 w-12 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center border border-white/40">
                        <Icon name="lock" className="text-white" size="md" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Ready to Transform Your NGO?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Join hundreds of social organizations already using our ethical AI platform
              to automate queries and reduce staff workload.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button size="lg" icon="rocket_launch" className="w-full sm:w-auto">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  icon="mail"
                  className="w-full sm:w-auto"
                >
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
