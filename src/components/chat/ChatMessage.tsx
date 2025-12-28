/**
 * Chat Message Component
 * 
 * Renders individual chat messages with support for:
 * - Markdown formatting
 * - Citations/source badges
 * - User/assistant differentiation
 * - Action buttons (copy, regenerate, feedback)
 */

'use client';

import React, { useState } from 'react';
import { User } from 'firebase/auth';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import { Icon, Avatar } from '@/components/ui';
import toast from 'react-hot-toast';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  citations?: Citation[];
  attachments?: string[];
  isError?: boolean;
}

export interface Citation {
  id: string;
  title: string;
  type: 'document' | 'article' | 'guideline';
}

interface ChatMessageProps {
  message: Message;
  user: User | null;
}

export function ChatMessage({ message, user }: ChatMessageProps) {
  const [showActions, setShowActions] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    toast.success('Copied to clipboard');
  };

  const handleFeedback = (type: 'up' | 'down') => {
    toast.success(type === 'up' ? 'Thank you for your feedback!' : 'We\'ll work to improve.');
  };

  return (
    <div
      className={cn(
        'flex gap-3',
        isUser ? 'flex-row-reverse' : ''
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar */}
      {isUser ? (
        <Avatar
          src={user?.photoURL}
          name={user?.displayName || 'User'}
          size="md"
          className="shrink-0"
        />
      ) : (
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shrink-0">
          <Icon name="smart_toy" className="text-white" size="sm" />
        </div>
      )}

      {/* Message content */}
      <div className={cn('flex flex-col gap-1', isUser ? 'items-end' : 'items-start', 'max-w-[80%]')}>
        {!isUser && (
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 ml-1">
            AI Assistant
          </span>
        )}

        <div
          className={cn(
            'rounded-2xl px-4 py-3',
            isUser
              ? 'bg-primary text-white rounded-tr-none'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-tl-none',
            message.isError && 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
          )}
        >
          {isUser ? (
            <p className="text-[15px] leading-relaxed">{message.content}</p>
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  p: ({ children }) => (
                    <p className="text-[15px] leading-relaxed mb-2 last:mb-0">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside space-y-1 my-2">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside space-y-2 my-2">{children}</ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-gray-600 dark:text-gray-300 text-sm">{children}</li>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-gray-900 dark:text-white">{children}</strong>
                  ),
                  code: ({ children }) => (
                    <code className="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm">{children}</code>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}

          {/* Citations */}
          {message.citations && message.citations.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Sources:</p>
              <div className="flex flex-wrap gap-2">
                {message.citations.map((citation) => (
                  <button
                    key={citation.id}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded bg-primary/10 hover:bg-primary/20 text-primary dark:text-blue-400 text-xs font-medium transition-colors border border-primary/20"
                  >
                    <Icon name="description" size="sm" />
                    {citation.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Disclaimer for sensitive topics */}
          {!isUser && message.content.toLowerCase().includes('consult') && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 italic flex items-center gap-1">
                <Icon name="warning" size="sm" className="text-orange-500" />
                AI can make mistakes. Please verify important information with official staff.
              </p>
            </div>
          )}
        </div>

        {/* Timestamp */}
        <span className="text-xs text-gray-400 dark:text-gray-500 px-1">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>

        {/* Action buttons */}
        {!isUser && showActions && (
          <div className="flex gap-1 mt-1 animate-fade-in">
            <button
              onClick={handleCopy}
              className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              title="Copy"
            >
              <Icon name="content_copy" size="sm" />
            </button>
            <button
              className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              title="Regenerate"
            >
              <Icon name="refresh" size="sm" />
            </button>
            <button
              onClick={() => handleFeedback('up')}
              className="p-1.5 text-gray-400 hover:text-green-600 transition-colors"
              title="Good response"
            >
              <Icon name="thumb_up" size="sm" />
            </button>
            <button
              onClick={() => handleFeedback('down')}
              className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
              title="Poor response"
            >
              <Icon name="thumb_down" size="sm" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatMessage;
