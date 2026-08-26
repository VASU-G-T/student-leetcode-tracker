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
import { ref, onValue, set, push, remove } from 'firebase/database';
import { db, rtdb, isFirebaseConfigured } from './firebase';

/**
 * Setup real-time listener for students
 */
export function subscribeToStudents(onUpdate, onError) {
  if (!isFirebaseConfigured) return () => {};

  let unsubFirestore = () => {};
  let unsubRtdb = () => {};

  // 1. Listen via Firestore
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

  // 2. Listen via Realtime Database
  if (rtdb) {
    try {
      const studentsRef = ref(rtdb, 'students');
      unsubRtdb = onValue(studentsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const studentsList = Object.keys(data).map(k => ({ id: k, ...data[k] }));
          onUpdate(studentsList);
        }
      }, (err) => {
        console.warn('RTDB students sync error:', err);
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

  if (db) {
    try {
      await setDoc(doc(db, 'students', studentId), studentData, { merge: true });
    } catch (e) {}
  }

  if (rtdb) {
    try {
      await set(ref(rtdb, `students/${studentId}`), studentData);
    } catch (e) {}
  }
}

/**
 * Delete student from Cloud
 */
export async function deleteStudentFromCloud(studentId) {
  if (!isFirebaseConfigured) return;

  if (db) {
    try {
      await deleteDoc(doc(db, 'students', studentId));
    } catch (e) {}
  }

  if (rtdb) {
    try {
      await remove(ref(rtdb, `students/${studentId}`));
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

  if (db) {
    try {
      await setDoc(doc(db, 'projects', studentId), { studentId, projects: projectsList, updatedAt: new Date().toISOString() });
    } catch (e) {}
  }

  if (rtdb) {
    try {
      await set(ref(rtdb, `projects/${studentId}`), projectsList);
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

  if (rtdb) {
    try {
      const settingsRef = ref(rtdb, 'settings/global');
      unsubRtdb = onValue(settingsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) onUpdate(data);
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
