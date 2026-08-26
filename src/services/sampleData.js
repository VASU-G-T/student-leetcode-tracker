/**
 * Initial Sample Data for LeetTrack Development & Testing
 * Features realistic student profiles, LeetSync-style repository references, and problems.
 */

export const INITIAL_STUDENTS = [
  {
    id: 'student_1',
    name: 'G T Vasudevan',
    registerNumber: 'ECE001',
    department: 'ECE',
    year: '2nd Year',
    section: 'A',
    email: 'vasudevan@college.edu',
    githubUsername: 'Vasudevan123',
    githubRepoUrl: 'https://github.com/Vasudevan123/leetcode',
    githubRepoOwner: 'Vasudevan123',
    githubRepoName: 'leetcode',
    leetcodeUsername: 'vasudevan123',
    profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    totalSolved: 156,
    easySolved: 92,
    mediumSolved: 51,
    hardSolved: 13,
    goal: 200,
    lastSynced: new Date(Date.now() - 1000 * 60 * 2).toISOString(), // 2 mins ago
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    isSample: true,
  },
  {
    id: 'student_2',
    name: 'Karthick R',
    registerNumber: 'CSE042',
    department: 'CSE',
    year: '3rd Year',
    section: 'B',
    email: 'karthick.r@college.edu',
    githubUsername: 'karthick-dev',
    githubRepoUrl: 'https://github.com/karthick-dev/leetcode-solutions',
    githubRepoOwner: 'karthick-dev',
    githubRepoName: 'leetcode-solutions',
    leetcodeUsername: 'karthick_code',
    profileImage: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    totalSolved: 149,
    easySolved: 84,
    mediumSolved: 53,
    hardSolved: 12,
    goal: 200,
    lastSynced: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 mins ago
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 28).toISOString(),
    isSample: true,
  },
  {
    id: 'student_3',
    name: 'Nivetha S',
    registerNumber: 'IT019',
    department: 'IT',
    year: '3rd Year',
    section: 'A',
    email: 'nivetha.s@college.edu',
    githubUsername: 'nivetha-s',
    githubRepoUrl: 'https://github.com/nivetha-s/LeetCode-Sync',
    githubRepoOwner: 'nivetha-s',
    githubRepoName: 'LeetCode-Sync',
    leetcodeUsername: 'nivi_codes',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    totalSolved: 138,
    easySolved: 80,
    mediumSolved: 48,
    hardSolved: 10,
    goal: 200,
    lastSynced: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // 25 mins ago
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25).toISOString(),
    isSample: true,
  },
  {
    id: 'student_4',
    name: 'Arun Kumar',
    registerNumber: 'CSE015',
    department: 'CSE',
    year: '2nd Year',
    section: 'A',
    email: 'arun.kumar@college.edu',
    githubUsername: 'arunkumar-tech',
    githubRepoUrl: 'https://github.com/arunkumar-tech/leetcode-practice',
    githubRepoOwner: 'arunkumar-tech',
    githubRepoName: 'leetcode-practice',
    leetcodeUsername: 'arun_k',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    totalSolved: 112,
    easySolved: 70,
    mediumSolved: 36,
    hardSolved: 6,
    goal: 150,
    lastSynced: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
    isSample: true,
  },
  {
    id: 'student_5',
    name: 'Praveen M',
    registerNumber: 'ECE088',
    department: 'ECE',
    year: '4th Year',
    section: 'B',
    email: 'praveen.m@college.edu',
    githubUsername: 'praveen-m',
    githubRepoUrl: 'https://github.com/praveen-m/dsa-leetcode',
    githubRepoOwner: 'praveen-m',
    githubRepoName: 'dsa-leetcode',
    leetcodeUsername: 'praveen_dev',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    totalSolved: 95,
    easySolved: 55,
    mediumSolved: 32,
    hardSolved: 8,
    goal: 200,
    lastSynced: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
    isSample: true,
  }
];

