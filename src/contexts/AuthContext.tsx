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
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider, microsoftProvider, COLLECTIONS, USER_ROLES, UserRole } from '@/lib/firebase/config';
import toast from 'react-hot-toast';


/**
 * NGO-specific details stored in user profile
 */
interface NGODetails {
  organizationName: string;
  registrationNumber: string;
  type: 'adoption' | 'child_care' | 'welfare';
  location: string;
  description?: string;
}

/**
 * Extended user profile stored in Firestore
 */
export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  provider: string;
  createdAt: Date;
  lastLoginAt: Date;
  // NGO-specific fields
  ngoStatus?: 'pending' | 'approved' | 'rejected';
  ngoDetails?: NGODetails;
  // Account status
  accountStatus?: 'active' | 'suspended' | 'locked';
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
  signInWithEmail: (email: string, password: string) => Promise<UserCredential | null>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<UserCredential | null>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;

  // Role checks
  isAdmin: boolean;
  isNGO: boolean;
  isVerifiedNGO: boolean;
  isProspectiveParent: boolean;
  isAuthenticated: boolean;
  isAccountActive: boolean;

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
   * Sign in with Email/Password
   */
  const signInWithEmail = async (email: string, password: string): Promise<UserCredential | null> => {
    try {
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      const profile = await fetchOrCreateUserProfile(result.user, 'email');
      setUserProfile(profile);
      toast.success(`Welcome back, ${result.user.displayName || 'User'}!`);
      return result;
    } catch (error: any) {
      console.error('Email sign-in error:', error);
      let message = 'Failed to sign in. Please try again.';
      if (error.code === 'auth/user-not-found') {
        message = 'No account found with this email.';
      } else if (error.code === 'auth/wrong-password') {
        message = 'Incorrect password.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Invalid email address.';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Too many failed attempts. Please try again later.';
      }
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sign up with Email/Password
   */
  const signUpWithEmail = async (email: string, password: string, displayName: string): Promise<UserCredential | null> => {
    try {
      setLoading(true);
      const result = await createUserWithEmailAndPassword(auth, email, password);

      // Update display name
      await updateProfile(result.user, { displayName });

      const profile = await fetchOrCreateUserProfile(result.user, 'email');
      setUserProfile(profile);
      toast.success(`Welcome, ${displayName}! Your account has been created.`);
      return result;
    } catch (error: any) {
      console.error('Email sign-up error:', error);
      let message = 'Failed to create account. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        message = 'An account with this email already exists.';
      } else if (error.code === 'auth/weak-password') {
        message = 'Password should be at least 6 characters.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Invalid email address.';
      }
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reset Password
   */
  const resetPassword = async (email: string): Promise<void> => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent. Check your inbox.');
    } catch (error: any) {
      console.error('Password reset error:', error);
      let message = 'Failed to send reset email.';
      if (error.code === 'auth/user-not-found') {
        message = 'No account found with this email.';
      }
      toast.error(message);
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
  const isNGO = userProfile?.role === USER_ROLES.NGO;
  const isVerifiedNGO = isNGO && userProfile?.ngoStatus === 'approved';
  const isProspectiveParent = userProfile?.role === USER_ROLES.PROSPECTIVE_PARENT || userProfile?.role === USER_ROLES.USER;
  const isAuthenticated = !!user;
  const isAccountActive = userProfile?.accountStatus !== 'suspended' && userProfile?.accountStatus !== 'locked';

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    signInWithGoogle,
    signInWithMicrosoft,
    signInWithEmail,
    signUpWithEmail,
    resetPassword,
    signOut,
    isAdmin,
    isNGO,
    isVerifiedNGO,
    isProspectiveParent,
    isAuthenticated,
    isAccountActive,
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
