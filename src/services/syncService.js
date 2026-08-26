/**
 * Student Repository Synchronization Service
 * Orchestrates GitHub fetching, LeetCode problem parsing, duplicate elimination,
 * exact GitHub README difficulty extraction, and database updates.
 */

import { fetchRepositoryFiles } from './githubService';
import { parseRepositoryTree, extractDifficultyFromReadme } from './leetcodeParser';
import { parseGitHubRepoUrl } from '../utils/helpers';

/**
 * Fetch raw file contents from GitHub without consuming API rate limits
 */
async function fetchRawFileContent(owner, repo, branch, filePath) {
  try {
    const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`;
    const res = await fetch(rawUrl);
    if (res.ok) {
      return await res.text();
    }
  } catch (e) {}
  return null;
}

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
    // 1. Fetch all files from repository tree
    const { files, repoInfo, fromCache } = await fetchRepositoryFiles(student.githubRepoUrl, forceRefresh);

    // 2. Parse problem files and eliminate duplicates
    const { problems, stats: initialStats } = parseRepositoryTree(files, repoInfo);

    // 3. Exact Difficulty Extraction from Problem README.md files
    const readmeFilesMap = new Map();
    for (const f of files) {
      const lower = (f.path || '').toLowerCase();
      if (lower.endsWith('/readme.md') || lower === 'readme.md') {
        readmeFilesMap.set(lower, f.path);
      }
    }

    const branch = repoInfo?.defaultBranch || 'main';
    const fetchPromises = problems.map(async (p) => {
      const folder = p.path.includes('/') ? p.path.slice(0, p.path.lastIndexOf('/')) : '';
      if (!folder) return;

      const expectedReadmePath = `${folder}/readme.md`.toLowerCase();
      const actualPath = readmeFilesMap.get(expectedReadmePath);
      if (actualPath) {
        const readmeText = await fetchRawFileContent(owner, repo, branch, actualPath);
        if (readmeText) {
          const exactDiff = extractDifficultyFromReadme(readmeText);
          if (exactDiff) {
            p.difficulty = exactDiff;
          }
        }
      }
    });

    // Run parallel fetch for exact difficulty badges
    await Promise.allSettled(fetchPromises);

    // 4. Recompute exact stats with verified difficulties
    let easySolved = 0;
    let mediumSolved = 0;
    let hardSolved = 0;

    for (const p of problems) {
      if (p.difficulty === 'Easy') easySolved++;
      else if (p.difficulty === 'Medium') mediumSolved++;
      else if (p.difficulty === 'Hard') hardSolved++;
    }

    const exactStats = {
      totalSolved: easySolved + mediumSolved + hardSolved,
      easySolved,
      mediumSolved,
      hardSolved
    };

    const now = new Date().toISOString();

    // 5. Construct updated student object
    const updatedStudent = {
      ...student,
      githubRepoOwner: owner,
      githubRepoName: repo,
      totalSolved: exactStats.totalSolved,
      easySolved: exactStats.easySolved,
      mediumSolved: exactStats.mediumSolved,
      hardSolved: exactStats.hardSolved,
      lastSynced: now,
      syncStatus: 'success',
      syncError: null
    };

    // 6. Determine newly detected solved problems
    const detectedProblems = problems.map(p => ({
      ...p,
      studentId: student.id,
      studentName: student.name
    }));

    return {
      student: updatedStudent,
      problems: detectedProblems,
      stats: exactStats,
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
      onProgress(i + 1, total, student);
    }

    try {
      const result = await syncStudentRepository(student, true);
      results.push(result);
    } catch (err) {
      results.push({
        student,
        problems: [],
        stats: {
          totalSolved: student.totalSolved || 0,
          easySolved: student.easySolved || 0,
          mediumSolved: student.mediumSolved || 0,
          hardSolved: student.hardSolved || 0
        },
        error: err.message,
        success: false
      });
    }

    // Brief throttle to avoid hammering raw CDN / API
    if (i < total - 1) {
      await new Promise(resolve => setTimeout(resolve, 250));
    }
  }

  return results;
}
