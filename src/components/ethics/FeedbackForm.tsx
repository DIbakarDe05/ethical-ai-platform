/**
 * Feedback Form Component
 * 
 * Form for reporting ethical concerns.
 */

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui';
import toast from 'react-hot-toast';

export function FeedbackForm() {
  const [issueType, setIssueType] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!issueType || !description) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Thank you for your report. We will investigate within 48 hours.');
    setIssueType('');
    setDescription('');
    setEmail('');
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Issue Type */}
      <div>
        <label 
          htmlFor="issue-type" 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Issue Type *
        </label>
        <select
          id="issue-type"
          value={issueType}
          onChange={(e) => setIssueType(e.target.value)}
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          required
        >
          <option value="">Select an issue type</option>
          <option value="bias">Algorithmic Bias</option>
          <option value="privacy">Privacy Violation</option>
          <option value="misinformation">Misinformation</option>
          <option value="harmful">Harmful Content</option>
          <option value="accuracy">Accuracy Concern</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Description */}
      <div>
        <label 
          htmlFor="description" 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Description *
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Please describe the issue in detail. Include any relevant context, such as the query you made and the response you received."
          rows={4}
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
          required
        />
      </div>

      {/* Email (optional) */}
      <div>
        <label 
          htmlFor="email" 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Email (optional)
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your.email@example.com"
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Provide your email if you'd like us to follow up with you.
        </p>
      </div>

      {/* Submit button */}
      <Button
        type="submit"
        fullWidth
        loading={isSubmitting}
        disabled={!issueType || !description}
      >
        Submit Report
      </Button>

      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        All reports are reviewed by our ethics team within 48 hours.
      </p>
    </form>
  );
}

export default FeedbackForm;
