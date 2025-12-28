/**
 * Chat Interface Component
 * 
 * Main chat UI with sidebar for history and message area.
 * Desktop-first design with full-screen layout.
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Icon, Button, Avatar } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { ChatMessage, Message } from './ChatMessage';
import { ChatSidebar } from './ChatSidebar';
import { ChatInput } from './ChatInput';
import { sendChatMessage } from '@/lib/ai/chat';

// Sample initial message
const welcomeMessage: Message = {
  id: 'welcome',
  role: 'assistant',
  content: `Hello! I am your **Ethical AI Assistant**, designed to help NGOs and social organizations navigate complex regulations.

I can assist with:
- International Adoption Policies
- Grant Compliance
- Social Housing Regulations
- NGO Best Practices

Ask me anything, and I'll provide answers based on verified documents. What would you like to know?`,
  timestamp: new Date(),
};

export function ChatInterface() {
  const { user, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = async (content: string, attachments?: File[]) => {
    if (!content.trim() && (!attachments || attachments.length === 0)) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
      attachments: attachments?.map(f => f.name),
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Send to AI and get response
      const response = await sendChatMessage(content, messages);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        citations: response.citations,
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again or contact support if the issue persists.',
        timestamp: new Date(),
        isError: true,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Start a new chat
  const handleNewChat = () => {
    setMessages([welcomeMessage]);
    setCurrentChatId(null);
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Sidebar */}
      <ChatSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNewChat={handleNewChat}
        currentChatId={currentChatId}
        onSelectChat={setCurrentChatId}
      />

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-dark">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
            >
              <Icon name="menu" size="lg" className="text-gray-600 dark:text-gray-300" />
            </button>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
                  <Icon name="smart_toy" className="text-white" size="md" />
                </div>
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-surface-dark" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  Ethical AI Assistant
                </h2>
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Online</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language selector */}
            <select className="text-sm bg-gray-100 dark:bg-gray-800 border-0 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-primary">
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>
            
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300">
              <Icon name="info" size="lg" />
            </button>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 custom-scrollbar">
          {/* Timestamp */}
          <div className="flex justify-center">
            <span className="text-xs font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
              Today
            </span>
          </div>

          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              user={user}
            />
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shrink-0">
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

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <ChatInput
          onSend={handleSendMessage}
          isLoading={isLoading}
          isAuthenticated={isAuthenticated}
        />
      </div>
    </div>
  );
}

export default ChatInterface;
