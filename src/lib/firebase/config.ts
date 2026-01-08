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
// Values are loaded from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

/**
 * Validate Firebase configuration
 * Logs a warning if configuration is missing (development mode)
 * In production, you may want to throw an error instead
 */
function validateFirebaseConfig() {
  const requiredKeys = ['apiKey', 'authDomain', 'projectId'] as const;
  const missingKeys = requiredKeys.filter(
    (key) => !firebaseConfig[key]
  );

  if (missingKeys.length > 0) {
    const isDev = process.env.NODE_ENV === 'development';
    const message = `Firebase configuration missing: ${missingKeys.join(', ')}. ` +
      'Please set the required NEXT_PUBLIC_FIREBASE_* environment variables.';

    if (isDev) {
      console.warn(`⚠️ ${message} Running in demo mode.`);
    } else {
      // In production, you may want to throw an error
      console.error(`❌ ${message}`);
    }
    return false;
  }
  return true;
}

// Validate config on module load
const isConfigValid = validateFirebaseConfig();

// Initialize Firebase (prevent re-initialization in development)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Export config validation status for conditional features
export const isFirebaseConfigured = isConfigValid;


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
  // New collections for adoption platform features
  NGOS: 'ngos',
  ADOPTION_REQUESTS: 'adoption_requests',
  USER_DOCUMENTS: 'user_documents',
  CONTACT_REQUESTS: 'contact_requests',
} as const;

/**
 * User Roles
 * Role-based access control definitions
 */
export const USER_ROLES = {
  GUEST: 'guest',
  USER: 'user',
  PROSPECTIVE_PARENT: 'prospective_parent',
  NGO: 'ngo',
  ADMIN: 'admin',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

/**
 * NGO Types
 */
export const NGO_TYPES = {
  ADOPTION: 'adoption',
  CHILD_CARE: 'child_care',
  WELFARE: 'welfare',
} as const;

export type NGOType = typeof NGO_TYPES[keyof typeof NGO_TYPES];

/**
 * NGO Status
 */
export const NGO_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export type NGOStatus = typeof NGO_STATUS[keyof typeof NGO_STATUS];

