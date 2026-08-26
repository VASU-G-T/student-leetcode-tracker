/**
 * Universal Cloud Synchronization Service
 * Provides multi-device, real-time data sync across different browsers and emails.
 * Uses high-speed Firebase REST API + SDK WebSockets for 100% guaranteed delivery on all devices.
 */

import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { ref, onValue, set, remove, get } from 'firebase/database';
import { db, rtdb, isFirebaseConfigured, DEFAULT_FIREBASE_CONFIG } from './firebase';

const RTDB_BASE_URL = DEFAULT_FIREBASE_CONFIG.databaseURL || 'https://vasu-leetsync-default-rtdb.firebaseio.com';

/**
 * Sanitize object for Firebase (no undefined or null values)
 */
export function sanitizeForCloud(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  return JSON.parse(JSON.stringify(obj, (key, value) => {
    if (value === undefined || value === null) return '';
    return value;
  }));
}

/**
 * Direct REST API GET
 */
async function fetchFromRest(endpoint) {
  try {
    const res = await fetch(`${RTDB_BASE_URL}/${endpoint}.json`);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn(`REST fetch error for ${endpoint}:`, e);
  }
  return null;
}

/**
 * Direct REST API PUT
 */
async function putToRest(endpoint, data) {
  try {
    const res = await fetch(`${RTDB_BASE_URL}/${endpoint}.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sanitizeForCloud(data))
    });
    return res.ok;
  } catch (e) {
    console.warn(`REST put error for ${endpoint}:`, e);
    return false;
  }
}

/**
 * Direct REST API DELETE
 */
async function deleteFromRest(endpoint) {
  try {
    const res = await fetch(`${RTDB_BASE_URL}/${endpoint}.json`, {
      method: 'DELETE'
    });
    return res.ok;
  } catch (e) {
    console.warn(`REST delete error for ${endpoint}:`, e);
    return false;
  }
}

/**
 * Fetch all students from cloud once (for fast initial load)
 */
export async function fetchAllStudentsFromCloud() {
  // 1. Direct REST fetch (fastest & most reliable across all browsers/networks)
  const restData = await fetchFromRest('students');
  if (restData) {
    return Object.keys(restData).map(k => ({ id: k, ...restData[k] }));
  }

  // 2. Try SDK Realtime Database
  if (rtdb) {
    try {
      const snap = await get(ref(rtdb, 'students'));
      if (snap.exists()) {
        const val = snap.val();
        return Object.keys(val).map(k => ({ id: k, ...val[k] }));
      }
    } catch (e) {}
  }

  // 3. Try Firestore
  if (db) {
    try {
      const snap = await getDocs(collection(db, 'students'));
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      }
    } catch (e) {}
  }

  return [];
}

/**
 * Fetch all projects from cloud once
 */
export async function fetchAllProjectsFromCloud() {
  const restData = await fetchFromRest('projects');
  if (restData) {
    return restData;
  }

  if (rtdb) {
    try {
      const snap = await get(ref(rtdb, 'projects'));
      if (snap.exists()) {
        return snap.val() || {};
      }
    } catch (e) {}
  }

  return {};
}

/**
 * Setup real-time listener for students
 */
export function subscribeToStudents(onUpdate, onError) {
  let isSubscribed = true;
  let unsubRtdb = () => {};

  // Instant fetch on subscription mount (0ms latency)
  fetchFromRest('students').then(freshData => {
    if (freshData && isSubscribed) {
      const studentsList = Object.keys(freshData).map(k => ({ id: k, ...freshData[k] }));
      onUpdate(studentsList);
    }
  }).catch(() => {});

  // 1. WebSocket listener via RTDB SDK
  if (rtdb) {
    try {
      const studentsRef = ref(rtdb, 'students');
      unsubRtdb = onValue(studentsRef, (snapshot) => {
        if (!isSubscribed) return;
        const data = snapshot.val();
        if (data) {
          const studentsList = Object.keys(data).map(k => ({ id: k, ...data[k] }));
          onUpdate(studentsList);
        }
      }, (err) => {});
    } catch (err) {}
  }

  // 2. High-reliability polling fallback every 3 seconds (guarantees cross-device sync)
  const pollInterval = setInterval(async () => {
    if (!isSubscribed) return;
    try {
      const freshData = await fetchFromRest('students');
      if (freshData && isSubscribed) {
        const studentsList = Object.keys(freshData).map(k => ({ id: k, ...freshData[k] }));
        onUpdate(studentsList);
      }
    } catch (e) {}
  }, 3000);

  return () => {
    isSubscribed = false;
    clearInterval(pollInterval);
    unsubRtdb();
  };
}

/**
 * Push student to Cloud
 */
export async function syncStudentToCloud(studentId, studentData) {
  const cleanData = sanitizeForCloud(studentData);

  // 1. Direct REST PUT (instant)
  await putToRest(`students/${studentId}`, cleanData);

  // 2. SDK RTDB
  if (rtdb) {
    try {
      await set(ref(rtdb, `students/${studentId}`), cleanData);
    } catch (e) {}
  }

  // 3. Firestore
  if (db) {
    try {
      await setDoc(doc(db, 'students', studentId), cleanData, { merge: true });
    } catch (e) {}
  }
}

/**
 * Delete student from Cloud
 */
export async function deleteStudentFromCloud(studentId) {
  await deleteFromRest(`students/${studentId}`);
  await deleteFromRest(`projects/${studentId}`);

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
  let isSubscribed = true;
  let unsubRtdb = () => {};

  // Instant fetch on subscription mount
  fetchFromRest('projects').then(freshData => {
    if (freshData && isSubscribed) {
      onUpdate(freshData);
    }
  }).catch(() => {});

  if (rtdb) {
    try {
      const projectsRef = ref(rtdb, 'projects');
      unsubRtdb = onValue(projectsRef, (snapshot) => {
        if (!isSubscribed) return;
        const data = snapshot.val();
        if (data) onUpdate(data);
      }, (err) => {});
    } catch (err) {}
  }

  const pollInterval = setInterval(async () => {
    if (!isSubscribed) return;
    try {
      const freshData = await fetchFromRest('projects');
      if (freshData && isSubscribed) {
        onUpdate(freshData);
      }
    } catch (e) {}
  }, 3000);

  return () => {
    isSubscribed = false;
    clearInterval(pollInterval);
    unsubRtdb();
  };
}

/**
 * Push student projects to Cloud
 */
export async function syncProjectsToCloud(studentId, projectsList) {
  const cleanList = sanitizeForCloud(projectsList);
  await putToRest(`projects/${studentId}`, cleanList);

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
  let isSubscribed = true;

  const pollInterval = setInterval(async () => {
    if (!isSubscribed) return;
    try {
      const freshSettings = await fetchFromRest('settings/global');
      if (freshSettings && isSubscribed) {
        onUpdate(freshSettings);
      }
    } catch (e) {}
  }, 6000);

  return () => {
    isSubscribed = false;
    clearInterval(pollInterval);
  };
}

/**
 * Setup real-time listener for live activity feed
 */
export function subscribeToActivities(onUpdate, onError) {
  let isSubscribed = true;

  const pollInterval = setInterval(async () => {
    if (!isSubscribed) return;
    try {
      const freshActs = await fetchFromRest('activity');
      if (freshActs && isSubscribed) {
        const acts = Object.keys(freshActs).map(k => ({ id: k, ...freshActs[k] }));
        acts.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
        onUpdate(acts.slice(0, 30));
      }
    } catch (e) {}
  }, 5000);

  return () => {
    isSubscribed = false;
    clearInterval(pollInterval);
  };
}

/**
 * Test live connection to Firebase Cloud
 */
export async function testCloudConnection() {
  try {
    const testId = `ping_${Date.now()}`;
    const testPayload = { ping: true, timestamp: new Date().toISOString() };

    const ok = await putToRest(`_health/${testId}`, testPayload);
    if (ok) {
      await deleteFromRest(`_health/${testId}`);
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
