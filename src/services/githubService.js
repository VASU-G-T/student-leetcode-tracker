/**
 * GitHub REST API Service
 * Handles repository validation, rate limit inspection, recursive file tree fetching, commit history, and caching.
 */

import { parseGitHubRepoUrl } from '../utils/helpers.js';

// Simple in-memory cache for repository tree and commits responses (10 minutes TTL)
const cache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000;

/**
 * Get headers for GitHub API requests
 */
function getHeaders() {
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'LeetTrack-App'
  };

  // Optional token for higher rate limit (if provided via environment variable)
  const token = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GITHUB_TOKEN) || '';
  if (token && token.trim() !== '') {
    headers['Authorization'] = `token ${token.trim()}`;
  }

  return headers;
}

/**
 * Validate repository URL format and check live status via GitHub API
 */
export async function validateRepository(repoUrl) {
  const parsed = parseGitHubRepoUrl(repoUrl);
  if (!parsed) {
    return {
      isValid: false,
      error: 'Invalid GitHub repository URL format. Example: https://github.com/username/leetcode'
    };
  }

  const { owner, repo } = parsed;

  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: getHeaders()
    });

    if (response.status === 404) {
      return {
        isValid: false,
        error: 'Repository not found or is private.',
        owner,
        repo
      };
    }

    if (response.status === 403) {
      const rateLimitRemaining = response.headers.get('x-ratelimit-remaining');
      if (rateLimitRemaining === '0') {
        return {
          isValid: true, // Still technically a valid URL format, just rate-limited
          warning: 'GitHub API rate limit reached. Repository URL is valid but live check was throttled.',
          owner,
          repo,
          isRateLimited: true
        };
      }
      return {
        isValid: false,
        error: 'Repository is private or inaccessible.',
        owner,
        repo
      };
    }

    if (!response.ok) {
      return {
        isValid: false,
        error: `GitHub error: ${response.statusText} (${response.status})`,
        owner,
        repo
      };
    }

    const data = await response.json();

    return {
      isValid: true,
      owner: data.owner?.login || owner,
      repo: data.name || repo,
      defaultBranch: data.default_branch || 'main',
      isPrivate: data.private || false,
      stars: data.stargazers_count,
      description: data.description,
      pushedAt: data.pushed_at
    };
  } catch (err) {
    return {
      isValid: false,
      error: 'Network error contacting GitHub API. Please check your internet connection.'
    };
  }
}

/**
 * Fetch recent commits from a GitHub repository to get exact submission timestamps
 */
export async function fetchRepositoryCommits(owner, repo) {
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=100`, {
      headers: getHeaders()
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return data.map(c => ({
          sha: c.sha,
          date: c.commit?.author?.date || c.commit?.committer?.date || null,
          message: c.commit?.message || ''
        }));
      }
    }
  } catch (e) {}
  return [];
}

/**
 * Fetch all files recursively from a GitHub repository using Git Trees API
 * and retrieve exact commit dates
 */
export async function fetchRepositoryFiles(repoUrl, forceRefresh = false) {
  const parsed = parseGitHubRepoUrl(repoUrl);
  if (!parsed) {
    throw new Error('Invalid GitHub repository URL format.');
  }

  const { owner, repo } = parsed;
  const cacheKey = `${owner}/${repo}`;

  if (!forceRefresh && cache.has(cacheKey)) {
    const cachedEntry = cache.get(cacheKey);
    if (Date.now() - cachedEntry.timestamp < CACHE_TTL_MS) {
      return {
        files: cachedEntry.files,
        commits: cachedEntry.commits || [],
        repoInfo: { owner, repo, defaultBranch: cachedEntry.defaultBranch },
        fromCache: true
      };
    }
  }

  // 1. Get repository metadata to know the default branch
  const repoMetaResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: getHeaders()
  });

  if (repoMetaResponse.status === 404) {
    throw new Error('Repository not found. Please ensure it exists and is public.');
  }

  if (repoMetaResponse.status === 403) {
    throw new Error('GitHub API rate limit reached. Please try again later.');
  }

  if (!repoMetaResponse.ok) {
    throw new Error(`Unable to fetch repository info (${repoMetaResponse.status})`);
  }

  const repoMeta = await repoMetaResponse.json();
  const defaultBranch = repoMeta.default_branch || 'main';

  // 2. Fetch Git Tree recursively and fetch recent commits in parallel
  const [treeResponse, commits] = await Promise.all([
    fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`,
      { headers: getHeaders() }
    ),
    fetchRepositoryCommits(owner, repo)
  ]);

  if (treeResponse.status === 403) {
    throw new Error('GitHub API rate limit reached. Please try again later.');
  }

  if (!treeResponse.ok) {
    throw new Error(`Failed to read repository files (${treeResponse.status}).`);
  }

  const treeData = await treeResponse.json();
  const files = treeData.tree || [];

  const result = {
    files,
    commits,
    repoInfo: {
      owner,
      repo,
      defaultBranch,
      pushedAt: repoMeta.pushed_at
    },
    fromCache: false
  };

  // Update Cache
  cache.set(cacheKey, {
    files,
    commits,
    defaultBranch,
    timestamp: Date.now()
  });

  return result;
}
