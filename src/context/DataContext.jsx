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
  PROJECTS: 'leettrack_projects_v2',
  LAST_SYNC: 'leettrack_last_sync_v2'
};

export function DataProvider({ children }) {
  // State
  const [students, setStudents] = useState([]);
  const [problemsByStudent, setProblemsByStudent] = useState({});
  const [projectsByStudent, setProjectsByStudent] = useState({});
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

          // Load local projects
          const localProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
          if (localProjects) {
            setProjectsByStudent(JSON.parse(localProjects));
          }
        } else {
          // Local storage mode
          const localStudents = localStorage.getItem(STORAGE_KEYS.STUDENTS);
          const localProblems = localStorage.getItem(STORAGE_KEYS.PROBLEMS);
          const localProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
          const localActivity = localStorage.getItem(STORAGE_KEYS.ACTIVITY);
          const localSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
          const localLastSync = localStorage.getItem(STORAGE_KEYS.LAST_SYNC);

          const parsedStudents = localStudents ? JSON.parse(localStudents).filter(s => !s.isSample) : [];
          setStudents(parsedStudents);
          setProblemsByStudent(localProblems ? JSON.parse(localProblems) : {});
          setProjectsByStudent(localProjects ? JSON.parse(localProjects) : {});
          setActivities(localActivity ? JSON.parse(localActivity) : []);
          setSettings(localSettings ? JSON.parse(localSettings) : INITIAL_SETTINGS);
          setLastGlobalSync(localLastSync || null);
        }
      } catch (err) {
        console.error('Error loading data:', err);
        setStudents([]);
        setProblemsByStudent({});
        setProjectsByStudent({});
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Save to LocalStorage whenever state updates
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
      localStorage.setItem(STORAGE_KEYS.PROBLEMS, JSON.stringify(problemsByStudent));
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projectsByStudent));
      localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(activities));
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      if (lastGlobalSync) {
        localStorage.setItem(STORAGE_KEYS.LAST_SYNC, lastGlobalSync);
      }
    }
  }, [students, problemsByStudent, projectsByStudent, activities, settings, lastGlobalSync, loading]);

  /**
   * Add a new student
   */
  const addStudent = async (studentData) => {
    // Check for duplicate register number
    const existing = students.find(
      s => s.registerNumber.toLowerCase() === studentData.registerNumber.toLowerCase()
    );
    if (existing) {
      throw new Error(`A student with register number "${studentData.registerNumber}" already exists.`);
    }

    const newId = `student_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const newStudent = {
      id: newId,
      name: studentData.name,
      username: studentData.username || studentData.registerNumber.toLowerCase(),
      registerNumber: studentData.registerNumber.toUpperCase(),
      department: studentData.department || 'ECE',
      year: studentData.year || '2nd Year',
      section: studentData.section || 'Sec A',
      email: studentData.email || '',
      githubUsername: studentData.githubUsername || '',
      githubRepoUrl: studentData.githubRepoUrl || '',
      githubRepoOwner: studentData.githubRepoOwner || '',
      githubRepoName: studentData.githubRepoName || '',
      leetcodeUsername: studentData.leetcodeUsername || '',
      profileImage: studentData.profileImage || `https://api.dicebear.com/7.x/bottts/svg?seed=${studentData.githubUsername || studentData.name}`,
      bio: studentData.bio || 'ECE Student • LeetCode & Developer',
      skills: studentData.skills || ['C++', 'Python', 'Java', 'Data Structures', 'Algorithms'],
      accessStatus: studentData.accessStatus || 'active', // 'active', 'approved', 'pending', 'suspended'
      totalSolved: 0,
      easySolved: 0,
      mediumSolved: 0,
      hardSolved: 0,
      goal: parseInt(studentData.goal, 10) || 200,
      lastSynced: null,
      createdAt: new Date().toISOString()
    };

    if (isFirebaseConfigured && db) {
      await setDoc(doc(db, 'students', newId), newStudent);
    }

    const updatedList = [newStudent, ...students];
    setStudents(updatedList);
    showToast(`Student ${newStudent.name} registered successfully!`, 'success');

    // Trigger initial repository sync in background
    if (newStudent.githubRepoUrl) {
      setTimeout(() => {
        syncStudent(newId, updatedList);
      }, 500);
    }

    return newStudent;
  };

  /**
   * Update student profile details (photo, bio, skills, repo, info)
   */
  const updateStudentProfile = async (id, updatedFields) => {
    const targetStudent = students.find(s => s.id === id);
    if (!targetStudent) return;

    const merged = { ...targetStudent, ...updatedFields, updatedAt: new Date().toISOString() };

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'students', id), merged, { merge: true });
      } catch (e) {
        console.warn('Firestore update error:', e);
      }
    }

    const updatedStudents = students.map(s => s.id === id ? merged : s);
    setStudents(updatedStudents);
    showToast('Profile updated successfully!', 'success');

    // If repo URL was changed, re-sync repository
    if (updatedFields.githubRepoUrl && updatedFields.githubRepoUrl !== targetStudent.githubRepoUrl) {
      setTimeout(() => {
        syncStudent(id, updatedStudents);
      }, 500);
    }

    return merged;
  };

  /**
   * Update Student (Admin form)
   */
  const updateStudent = async (id, studentData) => {
    return updateStudentProfile(id, studentData);
  };

  /**
   * Update student access status (approved, active, suspended)
   */
  const updateStudentAccess = async (id, accessStatus) => {
    const target = students.find(s => s.id === id);
    if (!target) return;
    const updated = { ...target, accessStatus };
    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, 'students', id), { accessStatus });
      } catch (e) {}
    }
    setStudents(prev => prev.map(s => s.id === id ? updated : s));
    showToast(`Access status updated for ${target.name}: ${accessStatus}`, 'info');
  };

  /**
   * Delete student
   */
  const deleteStudent = async (id) => {
    const studentToDelete = students.find(s => s.id === id);
    if (!studentToDelete) return;

    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'students', id));
      } catch (e) {}
    }

    const updatedStudents = students.filter(s => s.id !== id);
    setStudents(updatedStudents);

    // Clean up local problems & projects
    setProblemsByStudent(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });

    setProjectsByStudent(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });

    showToast(`Student profile ${studentToDelete.name} deleted`, 'info');
  };

  /**
   * Add a project to a student profile (unlimited projects)
   */
  const addStudentProject = (studentId, projectData) => {
    const projectId = `proj_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const newProject = {
      id: projectId,
      title: projectData.title.trim(),
      description: projectData.description.trim(),
      techStack: Array.isArray(projectData.techStack) ? projectData.techStack : (projectData.techStack || '').split(',').map(s => s.trim()).filter(Boolean),
      githubUrl: (projectData.githubUrl || '').trim(),
      liveUrl: (projectData.liveUrl || '').trim(),
      imageUrl: projectData.imageUrl || '',
      category: projectData.category || 'Web / Software',
      createdAt: new Date().toISOString()
    };

    setProjectsByStudent(prev => {
      const existing = prev[studentId] || [];
      return {
        ...prev,
        [studentId]: [newProject, ...existing]
      };
    });

    showToast(`Project "${newProject.title}" added to showcase!`, 'success');
    return newProject;
  };

  /**
   * Update an existing project
   */
  const updateStudentProject = (studentId, projectId, projectData) => {
    setProjectsByStudent(prev => {
      const existing = prev[studentId] || [];
      const updated = existing.map(p => {
        if (p.id === projectId) {
          return {
            ...p,
            ...projectData,
            techStack: Array.isArray(projectData.techStack) ? projectData.techStack : (projectData.techStack || '').split(',').map(s => s.trim()).filter(Boolean),
            updatedAt: new Date().toISOString()
          };
        }
        return p;
      });
      return {
        ...prev,
        [studentId]: updated
      };
    });

    showToast('Project details updated', 'success');
  };

  /**
   * Delete a project from student profile
   */
  const deleteStudentProject = (studentId, projectId) => {
    setProjectsByStudent(prev => {
      const existing = prev[studentId] || [];
      return {
        ...prev,
        [studentId]: existing.filter(p => p.id !== projectId)
      };
    });

    showToast('Project removed from showcase', 'info');
  };

  /**
   * Get all projects for a student
   */
  const getStudentProjects = (studentId) => {
    return projectsByStudent[studentId] || [];
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
        setStudents(prev => prev.map(s => s.id === id ? syncResult.student : s));

        if (syncResult.problems && syncResult.problems.length > 0) {
          setProblemsByStudent(prev => ({
            ...prev,
            [id]: syncResult.problems
          }));

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
   * Look up student by id or slug (registerNumber, username, or githubUsername)
   */
  const getStudentById = (idOrSlug) => {
    if (!idOrSlug) return null;
    const lower = idOrSlug.toLowerCase();
    return students.find(s => 
      s.id === idOrSlug ||
      (s.username && s.username.toLowerCase() === lower) ||
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

  // Setup auto sync interval timer
  useEffect(() => {
    const minutes = settings.autoSyncInterval || 15;
    if (minutes <= 0) return;

    const intervalId = setInterval(() => {
      if (students.length > 0 && !isSyncingAll && !syncingStudentId) {
        syncAll();
      }
    }, minutes * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [settings.autoSyncInterval, students.length, isSyncingAll, syncingStudentId]);

  const value = {
    students,
    problemsByStudent,
    projectsByStudent,
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
    updateStudentProfile,
    updateStudentAccess,
    deleteStudent,
    addStudentProject,
    updateStudentProject,
    deleteStudentProject,
    getStudentProjects,
    syncStudent,
    syncAll,
    getStudentById,
    getStudentProblems,
    updateSettings
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
