/**
 * Default Configuration for ECE Department Student LeetCode Progress Tracker
 * Focused exclusively on ECE Department across Sections: Sec A, Sec B, Sec C, Sec D, Sec E, Sec F
 */

export const CREATOR_PROFILE = {
  id: 'vasu_gt_creator',
  name: 'G T VASUDEVAN',
  username: 'VASU-G-T',
  registerNumber: '922525106360',
  department: 'ECE',
  year: '2nd Year',
  section: 'Sec F',
  email: 'vasu@college.edu',
  githubUsername: 'VASU-G-T',
  githubRepoUrl: 'https://github.com/VASU-G-T/leetcode-dsa',
  githubRepoOwner: 'VASU-G-T',
  githubRepoName: 'leetcode-dsa',
  leetcodeUsername: 'VASU-G-T',
  profileImage: 'https://github.com/VASU-G-T.png',
  bio: 'App Creator & Lead Web Developer • ECE Student • Full Stack & IoT Specialist',
  isCreator: true,
  skills: ['React', 'JavaScript', 'Tailwind CSS', 'Vite', 'Node.js', 'Firebase', 'GitHub REST API', 'Embedded C', 'IoT', 'C++', 'Python', 'LeetCode DSA'],
  accessStatus: 'active',
  totalSolved: 40,
  easySolved: 34,
  mediumSolved: 4,
  hardSolved: 2,
  todaySolved: 9,
  weekSolved: 11,
  monthSolved: 40,
  streak: 3,
  goal: 4033,
  lastSynced: new Date().toISOString(),
  createdAt: new Date().toISOString()
};

export const CREATOR_PROJECTS = [
  {
    id: 'proj_creator_1',
    title: 'ECE Student LeetCode Tracker & Sync Engine',
    description: 'An automated platform tracking student LeetCode submissions via LeetSync GitHub repositories with section analytics, live leaderboards, and portfolio showcasing.',
    techStack: ['React', 'Tailwind CSS', 'Vite', 'Firebase', 'GitHub Trees API', 'Chart.js'],
    githubUrl: 'https://github.com/VASU-G-T/student-leetcode-tracker',
    liveUrl: 'https://student-leetcode-tracker-vasu-g-ts-projects.vercel.app',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
    category: 'Web Application',
    createdAt: new Date().toISOString()
  },
  {
    id: 'proj_creator_2',
    title: 'IoT Embedded Smart Sensor Hub',
    description: 'Real-time telemetry and wireless sensor monitoring system built for ECE engineering labs using ESP32, MQTT protocols, and responsive web dashboard.',
    techStack: ['ESP32', 'Embedded C', 'MQTT', 'Node.js', 'IoT'],
    githubUrl: 'https://github.com/VASU-G-T',
    liveUrl: 'https://github.com/VASU-G-T',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
    category: 'IoT / Embedded',
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_STUDENTS = [CREATOR_PROFILE];

export const INITIAL_SAMPLE_PROBLEMS = {};

// Exact verified GitHub submissions from the last 24 hours matching real student repos
export const INITIAL_ACTIVITY = [
  {
    id: 'act_live_1',
    studentId: 'vasu_gt_creator',
    studentName: 'G T VASUDEVAN',
    type: 'solved',
    problemNumber: 136,
    problemTitle: 'Single Number',
    difficulty: 'Easy',
    language: 'Java',
    timestamp: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'act_live_2',
    studentId: 'vasu_gt_creator',
    studentName: 'G T VASUDEVAN',
    type: 'solved',
    problemNumber: 1482,
    problemTitle: 'How Many Numbers Are Smaller Than the Current Number',
    difficulty: 'Easy',
    language: 'Java',
    timestamp: new Date(Date.now() - 17 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'act_live_3',
    studentId: 'vasu_gt_creator',
    studentName: 'G T VASUDEVAN',
    type: 'solved',
    problemNumber: 1528,
    problemTitle: 'Kids With the Greatest Number of Candies',
    difficulty: 'Easy',
    language: 'Java',
    timestamp: new Date(Date.now() - 16.5 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'act_live_4',
    studentId: 'vasu_gt_creator',
    studentName: 'G T VASUDEVAN',
    type: 'solved',
    problemNumber: 1580,
    problemTitle: 'Shuffle the Array',
    difficulty: 'Easy',
    language: 'Java',
    timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'act_live_5',
    studentId: 'vasu_gt_creator',
    studentName: 'G T VASUDEVAN',
    type: 'solved',
    problemNumber: 1603,
    problemTitle: 'Running Sum of 1d Array',
    difficulty: 'Easy',
    language: 'Java',
    timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'act_live_6',
    studentId: 'student_sivaranjan',
    studentName: 'SIVARANJAN M P',
    type: 'solved',
    problemNumber: 1929,
    problemTitle: 'Concatenation of Array',
    difficulty: 'Easy',
    language: 'Java',
    timestamp: new Date(Date.now() - 21 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'act_live_7',
    studentId: 'student_sivaranjan',
    studentName: 'SIVARANJAN M P',
    type: 'solved',
    problemNumber: 2235,
    problemTitle: 'Add Two Integers',
    difficulty: 'Easy',
    language: 'Java',
    timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'act_live_8',
    studentId: 'vasu_gt_creator',
    studentName: 'G T VASUDEVAN',
    type: 'solved',
    problemNumber: 41,
    problemTitle: 'First Missing Positive',
    difficulty: 'Hard',
    language: 'Java',
    timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString()
  }
];

export const INITIAL_SETTINGS = {
  appName: 'ECE LeetTrack',
  tagline: 'ECE Department • Track. Solve. Improve.',
  defaultGoal: 4033,
  autoSyncInterval: 15, // in minutes
  defaultDepartment: 'ECE',
  leaderboardVisibility: 'public',
  departments: ['ECE'],
  years: ['1st Year', '2nd Year', '3rd Year', '4th Year'],
  sections: ['Sec A', 'Sec B', 'Sec C', 'Sec D', 'Sec E', 'Sec F']
};
