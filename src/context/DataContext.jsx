import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  updateDoc, 
  query, 
  orderBy, 
  limit, 
  onSnapshot 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../services/firebase';
import { 
  INITIAL_STUDENTS, 
  INITIAL_SAMPLE_PROBLEMS, 
  INITIAL_ACTIVITY, 
  INITIAL_SETTINGS 
} from '../services/sampleData';
import { syncStudentRepository, syncAllStudents } from '../services/syncService';

const DataContext = createContext();

const STORAGE_KEYS = {
  STUDENTS: 'leettrack_students_v2',
  PROBLEMS: 'leettrack_problems_v2',
  ACTIVITY: 'leettrack_activity_v2',
  SETTINGS: 'leettrack_settings_v2',
  LAST_SYNC: 'leettrack_last_sync_v2'
};

export function DataProvider({ children }) {
  // State
  const [students, setStudents] = useState([]);
  const [problemsByStudent, setProblemsByStudent] = useState({});
  const [activities, setActivities] = useState([]);
  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  const [lastGlobalSync, setLastGlobalSync] = useState(null);
  
  // Sync Status
  const [syncingStudentId, setSyncingStudentId] = useState(null);
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [syncProgress, setSyncProgress] = useState({ current: 0, total: 0, currentName: '' });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
  };

  const clearToast = () => setToast(null);

  // Initialize data on mount
  useEffect(() => {
    // Clear old v1 demo keys if present
    try {
      localStorage.removeItem('leettrack_students_v1');
      localStorage.removeItem('leettrack_problems_v1');
      localStorage.removeItem('leettrack_activity_v1');
    } catch (e) {}

    const loadInitialData = async () => {
      try {
        if (isFirebaseConfigured && db) {
          // Firestore integration
          const studentsCol = collection(db, 'students');
          const studentSnapshot = await getDocs(studentsCol);
          
          if (!studentSnapshot.empty) {
            const fetchedStudents = studentSnapshot.docs
              .map(doc => ({ id: doc.id, ...doc.data() }))
              .filter(s => !s.isSample);
            setStudents(fetchedStudents);
          } else {
            setStudents([]);
          }

          // Fetch Settings
          const settingsDoc = await getDocs(collection(db, 'settings'));
          if (!settingsDoc.empty) {
            setSettings({ ...INITIAL_SETTINGS, ...settingsDoc.docs[0].data() });
          }

          // Fetch Activities
          const actQuery = query(collection(db, 'activity'), orderBy('timestamp', 'desc'), limit(20));
          const actSnapshot = await getDocs(actQuery);
          if (!actSnapshot.empty) {
            setActivities(actSnapshot.docs.map(d => ({ id: d.id, ...d.data() })));
          } else {
            setActivities([]);
          }
        } else {
          // Local storage mode
          const localStudents = localStorage.getItem(STORAGE_KEYS.STUDENTS);
          const localProblems = localStorage.getItem(STORAGE_KEYS.PROBLEMS);
          const localActivity = localStorage.getItem(STORAGE_KEYS.ACTIVITY);
          const localSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
          const localLastSync = localStorage.getItem(STORAGE_KEYS.LAST_SYNC);

          const parsedStudents = localStudents ? JSON.parse(localStudents).filter(s => !s.isSample) : [];
          setStudents(parsedStudents);
          setProblemsByStudent(localProblems ? JSON.parse(localProblems) : {});
          setActivities(localActivity ? JSON.parse(localActivity) : []);
          setSettings(localSettings ? JSON.parse(localSettings) : INITIAL_SETTINGS);
          setLastGlobalSync(localLastSync || null);
        }
      } catch (err) {
        console.error('Error loading data:', err);
        setStudents([]);
        setProblemsByStudent({});
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Save to LocalStorage whenever state updates (for fallback mode)
  useEffect(() => {
    if (!isFirebaseConfigured && !loading) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
      localStorage.setItem(STORAGE_KEYS.PROBLEMS, JSON.stringify(problemsByStudent));
      localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(activities));
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      if (lastGlobalSync) {
        localStorage.setItem(STORAGE_KEYS.LAST_SYNC, lastGlobalSync);
      }
    }
  }, [students, problemsByStudent, activities, settings, lastGlobalSync, loading]);

  /**
   * Add a new student
   */
  const addStudent = async (studentData) => {
    const studentId = `student_${Date.now()}`;
    const newStudent = {
      id: studentId,
      totalSolved: 0,
      easySolved: 0,
      mediumSolved: 0,
      hardSolved: 0,
      goal: studentData.goal ? parseInt(studentData.goal, 10) : settings.defaultGoal || 200,
      lastSynced: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...studentData
    };

    if (isFirebaseConfigured && db) {
      await setDoc(doc(db, 'students', studentId), newStudent);
    }

    const updated = [newStudent, ...students];
    setStudents(updated);
    showToast(`Student ${newStudent.name} added successfully!`, 'success');

    // Automatically trigger initial synchronization
    try {
      await syncStudent(studentId, updated);
    } catch (e) {
      console.warn('Initial sync warning:', e);
    }

    return newStudent;
  };

  /**
   * Update student details
   */
  const updateStudent = async (id, updatedFields) => {
    const now = new Date().toISOString();
    const updated = students.map(s => {
      if (s.id === id) {
        const repoChanged = updatedFields.githubRepoUrl && updatedFields.githubRepoUrl !== s.githubRepoUrl;
        return {
          ...s,
          ...updatedFields,
          updatedAt: now,
          ...(repoChanged ? { syncNotice: 'Repository changed. Run Sync to update progress.' } : {})
        };
      }
      return s;
    });

    if (isFirebaseConfigured && db) {
      await updateDoc(doc(db, 'students', id), { ...updatedFields, updatedAt: now });
    }

    setStudents(updated);
    showToast('Student information updated successfully', 'success');
  };

  /**
   * Delete student
   */
  const deleteStudent = async (id) => {
    const studentToDelete = students.find(s => s.id === id);
    if (!studentToDelete) return;

    if (isFirebaseConfigured && db) {
      await deleteDoc(doc(db, 'students', id));
    }

    const updatedStudents = students.filter(s => s.id !== id);
    setStudents(updatedStudents);

    // Clean up local problems
    setProblemsByStudent(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });

    showToast(`Student ${studentToDelete.name} deleted`, 'info');
  };

  /**
   * Synchronize a specific student
   */
  const syncStudent = async (id, currentStudentsList = null) => {
    const list = currentStudentsList || students;
    const targetStudent = list.find(s => s.id === id);
    if (!targetStudent) return;

    setSyncingStudentId(id);
    try {
      const syncResult = await syncStudentRepository(targetStudent, true);

      if (syncResult.success) {
        // Update student in state
        setStudents(prev => prev.map(s => s.id === id ? syncResult.student : s));

        // Update problems in state
        if (syncResult.problems && syncResult.problems.length > 0) {
          setProblemsByStudent(prev => ({
            ...prev,
            [id]: syncResult.problems
          }));

          // Add newly found problem to recent activity
          const latestProblem = syncResult.problems[syncResult.problems.length - 1];
          if (latestProblem) {
            const newActivity = {
              id: `act_${Date.now()}`,
              studentName: targetStudent.name,
              studentId: targetStudent.id,
              problemTitle: latestProblem.title,
              problemNumber: latestProblem.problemNumber,
              difficulty: latestProblem.difficulty,
              timestamp: new Date().toISOString(),
              type: 'solve'
            };
            setActivities(prev => [newActivity, ...prev.slice(0, 19)]);
          }
        }

        if (isFirebaseConfigured && db) {
          await updateDoc(doc(db, 'students', id), syncResult.student);
        }

        showToast(`✓ Synced ${targetStudent.name} (${syncResult.stats.totalSolved} problems detected)`, 'success');
      } else {
        setStudents(prev => prev.map(s => s.id === id ? syncResult.student : s));
        showToast(`✕ Sync failed for ${targetStudent.name}: ${syncResult.error}`, 'error');
      }
      return syncResult;
    } catch (err) {
      showToast(`Sync error: ${err.message}`, 'error');
    } finally {
      setSyncingStudentId(null);
    }
  };

  /**
   * Synchronize all students
   */
  const syncAll = async () => {
    if (students.length === 0) {
      showToast('No students to synchronize', 'info');
      return;
    }

    setIsSyncingAll(true);
    setSyncProgress({ current: 0, total: students.length, currentName: '' });

    try {
      const results = await syncAllStudents(students, (curr, total, student) => {
        setSyncProgress({
          current: curr,
          total,
          currentName: student ? student.name : ''
        });
      });

      // Update state with results
      const updatedMap = new Map();
      const newProblemsMap = { ...problemsByStudent };

      for (const r of results) {
        if (r.student) {
          updatedMap.set(r.student.id, r.student);
          if (r.problems && r.problems.length) {
            newProblemsMap[r.student.id] = r.problems;
          }
        }
      }

      setStudents(prev => prev.map(s => updatedMap.get(s.id) || s));
      setProblemsByStudent(newProblemsMap);
      
      const now = new Date().toISOString();
      setLastGlobalSync(now);

      const successful = results.filter(r => r.success).length;
      showToast(`✓ Sync All complete: ${successful}/${students.length} students synced`, 'success');
    } catch (err) {
      showToast(`Sync all encountered an error: ${err.message}`, 'error');
    } finally {
      setIsSyncingAll(false);
      setSyncProgress({ current: 0, total: 0, currentName: '' });
    }
  };

  /**
   * Look up student by id or slug (registerNumber or githubUsername)
   */
  const getStudentById = (idOrSlug) => {
    if (!idOrSlug) return null;
    const lower = idOrSlug.toLowerCase();
    return students.find(s => 
      s.id === idOrSlug ||
      (s.registerNumber && s.registerNumber.toLowerCase() === lower) ||
      (s.githubUsername && s.githubUsername.toLowerCase() === lower)
    );
  };

  /**
   * Get problems for a student
   */
  const getStudentProblems = (studentId) => {
    return problemsByStudent[studentId] || [];
  };

  /**
   * Update Settings
   */
  const updateSettings = async (newSettings) => {
    const merged = { ...settings, ...newSettings };
    setSettings(merged);
    if (isFirebaseConfigured && db) {
      await setDoc(doc(db, 'settings', 'global_config'), merged);
    }
    showToast('Settings updated successfully', 'success');
  };

  /**
   * Reset to Sample Data
   */
  const resetToSampleData = () => {
    setStudents(INITIAL_STUDENTS);
    setProblemsByStudent(INITIAL_SAMPLE_PROBLEMS);
    setActivities(INITIAL_ACTIVITY);
    setSettings(INITIAL_SETTINGS);
    setLastGlobalSync(new Date().toISOString());
    showToast('Sample students and data restored', 'info');
  };

  /**
   * Clear sample data
   */
  const clearSampleData = () => {
    setStudents(prev => prev.filter(s => !s.isSample));
    showToast('Sample students removed', 'info');
  };

  // Setup auto sync interval timer
  useEffect(() => {
    const minutes = settings.autoSyncInterval || 15;
    if (minutes <= 0) return;

    const intervalId = setInterval(() => {
      if (students.length > 0 && !isSyncingAll && !syncingStudentId) {
        console.log(`[Auto Sync] Running background sync every ${minutes} minutes...`);
        syncAll();
      }
    }, minutes * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [settings.autoSyncInterval, students.length, isSyncingAll, syncingStudentId]);

  const value = {
    students,
    problemsByStudent,
    activities,
    settings,
    lastGlobalSync,
    syncingStudentId,
    isSyncingAll,
    syncProgress,
    loading,
    toast,
    showToast,
    clearToast,
    addStudent,
    updateStudent,
    deleteStudent,
    syncStudent,
    syncAll,
    getStudentById,
    getStudentProblems,
    updateSettings,
    resetToSampleData,
    clearSampleData
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
