/**
 * Authentication Context Provider
 * 
 * Provides authentication state and methods throughout the application.
 * Handles user sign-in, sign-out, and role management.
 */

'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  User,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  UserCredential,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider, microsoftProvider, COLLECTIONS, USER_ROLES, UserRole } from '@/lib/firebase/config';
import toast from 'react-hot-toast';

/**
 * Extended user profile stored in Firestore
 */
interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  provider: string;
  createdAt: Date;
  lastLoginAt: Date;
  preferences: {
    language: string;
    theme: 'light' | 'dark' | 'system';
    emailNotifications: boolean;
  };
}

/**
 * Authentication context interface
 */
interface AuthContextType {
  // Current user state
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  
  // Authentication methods
  signInWithGoogle: () => Promise<UserCredential | null>;
  signInWithMicrosoft: () => Promise<UserCredential | null>;
  signOut: () => Promise<void>;
  
  // Role checks
  isAdmin: boolean;
  isAuthenticated: boolean;
  
  // Profile management
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Auth Provider Component
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Fetch or create user profile in Firestore
   */
  const fetchOrCreateUserProfile = useCallback(async (firebaseUser: User, provider: string = 'google'): Promise<UserProfile | null> => {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        // Update last login time
        const existingProfile = userSnap.data() as UserProfile;
        await setDoc(userRef, { lastLoginAt: serverTimestamp() }, { merge: true });
        return {
          ...existingProfile,
          lastLoginAt: new Date(),
        };
      } else {
        // Create new user profile
        const newProfile: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          role: USER_ROLES.USER, // Default role
          provider,
          createdAt: new Date(),
          lastLoginAt: new Date(),
          preferences: {
            language: 'en',
            theme: 'system',
            emailNotifications: true,
          },
        };

        await setDoc(userRef, {
          ...newProfile,
          createdAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
        });

        return newProfile;
      }
    } catch (error) {
      console.error('Error fetching/creating user profile:', error);
      return null;
    }
  }, []);

  /**
   * Sign in with Google
   */
  const signInWithGoogle = async (): Promise<UserCredential | null> => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const profile = await fetchOrCreateUserProfile(result.user, 'google');
      setUserProfile(profile);
      toast.success(`Welcome, ${result.user.displayName || 'User'}!`);
      return result;
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      if (error.code !== 'auth/popup-closed-by-user') {
        toast.error('Failed to sign in with Google. Please try again.');
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sign in with Microsoft
   */
  const signInWithMicrosoft = async (): Promise<UserCredential | null> => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, microsoftProvider);
      const profile = await fetchOrCreateUserProfile(result.user, 'microsoft');
      setUserProfile(profile);
      toast.success(`Welcome, ${result.user.displayName || 'User'}!`);
      return result;
    } catch (error: any) {
      console.error('Microsoft sign-in error:', error);
      if (error.code !== 'auth/popup-closed-by-user') {
        toast.error('Failed to sign in with Microsoft. Please try again.');
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sign out
   */
  const signOut = async (): Promise<void> => {
    try {
      await firebaseSignOut(auth);
      setUserProfile(null);
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out. Please try again.');
    }
  };

  /**
   * Update user profile
   */
  const updateUserProfile = async (updates: Partial<UserProfile>): Promise<void> => {
    if (!user) {
      toast.error('You must be signed in to update your profile');
      return;
    }

    try {
      const userRef = doc(db, COLLECTIONS.USERS, user.uid);
      await setDoc(userRef, updates, { merge: true });
      
      // Update local state
      setUserProfile(prev => prev ? { ...prev, ...updates } : null);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
    }
  };

  /**
   * Refresh user profile from Firestore
   */
  const refreshUserProfile = async (): Promise<void> => {
    if (!user) return;
    
    try {
      const userRef = doc(db, COLLECTIONS.USERS, user.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        setUserProfile(userSnap.data() as UserProfile);
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Fetch user profile when authenticated
        const profile = await fetchOrCreateUserProfile(firebaseUser);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, [fetchOrCreateUserProfile]);

  // Computed properties
  const isAdmin = userProfile?.role === USER_ROLES.ADMIN;
  const isAuthenticated = !!user;

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    signInWithGoogle,
    signInWithMicrosoft,
    signOut,
    isAdmin,
    isAuthenticated,
    updateUserProfile,
    refreshUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to use auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
