import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const CUSTOM_FIREBASE_KEY = 'leettrack_custom_firebase_config_v2';

export const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyBO4IpLLQZQl68LX2noLqfmG7iH1oiyB70",
  authDomain: "vasu-leetsync.firebaseapp.com",
  databaseURL: "https://vasu-leetsync-default-rtdb.firebaseio.com",
  projectId: "vasu-leetsync",
  storageBucket: "vasu-leetsync.firebasestorage.app",
  messagingSenderId: "1000181139020",
  appId: "1:1000181139020:web:000e37e92838326ffa96e9",
  measurementId: "G-L0L17GB5LM"
};

export function getActiveFirebaseConfig() {
  // 1. Check localStorage for Admin configured keys first
  try {
    const saved = localStorage.getItem(CUSTOM_FIREBASE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.apiKey && parsed.projectId) {
        return parsed;
      }
    }
  } catch (e) {}

  // 2. Check Vite Environment Variables
  if (import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_PROJECT_ID) {
    return {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
      measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ''
    };
  }

  // 3. Built-in Production Cloud Database (Shared for all students across all devices)
  return DEFAULT_FIREBASE_CONFIG;
}

export function saveCustomFirebaseConfig(config) {
  if (!config) {
    localStorage.removeItem(CUSTOM_FIREBASE_KEY);
  } else {
    localStorage.setItem(CUSTOM_FIREBASE_KEY, JSON.stringify(config));
  }
}

const config = getActiveFirebaseConfig();

export const isFirebaseConfigured = Boolean(
  config.apiKey &&
  config.apiKey.trim() !== '' &&
  config.projectId &&
  config.projectId.trim() !== ''
);

let app = null;
let auth = null;
let db = null;

if (isFirebaseConfigured) {
  try {
    app = !getApps().length ? initializeApp(config) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    console.log('🟢 Firebase Cloud Firestore connected successfully for real-time multi-device sync');
  } catch (err) {
    console.warn('Firebase initialization error, running with local state fallback:', err);
  }
}

export { app, auth, db };
