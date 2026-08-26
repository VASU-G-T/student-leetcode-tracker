/**
 * Export Utilities for LeetTrack
 * Direct Word Document Table (.doc) Exporter - Arranges each data point into its own separate table cell.
 */

import { getStudentActivityMetrics } from './helpers.js';

/**
 * Export Leaderboard directly as a Formatted Microsoft Word Document (.doc) Table
 * Every single piece of data is placed in its own dedicated table cell (no merged columns).
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
    const isTop2 = rank === 2;
    const isTop3 = rank === 3;

    const rankLabel = isTop1 ? '👑 #1' : isTop2 ? '🥈 #2' : isTop3 ? '🥉 #3' : `#${rank}`;
    const rowBg = isTop1 ? '#fef3c7' : (idx % 2 === 0 ? '#ffffff' : '#f8fafc');

    return `
      <tr style="background-color: ${rowBg};">
        <td style="padding: 8px 6px; text-align: center; font-weight: bold; border: 1px solid #cbd5e1; color: ${isTop1 ? '#b45309' : '#1e293b'}; font-size: 10pt;">
          ${rankLabel}
        </td>
        <td style="padding: 8px 8px; font-weight: bold; border: 1px solid #cbd5e1; color: #0f172a; font-size: 10pt;">
          ${s.name || 'Student'}
        </td>
        <td style="padding: 8px 6px; text-align: center; font-family: monospace; font-weight: bold; border: 1px solid #cbd5e1; color: #0284c7; font-size: 9.5pt;">
          ${s.registerNumber || s.regNo || s.username || '-'}
        </td>
        <td style="padding: 8px 6px; text-align: center; border: 1px solid #cbd5e1; color: #334155; font-size: 9.5pt;">
          ${s.department || 'ECE'}
        </td>
        <td style="padding: 8px 6px; text-align: center; border: 1px solid #cbd5e1; color: #334155; font-size: 9pt;">
          ${s.year || '2nd Year'}
        </td>
        <td style="padding: 8px 6px; text-align: center; font-weight: bold; border: 1px solid #cbd5e1; color: #0284c7; font-size: 9.5pt;">
          ${s.section || 'Sec F'}
        </td>
        <td style="padding: 8px 6px; text-align: center; font-weight: bold; border: 1px solid #cbd5e1; color: #0f172a; font-size: 11.5pt;">
          ${s.totalSolved ?? 0}
        </td>
        <td style="padding: 8px 6px; text-align: center; font-weight: bold; border: 1px solid #cbd5e1; color: #047857; background-color: #ecfdf5; font-size: 10pt;">
          +${metrics.today ?? 0}
        </td>
        <td style="padding: 8px 6px; text-align: center; font-weight: bold; border: 1px solid #cbd5e1; color: #0284c7; background-color: #f0f9ff; font-size: 10pt;">
          ${metrics.week ?? 0}
        </td>
        <td style="padding: 8px 6px; text-align: center; font-weight: bold; border: 1px solid #cbd5e1; color: #ea580c; background-color: #fff7ed; font-size: 10pt;">
          ${metrics.month ?? 0}
        </td>
        <td style="padding: 8px 6px; text-align: center; font-weight: bold; border: 1px solid #cbd5e1; color: #c2410c; background-color: #fffaf0; font-size: 9.5pt;">
          🔥 ${metrics.streak ?? 0}d
        </td>
        <td style="padding: 8px 6px; text-align: center; font-weight: bold; border: 1px solid #cbd5e1; color: #059669; font-size: 9.5pt;">
          ${s.easySolved ?? 0}
        </td>
        <td style="padding: 8px 6px; text-align: center; font-weight: bold; border: 1px solid #cbd5e1; color: #0284c7; font-size: 9.5pt;">
          ${s.mediumSolved ?? 0}
        </td>
        <td style="padding: 8px 6px; text-align: center; font-weight: bold; border: 1px solid #cbd5e1; color: #e11d48; font-size: 9.5pt;">
          ${s.hardSolved ?? 0}
        </td>
        <td style="padding: 8px 8px; border: 1px solid #cbd5e1; font-size: 8.5pt; font-family: monospace;">
          <a href="${s.githubRepoUrl || '#'}" style="color: #0284c7; text-decoration: underline;">
            ${s.githubRepoUrl || 'https://github.com'}
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
      <!--[if gte mso 9]>
      <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>100</w:Zoom>
          <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
      </xml>
      <![endif]-->
      <style>
        @page {
          size: A4 landscape;
          margin: 1.5cm;
        }
        body {
          font-family: 'Segoe UI', Calibri, Arial, sans-serif;
          margin: 20px;
          color: #0f172a;
        }
        .header-title {
          color: #0284c7;
          font-size: 18pt;
          font-weight: bold;
          margin-bottom: 3px;
        }
        .header-subtitle {
          color: #64748b;
          font-size: 10pt;
          margin-top: 0;
          margin-bottom: 14px;
        }
        .meta-box {
          background-color: #f0f9ff;
          border: 1px solid #bae6fd;
          padding: 8px 12px;
          border-radius: 6px;
          margin-bottom: 16px;
          font-size: 9pt;
          color: #0369a1;
        }
        table {
          border-collapse: collapse;
          width: 100%;
          font-size: 9pt;
          border: 1px solid #cbd5e1;
        }
        th {
          background-color: #0284c7;
          color: #ffffff;
          padding: 8px 6px;
          text-align: center;
          font-size: 9pt;
          font-weight: bold;
          border: 1px solid #0369a1;
        }
        th.left {
          text-align: left;
        }
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

      <div style="margin-top: 20px; font-size: 8pt; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 6px;">
        Student LeetCode DSA Tracker • Developed by G T VASUDEVAN (ECE Dept) • Automated Progress Verification System
      </div>
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
 * Export Leaderboard directly as an Excel Spreadsheet Table (.xls)
 */
