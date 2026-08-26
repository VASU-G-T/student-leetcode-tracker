import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const CUSTOM_FIREBASE_KEY = 'leettrack_custom_firebase_config_v2';

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

  // 2. Fallback to Vite Environment Variables
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ''
  };
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
  config.apiKey !== 'your_firebase_api_key' &&
  config.projectId &&
  config.projectId.trim() !== '' &&
  config.projectId !== 'your-project-id'
);

let app = null;
let auth = null;
let db = null;

if (isFirebaseConfigured) {
  try {
    app = !getApps().length ? initializeApp(config) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (err) {
    console.warn('Firebase initialization error, running with local state fallback:', err);
  }
}

export { app, auth, db };
