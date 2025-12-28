/**
 * Firebase Admin SDK Configuration
 * 
 * This file initializes Firebase Admin SDK for server-side operations.
 * Used in API routes and server components.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to Firebase Console > Project Settings > Service Accounts
 * 2. Generate new private key
 * 3. Save the JSON file securely (NEVER commit to git)
 * 4. Set the environment variables below
 * 
 * SECURITY WARNING:
 * - Never expose service account credentials in client code
 * - Store credentials in environment variables
 * - Add service account JSON to .gitignore
 */

import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

// Service account configuration from environment variables
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  // Private key needs special handling for newlines in env vars
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

// Initialize Firebase Admin (singleton pattern)
let adminApp: App;

if (getApps().length === 0) {
  // Only initialize if no apps exist
  if (serviceAccount.projectId && serviceAccount.clientEmail && serviceAccount.privateKey) {
    adminApp = initializeApp({
      credential: cert(serviceAccount as any),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  } else {
    // Fallback for development without credentials
    console.warn('Firebase Admin: Using default credentials (development mode)');
    adminApp = initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  }
} else {
  adminApp = getApps()[0];
}

// Export admin services
export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);
export const adminStorage = getStorage(adminApp);

export default adminApp;

/**
 * Verify Firebase ID Token
 * Used to authenticate API requests
 */
export async function verifyIdToken(token: string) {
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return { valid: true, uid: decodedToken.uid, token: decodedToken };
  } catch (error) {
    console.error('Token verification failed:', error);
    return { valid: false, uid: null, token: null };
  }
}

/**
 * Get user role from custom claims
 */
export async function getUserRole(uid: string): Promise<string> {
  try {
    const user = await adminAuth.getUser(uid);
    return user.customClaims?.role || 'user';
  } catch (error) {
    console.error('Failed to get user role:', error);
    return 'guest';
  }
}

/**
 * Set custom claims for user (admin only operation)
 */
export async function setUserRole(uid: string, role: 'admin' | 'user' | 'guest') {
  try {
    await adminAuth.setCustomUserClaims(uid, { role });
    return { success: true };
  } catch (error) {
    console.error('Failed to set user role:', error);
    return { success: false, error };
  }
}
