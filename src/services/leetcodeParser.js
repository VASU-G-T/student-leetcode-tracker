import { getLeetCodeDifficulty } from './leetcodeDatabase.js';

// Common programming language mapping based on file extensions
const EXTENSION_LANGUAGE_MAP = {
  'java': 'Java',
  'cpp': 'C++',
  'cc': 'C++',
  'cxx': 'C++',
  'c': 'C',
  'py': 'Python',
  'py3': 'Python',
  'js': 'JavaScript',
  'jsx': 'JavaScript',
  'ts': 'TypeScript',
  'tsx': 'TypeScript',
  'go': 'Go',
  'rs': 'Rust',
  'kt': 'Kotlin',
  'kts': 'Kotlin',
  'cs': 'C#',
  'rb': 'Ruby',
  'swift': 'Swift',
  'php': 'PHP',
  'scala': 'Scala',
  'sql': 'SQL',
  'dart': 'Dart',
  'r': 'R'
};

// Files and folders to ignore
const IGNORED_FILES = new Set([
  'readme.md', 'readme', 'license', 'license.md', 'license.txt',
  '.gitignore', '.gitattributes', 'package.json', 'package-lock.json',
  'tsconfig.json', '.eslintrc.json', '.prettierrc', 'cpm.json',
  'gemfile', 'dockerfile', 'makefile', 'cmakelists.txt', 'pom.xml'
]);

const IGNORED_EXTENSIONS = new Set([
  'md', 'txt', 'png', 'jpg', 'jpeg', 'svg', 'gif', 'json', 'yml',
  'yaml', 'xml', 'lock', 'pdf', 'csv', 'sh', 'bat', 'env'
]);

/**
 * Common known LeetCode problem difficulty lookup (covers popular LeetCode numbers as high-confidence fallback)
 */
