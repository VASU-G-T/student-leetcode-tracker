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
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-amber-300 to-amber-600 text-slate-950 font-extrabold shadow-lg shadow-amber-500/30 border border-amber-200 ring-2 ring-amber-400/40">
          <Crown className="w-4 h-4 fill-current" />
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-slate-200 to-slate-400 text-slate-950 font-extrabold shadow-md border border-white ring-2 ring-slate-400/30">
          2
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-amber-700 to-orange-800 text-amber-100 font-extrabold shadow-md border border-amber-600/60 ring-2 ring-amber-700/30">
          3
        </div>
      );
    }
    return (
      <span className="w-8 text-center text-sm font-semibold font-mono text-slate-400">
        #{rank}
      </span>
    );
  };

  if (!displayList.length) {
    return (
      <div className="glass-card p-12 text-center">
        <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h3 className="text-base font-medium text-slate-300">No students ranked yet</h3>
        <p className="text-xs text-slate-500 mt-1">
          Add students and sync their GitHub repositories to generate the leaderboard.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      {showExport && (
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Student Rankings
            </h3>
            <span className="text-xs font-mono text-slate-500">
              ({displayList.length} Students)
            </span>
          </div>

          <button
            onClick={() => exportLeaderboardCsv(sorted)}
            className="btn-secondary !py-1.5 !px-3 text-xs flex items-center gap-1.5"
            title="Download ranking data as CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4 w-16 text-center">Rank</th>
              <th className="py-3 px-4">Student</th>
              <th className="py-3 px-4 hidden md:table-cell">Dept & Year</th>
              <th className="py-3 px-4 text-center">Total Solved</th>
              <th className="py-3 px-4 text-center text-emerald-400">Today</th>
              <th className="py-3 px-4 text-center text-cyan-400">1 Week</th>
              <th className="py-3 px-4 text-center text-amber-400">1 Month</th>
              <th className="py-3 px-4 text-center text-orange-400">Streak</th>
              <th className="py-3 px-4 text-center hidden lg:table-cell text-emerald-400">Easy</th>
              <th className="py-3 px-4 text-center hidden lg:table-cell text-amber-400">Med</th>
              <th className="py-3 px-4 text-center hidden lg:table-cell text-rose-400">Hard</th>
              <th className="py-3 px-4 w-40">Goal Progress</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm">
            {paginatedList.map((student, index) => {
              const rank = limitCount ? index + 1 : (currentPage - 1) * pageSize + index + 1;
              const metrics = getStudentActivityMetrics(student);

              return (
                <tr 
                  key={student.id}
                  className={`
                    hover:bg-slate-850/50 transition-colors group
                    ${rank === 1 ? 'bg-amber-500/5' : ''}
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
                        className="w-9 h-9 rounded-xl object-cover border border-slate-700 shadow-sm shrink-0"
                      />
                      <div>
                        <Link
                          to={`/student/${student.registerNumber || student.id}`}
                          className="font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1"
                        >
                          {student.name}
                        </Link>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                          <span className="font-mono text-amber-400/90 font-medium">
                            {student.registerNumber}
                          </span>
                          <span>•</span>
                          <span>{student.section}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Dept & Year */}
                  <td className="py-3.5 px-4 hidden md:table-cell text-slate-300 text-xs">
                    <div>
                      <span className="font-medium text-white">{student.department}</span>
                      <span className="text-slate-500 block text-[11px]">{student.year || '2nd Year'}</span>
                    </div>
                  </td>

                  {/* Total Solved */}
                  <td className="py-3.5 px-4 text-center">
                    <span className="text-base font-bold font-mono text-white">
                      {student.totalSolved || 0}
                    </span>
                  </td>

                  {/* Today Submissions */}
                  <td className="py-3.5 px-4 text-center font-mono">
                    <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-bold border ${metrics.today > 0 ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-slate-800/40 text-slate-500 border-slate-800'}`}>
                      {metrics.today > 0 ? `+${metrics.today}` : '0'}
                    </span>
                  </td>

                  {/* 1 Week Submissions */}
                  <td className="py-3.5 px-4 text-center font-mono">
                    <span className="inline-block px-2 py-0.5 rounded-md text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {metrics.week}
                    </span>
                  </td>

                  {/* 1 Month Submissions */}
                  <td className="py-3.5 px-4 text-center font-mono">
                    <span className="inline-block px-2 py-0.5 rounded-md text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {metrics.month}
                    </span>
                  </td>

                  {/* Streak Count */}
                  <td className="py-3.5 px-4 text-center font-mono">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold border ${metrics.streak > 0 ? 'bg-orange-500/15 text-orange-400 border-orange-500/30' : 'bg-slate-800/40 text-slate-500 border-slate-800'}`}>
                      {metrics.streak > 0 ? `🔥 ${metrics.streak}d` : '0d'}
                    </span>
                  </td>

                  {/* Easy */}
                  <td className="py-3.5 px-4 text-center hidden lg:table-cell font-mono font-medium text-emerald-400">
                    {student.easySolved || 0}
                  </td>

                  {/* Medium */}
                  <td className="py-3.5 px-4 text-center hidden lg:table-cell font-mono font-medium text-amber-400">
                    {student.mediumSolved || 0}
                  </td>

                  {/* Hard */}
                  <td className="py-3.5 px-4 text-center hidden lg:table-cell font-mono font-medium text-rose-400">
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
