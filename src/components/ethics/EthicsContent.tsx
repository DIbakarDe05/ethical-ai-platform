/**
 * Ethics Content Component
 * 
 * Main content for the Ethics & Transparency page.
 */

'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Icon, Card, Badge, Button } from '@/components/ui';
import { FeedbackForm } from './FeedbackForm';

const principles = [
  {
    id: 'fairness',
    icon: 'balance',
    title: 'Fairness & Non-Discrimination',
    description: 'We actively monitor our datasets and algorithms to prevent bias based on race, gender, or socioeconomic status. Our models are audited quarterly by third-party ethics boards.',
    link: 'Read Audit Report',
  },
  {
    id: 'privacy',
    icon: 'security',
    title: 'Privacy & Data Security',
    description: 'All user interactions are end-to-end encrypted. We employ differential privacy techniques to ensure individual data points cannot be reverse-engineered.',
    badges: ['GDPR Compliant', 'SOC2 Type II'],
  },
  {
    id: 'oversight',
    icon: 'visibility',
    title: 'Human Oversight',
    description: 'We maintain a "Human-in-the-loop" approach for high-stakes scenarios. Any flagging of sensitive content is reviewed by our trained safety team before action is taken.',
  },
  {
    id: 'transparency',
    icon: 'article',
    title: 'Transparency',
    description: 'All AI responses include source citations. Users can always trace information back to verified documents. We maintain full audit logs of all system decisions.',
  },
  {
    id: 'accountability',
    icon: 'verified_user',
    title: 'Accountability',
    description: 'Clear escalation paths exist for disputed AI responses. Users can report concerns directly, and we commit to investigating all reports within 48 hours.',
  },
];

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'fairness', label: 'Fairness' },
  { id: 'privacy', label: 'Privacy' },
  { id: 'oversight', label: 'Oversight' },
  { id: 'settings', label: 'Settings' },
];

export function EthicsContent() {
  const [activeTab, setActiveTab] = useState('overview');
  const [dataContribution, setDataContribution] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Header */}
      <div className="mb-8">
        <Badge variant="primary" className="mb-4">
          UNESCO Aligned
        </Badge>
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Ethical AI Commitment
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Our platform strictly adheres to the{' '}
          <a href="#" className="text-primary font-medium hover:underline">
            UNESCO Recommendation
          </a>{' '}
          on the Ethics of Artificial Intelligence, prioritizing human rights, fairness, and transparency.
        </p>
      </div>

      {/* Version info */}
      <div className="flex items-center justify-between py-3 mb-6 border-b border-gray-200 dark:border-gray-800">
        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
          Version 2.4
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Updated: December 27, 2025
        </span>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-8 pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex shrink-0 items-center justify-center px-4 py-2 rounded-full text-sm font-medium transition-colors',
              activeTab === tab.id
                ? 'bg-primary text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Principles */}
      <div className="space-y-6 mb-12">
        {principles.map((principle) => (
          <Card key={principle.id} padding="lg" className="group">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Icon name={principle.icon} className="text-primary" size="lg" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {principle.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {principle.description}
                </p>
                
                {principle.badges && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {principle.badges.map((badge) => (
                      <Badge key={badge} variant="success">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                )}
                
                {principle.link && (
                  <button className="flex items-center gap-1 mt-4 text-primary text-sm font-semibold group-hover:gap-2 transition-all">
                    {principle.link}
                    <Icon name="arrow_forward" size="sm" />
                  </button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* AI Limitations Section */}
      <Card padding="lg" className="mb-8 bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-900/30">
            <Icon name="warning" className="text-orange-600" size="lg" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              AI Limitations
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Our AI assistant has important limitations you should be aware of:
            </p>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-2">
                <Icon name="close" size="sm" className="text-red-500 mt-1" />
                <span>Cannot provide legal, medical, or financial advice</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="close" size="sm" className="text-red-500 mt-1" />
                <span>May occasionally produce inaccurate information</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="close" size="sm" className="text-red-500 mt-1" />
                <span>Limited to information in verified documents only</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="close" size="sm" className="text-red-500 mt-1" />
                <span>Cannot make decisions about specific cases</span>
              </li>
            </ul>
            <p className="mt-4 text-sm text-orange-700 dark:text-orange-300 font-medium">
              Always consult with qualified professionals for important decisions.
            </p>
          </div>
        </div>
      </Card>

      {/* Data Contribution Toggle */}
      <Card padding="lg" className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              Data Contribution
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Allow anonymized usage data to be used for training future models to improve accuracy.
            </p>
          </div>
          
          {/* Toggle switch */}
          <button
            onClick={() => setDataContribution(!dataContribution)}
            className={cn(
              'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
              dataContribution ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
            )}
          >
            <span
              className={cn(
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                dataContribution ? 'translate-x-5' : 'translate-x-0'
              )}
            />
          </button>
        </div>
        
        <div className="border-t border-gray-100 dark:border-gray-700 mt-4 pt-4">
          <p className="text-xs text-gray-400 dark:text-gray-500 italic">
            Note: Opting out does not affect your ability to use the platform's core features.
          </p>
        </div>
      </Card>

      {/* Feedback Form */}
      <Card padding="lg" className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Icon name="report" size="lg" className="text-gray-500" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Report an Ethical Concern
          </h3>
        </div>
        <FeedbackForm />
      </Card>

      {/* Trust Footer */}
      <div className="text-center py-8">
        <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-primary to-indigo-600 mx-auto mb-4 flex items-center justify-center">
          <Icon name="public" size="xl" className="text-white" />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
          Aligned with the UNESCO Recommendation on the Ethics of Artificial Intelligence (2021).
        </p>
      </div>
    </div>
  );
}

export default EthicsContent;
