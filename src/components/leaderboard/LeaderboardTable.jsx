import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Medal, Crown, ExternalLink, Download, Sparkles } from 'lucide-react';
import ProgressBar from '../common/ProgressBar';
import Pagination from '../common/Pagination';
import { sortLeaderboard, getStudentActivityMetrics } from '../../utils/helpers';
import { exportLeaderboardCsv } from '../../utils/exportCsv';

export default function LeaderboardTable({ students = [], showExport = true, limitCount = null }) {
  const sorted = sortLeaderboard(students);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  const displayList = limitCount ? sorted.slice(0, limitCount) : sorted;
  const paginatedList = limitCount 
    ? displayList 
    : displayList.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getRankBadge = (rank) => {
    if (rank === 1) {
      return (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 text-slate-950 font-extrabold shadow-md shadow-amber-500/30 border border-amber-200 ring-2 ring-amber-300/40">
          <Crown className="w-4 h-4 fill-current" />
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-slate-100 to-slate-300 text-slate-800 font-extrabold shadow-sm border border-slate-300 ring-2 ring-slate-200">
          2
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 text-white font-extrabold shadow-sm border border-amber-500 ring-2 ring-amber-600/30">
          3
        </div>
      );
    }
    return (
      <span className="w-8 text-center text-sm font-bold font-mono text-slate-500">
        #{rank}
      </span>
    );
  };

  if (!displayList.length) {
    return (
      <div className="glass-card p-12 text-center">
        <Trophy className="w-12 h-12 text-sky-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-800">No students ranked yet</h3>
        <p className="text-xs text-slate-500 mt-1">
          Add students and sync their GitHub repositories to generate the leaderboard.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden shadow-sm">
      {showExport && (
        <div className="p-4 border-b border-sky-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-sky-50 text-sky-600 border border-sky-200">
              <Trophy className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Student Rankings
            </h3>
            <span className="text-xs font-mono font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
              {displayList.length} Students
            </span>
          </div>

          <button
            onClick={() => exportLeaderboardCsv(sorted)}
            className="btn-secondary !py-1.5 !px-3 text-xs flex items-center gap-1.5 font-semibold text-sky-700 hover:text-sky-800"
            title="Download ranking data as CSV"
          >
            <Download className="w-3.5 h-3.5 text-sky-600" />
            <span>Export CSV</span>
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-sky-100 bg-sky-50/70 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <th className="py-3.5 px-4 w-16 text-center">Rank</th>
              <th className="py-3.5 px-4">Student</th>
              <th className="py-3.5 px-4 hidden md:table-cell">Dept & Year</th>
              <th className="py-3.5 px-4 text-center">Total Solved</th>
              <th className="py-3.5 px-4 text-center text-emerald-700">Today</th>
              <th className="py-3.5 px-4 text-center text-sky-700">1 Week</th>
              <th className="py-3.5 px-4 text-center text-amber-700">1 Month</th>
              <th className="py-3.5 px-4 text-center text-orange-700">Streak</th>
              <th className="py-3.5 px-4 text-center hidden lg:table-cell text-emerald-700">Easy</th>
              <th className="py-3.5 px-4 text-center hidden lg:table-cell text-sky-700">Med</th>
              <th className="py-3.5 px-4 text-center hidden lg:table-cell text-rose-700">Hard</th>
              <th className="py-3.5 px-4 w-40">Goal Progress</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sky-100/70 text-sm bg-white">
            {paginatedList.map((student, index) => {
              const rank = limitCount ? index + 1 : (currentPage - 1) * pageSize + index + 1;
              const metrics = getStudentActivityMetrics(student);

              return (
                <tr 
                  key={student.id}
                  className={`
                    hover:bg-sky-50/50 transition-colors group
                    ${rank === 1 ? 'bg-sky-50/30' : ''}
                  `}
                >
                  {/* Rank Badge */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex justify-center items-center">
                      {getRankBadge(rank)}
                    </div>
                  </td>

                  {/* Student Info */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={student.profileImage || `https://api.dicebear.com/7.x/bottts/svg?seed=${student.githubUsername || student.name}`}
                        alt={student.name}
                        className="w-10 h-10 rounded-xl object-cover border border-sky-200 shadow-sm shrink-0 bg-sky-50"
                      />
                      <div>
                        <Link
                          to={`/student/${student.registerNumber || student.id}`}
                          className="font-bold text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-1 text-sm"
                        >
                          {student.name}
                        </Link>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                          <span className="font-mono bg-sky-50 text-sky-700 px-1.5 py-0.2 rounded border border-sky-200 font-bold">
                            {student.registerNumber}
                          </span>
                          <span>•</span>
                          <span className="font-medium">{student.section}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Dept & Year */}
                  <td className="py-3.5 px-4 hidden md:table-cell text-slate-600 text-xs">
                    <div>
                      <span className="font-bold text-slate-800">{student.department}</span>
                      <span className="text-slate-500 block text-[11px] font-medium">{student.year || '2nd Year'}</span>
                    </div>
                  </td>

                  {/* Total Solved */}
                  <td className="py-3.5 px-4 text-center">
                    <span className="text-base font-extrabold font-mono text-slate-900">
                      {student.totalSolved || 0}
                    </span>
                  </td>

                  {/* Today Submissions */}
                  <td className="py-3.5 px-4 text-center font-mono">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold border ${metrics.today > 0 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                      {metrics.today > 0 ? `+${metrics.today}` : '0'}
                    </span>
                  </td>

                  {/* 1 Week Submissions */}
                  <td className="py-3.5 px-4 text-center font-mono">
                    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
                      {metrics.week}
                    </span>
                  </td>

                  {/* 1 Month Submissions */}
                  <td className="py-3.5 px-4 text-center font-mono">
                    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      {metrics.month}
                    </span>
                  </td>

                  {/* Streak Count */}
                  <td className="py-3.5 px-4 text-center font-mono">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${metrics.streak > 0 ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                      {metrics.streak > 0 ? `🔥 ${metrics.streak}d` : '0d'}
                    </span>
                  </td>

                  {/* Easy */}
                  <td className="py-3.5 px-4 text-center hidden lg:table-cell font-mono font-bold text-emerald-600">
                    {student.easySolved || 0}
                  </td>

                  {/* Medium */}
                  <td className="py-3.5 px-4 text-center hidden lg:table-cell font-mono font-bold text-sky-600">
                    {student.mediumSolved || 0}
                  </td>

                  {/* Hard */}
                  <td className="py-3.5 px-4 text-center hidden lg:table-cell font-mono font-bold text-rose-600">
                    {student.hardSolved || 0}
                  </td>

                  {/* Progress Goal */}
                  <td className="py-3.5 px-4">
                    <ProgressBar 
                      current={student.totalSolved || 0} 
                      target={student.goal || 4033}
                      size="sm"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {!limitCount && displayList.length > 25 && (
        <Pagination
          currentPage={currentPage}
          totalItems={displayList.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          pageSizeOptions={[25, 50, 100, 400]}
        />
      )}
    </div>
  );
}
