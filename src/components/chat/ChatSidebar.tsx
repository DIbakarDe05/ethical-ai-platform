/**
 * Chat Sidebar Component
 * 
 * Shows chat history and language selection.
 * Collapsible on desktop, drawer on mobile.
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Icon, Button } from '@/components/ui';

interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

// Mock chat history
const mockHistory: ChatHistory[] = [
  {
    id: '1',
    title: 'Adoption Requirements',
    lastMessage: 'What are the Hague Convention requirements?',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: '2',
    title: 'Grant Application Help',
    lastMessage: 'How do I fill out the federal grant form?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: '3',
    title: 'Volunteer Guidelines',
    lastMessage: 'What training is required for volunteers?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
  },
];

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  currentChatId: string | null;
  onSelectChat: (id: string) => void;
}

export function ChatSidebar({
  isOpen,
  onClose,
  onNewChat,
  currentChatId,
  onSelectChat,
}: ChatSidebarProps) {
  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:relative inset-y-0 left-0 z-50 w-72 bg-white dark:bg-surface-dark',
          'border-r border-gray-200 dark:border-gray-800',
          'flex flex-col transition-transform duration-300',
          'lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-0 lg:border-0 lg:overflow-hidden'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Chat History
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
          >
            <Icon name="close" size="md" className="text-gray-500" />
          </button>
        </div>

        {/* New chat button */}
        <div className="p-4">
          <Button
            onClick={onNewChat}
            variant="outline"
            icon="add"
            fullWidth
            className="justify-start"
          >
            New Chat
          </Button>
        </div>

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          {mockHistory.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={cn(
                'w-full text-left px-3 py-3 rounded-lg transition-colors',
                'hover:bg-gray-100 dark:hover:bg-gray-800',
                currentChatId === chat.id && 'bg-primary/10 text-primary'
              )}
            >
              <div className="flex items-start gap-3">
                <Icon
                  name="chat_bubble"
                  size="md"
                  className={cn(
                    'mt-0.5 shrink-0',
                    currentChatId === chat.id ? 'text-primary' : 'text-gray-400'
                  )}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                    {chat.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                    {chat.lastMessage}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {formatDate(chat.timestamp)}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
            <Icon name="info" size="sm" />
            <span>Chats are saved for 30 days</span>
          </div>
        </div>
      </aside>
    </>
  );
}

export default ChatSidebar;
