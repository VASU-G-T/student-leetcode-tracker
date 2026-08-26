import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
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
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
        setLoading(false);
      });
      return unsubscribe;
    } else {
      // Local fallback mode: check localStorage for saved admin session
      const savedUser = localStorage.getItem(LOCAL_ADMIN_KEY);
      if (savedUser) {
        try {
          setCurrentUser(JSON.parse(savedUser));
        } catch (e) {
          localStorage.removeItem(LOCAL_ADMIN_KEY);
        }
      }
      setLoading(false);
    }
  }, []);

  /**
   * Admin Login
   */
  const login = async (email, password) => {
    setAuthError(null);

    // If Firebase is configured, use Firebase Auth
    if (isFirebaseConfigured && auth) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        setCurrentUser(userCredential.user);
        return { success: true, user: userCredential.user };
      } catch (err) {
        setAuthError(err.message || 'Failed to login');
        return { success: false, error: err.message };
      }
    }

    // Local Admin Fallback Mode (Demo / Local development)
    if (email && password) {
      // Allow demo credentials or any non-empty input for ease of local testing
      const mockUser = {
        uid: 'local_admin_1',
        email: email,
        displayName: 'College Administrator',
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
      await firebaseSignOut(auth);
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
