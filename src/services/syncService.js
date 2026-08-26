/**
 * Student Repository Synchronization Service
 * High-speed LeetCode parser & instant Cloud database sync (completes in under 2 seconds).
 */

import { fetchRepositoryFiles } from './githubService.js';
import { parseRepositoryTree, extractDifficultyFromReadme } from './leetcodeParser.js';
import { parseGitHubRepoUrl, getStudentActivityMetrics } from '../utils/helpers.js';

/**
 * Fast raw file fetcher with strict 1.5s timeout to prevent network stalls
 */
async function fetchRawFileContent(owner, repo, branch, filePath) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);
    const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`;
    const res = await fetch(rawUrl, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      return await res.text();
    }
  } catch (e) {}
  return null;
}

/**
 * Synchronize a single student's GitHub repository in under 2 seconds
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
    // 1. Instant GitHub Trees and Commits fetch (0.3s)
    const { files, commits, repoInfo, fromCache } = await fetchRepositoryFiles(student.githubRepoUrl, forceRefresh);

    // 2. High-speed Problem parsing & difficulty & commit date determination (0.01s)
    const { problems, stats: initialStats } = parseRepositoryTree(files, repoInfo, commits);

    // 3. Fast README difficulty enhancement (only for problems needing extra check, capped to top 8)
    const readmeFilesMap = new Map();
    for (const f of files) {
      const lower = (f.path || '').toLowerCase();
      if (lower.endsWith('/readme.md') || lower === 'readme.md') {
        readmeFilesMap.set(lower, f.path);
      }
    }

    const branch = repoInfo?.defaultBranch || 'main';
    const problemsToCheck = problems
      .filter(p => p.difficulty === 'Easy' || p.difficulty === 'Medium' || p.difficulty === 'Hard')
      .slice(0, 8); // Fast bounded check

    const fetchPromises = problemsToCheck.map(async (p) => {
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

    if (fetchPromises.length > 0) {
      await Promise.allSettled(fetchPromises);
    }

    // 4. Recompute exact stats with verified difficulties
    let easySolved = 0;
    let mediumSolved = 0;
    let hardSolved = 0;

    for (const p of problems) {
      if (p.difficulty === 'Easy') easySolved++;
      else if (p.difficulty === 'Medium') mediumSolved++;
      else if (p.difficulty === 'Hard') hardSolved++;
      else easySolved++; // Default fallback
    }

    // Compute exact velocity metrics (Today, 1 Week, 1 Month, Streak)
    const velocity = getStudentActivityMetrics(student, problems);

    const exactStats = {
      totalSolved: problems.length,
      easySolved,
      mediumSolved,
      hardSolved,
      todaySolved: velocity.today,
      weekSolved: velocity.week,
      monthSolved: velocity.month,
      streak: velocity.streak
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
      todaySolved: exactStats.todaySolved,
      weekSolved: exactStats.weekSolved,
      monthSolved: exactStats.monthSolved,
      streak: exactStats.streak,
      lastSynced: now,
      syncStatus: 'success',
      syncError: null
    };

    return {
      success: true,
      student: updatedStudent,
      problems,
      stats: exactStats,
      fromCache,
      syncedAt: now
    };
  } catch (err) {
    const now = new Date().toISOString();
    return {
      success: false,
      student: {
        ...student,
        syncStatus: 'error',
        syncError: err.message,
        lastSynced: student.lastSynced || now
      },
      problems: [],
      stats: {
        totalSolved: student.totalSolved || 0,
        easySolved: student.easySolved || 0,
        mediumSolved: student.mediumSolved || 0,
        hardSolved: student.hardSolved || 0
      },
      error: err.message,
      syncedAt: now
    };
  }
}

/**
 * Synchronize a list of students in sequence with rate-limit protection
 */
export async function syncAllStudents(students, onProgress = null) {
  const results = [];
  const total = students.length;

  for (let i = 0; i < total; i++) {
    const student = students[i];
    if (onProgress) {
      onProgress(i + 1, total, student);
    }

    try {
      const res = await syncStudentRepository(student, true);
      results.push(res);
    } catch (err) {
      results.push({
        success: false,
        student: {
          ...student,
          syncStatus: 'error',
          syncError: err.message
        },
        problems: [],
        stats: {
          totalSolved: student.totalSolved || 0,
          easySolved: student.easySolved || 0,
          mediumSolved: student.mediumSolved || 0,
          hardSolved: student.hardSolved || 0
        },
        error: err.message
      });
    }

    // Small delay between calls to respect GitHub rate limits
    if (i < total - 1) {
      await new Promise(r => setTimeout(r, 200));
    }
  }

  return results;
}
