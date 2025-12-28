/**
 * AI Insight Card Component
 * 
 * Shows AI-generated summary for search queries.
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { Icon, Button } from '@/components/ui';

interface AIInsightCardProps {
  query: string;
  className?: string;
}

export function AIInsightCard({ query, className }: AIInsightCardProps) {
  return (
    <div className={cn(
      'relative overflow-hidden rounded-xl bg-gradient-to-br from-primary via-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-200 dark:shadow-none',
      className
    )}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 p-3 opacity-20">
        <Icon name="smart_toy" size="2xl" className="text-6xl" />
      </div>

      <div className="relative p-6 z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Icon name="auto_awesome" className="text-white" size="lg" />
          </div>
          <div>
            <span className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-xs font-medium border border-white/10">
              AI Summary
            </span>
          </div>
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold mb-3">
          Results for &ldquo;{query}&rdquo;
        </h3>
        <p className="text-blue-100 leading-relaxed mb-6">
          Based on our verified documents, I found relevant information about {query.toLowerCase()}. 
          The documents cover policies, guidelines, and best practices from multiple sources. 
          Review the matched documents below for detailed information.
        </p>

        {/* Quick stats */}
        <div className="flex items-center gap-6 mb-6">
          <div className="flex items-center gap-2">
            <Icon name="description" size="md" className="text-blue-200" />
            <span className="text-sm">6 documents matched</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="schedule" size="md" className="text-blue-200" />
            <span className="text-sm">Last updated 2 days ago</span>
          </div>
        </div>

        {/* Action button */}
        <Button
          variant="secondary"
          className="bg-white text-primary hover:bg-blue-50"
          icon="arrow_forward"
          iconPosition="right"
        >
          Ask AI for detailed analysis
        </Button>
      </div>
    </div>
  );
}

export default AIInsightCard;
