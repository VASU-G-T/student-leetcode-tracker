import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../services/firebase';

const AuthContext = createContext();

const LOCAL_SESSION_KEY = 'leettrack_auth_session_v2';
const STUDENT_CREDENTIALS_KEY = 'leettrack_student_auth_creds_v2';

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Load existing session on mount
  useEffect(() => {
    const savedSession = localStorage.getItem(LOCAL_SESSION_KEY);
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        setCurrentUser(parsed);
      } catch (e) {
        localStorage.removeItem(LOCAL_SESSION_KEY);
      }
    }

    if (isFirebaseConfigured && auth) {
      try {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            // If already local admin or student session, preserve role
            const existing = currentUser || (savedSession ? JSON.parse(savedSession) : null);
            setCurrentUser({
              ...user,
              role: existing?.role || (user.email === 'vscec.ece@college.edu' ? 'admin' : 'student'),
              studentId: existing?.studentId || null,
              username: existing?.username || user.email?.split('@')[0]
            });
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
   * Helper: Save student auth credentials locally
   */
  const saveStudentCredentials = (username, password, studentId, studentData) => {
    try {
      const existingStr = localStorage.getItem(STUDENT_CREDENTIALS_KEY);
      const creds = existingStr ? JSON.parse(existingStr) : {};
      creds[username.toLowerCase()] = {
        username,
        password,
        studentId,
        registerNumber: studentData.registerNumber,
        email: studentData.email,
        name: studentData.name
      };
      if (studentData.registerNumber) {
        creds[studentData.registerNumber.toLowerCase()] = creds[username.toLowerCase()];
      }
      if (studentData.email) {
        creds[studentData.email.toLowerCase()] = creds[username.toLowerCase()];
      }
      localStorage.setItem(STUDENT_CREDENTIALS_KEY, JSON.stringify(creds));
    } catch (e) {
      console.warn('Failed to save student credentials:', e);
    }
  };

  /**
   * Admin Login: vscec.ece / vsb
   */
  const loginAdmin = async (identifier, password) => {
    setAuthError(null);
    const cleanId = (identifier || '').trim();
    const cleanPass = (password || '').trim();

    const isMatch = 
      (cleanId.toLowerCase() === 'vscec.ece' || cleanId.toLowerCase() === 'vscec.ece@college.edu' || cleanId.toLowerCase() === 'admin@college.edu') &&
      (cleanPass === 'vsb' || cleanPass === 'admin123');

    if (isMatch) {
      const adminUser = {
        uid: 'vscec_ece_admin',
        email: 'vscec.ece@college.edu',
        username: 'vscec.ece',
        displayName: 'ECE Administrator',
        role: 'admin',
        isAdmin: true
      };
      setCurrentUser(adminUser);
      localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(adminUser));
      return { success: true, user: adminUser };
    }

    // Try Firebase Admin Auth if applicable
    if (isFirebaseConfigured && auth && cleanId.includes('@')) {
      try {
        const cred = await signInWithEmailAndPassword(auth, cleanId, cleanPass);
        const adminUser = {
          uid: cred.user.uid,
          email: cred.user.email,
          username: cleanId.split('@')[0],
          displayName: 'ECE Administrator',
          role: 'admin',
          isAdmin: true
        };
        setCurrentUser(adminUser);
        localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(adminUser));
        return { success: true, user: adminUser };
      } catch (err) {
        // Continue
      }
    }

    const err = 'Invalid administrator username or password (use vscec.ece / vsb)';
    setAuthError(err);
    return { success: false, error: err };
  };

  /**
   * Student Login: Username / RegNo + Password
   */
  const loginStudent = async (identifier, password, allStudents = []) => {
    setAuthError(null);
    const cleanId = (identifier || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    if (!cleanId || !cleanPass) {
      const err = 'Please enter both username/register number and password';
      setAuthError(err);
      return { success: false, error: err };
    }

    // Check saved credentials database
    let matchedStudent = null;
    let matchedCred = null;

    try {
      const credsStr = localStorage.getItem(STUDENT_CREDENTIALS_KEY);
      if (credsStr) {
        const creds = JSON.parse(credsStr);
        matchedCred = creds[cleanId];
      }
    } catch (e) {}

    // Find student in roster
    matchedStudent = allStudents.find(s => 
      s.username?.toLowerCase() === cleanId ||
      s.registerNumber?.toLowerCase() === cleanId ||
      s.email?.toLowerCase() === cleanId ||
      s.githubUsername?.toLowerCase() === cleanId
    );

    if (matchedCred) {
      if (matchedCred.password !== cleanPass) {
        const err = 'Incorrect student password. Please try again.';
        setAuthError(err);
        return { success: false, error: err };
      }
    } else if (!matchedStudent) {
      const err = `No student profile found matching "${identifier}". Please register first.`;
      setAuthError(err);
      return { success: false, error: err };
    }

    const studentUser = {
      uid: matchedStudent?.id || matchedCred?.studentId || `student_${cleanId}`,
      studentId: matchedStudent?.id || matchedCred?.studentId || `student_${cleanId}`,
      username: matchedStudent?.username || matchedCred?.username || cleanId,
      registerNumber: matchedStudent?.registerNumber || matchedCred?.registerNumber,
      displayName: matchedStudent?.name || matchedCred?.name || 'Student',
      email: matchedStudent?.email || matchedCred?.email,
      role: 'student',
      isStudent: true
    };

    setCurrentUser(studentUser);
    localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(studentUser));
    return { success: true, user: studentUser, student: matchedStudent };
  };

  /**
   * Unified Login router
   */
  const login = async (identifier, password, allStudents = []) => {
    const cleanId = (identifier || '').trim().toLowerCase();
    
    // If identifier is admin
    if (cleanId === 'vscec.ece' || cleanId === 'vscec.ece@college.edu' || cleanId === 'admin@college.edu') {
      return loginAdmin(identifier, password);
    }

    // Otherwise try student login
    const studentRes = await loginStudent(identifier, password, allStudents);
    if (studentRes.success) {
      return studentRes;
    }

    // Fallback: check admin
    return loginAdmin(identifier, password);
  };

  /**
   * Register a new student account
   */
  const registerStudent = (studentData, password) => {
    const username = (studentData.username || studentData.registerNumber || studentData.githubUsername).toLowerCase();
    saveStudentCredentials(username, password, studentData.id, studentData);

    const studentUser = {
      uid: studentData.id,
      studentId: studentData.id,
      username: username,
      registerNumber: studentData.registerNumber,
      displayName: studentData.name,
      email: studentData.email,
      role: 'student',
      isStudent: true
    };

    setCurrentUser(studentUser);
    localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(studentUser));
    return studentUser;
  };

  /**
   * Logout
   */
  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      try {
        await firebaseSignOut(auth);
      } catch (e) {}
    }
    localStorage.removeItem(LOCAL_SESSION_KEY);
    setCurrentUser(null);
  };

  const isAdmin = currentUser?.role === 'admin' || currentUser?.isAdmin === true;
  const isStudent = currentUser?.role === 'student' || currentUser?.isStudent === true;
  const currentStudentId = currentUser?.studentId || null;

  const value = {
    currentUser,
    isAdmin,
    isStudent,
    currentStudentId,
    loading,
    authError,
    login,
    loginAdmin,
    loginStudent,
    registerStudent,
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
