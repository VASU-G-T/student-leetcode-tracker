/**
 * Export data to Clean, Excel-Compatible CSV / Spreadsheet Table
 * Uses UTF-8 BOM (\uFEFF) to ensure Microsoft Excel and Google Sheets
 * instantly separate each data point into distinct table columns without double-quotes.
 */

import { getStudentActivityMetrics } from './helpers.js';

export function exportToCsv(filename, headers, rows) {
  if (!rows || !rows.length) return;

  // Clean cell formatter: Only quote if cell contains comma, newline, or existing quote
  const formatCell = (val) => {
    if (val === null || val === undefined || val === '') return '';
    const str = String(val).trim();
    if (str.includes(',') || str.includes('\n') || str.includes('\r') || str.includes('"')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  // Build clean CSV rows
  const csvLines = [
    headers.map(formatCell).join(','),
    ...rows.map(row => row.map(formatCell).join(','))
  ];

  const csvContent = csvLines.join('\r\n');

  // \uFEFF Byte Order Mark forces Excel to parse UTF-8 with proper comma column separation
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export Clean Leaderboard Table to Excel / CSV
 */
export function exportLeaderboardCsv(students) {
  const headers = [
    'Rank', 
    'Name', 
    'Register Number', 
    'Department', 
    'Year', 
    'Section', 
    'Total Solved', 
    'Today Solved', 
    '1 Week Solved', 
    '1 Month Solved', 
    'Streak (Days)', 
    'Easy', 
    'Medium', 
    'Hard', 
    'GitHub Repo'
  ];
  
  const rows = students.map((s, idx) => {
    const metrics = getStudentActivityMetrics(s);
    return [
      idx + 1,
      s.name || 'Student',
      s.registerNumber || s.regNo || s.username || '-',
      s.department || 'ECE',
      s.year || '2nd Year',
      s.section || 'Sec F',
      s.totalSolved ?? 0,
      metrics.today ?? 0,
      metrics.week ?? 0,
      metrics.month ?? 0,
      metrics.streak ?? 0,
      s.easySolved ?? 0,
      s.mediumSolved ?? 0,
      s.hardSolved ?? 0,
      s.githubRepoUrl || ''
    ];
  });

  const todayStr = new Date().toISOString().split('T')[0];
  exportToCsv(`ECE_LeetCode_Leaderboard_${todayStr}`, headers, rows);
}
