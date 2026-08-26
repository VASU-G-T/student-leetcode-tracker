/**
 * Student Repository Synchronization Service
 * Orchestrates GitHub fetching, LeetCode problem parsing, duplicate elimination,
 * and database updates.
 */

import { fetchRepositoryFiles } from './githubService';
import { parseRepositoryTree } from './leetcodeParser';
import { parseGitHubRepoUrl } from '../utils/helpers';

/**
 * Synchronize a single student's GitHub repository
 * @param {Object} student - Student object with githubRepoUrl
 * @param {boolean} forceRefresh - Ignore local cache and force API fetch
 * @returns {Promise<Object>} Updated student data, problems array, and sync stats
 */
export async function syncStudentRepository(student, forceRefresh = false) {
  if (!student || !student.githubRepoUrl) {
    throw new Error('Student has no GitHub repository URL configured.');
  }

  const parsedUrl = parseGitHubRepoUrl(student.githubRepoUrl);
  if (!parsedUrl) {
    throw new Error(`Invalid GitHub repository URL: ${student.githubRepoUrl}`);
  }

  const { owner, repo } = parsedUrl;

  try {
    // 1. Fetch all files from repository
    const { files, repoInfo, fromCache } = await fetchRepositoryFiles(student.githubRepoUrl, forceRefresh);

    // 2. Parse problem files and eliminate duplicates
    const { problems, stats } = parseRepositoryTree(files, repoInfo);

    const now = new Date().toISOString();

    // 3. Construct updated student object
    const updatedStudent = {
      ...student,
      githubRepoOwner: owner,
      githubRepoName: repo,
      totalSolved: stats.totalSolved,
      easySolved: stats.easySolved,
      mediumSolved: stats.mediumSolved,
      hardSolved: stats.hardSolved,
      lastSynced: now,
      syncStatus: 'success',
      syncError: null
    };

    // 4. Determine newly detected solved problems
    const detectedProblems = problems.map(p => ({
      ...p,
      studentId: student.id,
      studentName: student.name
    }));

    return {
      student: updatedStudent,
      problems: detectedProblems,
      stats,
      fromCache,
      timestamp: now,
      success: true
    };
  } catch (error) {
    // Maintain existing stats on temporary sync failures
    const errorStudent = {
      ...student,
      lastSynced: new Date().toISOString(),
      syncStatus: 'failed',
      syncError: error.message || 'Sync failed'
    };

    return {
      student: errorStudent,
      problems: [],
      stats: {
        totalSolved: student.totalSolved || 0,
        easySolved: student.easySolved || 0,
        mediumSolved: student.mediumSolved || 0,
        hardSolved: student.hardSolved || 0
      },
      error: error.message || 'Unable to synchronize repository.',
      success: false
    };
  }
}

/**
 * Synchronize multiple students with rate limit throttling
 * @param {Array} students - Array of students
 * @param {Function} onProgress - Progress callback (completed, total, currentStudent)
 */
export async function syncAllStudents(students = [], onProgress = null) {
  const results = [];
  const total = students.length;

  for (let i = 0; i < total; i++) {
    const student = students[i];
    if (onProgress) {
      onProgress(i, total, student);
    }

    try {
      const result = await syncStudentRepository(student, true);
      results.push(result);
    } catch (err) {
      results.push({
        student: { ...student, syncStatus: 'failed', syncError: err.message },
        problems: [],
        error: err.message,
        success: false
      });
    }

    // Small delay between requests to avoid triggering secondary GitHub rate limits
    if (i < total - 1) {
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }

  if (onProgress) {
    onProgress(total, total, null);
  }

  return results;
}
