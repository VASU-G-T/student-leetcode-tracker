/**
 * Unit Test Script for leetcodeParser
 * Validates problem extraction and deduplication logic against various LeetSync patterns.
 */

import { parseProblemFile, parseRepositoryTree } from '../services/leetcodeParser.js';

function runTests() {
  console.log('Running LeetCode Parser Unit Tests...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✓ PASS: ${message}`);
      passed++;
    } else {
      console.error(`✕ FAIL: ${message}`);
      failed++;
    }
  }

  const mockRepo = { owner: 'testuser', repo: 'leetcode' };

  // Test 1: LeetSync directory format
  const file1 = { path: '0001-two-sum/0001-two-sum.java', type: 'blob' };
  const p1 = parseProblemFile(file1, mockRepo);
  assert(p1 && p1.problemNumber === 1 && p1.title === 'Two Sum' && p1.language === 'Java' && p1.difficulty === 'Easy', 'LeetSync folder path (0001-two-sum/0001-two-sum.java)');

  // Test 2: Root file format with dot
  const file2 = { path: '15. 3Sum.cpp', type: 'blob' };
  const p2 = parseProblemFile(file2, mockRepo);
  assert(p2 && p2.problemNumber === 15 && p2.title === '3Sum' && p2.language === 'C++' && p2.difficulty === 'Medium', 'Root file with dot format (15. 3Sum.cpp)');

  // Test 3: Difficulty folder structure
  const file3 = { path: 'Hard/42. Trapping Rain Water.py', type: 'blob' };
  const p3 = parseProblemFile(file3, mockRepo);
  assert(p3 && p3.problemNumber === 42 && p3.title === 'Trapping Rain Water' && p3.difficulty === 'Hard' && p3.language === 'Python', 'Difficulty folder structure (Hard/42. Trapping Rain Water.py)');

  // Test 4: Ignored files
  assert(parseProblemFile({ path: 'README.md', type: 'blob' }) === null, 'Ignore README.md');
  assert(parseProblemFile({ path: 'LICENSE', type: 'blob' }) === null, 'Ignore LICENSE');
  assert(parseProblemFile({ path: '.github/workflows/sync.yml', type: 'blob' }) === null, 'Ignore github workflow files');

  // Test 5: Deduplication test (multiple solutions for Problem #1)
  const treeFiles = [
    { path: '0001-two-sum/0001-two-sum.java', type: 'blob' },
    { path: '0001-two-sum/0001-two-sum.py', type: 'blob' },
    { path: '0001-two-sum/0001-two-sum.cpp', type: 'blob' },
    { path: '0001-two-sum/README.md', type: 'blob' },
    { path: '0015-3sum/Solution.java', type: 'blob' },
    { path: 'Hard/42. Trapping Rain Water.py', type: 'blob' },
  ];

  const { problems, stats } = parseRepositoryTree(treeFiles, mockRepo);

  assert(problems.length === 3, 'Multiple solutions of same problem deduplicated to 1 (expected 3 total unique problems)');
  assert(stats.totalSolved === 3, 'Total solved equals 3');
  assert(stats.easySolved === 1, 'Easy solved equals 1');
  assert(stats.mediumSolved === 1, 'Medium solved equals 1');
  assert(stats.hardSolved === 1, 'Hard solved equals 1');

  const p1Details = problems.find(p => p.problemNumber === 1);
  assert(p1Details && p1Details.allLanguages.length === 3, 'Problem 1 has all 3 languages (Java, Python, C++) recorded');

  // Test 6: Verify accurate difficulty lookup for standard problems
  const easyFile1 = parseProblemFile({ path: '0026-remove-duplicates-from-sorted-array/0026-remove-duplicates-from-sorted-array.java', type: 'blob' });
  assert(easyFile1 && easyFile1.difficulty === 'Easy', 'Problem 26 accurately classified as Easy');

  const easyFile2 = parseProblemFile({ path: '0206-reverse-linked-list/Solution.py', type: 'blob' });
  assert(easyFile2 && easyFile2.difficulty === 'Easy', 'Problem 206 accurately classified as Easy');

  const easyFile3 = parseProblemFile({ path: '0217-contains-duplicate/0217-contains-duplicate.cpp', type: 'blob' });
  assert(easyFile3 && easyFile3.difficulty === 'Easy', 'Problem 217 accurately classified as Easy');

  const hardFile1 = parseProblemFile({ path: '0023-merge-k-sorted-lists/0023-merge-k-sorted-lists.java', type: 'blob' });
  assert(hardFile1 && hardFile1.difficulty === 'Hard', 'Problem 23 accurately classified as Hard');

  console.log(`\nResults: ${passed} Passed, ${failed} Failed`);
  return failed === 0;
}

runTests();