export const INITIAL_SAMPLE_PROBLEMS = {
  'student_1': [
    { id: 'p1', problemNumber: 1, title: 'Two Sum', difficulty: 'Easy', language: 'Java', allLanguages: ['Java', 'Python'], githubUrl: 'https://github.com/Vasudevan123/leetcode/blob/main/0001-two-sum/0001-two-sum.java', solvedAt: new Date(Date.now() - 1000 * 60 * 2).toISOString() },
    { id: 'p2', problemNumber: 2, title: 'Add Two Numbers', difficulty: 'Medium', language: 'Java', allLanguages: ['Java'], githubUrl: 'https://github.com/Vasudevan123/leetcode/blob/main/0002-add-two-numbers/0002-add-two-numbers.java', solvedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
    { id: 'p3', problemNumber: 3, title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', language: 'Java', allLanguages: ['Java'], githubUrl: 'https://github.com/Vasudevan123/leetcode/blob/main/0003-longest-substring/Solution.java', solvedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString() },
    { id: 'p4', problemNumber: 9, title: 'Palindrome Number', difficulty: 'Easy', language: 'Python', allLanguages: ['Python'], githubUrl: 'https://github.com/Vasudevan123/leetcode/blob/main/0009-palindrome-number/Solution.py', solvedAt: new Date(Date.now() - 1000 * 60 * 300).toISOString() },
    { id: 'p5', problemNumber: 15, title: '3Sum', difficulty: 'Medium', language: 'Java', allLanguages: ['Java'], githubUrl: 'https://github.com/Vasudevan123/leetcode/blob/main/0015-3sum/0015-3sum.java', solvedAt: new Date(Date.now() - 1000 * 60 * 600).toISOString() },
    { id: 'p6', problemNumber: 20, title: 'Valid Parentheses', difficulty: 'Easy', language: 'Java', allLanguages: ['Java'], githubUrl: 'https://github.com/Vasudevan123/leetcode/blob/main/0020-valid-parentheses/Solution.java', solvedAt: new Date(Date.now() - 1000 * 60 * 1200).toISOString() },
    { id: 'p7', problemNumber: 23, title: 'Merge k Sorted Lists', difficulty: 'Hard', language: 'Java', allLanguages: ['Java'], githubUrl: 'https://github.com/Vasudevan123/leetcode/blob/main/0023-merge-k-sorted-lists/Solution.java', solvedAt: new Date(Date.now() - 1000 * 60 * 1800).toISOString() },
    { id: 'p8', problemNumber: 42, title: 'Trapping Rain Water', difficulty: 'Hard', language: 'Java', allLanguages: ['Java'], githubUrl: 'https://github.com/Vasudevan123/leetcode/blob/main/0042-trapping-rain-water/Solution.java', solvedAt: new Date(Date.now() - 1000 * 60 * 2400).toISOString() },
    { id: 'p9', problemNumber: 121, title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', language: 'Java', allLanguages: ['Java'], githubUrl: 'https://github.com/Vasudevan123/leetcode/blob/main/0121-best-time-to-buy-and-sell-stock/Solution.java', solvedAt: new Date(Date.now() - 1000 * 60 * 3600).toISOString() },
    { id: 'p10', problemNumber: 200, title: 'Number of Islands', difficulty: 'Medium', language: 'Java', allLanguages: ['Java'], githubUrl: 'https://github.com/Vasudevan123/leetcode/blob/main/0200-number-of-islands/Solution.java', solvedAt: new Date(Date.now() - 1000 * 60 * 4800).toISOString() },
  ]
};

export const INITIAL_ACTIVITY = [
  {
    id: 'act_1',
    studentName: 'G T Vasudevan',
    studentId: 'student_1',
    problemTitle: 'Two Sum',
    problemNumber: 1,
    difficulty: 'Easy',
    timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    type: 'solve'
  },
  {
    id: 'act_2',
    studentName: 'Karthick R',
    studentId: 'student_2',
    problemTitle: 'Binary Search',
    problemNumber: 704,
    difficulty: 'Easy',
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    type: 'solve'
  },
  {
    id: 'act_3',
    studentName: 'Nivetha S',
    studentId: 'student_3',
    problemTitle: 'Valid Parentheses',
    problemNumber: 20,
    difficulty: 'Easy',
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    type: 'solve'
  },
  {
    id: 'act_4',
    studentName: 'G T Vasudevan',
    studentId: 'student_1',
    problemTitle: '3Sum',
    problemNumber: 15,
    difficulty: 'Medium',
    timestamp: new Date(Date.now() - 1000 * 60 * 65).toISOString(),
    type: 'solve'
  },
  {
    id: 'act_5',
    studentName: 'Praveen M',
    studentId: 'student_5',
    problemTitle: 'Trapping Rain Water',
    problemNumber: 42,
    difficulty: 'Hard',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    type: 'solve'
  }
];

export const INITIAL_SETTINGS = {
  appName: 'LeetTrack',
  tagline: 'Track. Solve. Improve.',
  defaultGoal: 200,
  autoSyncInterval: 15, // in minutes
  defaultDepartment: 'ECE',
  leaderboardVisibility: 'public',
  departments: ['ECE', 'CSE', 'IT', 'AI&DS', 'MECH', 'CIVIL', 'EEE'],
  years: ['1st Year', '2nd Year', '3rd Year', '4th Year'],
  sections: ['A', 'B', 'C', 'D']
};
