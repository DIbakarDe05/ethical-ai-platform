/**
 * Stats Section Component
 * 
 * Impact metrics displayed on the landing page.
 */

import React from 'react';
import { Icon, Card } from '@/components/ui';

const stats = [
  {
    icon: 'bolt',
    iconColor: 'text-primary',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    label: 'Query Automation',
    value: '90%',
    description: 'of routine queries automated',
  },
  {
    icon: 'verified_user',
    iconColor: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    label: 'Data Privacy',
    value: '100%',
    description: 'GDPR compliant operations',
  },
  {
    icon: 'diversity_1',
    iconColor: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    label: 'NGOs Aided',
    value: '500+',
    description: 'organizations worldwide',
  },
  {
    icon: 'schedule',
    iconColor: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    label: 'Time Saved',
    value: '1000+',
    description: 'hours per month average',
  },
];

export function StatsSection() {
  return (
    <section className="py-16 lg:py-20 bg-white dark:bg-surface-dark border-y border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Impact Metrics
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Real results from organizations using our ethical AI platform
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map(({ icon, iconColor, bgColor, label, value, description }) => (
            <Card key={label} padding="lg" hover>
              <div className="flex flex-col">
                <div className={`h-12 w-12 rounded-xl ${bgColor} flex items-center justify-center mb-4`}>
                  <Icon name={icon} className={iconColor} size="lg" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">
                  {label}
                </p>
                <p className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-1">
                  {value}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default StatsSection;
