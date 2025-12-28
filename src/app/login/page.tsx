/**
 * Login Page
 * 
 * Authentication page with Google and Microsoft sign-in options.
 */

'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const LoginForm = dynamic(
  () => import('@/components/auth/LoginForm').then((mod) => mod.LoginForm),
  { ssr: false }
);

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <LoginForm />
    </div>
  );
}
