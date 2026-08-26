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
  subscribeToStudents, 
  subscribeToProjects, 
  subscribeToSettings, 
  subscribeToActivities 
} from '../services/cloudSync';
import { 
  INITIAL_STUDENTS, 
  INITIAL_SAMPLE_PROBLEMS, 
  INITIAL_ACTIVITY, 
  INITIAL_SETTINGS,
  CREATOR_PROFILE,
  CREATOR_PROJECTS
} from '../services/sampleData';
import { syncStudentRepository, syncAllStudents } from '../services/syncService';

const DataContext = createContext();

const STORAGE_KEYS = {
  STUDENTS: 'leettrack_students_v3',
  PROBLEMS: 'leettrack_problems_v3',
  ACTIVITY: 'leettrack_activity_v3',
  SETTINGS: 'leettrack_settings_v3',
  PROJECTS: 'leettrack_projects_v3',
  LAST_SYNC: 'leettrack_last_sync_v3'
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

  // Initialize data and setup Real-time Listeners
  useEffect(() => {
    let unsubStudents = () => {};
    let unsubProjects = () => {};
    let unsubSettings = () => {};
    let unsubActivities = () => {};

    const loadInitialData = async () => {
      try {
        // 1. Load from LocalStorage first for instant rendering
        const localStudents = localStorage.getItem(STORAGE_KEYS.STUDENTS);
        const localProblems = localStorage.getItem(STORAGE_KEYS.PROBLEMS);
        const localProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
        const localActivity = localStorage.getItem(STORAGE_KEYS.ACTIVITY);
        const localSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        const localLastSync = localStorage.getItem(STORAGE_KEYS.LAST_SYNC);

        let parsedStudents = localStudents ? JSON.parse(localStudents).filter(s => !s.isSample) : [];
        parsedStudents = parsedStudents.map(s => {
          if (!s.goal || s.goal === 200 || s.goal === 250) {
            return { ...s, goal: 4033 };
          }
          return s;
        });

        if (!parsedStudents.some(s => s.id === CREATOR_PROFILE.id || s.username === CREATOR_PROFILE.username || s.registerNumber === CREATOR_PROFILE.registerNumber)) {
          parsedStudents = [CREATOR_PROFILE, ...parsedStudents];
        }

        setStudents(parsedStudents);
        setProblemsByStudent(localProblems ? JSON.parse(localProblems) : {});

        let parsedProjects = localProjects ? JSON.parse(localProjects) : {};
        if (!parsedProjects[CREATOR_PROFILE.id]) {
          parsedProjects[CREATOR_PROFILE.id] = CREATOR_PROJECTS;
        }
        setProjectsByStudent(parsedProjects);
        setActivities(localActivity ? JSON.parse(localActivity) : []);
        setSettings(localSettings ? JSON.parse(localSettings) : INITIAL_SETTINGS);
        setLastGlobalSync(localLastSync || null);

        // 2. If Firebase Firestore is configured, setup Real-Time Cloud Listeners
        if (isFirebaseConfigured && db) {
          unsubStudents = subscribeToStudents((cloudStudents) => {
            if (cloudStudents && cloudStudents.length > 0) {
              const cleaned = cloudStudents.map(s => (!s.goal || s.goal === 200 || s.goal === 250) ? { ...s, goal: 4033 } : s);
              if (!cleaned.some(s => s.id === CREATOR_PROFILE.id || s.username === CREATOR_PROFILE.username)) {
                cleaned.unshift(CREATOR_PROFILE);
              }
              setStudents(cleaned);
            }
          });

          unsubProjects = subscribeToProjects((cloudProjects) => {
            if (cloudProjects && Object.keys(cloudProjects).length > 0) {
              setProjectsByStudent(prev => ({
                ...prev,
                ...cloudProjects,
                [CREATOR_PROFILE.id]: cloudProjects[CREATOR_PROFILE.id] || CREATOR_PROJECTS
              }));
            }
          });

          unsubSettings = subscribeToSettings((cloudSettings) => {
            if (cloudSettings) {
              setSettings(prev => ({ ...prev, ...cloudSettings }));
            }
          });

          unsubActivities = subscribeToActivities((cloudActivities) => {
            if (cloudActivities && cloudActivities.length > 0) {
              setActivities(cloudActivities);
            }
          });
        }
      } catch (err) {
        console.error('Error initializing data store:', err);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();

    return () => {
      unsubStudents();
      unsubProjects();
      unsubSettings();
      unsubActivities();
    };
  }, []);

  // Save to LocalStorage whenever state updates for seamless offline access
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
   * Add a new student record
   */
  const addStudent = async (studentData) => {
    // Check for duplicate register number
    const existing = students.find(
      s => s.registerNumber?.toUpperCase() === studentData.registerNumber?.trim().toUpperCase()
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
      accessStatus: studentData.accessStatus || 'active',
      totalSolved: 0,
      easySolved: 0,
      mediumSolved: 0,
      hardSolved: 0,
      goal: parseInt(studentData.goal, 10) || settings.defaultGoal || 4033,
      lastSynced: null,
      createdAt: new Date().toISOString()
    };

    // Push to Firestore in real-time
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'students', newId), newStudent);
      } catch (e) {
        console.warn('Firestore add student error:', e);
      }
    }

    setStudents(prev => [newStudent, ...prev]);

    // Record activity
    const newAct = {
      id: `act_${Date.now()}`,
      studentId: newId,
      studentName: newStudent.name,
      type: 'registration',
      message: `joined the platform from ${newStudent.department} - ${newStudent.section}`,
      timestamp: new Date().toISOString()
    };
    logActivity(newAct);

    showToast(`Student profile for ${newStudent.name} created!`, 'success');

    // Trigger initial repository sync in background
    syncStudent(newId).catch(() => {});

    return newStudent;
  };

  /**
   * Add multiple student records in bulk (up to 400+ students)
   */
  const addMultipleStudents = async (studentsList = []) => {
    const newStudents = [];
    const existingRegNos = new Set(students.map(s => s.registerNumber?.toUpperCase()));

    for (const item of studentsList) {
      const regUpper = (item.registerNumber || '').toUpperCase().trim();
      if (!regUpper || existingRegNos.has(regUpper)) continue;
      existingRegNos.add(regUpper);

      const newId = `student_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
      const newStudent = {
        id: newId,
        name: item.name,
        username: item.username || regUpper.toLowerCase(),
        registerNumber: regUpper,
        department: item.department || 'ECE',
        year: item.year || '2nd Year',
        section: item.section || 'Sec A',
        email: item.email || '',
        githubUsername: item.githubUsername || '',
        githubRepoUrl: item.githubRepoUrl || '',
        githubRepoOwner: item.githubRepoOwner || '',
        githubRepoName: item.githubRepoName || '',
        leetcodeUsername: item.leetcodeUsername || regUpper.toLowerCase(),
        profileImage: item.profileImage || `https://api.dicebear.com/7.x/bottts/svg?seed=${item.githubUsername || item.name}`,
        bio: item.bio || 'ECE Student • LeetCode & Developer',
        skills: item.skills || ['C++', 'Python', 'Java', 'DSA'],
        accessStatus: 'active',
        totalSolved: 0,
        easySolved: 0,
        mediumSolved: 0,
        hardSolved: 0,
        goal: parseInt(item.goal, 10) || settings.defaultGoal || 4033,
        lastSynced: null,
        createdAt: new Date().toISOString()
      };

      if (isFirebaseConfigured && db) {
        try {
          await setDoc(doc(db, 'students', newId), newStudent);
        } catch (e) {}
      }

      newStudents.push(newStudent);
    }

    setStudents(prev => [...newStudents, ...prev]);
    return newStudents;
  };

  /**
   * Update student details (Admin or profile owner)
   */
  const updateStudent = async (id, updatedData) => {
    const target = students.find(s => s.id === id);
    if (!target) return;

    const merged = { ...target, ...updatedData, updatedAt: new Date().toISOString() };

    // Push to Firestore in real-time
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'students', id), merged, { merge: true });
      } catch (e) {
        console.warn('Firestore update student error:', e);
      }
    }

    setStudents(prev => prev.map(s => s.id === id ? merged : s));
    showToast(`Updated student profile for ${merged.name}`, 'success');
    return merged;
  };

  /**
   * Update student profile (for self-editing student / creator)
   */
  const updateStudentProfile = async (id, profileData) => {
    return await updateStudent(id, profileData);
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
        await deleteDoc(doc(db, 'projects', id));
      } catch (e) {}
    }

    const updatedStudents = students.filter(s => s.id !== id);
    setStudents(updatedStudents);

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
  const addStudentProject = async (studentId, projectData) => {
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

    const existing = projectsByStudent[studentId] || [];
    const updatedProjects = [newProject, ...existing];

    setProjectsByStudent(prev => ({
      ...prev,
      [studentId]: updatedProjects
    }));

    // Real-time Cloud Save
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'projects', studentId), {
          studentId,
          projects: updatedProjects,
          updatedAt: new Date().toISOString()
        });
      } catch (e) {}
    }

    showToast(`Project "${newProject.title}" added to showcase!`, 'success');
    return newProject;
  };

  /**
   * Update an existing project
   */
  const updateStudentProject = async (studentId, projectId, projectData) => {
    const existing = projectsByStudent[studentId] || [];
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

    setProjectsByStudent(prev => ({
      ...prev,
      [studentId]: updated
    }));

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'projects', studentId), {
          studentId,
          projects: updated,
          updatedAt: new Date().toISOString()
        });
      } catch (e) {}
    }

    showToast('Project details updated successfully!', 'success');
  };

  /**
   * Delete a project
   */
  const deleteStudentProject = async (studentId, projectId) => {
    const existing = projectsByStudent[studentId] || [];
    const filtered = existing.filter(p => p.id !== projectId);

    setProjectsByStudent(prev => ({
      ...prev,
      [studentId]: filtered
    }));

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'projects', studentId), {
          studentId,
          projects: filtered,
          updatedAt: new Date().toISOString()
        });
      } catch (e) {}
    }

    showToast('Project removed from showcase', 'info');
  };

  /**
   * Get student projects list
   */
  const getStudentProjects = useCallback((studentId) => {
    if (!studentId) return [];
    if (projectsByStudent[studentId]) {
      return projectsByStudent[studentId];
    }
    if (studentId === CREATOR_PROFILE.id || studentId === 'vasu_gt_creator') {
      return CREATOR_PROJECTS;
    }
    return [];
  }, [projectsByStudent]);

  /**
   * Synchronize single student GitHub repo
   */
  const syncStudent = async (id, force = true) => {
    const student = students.find(s => s.id === id);
    if (!student) return;

    setSyncingStudentId(id);
    try {
      const syncResult = await syncStudentRepository(student, force);

      if (syncResult.success) {
        setStudents(prev => prev.map(s => s.id === id ? syncResult.student : s));

        setProblemsByStudent(prev => ({
          ...prev,
          [id]: syncResult.problems
        }));

        // Real-time Cloud Save
        if (isFirebaseConfigured && db) {
          try {
            await setDoc(doc(db, 'students', id), syncResult.student, { merge: true });
          } catch (e) {}
        }

        showToast(`Synced ${syncResult.stats.totalSolved} problems for ${student.name}`, 'success');
      } else {
        showToast(syncResult.error || `Sync failed for ${student.name}`, 'error');
      }

      return syncResult;
    } catch (err) {
      showToast(`Sync failed: ${err.message}`, 'error');
    } finally {
      setSyncingStudentId(null);
    }
  };

  /**
   * Synchronize all students
   */
  const syncAll = async () => {
    if (isSyncingAll || students.length === 0) return;

    setIsSyncingAll(true);
    setSyncProgress({ current: 0, total: students.length, currentName: '' });

    try {
      const results = await syncAllStudents(students, (curr, tot, curStudent) => {
        setSyncProgress({
          current: curr,
          total: tot,
          currentName: curStudent?.name || ''
        });
      });

      const updatedMap = new Map();
      const newProblemsMap = { ...problemsByStudent };

      results.forEach(res => {
        if (res.student) {
          updatedMap.set(res.student.id, res.student);
          if (res.problems && res.problems.length > 0) {
            newProblemsMap[res.student.id] = res.problems;
          }
        }
      });

      const now = new Date().toISOString();
      setStudents(prev => prev.map(s => updatedMap.get(s.id) || s));
      setProblemsByStudent(newProblemsMap);
      setLastGlobalSync(now);

      showToast(`Global sync completed for ${results.length} students`, 'success');
    } catch (err) {
      showToast(`Sync all encountered errors: ${err.message}`, 'error');
    } finally {
      setIsSyncingAll(false);
      setSyncProgress({ current: 0, total: 0, currentName: '' });
    }
  };

  /**
   * Update app settings
   */
  const updateSettings = async (newSettings) => {
    const merged = { ...settings, ...newSettings };
    setSettings(merged);

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'settings', 'global'), merged, { merge: true });
      } catch (e) {}
    }

    showToast('Platform settings saved successfully!', 'success');
  };

  /**
   * Log platform activity
   */
  const logActivity = async (activityItem) => {
    const act = {
      id: activityItem.id || `act_${Date.now()}`,
      ...activityItem,
      timestamp: activityItem.timestamp || new Date().toISOString()
    };

    setActivities(prev => [act, ...prev.slice(0, 29)]);

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'activity', act.id), act);
      } catch (e) {}
    }
  };

  const getStudentById = useCallback((id) => {
    return students.find(s => s.id === id || s.registerNumber?.toLowerCase() === id?.toLowerCase() || s.username?.toLowerCase() === id?.toLowerCase());
  }, [students]);

  const getProblemsByStudentId = useCallback((id) => {
    if (problemsByStudent[id]) return problemsByStudent[id];
    return [];
  }, [problemsByStudent]);

  return (
    <DataContext.Provider
      value={{
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
        addMultipleStudents,
        updateStudent,
        updateStudentProfile,
        updateStudentAccess,
        deleteStudent,
        getStudentById,
        getProblemsByStudentId,
        getStudentProjects,
        addStudentProject,
        updateStudentProject,
        deleteStudentProject,
        syncStudent,
        syncAll,
        updateSettings,
        logActivity
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
