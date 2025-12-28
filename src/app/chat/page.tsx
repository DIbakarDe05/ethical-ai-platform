/**
 * AI Chat Page
 * 
 * Full-screen desktop chatbot UI with sidebar, chat history,
 * and multilingual support. ChatGPT-style interface.
 */

'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const Navbar = dynamic(
  () => import('@/components/layout/Navbar').then((mod) => mod.Navbar),
  { ssr: false }
);

const ChatInterface = dynamic(
  () => import('@/components/chat/ChatInterface').then((mod) => mod.ChatInterface),
  { ssr: false }
);

export default function ChatPage() {
  return (
    <div className="h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <Navbar />
      <ChatInterface />
    </div>
  );
}