export function exportLeaderboardExcel(students) {
  if (!students || !students.length) return;

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  const tableRowsHtml = students.map((s, idx) => {
    const metrics = getStudentActivityMetrics(s);
    const rank = idx + 1;
    const rowBg = rank === 1 ? '#fef3c7' : (idx % 2 === 0 ? '#ffffff' : '#f8fafc');

    return `
      <tr style="background-color: ${rowBg};">
        <td style="padding: 8px; text-align: center; font-weight: bold; border: 1px solid #cbd5e1;">${rank}</td>
        <td style="padding: 8px; font-weight: bold; border: 1px solid #cbd5e1;">${s.name || 'Student'}</td>
        <td style="padding: 8px; text-align: center; border: 1px solid #cbd5e1; mso-number-format:'\\@'; font-weight: bold;">${s.registerNumber || s.regNo || '-'}</td>
        <td style="padding: 8px; text-align: center; border: 1px solid #cbd5e1;">${s.department || 'ECE'}</td>
        <td style="padding: 8px; text-align: center; border: 1px solid #cbd5e1;">${s.year || '2nd Year'}</td>
        <td style="padding: 8px; text-align: center; border: 1px solid #cbd5e1;">${s.section || 'Sec F'}</td>
        <td style="padding: 8px; text-align: center; font-weight: bold; border: 1px solid #cbd5e1;">${s.totalSolved ?? 0}</td>
        <td style="padding: 8px; text-align: center; font-weight: bold; color: #047857; border: 1px solid #cbd5e1;">+${metrics.today ?? 0}</td>
        <td style="padding: 8px; text-align: center; font-weight: bold; color: #0284c7; border: 1px solid #cbd5e1;">${metrics.week ?? 0}</td>
        <td style="padding: 8px; text-align: center; font-weight: bold; color: #ea580c; border: 1px solid #cbd5e1;">${metrics.month ?? 0}</td>
        <td style="padding: 8px; text-align: center; font-weight: bold; color: #c2410c; border: 1px solid #cbd5e1;">${metrics.streak ?? 0}d</td>
        <td style="padding: 8px; text-align: center; color: #059669; border: 1px solid #cbd5e1;">${s.easySolved ?? 0}</td>
        <td style="padding: 8px; text-align: center; color: #0284c7; border: 1px solid #cbd5e1;">${s.mediumSolved ?? 0}</td>
        <td style="padding: 8px; text-align: center; color: #e11d48; border: 1px solid #cbd5e1;">${s.hardSolved ?? 0}</td>
        <td style="padding: 8px; border: 1px solid #cbd5e1;"><a href="${s.githubRepoUrl || '#'}">${s.githubRepoUrl || ''}</a></td>
      </tr>
    `;
  }).join('');

  const excelHtml = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8">
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>ECE Leaderboard</x:Name>
              <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <style>
        th { background-color: #0284c7; color: #ffffff; font-weight: bold; padding: 10px 8px; border: 1px solid #0369a1; text-align: center; }
        td { border: 1px solid #cbd5e1; vertical-align: middle; }
      </style>
    </head>
    <body>
      <h2 style="color: #0284c7;">ECE Department - LeetCode Student Leaderboard (${dateStr})</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Register Number</th>
            <th>Department</th>
            <th>Year</th>
            <th>Section</th>
            <th>Total Solved</th>
            <th>Today</th>
            <th>1 Week</th>
            <th>1 Month</th>
            <th>Streak</th>
            <th>Easy</th>
            <th>Medium</th>
            <th>Hard</th>
            <th>GitHub Repository</th>
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
  link.setAttribute('download', `ECE_LeetCode_Leaderboard_${now.toISOString().split('T')[0]}.xls`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Clean CSV fallback
 */
export function exportLeaderboardCsv(students) {
  exportLeaderboardWordDoc(students);
}

export function exportToCsv(filename, headers, rows) {
  if (!rows || !rows.length) return;

  const formatCell = (val) => {
    if (val === null || val === undefined || val === '') return '';
    const str = String(val).trim();
    if (str.includes(',') || str.includes('\n') || str.includes('\r') || str.includes('"')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csvLines = [
    headers.map(formatCell).join(','),
    ...rows.map(row => row.map(formatCell).join(','))
  ];

  const csvContent = csvLines.join('\r\n');

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
