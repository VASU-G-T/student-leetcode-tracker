// Helper functions for LeetTrack

/**
 * Format relative time (e.g. "2 minutes ago", "just now", "3 days ago")
 */
export function formatRelativeTime(dateInput) {
  if (!dateInput) return 'Never';
  
  const date = typeof dateInput === 'string' || typeof dateInput === 'number' 
    ? new Date(dateInput) 
    : dateInput.toDate ? dateInput.toDate() : new Date(dateInput);

  if (isNaN(date.getTime())) return 'Invalid date';

  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 30) return 'Just now';
  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Format full date & time (e.g., "25 Aug 2026, 10:25 PM")
 */
export function formatDateTime(dateInput) {
  if (!dateInput) return 'Never';
  
  const date = typeof dateInput === 'string' || typeof dateInput === 'number' 
    ? new Date(dateInput) 
    : dateInput.toDate ? dateInput.toDate() : new Date(dateInput);

  if (isNaN(date.getTime())) return 'Invalid date';

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

/**
 * Deterministic Leaderboard Sorting with Tie-Breaker
 * 1. Higher Total Solved
 * 2. Higher Hard count
 * 3. Higher Medium count
 * 4. Higher Easy count
 * 5. Name alphabetically
 */
export function sortLeaderboard(students) {
  return [...students].sort((a, b) => {
    const totalA = a.totalSolved || 0;
    const totalB = b.totalSolved || 0;
    if (totalB !== totalA) return totalB - totalA;

    const hardA = a.hardSolved || 0;
    const hardB = b.hardSolved || 0;
    if (hardB !== hardA) return hardB - hardA;

    const medA = a.mediumSolved || 0;
    const medB = b.mediumSolved || 0;
    if (medB !== medA) return medB - medA;

    const easyA = a.easySolved || 0;
    const easyB = b.easySolved || 0;
    if (easyB !== easyA) return easyB - easyA;

    return (a.name || '').localeCompare(b.name || '');
  });
}

/**
 * Calculates percentage safely
 */
export function calculatePercentage(part, total) {
  if (!total || total <= 0) return 0;
  return Math.min(100, Math.round((part / total) * 100));
}

/**
 * Extract GitHub owner and repo from URL
 */
export function parseGitHubRepoUrl(url) {
  if (!url || typeof url !== 'string') return null;
  const cleanUrl = url.trim();
  
  // Matches: https://github.com/owner/repo or github.com/owner/repo
  const regex = /^(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)(?:\/.*)?$/;
  const match = cleanUrl.match(regex);
  
  if (!match) return null;
  
  const owner = match[1];
  let repo = match[2];
  if (repo.endsWith('.git')) {
    repo = repo.slice(0, -4);
  }
  
  return {
    owner,
    repo,
    fullUrl: `https://github.com/${owner}/${repo}`
  };
}

/**
 * Creates friendly slug/ID for URLs (e.g. /student/vasudevan or /student/ECE001)
 */
export function generateStudentSlug(student) {
  if (!student) return '';
  return student.registerNumber || student.githubUsername || student.id;
}