const KNOWN_DIFFICULTIES = {
  1: 'Easy', // Two Sum
  2: 'Medium', // Add Two Numbers
  3: 'Medium', // Longest Substring Without Repeating Characters
  4: 'Hard', // Median of Two Sorted Arrays
  5: 'Medium', // Longest Palindromic Substring
  9: 'Easy', // Palindrome Number
  11: 'Medium', // Container With Most Water
  13: 'Easy', // Roman to Integer
  14: 'Easy', // Longest Common Prefix
  15: 'Medium', // 3Sum
  19: 'Medium', // Remove Nth Node From End of List
  20: 'Easy', // Valid Parentheses
  21: 'Easy', // Merge Two Sorted Lists
  22: 'Medium', // Generate Parentheses
  23: 'Hard', // Merge k Sorted Lists
  26: 'Easy', // Remove Duplicates from Sorted Array
  33: 'Medium', // Search in Rotated Sorted Array
  42: 'Hard', // Trapping Rain Water
  46: 'Medium', // Permutations
  48: 'Medium', // Rotate Image
  49: 'Medium', // Group Anagrams
  53: 'Medium', // Maximum Subarray
  54: 'Medium', // Spiral Matrix
  55: 'Medium', // Jump Game
  56: 'Medium', // Merge Intervals
  70: 'Easy', // Climbing Stairs
  72: 'Hard', // Edit Distance
  73: 'Medium', // Set Matrix Zeroes
  74: 'Medium', // Search a 2D Matrix
  75: 'Medium', // Sort Colors
  76: 'Hard', // Minimum Window Substring
  78: 'Medium', // Subsets
  79: 'Medium', // Word Search
  84: 'Hard', // Largest Rectangle in Histogram
  94: 'Easy', // Binary Tree Inorder Traversal
  98: 'Medium', // Validate Binary Search Tree
  101: 'Easy', // Symmetric Tree
  102: 'Medium', // Binary Tree Level Order Traversal
  104: 'Easy', // Maximum Depth of Binary Tree
  105: 'Medium', // Construct Binary Tree from Preorder and Inorder Traversal
  121: 'Easy', // Best Time to Buy and Sell Stock
  122: 'Medium', // Best Time to Buy and Sell Stock II
  124: 'Hard', // Binary Tree Maximum Path Sum
  128: 'Medium', // Longest Consecutive Sequence
  136: 'Easy', // Single Number
  139: 'Medium', // Word Break
  141: 'Easy', // Linked List Cycle
  142: 'Medium', // Linked List Cycle II
  146: 'Medium', // LRU Cache
  152: 'Medium', // Maximum Product Subarray
  153: 'Medium', // Find Minimum in Rotated Sorted Array
  155: 'Medium', // Min Stack
  160: 'Easy', // Intersection of Two Linked Lists
  169: 'Easy', // Majority Element
  198: 'Medium', // House Robber
  200: 'Medium', // Number of Islands
  206: 'Easy', // Reverse Linked List
  207: 'Medium', // Course Schedule
  208: 'Medium', // Implement Trie
  215: 'Medium', // Kth Largest Element in an Array
  217: 'Easy', // Contains Duplicate
  226: 'Easy', // Invert Binary Tree
  230: 'Medium', // Kth Smallest Element in a BST
  232: 'Easy', // Implement Queue using Stacks
  234: 'Easy', // Palindrome Linked List
  236: 'Medium', // Lowest Common Ancestor of a Binary Tree
  238: 'Medium', // Product of Array Except Self
  239: 'Hard', // Sliding Window Maximum
  242: 'Easy', // Valid Anagram
  283: 'Easy', // Move Zeroes
  287: 'Medium', // Find the Duplicate Number
  295: 'Hard', // Find Median from Data Stream
  297: 'Hard', // Serialize and Deserialize Binary Tree
  300: 'Medium', // Longest Increasing Subsequence
  322: 'Medium', // Coin Change
  347: 'Medium', // Top K Frequent Elements
  371: 'Medium', // Sum of Two Integers
  416: 'Medium', // Partition Equal Subset Sum
  424: 'Medium', // Longest Repeating Character Replacement
  438: 'Medium', // Find All Anagrams in a String
  543: 'Easy', // Diameter of Binary Tree
  560: 'Medium', // Subarray Sum Equals K
  572: 'Easy', // Subtree of Another Tree
  704: 'Easy', // Binary Search
  739: 'Medium', // Daily Temperatures
  875: 'Medium', // Koko Eating Bananas
  981: 'Medium', // Time Based Key-Value Store
  994: 'Medium', // Rotting Oranges
  1143: 'Medium', // Longest Common Subsequence
};

/**
 * Determine difficulty from path / folder / filename / authoritative database
 */
function detectDifficulty(path, filename, problemNumber) {
  const normalizedPath = (path + '/' + filename).toLowerCase();
  
  if (/\b(easy|01-easy|easy problems)\b/.test(normalizedPath)) {
    return 'Easy';
  }
  if (/\b(hard|03-hard|hard problems)\b/.test(normalizedPath)) {
    return 'Hard';
  }
  if (/\b(medium|02-medium|medium problems|med)\b/.test(normalizedPath)) {
    return 'Medium';
  }

  // Use authoritative LeetCode problem difficulty database
  if (problemNumber) {
    return getLeetCodeDifficulty(problemNumber, normalizedPath);
  }

  return 'Medium';
}

/**
 * Extract exact difficulty level from a problem's README.md file
 * LeetSync / LeetHub formats:
 * - Badges: https://img.shields.io/badge/Difficulty-Easy-brightgreen
 * - HTML: <h3>Easy</h3>, <strong>Easy</strong>
 * - Text: Difficulty Easy, Difficulty: Easy, **Difficulty:** Easy
 */
