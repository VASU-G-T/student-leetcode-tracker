/**
 * Default Configuration for ECE Department Student LeetCode Progress Tracker
 * Focused exclusively on ECE Department across Sections: Sec A, Sec B, Sec C, Sec D, Sec E, Sec F
 */

export const CREATOR_PROFILE = {
  id: 'vasu_gt_creator',
  name: 'Vasu G T',
  username: 'VASU-G-T',
  registerNumber: '922525106360',
  department: 'ECE',
  year: 'Lead Developer',
  section: 'Sec A',
  email: 'vasu@college.edu',
  githubUsername: 'VASU-G-T',
  githubRepoUrl: 'https://github.com/VASU-G-T/student-leetcode-tracker',
  githubRepoOwner: 'VASU-G-T',
  githubRepoName: 'student-leetcode-tracker',
  leetcodeUsername: 'VASU-G-T',
  profileImage: 'https://github.com/VASU-G-T.png',
  bio: 'App Creator & Lead Web Developer • ECE Student • Full Stack & IoT Specialist',
  isCreator: true,
  skills: ['React', 'JavaScript', 'Tailwind CSS', 'Vite', 'Node.js', 'Firebase', 'GitHub REST API', 'Embedded C', 'IoT', 'C++', 'Python', 'LeetCode DSA'],
  accessStatus: 'active',
  totalSolved: 33,
  easySolved: 18,
  mediumSolved: 14,
  hardSolved: 1,
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
    liveUrl: 'https://github.com/VASU-G-T/student-leetcode-tracker',
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

export const INITIAL_ACTIVITY = [];

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
