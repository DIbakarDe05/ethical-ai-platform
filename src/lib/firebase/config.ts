/**
 * Firebase Configuration
 * 
 * This file initializes the Firebase SDK for client-side use.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to Firebase Console (https://console.firebase.google.com)
 * 2. Create a new project or select existing one
 * 3. Enable Authentication (Google & Microsoft providers)
 * 4. Enable Firestore Database
 * 5. Enable Firebase Storage
 * 6. Copy your config values below
 * 
 * SECURITY NOTE:
 * - These values are safe to expose in client-side code
 * - Security is enforced via Firestore Security Rules
 * - Never expose service account keys in client code
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration object
// Replace these with your actual Firebase project config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "your-project.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abc123",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-XXXXXXXXXX",
};

// Initialize Firebase (prevent re-initialization in development)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Authentication providers
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account', // Always show account picker
});

// Microsoft OAuth Provider
export const microsoftProvider = new OAuthProvider('microsoft.com');
microsoftProvider.setCustomParameters({
  prompt: 'consent',
  tenant: 'common', // Allows both personal and work accounts
});

// Export the Firebase app instance
export default app;

/**
 * Firestore Collection Names
 * Centralized collection references for type safety
 */
export const COLLECTIONS = {
  USERS: 'users',
  DOCUMENTS: 'documents',
  DOCUMENT_CHUNKS: 'document_chunks',
  CHAT_SESSIONS: 'chat_sessions',
  CHAT_MESSAGES: 'chat_messages',
  AUDIT_LOGS: 'audit_logs',
  FEEDBACK: 'feedback',
  ANALYTICS: 'analytics',
} as const;

/**
 * User Roles
 * Role-based access control definitions
 */
export const USER_ROLES = {
  GUEST: 'guest',
  USER: 'user',
  ADMIN: 'admin',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
