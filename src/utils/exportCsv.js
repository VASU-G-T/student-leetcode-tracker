/**
 * Export data to CSV file download
 */
export function exportToCsv(filename, headers, rows) {
  if (!rows || !rows.length) return;

  const escapeCsv = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const csvContent = [
    headers.map(escapeCsv).join(','),
    ...rows.map(row => row.map(escapeCsv).join(','))
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
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
 * Export Leaderboard to CSV
 */
export function exportLeaderboardCsv(students) {
  const headers = ['Rank', 'Name', 'Register Number', 'Department', 'Year', 'Section', 'Total Solved', 'Easy', 'Medium', 'Hard', 'GitHub Repo'];
  const rows = students.map((s, idx) => [
    idx + 1,
    s.name,
    s.registerNumber,
    s.department,
    s.year,
    s.section,
    s.totalSolved || 0,
    s.easySolved || 0,
    s.mediumSolved || 0,
    s.hardSolved || 0,
    s.githubRepoUrl
  ]);

  exportToCsv(`LeetTrack_Leaderboard_${new Date().toISOString().split('T')[0]}`, headers, rows);
}
