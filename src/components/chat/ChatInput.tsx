/**
 * Chat Input Component
 * 
 * Message composer with:
 * - Text input with auto-resize
 * - Voice input support
 * - File attachment
 * - Send button
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Icon, Button } from '@/components/ui';

interface ChatInputProps {
  onSend: (content: string, attachments?: File[]) => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function ChatInput({ onSend, isLoading, isAuthenticated }: ChatInputProps) {
  const [content, setContent] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [content]);

  const handleSend = () => {
    if (!content.trim() && attachments.length === 0) return;
    onSend(content.trim(), attachments);
    setContent('');
    setAttachments([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const toggleRecording = () => {
    // Voice recording logic would go here
    setIsRecording(!isRecording);
  };

  // Guest login prompt
  if (!isAuthenticated) {
    return (
      <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-dark p-4">
        <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Icon name="lock" size="lg" className="text-gray-400" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Sign in to start chatting
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Create a free account to use the AI assistant
              </p>
            </div>
          </div>
          <Link href="/login">
            <Button size="sm">Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-dark p-4">
      {/* Attachments preview */}
      {attachments.length > 0 && (
        <div className="flex gap-2 mb-3 flex-wrap">
          {attachments.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2"
            >
              <Icon name="attach_file" size="sm" className="text-gray-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[150px]">
                {file.name}
              </span>
              <button
                onClick={() => removeAttachment(index)}
                className="text-gray-400 hover:text-red-500"
              >
                <Icon name="close" size="sm" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="flex flex-col gap-2">
        <div
          className={cn(
            'relative flex items-end gap-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-xl',
            'border-2 border-transparent focus-within:border-primary/50 transition-all'
          )}
        >
          {/* Attachment button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center h-10 w-10 shrink-0 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="Attach file"
          >
            <Icon name="add_circle" size="lg" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about policies, adoption, grants..."
            rows={1}
            className="w-full max-h-[150px] min-h-[40px] py-2 px-2 bg-transparent border-none focus:ring-0 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-[16px] resize-none"
            disabled={isLoading}
          />

          {/* Voice input button */}
          <button
            onClick={toggleRecording}
            className={cn(
              'flex items-center justify-center h-10 w-10 shrink-0 rounded-lg transition-colors',
              isRecording
                ? 'bg-red-500 text-white animate-pulse'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            )}
            title={isRecording ? 'Stop recording' : 'Voice input'}
          >
            <Icon name={isRecording ? 'stop' : 'mic'} size="lg" />
          </button>

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={isLoading || (!content.trim() && attachments.length === 0)}
            className={cn(
              'flex items-center justify-center h-10 w-10 shrink-0 rounded-lg transition-colors',
              'bg-primary hover:bg-primary-600 text-white',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            <Icon name={isLoading ? 'hourglass_empty' : 'arrow_upward'} size="lg" />
          </button>
        </div>

        {/* Disclaimer */}
        <p className="text-[10px] text-center text-gray-400 dark:text-gray-500">
          Ethical AI provides information from verified documents. Always verify critical decisions with official sources.
        </p>
      </div>
    </div>
  );
}

export default ChatInput;
