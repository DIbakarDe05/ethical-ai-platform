/**
 * Demo Chat Widget Component
 * 
 * Interactive demo chatbot for the landing page.
 * Shows a sample conversation with the AI assistant.
 */

'use client';

import React, { useState } from 'react';
import { Icon } from '@/components/ui';
import { cn } from '@/lib/utils';

const demoMessages = [
  {
    role: 'ai',
    content: "Hello! I'm your Ethical AI assistant. How can I help verify adoption regulations for your NGO today?",
    time: 'Just now',
  },
];

const suggestedQuestions = [
  'What are international adoption requirements?',
  'How do I apply for a grant?',
  'What documents are needed for child welfare?',
];

export function DemoChatWidget() {
  const [messages, setMessages] = useState(demoMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: text, time: 'Now' }]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          role: 'ai',
          content: `Based on our verified documents, here's what I found about "${text}". For complete details, please sign in to access the full knowledge base. [doc: FAQ_Document.pdf]`,
          time: 'Just now',
        },
      ]);
    }, 1500);
  };

  return (
    <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden max-w-md mx-auto lg:mx-0">
      {/* Header */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
        <div className="relative">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
            <Icon name="smart_toy" className="text-white" size="md" />
          </div>
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-800 animate-pulse" />
        </div>
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">Live Demo Assistant</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Online • Try it now</p>
        </div>
      </div>

      {/* Messages */}
      <div className="h-72 overflow-y-auto p-4 space-y-4 bg-white dark:bg-gray-900">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={cn(
              'flex gap-3',
              msg.role === 'user' ? 'flex-row-reverse' : ''
            )}
          >
            {msg.role === 'ai' && (
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                <Icon name="smart_toy" className="text-white" size="sm" />
              </div>
            )}
            <div
              className={cn(
                'max-w-[80%] rounded-2xl px-4 py-3',
                msg.role === 'ai'
                  ? 'bg-gray-100 dark:bg-gray-800 rounded-tl-none'
                  : 'bg-primary text-white rounded-tr-none'
              )}
            >
              <p className="text-sm leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-3">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0">
              <Icon name="smart_toy" className="text-white" size="sm" />
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-none px-4 py-3">
              <div className="typing-dots flex gap-1">
                <span className="h-2 w-2 rounded-full bg-gray-400" />
                <span className="h-2 w-2 rounded-full bg-gray-400" />
                <span className="h-2 w-2 rounded-full bg-gray-400" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggested questions */}
      <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Try asking:</p>
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="shrink-0 px-3 py-1.5 text-xs font-medium rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(input)}
            placeholder="Ask about regulations..."
            className="flex-1 bg-transparent border-none focus:outline-none text-sm text-gray-900 dark:text-white placeholder:text-gray-400"
          />
          <button
            onClick={() => handleSendMessage(input)}
            className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-600 transition-colors"
          >
            <Icon name="send" size="sm" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default DemoChatWidget;