export function extractDifficultyFromReadme(readmeContent) {
  if (!readmeContent || typeof readmeContent !== 'string') return null;

  // 1. Shields badge pattern: e.g. Difficulty-Easy, Difficulty-Medium, Difficulty-Hard, Difficulty%20Easy
  const badgeMatch = readmeContent.match(/Difficulty(?:%20|[-_:\s])+(Easy|Medium|Hard)/i);
  if (badgeMatch) {
    const diff = badgeMatch[1].toLowerCase();
    if (diff === 'easy') return 'Easy';
    if (diff === 'medium') return 'Medium';
    if (diff === 'hard') return 'Hard';
  }

  // 2. HTML header/tag pattern: e.g. <h3>Easy</h3>, <strong>Medium</strong>, <span>Hard</span>
  const htmlMatch = readmeContent.match(/<(?:h[1-6]|strong|b|span|p|div|em)[^>]*>\s*(Easy|Medium|Hard)\s*<\//i);
  if (htmlMatch) {
    const diff = htmlMatch[1].toLowerCase();
    if (diff === 'easy') return 'Easy';
    if (diff === 'medium') return 'Medium';
    if (diff === 'hard') return 'Hard';
  }

  // 3. Markdown / text patterns: e.g. **Difficulty:** Medium, **Difficulty**: Medium, Difficulty: Medium, Difficulty Easy
  const textMatch = readmeContent.match(/(?:\*\*|\*|###|##)?\s*Difficulty\s*(?:\*\*|\*)?\s*[:\-\s]\s*(?:\*\*|\*)?\s*(Easy|Medium|Hard)\b/i);
  if (textMatch) {
    const diff = textMatch[1].toLowerCase();
    if (diff === 'easy') return 'Easy';
    if (diff === 'medium') return 'Medium';
    if (diff === 'hard') return 'Hard';
  }

  // 4. Standalone Markdown heading / bold tag: e.g. ### Easy, **Easy**
  const standaloneMatch = readmeContent.match(/(?:###|##|\*\*)\s*(Easy|Medium|Hard)\s*(?:\*\*|$)/i);
  if (standaloneMatch) {
    const diff = standaloneMatch[1].toLowerCase();
    if (diff === 'easy') return 'Easy';
    if (diff === 'medium') return 'Medium';
    if (diff === 'hard') return 'Hard';
  }

  return null;
}

/**
 * Format title case from slug or words
 */
function formatTitle(rawTitle) {
  if (!rawTitle) return '';

  // If already properly spaced and capitalized (e.g. "3Sum", "Trapping Rain Water")
  if (!rawTitle.includes('-') && !rawTitle.includes('_') && /[A-Z]/.test(rawTitle)) {
    return rawTitle.trim();
  }

  return rawTitle
    .replace(/[-_]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(' ')
    .filter(Boolean)
    .map(word => {
      // If starts with digits followed by letters (e.g. "3sum" -> "3Sum")
      const digitMatch = word.match(/^(\d+)([a-zA-Z]+)$/);
      if (digitMatch) {
        return digitMatch[1] + digitMatch[2].charAt(0).toUpperCase() + digitMatch[2].slice(1).toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

/**
 * Parse a single repository file path to determine if it is a LeetCode problem solution
 * 
 * Supports structures:
 * - "0001-two-sum/0001-two-sum.py" (LeetSync directory style)
 * - "Easy/0001-two-sum.java"
 * - "Medium/15. 3Sum.cpp"
 * - "1. Two Sum.java" (Root file style)
 * - "20. Valid Parentheses.cpp"
 * - "121. Best Time to Buy and Sell Stock.py"
 * - "0001-two-sum/Solution.java"
 * - "problems/0001-two-sum/Solution.py"
 */
export function parseProblemFile(file, repoInfo) {
  const path = file.path || '';
  const parts = path.split('/');
  const filename = parts[parts.length - 1];
  const lowerFilename = filename.toLowerCase();

  // Ignore system, doc, and config files
  if (IGNORED_FILES.has(lowerFilename) || lowerFilename.startsWith('.')) {
    return null;
  }

  const dotIndex = filename.lastIndexOf('.');
  if (dotIndex === -1) return null;

  const ext = filename.slice(dotIndex + 1).toLowerCase();
  if (IGNORED_EXTENSIONS.has(ext)) return null;

  const language = EXTENSION_LANGUAGE_MAP[ext] || ext.toUpperCase();
  const rawBaseName = filename.slice(0, dotIndex);

  let problemNumber = null;
  let problemTitle = '';

  // Pattern 1: Number followed by dot or space and title (e.g. "1. Two Sum.java", "1 - Two Sum.py", "121. Best Time...")
  const pattern1 = /^(\d+)[\.\s\-_]+(.+)$/;
  
  // Pattern 2: LeetSync directory folder name (e.g., path: "0001-two-sum/...", parts[0] or parts[1] is "0001-two-sum")
  const leetSyncFolder = parts.find(p => /^\d{3,5}-[\w-]+$/.test(p));

  // Pattern 3: Zero-padded slug filename (e.g. "0001-two-sum.py")
  const pattern3 = /^(\d{3,5})-([a-z0-9\-]+)$/i;

  const match1 = rawBaseName.match(pattern1);
  const match3 = rawBaseName.match(pattern3);

  if (match1) {
    problemNumber = parseInt(match1[1], 10);
    problemTitle = formatTitle(match1[2]);
  } else if (match3) {
    problemNumber = parseInt(match3[1], 10);
    problemTitle = formatTitle(match3[2]);
  } else if (leetSyncFolder) {
    const folderMatch = leetSyncFolder.match(/^(\d{3,5})-(.+)$/);
    if (folderMatch) {
      problemNumber = parseInt(folderMatch[1], 10);
      problemTitle = formatTitle(folderMatch[2]);
    }
  } else {
    // If not matching explicit number patterns, check if parent folder is a number or problem name
    const parentFolder = parts.length > 1 ? parts[parts.length - 2] : '';
    const parentMatch = parentFolder.match(/^(\d+)[\.\s\-_]+(.+)$/);
    if (parentMatch) {
      problemNumber = parseInt(parentMatch[1], 10);
      problemTitle = formatTitle(parentMatch[2]);
    }
  }

  // If still no problem number was identified, skip file
  if (!problemNumber || isNaN(problemNumber)) {
    return null;
  }

  if (!problemTitle) {
    problemTitle = `Problem ${problemNumber}`;
  }

  const difficulty = detectDifficulty(path, filename, problemNumber);
  
  // Construct direct GitHub viewing link
  const githubUrl = repoInfo 
    ? `https://github.com/${repoInfo.owner}/${repoInfo.repo}/blob/main/${path}`
    : file.html_url || `https://github.com/${path}`;

  return {
    problemNumber,
    title: problemTitle,
    difficulty,
    language,
    path,
    filename,
    githubUrl,
    sha: file.sha || null
  };
}

/**
 * Parse an array of repository files and deduplicate problem solutions
 * Multiple solution files for the same problem ID will be merged into 1 solved problem record.
 */
export function parseRepositoryTree(files = [], repoInfo = null) {
  const problemsMap = new Map();

  for (const file of files) {
    // We only inspect blob / file types
    if (file.type && file.type !== 'blob' && file.type !== 'file') {
      continue;
    }

    const parsed = parseProblemFile(file, repoInfo);
    if (!parsed) continue;

    const key = parsed.problemNumber;
    
    if (!problemsMap.has(key)) {
      problemsMap.set(key, {
        id: `problem_${parsed.problemNumber}`,
        problemNumber: parsed.problemNumber,
        title: parsed.title,
        difficulty: parsed.difficulty,
        language: parsed.language,
        githubUrl: parsed.githubUrl,
        path: parsed.path,
        allLanguages: [parsed.language],
        solvedAt: file.committedDate || new Date().toISOString()
      });
    } else {
      // Existing solution for same problem: append language if not present
      const existing = problemsMap.get(key);
      if (!existing.allLanguages.includes(parsed.language)) {
        existing.allLanguages.push(parsed.language);
      }
    }
  }

  const problems = Array.from(problemsMap.values());
  
  // Sort ascending by problem number
  problems.sort((a, b) => a.problemNumber - b.problemNumber);

  // Compute stats
  let easySolved = 0;
  let mediumSolved = 0;
  let hardSolved = 0;

  for (const p of problems) {
    if (p.difficulty === 'Easy') easySolved++;
    else if (p.difficulty === 'Medium') mediumSolved++;
    else if (p.difficulty === 'Hard') hardSolved++;
  }

  const totalSolved = easySolved + mediumSolved + hardSolved;

  return {
    problems,
    stats: {
      totalSolved,
      easySolved,
      mediumSolved,
      hardSolved
    }
  };
}
