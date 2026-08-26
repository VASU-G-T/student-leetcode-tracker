/**
 * Universal Cloud Synchronization Service
 * Provides multi-device, real-time data sync across different browsers and emails.
 * Supports Firebase Firestore real-time listeners (onSnapshot) and redundant cloud state broadcast.
 */

import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';

const GLOBAL_SYNC_CHANNEL_KEY = 'leettrack_global_cloud_channel_v1';

/**
 * Setup real-time listener for students collection
 */
export function subscribeToStudents(onUpdate, onError) {
  if (!isFirebaseConfigured || !db) return () => {};

  try {
    const studentsCol = collection(db, 'students');
    const unsubscribe = onSnapshot(studentsCol, (snapshot) => {
      const students = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      onUpdate(students);
    }, (err) => {
      console.warn('Students real-time sync listener error:', err);
      if (onError) onError(err);
    });

    return unsubscribe;
  } catch (err) {
    console.warn('Failed to subscribe to students:', err);
    return () => {};
  }
}

/**
 * Setup real-time listener for projects collection
 */
export function subscribeToProjects(onUpdate, onError) {
  if (!isFirebaseConfigured || !db) return () => {};

  try {
    const projectsCol = collection(db, 'projects');
    const unsubscribe = onSnapshot(projectsCol, (snapshot) => {
      const projectsMap = {};
      snapshot.docs.forEach(d => {
        const data = d.data();
        const studentId = data.studentId || d.id;
        projectsMap[studentId] = data.projects || [];
      });
      onUpdate(projectsMap);
    }, (err) => {
      console.warn('Projects real-time sync listener error:', err);
      if (onError) onError(err);
    });

    return unsubscribe;
  } catch (err) {
    console.warn('Failed to subscribe to projects:', err);
    return () => {};
  }
}

/**
 * Setup real-time listener for global application settings
 */
export function subscribeToSettings(onUpdate, onError) {
  if (!isFirebaseConfigured || !db) return () => {};

  try {
    const settingsDocRef = doc(db, 'settings', 'global');
    const unsubscribe = onSnapshot(settingsDocRef, (docSnap) => {
      if (docSnap.exists()) {
        onUpdate(docSnap.data());
      }
    }, (err) => {
      console.warn('Settings real-time sync listener error:', err);
      if (onError) onError(err);
    });

    return unsubscribe;
  } catch (err) {
    console.warn('Failed to subscribe to settings:', err);
    return () => {};
  }
}

/**
 * Setup real-time listener for live activity feed
 */
export function subscribeToActivities(onUpdate, onError) {
  if (!isFirebaseConfigured || !db) return () => {};

  try {
    const actQuery = query(collection(db, 'activity'), orderBy('timestamp', 'desc'), limit(30));
    const unsubscribe = onSnapshot(actQuery, (snapshot) => {
      const activities = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      onUpdate(activities);
    }, (err) => {
      console.warn('Activities real-time sync listener error:', err);
      if (onError) onError(err);
    });

    return unsubscribe;
  } catch (err) {
    console.warn('Failed to subscribe to activities:', err);
    return () => {};
  }
}

/**
 * Test Firebase Firestore Cloud Connection
 */
export async function testCloudConnection() {
  if (!isFirebaseConfigured || !db) {
    return {
      connected: false,
      message: 'Firebase is not configured yet. Add your Firebase credentials in Admin Settings to activate real-time cloud sync.'
    };
  }

  try {
    const pingRef = doc(db, 'system', 'connection_ping');
    await setDoc(pingRef, {
      lastPing: new Date().toISOString(),
      status: 'active'
    });
    return {
      connected: true,
      message: '✓ Real-time Cloud Database connected successfully! Changes are synced instantly across all browsers, emails, and devices.'
    };
  } catch (err) {
    return {
      connected: false,
      message: `Connection test failed: ${err.message}`
    };
  }
}
