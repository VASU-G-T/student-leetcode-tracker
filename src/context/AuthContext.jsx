import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../services/firebase';

const AuthContext = createContext();

const LOCAL_ADMIN_KEY = 'leettrack_admin_user';

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    // Check local fallback first
    const savedUser = localStorage.getItem(LOCAL_ADMIN_KEY);
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem(LOCAL_ADMIN_KEY);
      }
    }

    if (isFirebaseConfigured && auth) {
      try {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            setCurrentUser(user);
          }
          setLoading(false);
        });
        return unsubscribe;
      } catch (e) {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  /**
   * Admin Login with automatic Firebase Auth fallback
   */
  const login = async (email, password) => {
    setAuthError(null);

    // 1. Try Firebase Auth if available
    if (isFirebaseConfigured && auth) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        setCurrentUser(userCredential.user);
        return { success: true, user: userCredential.user };
      } catch (err) {
        // If user doesn't exist yet in Firebase, auto-create the admin user
        if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
          try {
            const newCredential = await createUserWithEmailAndPassword(auth, email, password);
            setCurrentUser(newCredential.user);
            return { success: true, user: newCredential.user };
          } catch (createErr) {
            // Fallback to local admin login so admin is never locked out
            console.warn('Firebase Auth fallback to local session:', createErr.message);
          }
        }
      }
    }

    // 2. Local Admin Fallback Mode (Always available)
    if (email && password) {
      const mockUser = {
        uid: 'admin_ece_1',
        email: email,
        displayName: 'ECE Administrator',
        role: 'admin',
        isLocalMock: true
      };
      setCurrentUser(mockUser);
      localStorage.setItem(LOCAL_ADMIN_KEY, JSON.stringify(mockUser));
      return { success: true, user: mockUser };
    } else {
      const err = 'Please provide both email and password';
      setAuthError(err);
      return { success: false, error: err };
    }
  };

  /**
   * Admin Logout
   */
  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      try {
        await firebaseSignOut(auth);
      } catch (e) {}
    }
    localStorage.removeItem(LOCAL_ADMIN_KEY);
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    isAdmin: Boolean(currentUser),
    loading,
    authError,
    login,
    logout,
    isFirebaseConfigured
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
