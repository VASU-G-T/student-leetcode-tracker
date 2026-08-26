/**
 * Universal Cloud Synchronization Service
 * Provides multi-device, real-time data sync across different browsers and emails.
 * Supports Firebase Firestore and Firebase Realtime Database with live listeners.
 */

import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { ref, onValue, set, push, remove, get } from 'firebase/database';
import { db, rtdb, isFirebaseConfigured } from './firebase';

/**
 * Sanitize object for Firebase Realtime Database / Firestore (no undefined or null values)
 */
export function sanitizeForCloud(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  return JSON.parse(JSON.stringify(obj, (key, value) => {
    if (value === undefined || value === null) return '';
    return value;
  }));
}

/**
 * Fetch all students from cloud once (for fast initial load)
 */
export async function fetchAllStudentsFromCloud() {
  if (!isFirebaseConfigured) return [];

  // 1. Try Realtime Database
  if (rtdb) {
    try {
      const snap = await get(ref(rtdb, 'students'));
      if (snap.exists()) {
        const val = snap.val();
        return Object.keys(val).map(k => ({ id: k, ...val[k] }));
      }
    } catch (e) {
      console.warn('Failed to fetch students from RTDB:', e);
    }
  }

  // 2. Try Firestore
  if (db) {
    try {
      const snap = await getDocs(collection(db, 'students'));
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      }
    } catch (e) {
      console.warn('Failed to fetch students from Firestore:', e);
    }
  }

  return [];
}

/**
 * Fetch all projects from cloud once
 */
export async function fetchAllProjectsFromCloud() {
  if (!isFirebaseConfigured) return {};

  if (rtdb) {
    try {
      const snap = await get(ref(rtdb, 'projects'));
      if (snap.exists()) {
        return snap.val() || {};
      }
    } catch (e) {}
  }

  if (db) {
    try {
      const snap = await getDocs(collection(db, 'projects'));
      if (!snap.empty) {
        const map = {};
        snap.docs.forEach(d => {
          map[d.id] = d.data()?.projects || [];
        });
        return map;
      }
    } catch (e) {}
  }

  return {};
}

/**
 * Setup real-time listener for students
 */
export function subscribeToStudents(onUpdate, onError) {
  if (!isFirebaseConfigured) return () => {};

  let unsubFirestore = () => {};
  let unsubRtdb = () => {};

  // 1. Listen via Realtime Database
  if (rtdb) {
    try {
      const studentsRef = ref(rtdb, 'students');
      unsubRtdb = onValue(studentsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const studentsList = Object.keys(data).map(k => ({ id: k, ...data[k] }));
          onUpdate(studentsList);
        } else {
          onUpdate([]);
        }
      }, (err) => {
        console.warn('RTDB students sync error:', err);
      });
    } catch (err) {}
  }

  // 2. Listen via Firestore
  if (db) {
    try {
      const studentsCol = collection(db, 'students');
      unsubFirestore = onSnapshot(studentsCol, (snapshot) => {
        if (!snapshot.empty) {
          const students = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          onUpdate(students);
        }
      }, (err) => {
        console.warn('Firestore students sync error:', err);
      });
    } catch (err) {}
  }

  return () => {
    unsubFirestore();
    unsubRtdb();
  };
}

/**
 * Push student to Cloud
 */
export async function syncStudentToCloud(studentId, studentData) {
  if (!isFirebaseConfigured) return;
  const cleanData = sanitizeForCloud(studentData);

  if (rtdb) {
    try {
      await set(ref(rtdb, `students/${studentId}`), cleanData);
      console.log('🟢 Student synced to RTDB:', studentId);
    } catch (e) {
      console.warn('RTDB student sync error:', e);
    }
  }

  if (db) {
    try {
      await setDoc(doc(db, 'students', studentId), cleanData, { merge: true });
    } catch (e) {
      console.warn('Firestore student sync error:', e);
    }
  }
}

/**
 * Delete student from Cloud
 */
export async function deleteStudentFromCloud(studentId) {
  if (!isFirebaseConfigured) return;

  if (rtdb) {
    try {
      await remove(ref(rtdb, `students/${studentId}`));
    } catch (e) {}
  }

  if (db) {
    try {
      await deleteDoc(doc(db, 'students', studentId));
      await deleteDoc(doc(db, 'projects', studentId));
    } catch (e) {}
  }
}

/**
 * Setup real-time listener for projects
 */
