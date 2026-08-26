/**
 * Export Utilities for LeetTrack
 * Direct Google Sheets & Microsoft Excel Table Exporter (.xls) and Word Document (.doc)
 * Replaces raw CSV with formatted spreadsheet & word tables that open directly into clean columns.
 */

import { getStudentActivityMetrics, formatDateTime } from './helpers.js';

/**
 * Export Leaderboard directly as an Excel / Google Sheet Spreadsheet Table (.xls)
 */
export function exportLeaderboardExcel(students) {
  if (!students || !students.length) return;

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  const tableRowsHtml = students.map((s, idx) => {
    const metrics = getStudentActivityMetrics(s);
    const rank = idx + 1;
    const isTop1 = rank === 1;
    const rowBg = isTop1 ? '#fef3c7' : (idx % 2 === 0 ? '#ffffff' : '#f8fafc');

    return `
      <tr style="background-color: ${rowBg}; height: 32px;">
        <td style="padding: 10px 12px; text-align: center; font-weight: bold; border: 1px solid #cbd5e1; font-size: 11pt; color: ${isTop1 ? '#b45309' : '#1e293b'};">${rank}</td>
        <td style="padding: 10px 14px; font-weight: bold; border: 1px solid #cbd5e1; font-size: 11pt; color: #0f172a;">${s.name || 'Student'}</td>
        <td style="padding: 10px 14px; text-align: center; border: 1px solid #cbd5e1; font-family: monospace; font-weight: bold; font-size: 11pt; color: #0284c7; mso-number-format:'\\@';">${s.registerNumber || s.regNo || '-'}</td>
        <td style="padding: 10px 12px; text-align: center; border: 1px solid #cbd5e1; font-size: 10.5pt; color: #334155;">${s.department || 'ECE'}</td>
        <td style="padding: 10px 12px; text-align: center; border: 1px solid #cbd5e1; font-size: 10.5pt; color: #334155;">${s.year || '2nd Year'}</td>
        <td style="padding: 10px 12px; text-align: center; font-weight: bold; border: 1px solid #cbd5e1; font-size: 10.5pt; color: #0284c7;">${s.section || 'Sec F'}</td>
        <td style="padding: 10px 12px; text-align: center; font-weight: bold; border: 1px solid #cbd5e1; font-size: 12pt; color: #0f172a;">${s.totalSolved ?? 0}</td>
        <td style="padding: 10px 12px; text-align: center; font-weight: bold; border: 1px solid #cbd5e1; font-size: 11pt; color: #047857; background-color: #ecfdf5;">+${metrics.today ?? 0}</td>
        <td style="padding: 10px 12px; text-align: center; font-weight: bold; border: 1px solid #cbd5e1; font-size: 11pt; color: #0284c7; background-color: #f0f9ff;">${metrics.week ?? 0}</td>
        <td style="padding: 10px 12px; text-align: center; font-weight: bold; border: 1px solid #cbd5e1; font-size: 11pt; color: #ea580c; background-color: #fff7ed;">${metrics.month ?? 0}</td>
        <td style="padding: 10px 12px; text-align: center; font-weight: bold; border: 1px solid #cbd5e1; font-size: 11pt; color: #c2410c; background-color: #fffaf0;">${metrics.streak ?? 0}d</td>
        <td style="padding: 10px 12px; text-align: center; font-weight: bold; border: 1px solid #cbd5e1; font-size: 10.5pt; color: #059669;">${s.easySolved ?? 0}</td>
        <td style="padding: 10px 12px; text-align: center; font-weight: bold; border: 1px solid #cbd5e1; font-size: 10.5pt; color: #0284c7;">${s.mediumSolved ?? 0}</td>
        <td style="padding: 10px 12px; text-align: center; font-weight: bold; border: 1px solid #cbd5e1; font-size: 10.5pt; color: #e11d48;">${s.hardSolved ?? 0}</td>
        <td style="padding: 10px 14px; border: 1px solid #cbd5e1; font-size: 10pt;">
          <a href="${s.githubRepoUrl || '#'}" style="color: #0284c7; text-decoration: underline;">
            ${s.githubRepoUrl || ''}
          </a>
        </td>
      </tr>
    `;
  }).join('');

  const excelHtml = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Google Sans', Arial, Roboto, sans-serif; }
        th { 
          background-color: #5b21b6; 
          color: #ffffff; 
          font-weight: bold; 
          font-size: 11pt; 
          padding: 12px 10px; 
          border: 1px solid #4c1d95; 
          text-align: center; 
          vertical-align: middle;
        }
        th.left { text-align: left; }
        td { 
          border: 1px solid #cbd5e1; 
          vertical-align: middle; 
        }
      </style>
    </head>
    <body>
      <table border="1" cellpadding="0" cellspacing="0" style="border-collapse: collapse; width: 100%;">
        <thead>
          <tr style="background-color: #5b21b6; color: #ffffff; height: 38px;">
            <th style="width: 50px;">Rank</th>
            <th class="left" style="width: 220px;">Student Full Name</th>
            <th style="width: 160px;">Register Number</th>
            <th style="width: 110px;">Department</th>
            <th style="width: 100px;">Year</th>
            <th style="width: 90px;">Section</th>
            <th style="width: 110px;">Total Solved</th>
            <th style="width: 90px;">Today</th>
            <th style="width: 100px;">1 Week</th>
            <th style="width: 100px;">1 Month</th>
            <th style="width: 90px;">Streak</th>
            <th style="width: 80px;">Easy</th>
            <th style="width: 80px;">Medium</th>
            <th style="width: 80px;">Hard</th>
            <th class="left" style="width: 380px;">GitHub Repository URL (LeetSync repo link)</th>
          </tr>
        </thead>
        <tbody>
          ${tableRowsHtml}
        </tbody>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob(['\uFEFF' + excelHtml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `ECE_LeetCode_Student_Sheet_${now.toISOString().split('T')[0]}.xls`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export Leaderboard directly as a Formatted Microsoft Word Document (.doc) Table
 */
export function exportLeaderboardWordDoc(students) {
  if (!students || !students.length) return;

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  const tableRowsHtml = students.map((s, idx) => {
    const metrics = getStudentActivityMetrics(s);
    const rank = idx + 1;
    const isTop1 = rank === 1;
    const rowBg = isTop1 ? '#fef3c7' : (idx % 2 === 0 ? '#ffffff' : '#f8fafc');

    return `
      <tr style="background-color: ${rowBg};">
        <td style="padding: 8px 6px; text-align: center; font-weight: bold; border: 1px solid #cbd5e1; color: ${isTop1 ? '#b45309' : '#1e293b'}; font-size: 10pt;">${rank === 1 ? '👑 #1' : `#${rank}`}</td>
        <td style="padding: 8px 8px; font-weight: bold; border: 1px solid #cbd5e1; color: #0f172a; font-size: 10pt;">${s.name || 'Student'}</td>
        <td style="padding: 8px 6px; text-align: center; font-family: monospace; font-weight: bold; border: 1px solid #cbd5e1; color: #0284c7; font-size: 9.5pt;">${s.registerNumber || s.regNo || '-'}</td>
        <td style="padding: 8px 6px; text-align: center; border: 1px solid #cbd5e1; color: #334155; font-size: 9.5pt;">${s.department || 'ECE'}</td>
        <td style="padding: 8px 6px; text-align: center; border: 1px solid #cbd5e1; color: #334155; font-size: 9pt;">${s.year || '2nd Year'}</td>
        <td style="padding: 8px 6px; text-align: center; font-weight: bold; border: 1px solid #cbd5e1; color: #0284c7; font-size: 9.5pt;">${s.section || 'Sec F'}</td>
        <td style="padding: 8px 6px; text-align: center; font-weight: bold; border: 1px solid #cbd5e1; color: #0f172a; font-size: 11.5pt;">${s.totalSolved ?? 0}</td>
        <td style="padding: 8px 6px; text-align: center; font-weight: bold; border: 1px solid #cbd5e1; color: #047857; background-color: #ecfdf5; font-size: 10pt;">+${metrics.today ?? 0}</td>
        <td style="padding: 8px 6px; text-align: center; font-weight: bold; border: 1px solid #cbd5e1; color: #0284c7; background-color: #f0f9ff; font-size: 10pt;">${metrics.week ?? 0}</td>
        <td style="padding: 8px 6px; text-align: center; font-weight: bold; border: 1px solid #cbd5e1; color: #ea580c; background-color: #fff7ed; font-size: 10pt;">${metrics.month ?? 0}</td>
        <td style="padding: 8px 6px; text-align: center; font-weight: bold; border: 1px solid #cbd5e1; color: #c2410c; background-color: #fffaf0; font-size: 9.5pt;">🔥 ${metrics.streak ?? 0}d</td>
        <td style="padding: 8px 6px; text-align: center; font-weight: bold; border: 1px solid #cbd5e1; color: #059669; font-size: 9.5pt;">${s.easySolved ?? 0}</td>
        <td style="padding: 8px 6px; text-align: center; font-weight: bold; border: 1px solid #cbd5e1; color: #0284c7; font-size: 9.5pt;">${s.mediumSolved ?? 0}</td>
        <td style="padding: 8px 6px; text-align: center; font-weight: bold; border: 1px solid #cbd5e1; color: #e11d48; font-size: 9.5pt;">${s.hardSolved ?? 0}</td>
        <td style="padding: 8px 8px; border: 1px solid #cbd5e1; font-size: 8.5pt; font-family: monospace;">
          <a href="${s.githubRepoUrl || '#'}" style="color: #0284c7; text-decoration: underline;">
            ${s.githubRepoUrl || ''}
          </a>
        </td>
      </tr>
    `;
  }).join('');

  const wordHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>ECE LeetCode Leaderboard Table</title>
      <style>
        @page { size: A4 landscape; margin: 1.5cm; }
        body { font-family: 'Segoe UI', Calibri, Arial, sans-serif; margin: 20px; color: #0f172a; }
        .header-title { color: #0284c7; font-size: 18pt; font-weight: bold; margin-bottom: 3px; }
        .header-subtitle { color: #64748b; font-size: 10pt; margin-top: 0; margin-bottom: 14px; }
        .meta-box { background-color: #f0f9ff; border: 1px solid #bae6fd; padding: 8px 12px; border-radius: 6px; margin-bottom: 16px; font-size: 9pt; color: #0369a1; }
        table { border-collapse: collapse; width: 100%; font-size: 9pt; border: 1px solid #cbd5e1; }
        th { background-color: #0284c7; color: #ffffff; padding: 8px 6px; text-align: center; font-size: 9pt; font-weight: bold; border: 1px solid #0369a1; }
        th.left { text-align: left; }
      </style>
    </head>
    <body>
      <div class="header-title">ECE Department • Student LeetCode DSA Leaderboard</div>
      <div class="header-subtitle">Official Progress Record • Generated ${dateStr}, ${timeStr}</div>
      <div class="meta-box">
        <strong>Department:</strong> Electronics & Communication Engineering (ECE Sec A - Sec F) &nbsp;|&nbsp;
        <strong>Total Enrolled Students:</strong> ${students.length} &nbsp;|&nbsp;
        <strong>Sync Engine:</strong> Live GitHub LeetSync Integration
      </div>
      <table border="1" cellpadding="0" cellspacing="0">
        <thead>
          <tr style="background-color: #0284c7; color: #ffffff;">
            <th style="width: 45px;">Rank</th>
            <th class="left" style="width: 150px;">Student Name</th>
            <th style="width: 110px;">Register No</th>
            <th style="width: 50px;">Dept</th>
            <th style="width: 65px;">Year</th>
            <th style="width: 60px;">Section</th>
            <th style="width: 60px;">Solved</th>
            <th style="width: 55px;">Today</th>
            <th style="width: 60px;">1 Week</th>
            <th style="width: 60px;">1 Month</th>
            <th style="width: 65px;">Streak</th>
            <th style="width: 45px;">Easy</th>
            <th style="width: 45px;">Med</th>
            <th style="width: 45px;">Hard</th>
            <th class="left">GitHub Repository URL</th>
          </tr>
        </thead>
        <tbody>
          ${tableRowsHtml}
        </tbody>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob(['\uFEFF' + wordHtml], { type: 'application/msword;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `ECE_LeetCode_Leaderboard_${now.toISOString().split('T')[0]}.doc`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export Individual Student's Solved Problems as a Word Document (.doc) Table
 */
export function exportStudentProblemsWordDoc(studentName, problems) {
  if (!problems || !problems.length) return;

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  const tableRowsHtml = problems.map((p, idx) => {
    const diffColor = p.difficulty === 'Easy' ? '#047857' : p.difficulty === 'Medium' ? '#0284c7' : '#e11d48';
    const diffBg = p.difficulty === 'Easy' ? '#ecfdf5' : p.difficulty === 'Medium' ? '#f0f9ff' : '#fff1f2';
    const langs = p.allLanguages && p.allLanguages.length ? p.allLanguages.join(', ') : (p.language || 'Java');
    const solvedDate = p.solvedAt ? new Date(p.solvedAt).toLocaleDateString('en-GB') : 'Verified';

    return `
      <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
        <td style="padding: 8px; text-align: center; font-weight: bold; border: 1px solid #cbd5e1;">${idx + 1}</td>
        <td style="padding: 8px; text-align: center; font-family: monospace; font-weight: bold; color: #0284c7; border: 1px solid #cbd5e1;">#${p.problemNumber || idx + 1}</td>
        <td style="padding: 8px; font-weight: bold; color: #0f172a; border: 1px solid #cbd5e1;">${p.title}</td>
        <td style="padding: 8px; text-align: center; font-weight: bold; color: ${diffColor}; background-color: ${diffBg}; border: 1px solid #cbd5e1;">${p.difficulty}</td>
        <td style="padding: 8px; text-align: center; border: 1px solid #cbd5e1;">${langs}</td>
        <td style="padding: 8px; text-align: center; font-size: 9pt; color: #475569; border: 1px solid #cbd5e1;">${solvedDate}</td>
        <td style="padding: 8px; border: 1px solid #cbd5e1; font-size: 8.5pt;">
          <a href="${p.githubUrl || '#'}" style="color: #0284c7; text-decoration: underline;">GitHub Solution</a>
        </td>
      </tr>
    `;
  }).join('');

  const wordHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${studentName} - Solved LeetCode Problems</title>
      <style>
        body { font-family: 'Segoe UI', Calibri, Arial, sans-serif; margin: 20px; color: #0f172a; }
        .header-title { color: #0284c7; font-size: 18pt; font-weight: bold; margin-bottom: 3px; }
        .header-subtitle { color: #64748b; font-size: 10pt; margin-top: 0; margin-bottom: 14px; }
        table { border-collapse: collapse; width: 100%; font-size: 9.5pt; border: 1px solid #cbd5e1; }
        th { background-color: #0284c7; color: #ffffff; padding: 9px 8px; text-align: center; font-size: 9.5pt; font-weight: bold; border: 1px solid #0369a1; }
        th.left { text-align: left; }
      </style>
    </head>
    <body>
      <div class="header-title">${studentName} • Solved LeetCode Solutions (${problems.length})</div>
      <div class="header-subtitle">Verified GitHub Solutions Record • Generated ${dateStr}</div>
      <table border="1" cellpadding="0" cellspacing="0">
        <thead>
          <tr style="background-color: #0284c7; color: #ffffff;">
            <th style="width: 45px;">S.No</th>
            <th style="width: 70px;">Prob #</th>
            <th class="left">Problem Title</th>
            <th style="width: 90px;">Difficulty</th>
            <th style="width: 100px;">Tech Stack</th>
            <th style="width: 110px;">Submission Date</th>
            <th style="width: 130px;">GitHub Link</th>
          </tr>
        </thead>
        <tbody>
          ${tableRowsHtml}
        </tbody>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob(['\uFEFF' + wordHtml], { type: 'application/msword;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${studentName.replace(/\s+/g, '_')}_Solved_Problems_${now.toISOString().split('T')[0]}.doc`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export Individual Student's Solved Problems as an Excel Table (.xls)
 */
export function exportStudentProblemsExcel(studentName, problems) {
  if (!problems || !problems.length) return;

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  const tableRowsHtml = problems.map((p, idx) => {
    const langs = p.allLanguages && p.allLanguages.length ? p.allLanguages.join(', ') : (p.language || 'Java');
    const solvedDate = p.solvedAt ? new Date(p.solvedAt).toLocaleDateString('en-GB') : 'Verified';

    return `
      <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
        <td style="padding: 8px; text-align: center; font-weight: bold; border: 1px solid #cbd5e1;">${idx + 1}</td>
        <td style="padding: 8px; text-align: center; font-family: monospace; font-weight: bold; color: #0284c7; border: 1px solid #cbd5e1;">#${p.problemNumber || idx + 1}</td>
        <td style="padding: 8px; font-weight: bold; border: 1px solid #cbd5e1;">${p.title}</td>
        <td style="padding: 8px; text-align: center; font-weight: bold; border: 1px solid #cbd5e1;">${p.difficulty}</td>
        <td style="padding: 8px; text-align: center; border: 1px solid #cbd5e1;">${langs}</td>
        <td style="padding: 8px; text-align: center; border: 1px solid #cbd5e1;">${solvedDate}</td>
        <td style="padding: 8px; border: 1px solid #cbd5e1;"><a href="${p.githubUrl || '#'}">${p.githubUrl || ''}</a></td>
      </tr>
    `;
  }).join('');

  const excelHtml = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8">
      <style>
        th { background-color: #5b21b6; color: #ffffff; font-weight: bold; padding: 10px 8px; border: 1px solid #4c1d95; text-align: center; }
        td { border: 1px solid #cbd5e1; vertical-align: middle; }
      </style>
    </head>
    <body>
      <h2 style="color: #5b21b6;">${studentName} - Solved LeetCode Solutions (${dateStr})</h2>
      <table border="1">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Problem #</th>
            <th>Title</th>
            <th>Difficulty</th>
            <th>Tech Stack</th>
            <th>Submission Date</th>
            <th>GitHub Repository URL</th>
          </tr>
        </thead>
        <tbody>
          ${tableRowsHtml}
        </tbody>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob(['\uFEFF' + excelHtml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${studentName.replace(/\s+/g, '_')}_Solved_Problems_${now.toISOString().split('T')[0]}.xls`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportLeaderboardCsv(students) {
  exportLeaderboardExcel(students);
}

export function exportToCsv(filename, headers, rows) {
  exportLeaderboardExcel(rows);
}