export function subscribeToProjects(onUpdate, onError) {
  if (!isFirebaseConfigured) return () => {};

  let unsubFirestore = () => {};
  let unsubRtdb = () => {};

  if (rtdb) {
    try {
      const projectsRef = ref(rtdb, 'projects');
      unsubRtdb = onValue(projectsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          onUpdate(data);
        }
      }, (err) => {});
    } catch (err) {}
  }

  if (db) {
    try {
      const projectsCol = collection(db, 'projects');
      unsubFirestore = onSnapshot(projectsCol, (snapshot) => {
        const projectsMap = {};
        snapshot.docs.forEach(d => {
          const data = d.data();
          const studentId = data.studentId || d.id;
          projectsMap[studentId] = data.projects || [];
        });
        if (Object.keys(projectsMap).length > 0) {
          onUpdate(projectsMap);
        }
      }, (err) => {});
    } catch (err) {}
  }

  return () => {
    unsubFirestore();
    unsubRtdb();
  };
}

/**
 * Push student projects to Cloud
 */
export async function syncProjectsToCloud(studentId, projectsList) {
  if (!isFirebaseConfigured) return;
  const cleanList = sanitizeForCloud(projectsList);

  if (rtdb) {
    try {
      await set(ref(rtdb, `projects/${studentId}`), cleanList);
    } catch (e) {}
  }

  if (db) {
    try {
      await setDoc(doc(db, 'projects', studentId), { studentId, projects: cleanList, updatedAt: new Date().toISOString() });
    } catch (e) {}
  }
}

/**
 * Setup real-time listener for settings
 */
export function subscribeToSettings(onUpdate, onError) {
  if (!isFirebaseConfigured) return () => {};

  let unsubFirestore = () => {};
  let unsubRtdb = () => {};

  if (rtdb) {
    try {
      const settingsRef = ref(rtdb, 'settings/global');
      unsubRtdb = onValue(settingsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) onUpdate(data);
      }, (err) => {});
    } catch (err) {}
  }

  if (db) {
    try {
      const settingsDocRef = doc(db, 'settings', 'global');
      unsubFirestore = onSnapshot(settingsDocRef, (docSnap) => {
        if (docSnap.exists()) {
          onUpdate(docSnap.data());
        }
      }, (err) => {});
    } catch (err) {}
  }

  return () => {
    unsubFirestore();
    unsubRtdb();
  };
}

/**
 * Setup real-time listener for live activity feed
 */
export function subscribeToActivities(onUpdate, onError) {
  if (!isFirebaseConfigured) return () => {};

  let unsubFirestore = () => {};
  let unsubRtdb = () => {};

  if (rtdb) {
    try {
      const actRef = ref(rtdb, 'activity');
      unsubRtdb = onValue(actRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const acts = Object.keys(data).map(k => ({ id: k, ...data[k] }));
          acts.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
          onUpdate(acts.slice(0, 30));
        }
      }, (err) => {});
    } catch (err) {}
  }

  if (db) {
    try {
      const actCol = collection(db, 'activity');
      unsubFirestore = onSnapshot(actCol, (snapshot) => {
        if (!snapshot.empty) {
          const acts = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          acts.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
          onUpdate(acts.slice(0, 30));
        }
      }, (err) => {});
    } catch (err) {}
  }

  return () => {
    unsubFirestore();
    unsubRtdb();
  };
}

/**
 * Test live connection to Firebase Cloud
 */
export async function testCloudConnection() {
  if (!isFirebaseConfigured) {
    return { connected: false, message: 'Firebase configuration is incomplete.' };
  }

  try {
    const testId = `ping_${Date.now()}`;
    const testPayload = { ping: true, timestamp: new Date().toISOString() };

    let success = false;

    if (rtdb) {
      await set(ref(rtdb, `_health/${testId}`), testPayload);
      await remove(ref(rtdb, `_health/${testId}`));
      success = true;
    }

    if (db) {
      await setDoc(doc(db, '_health', testId), testPayload);
      await deleteDoc(doc(db, '_health', testId));
      success = true;
    }

    if (success) {
      return { 
        connected: true, 
        message: '🟢 Real-Time Cloud Database Connected! Multi-device synchronization is fully active.' 
      };
    } else {
      return {
        connected: false,
        message: 'Could not write to Firebase database. Check rules permissions.'
      };
    }
  } catch (err) {
    return { 
      connected: false, 
      message: `Connection test error: ${err.message || err.toString()}` 
    };
  }
}
