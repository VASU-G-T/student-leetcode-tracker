import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Medal, Crown, ExternalLink, Download, Sparkles } from 'lucide-react';
import ProgressBar from '../common/ProgressBar';
import { sortLeaderboard } from '../../utils/helpers';
import { exportLeaderboardCsv } from '../../utils/exportCsv';

export default function LeaderboardTable({ students = [], showExport = true, limitCount = null }) {
  const sorted = sortLeaderboard(students);
  const displayList = limitCount ? sorted.slice(0, limitCount) : sorted;

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
              <th className="py-3 px-4 text-center hidden sm:table-cell text-emerald-400">Easy</th>
              <th className="py-3 px-4 text-center hidden sm:table-cell text-amber-400">Medium</th>
              <th className="py-3 px-4 text-center hidden sm:table-cell text-rose-400">Hard</th>
              <th className="py-3 px-4 w-44">Goal Progress</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm">
            {displayList.map((student, index) => {
              const rank = index + 1;
              const isTopThree = rank <= 3;

              return (
                <tr 
                  key={student.id}
                  className={`
                    transition-colors group
                    ${rank === 1 ? 'bg-amber-500/[0.04] hover:bg-amber-500/[0.08]' : ''}
                    ${rank === 2 ? 'bg-slate-500/[0.03] hover:bg-slate-500/[0.06]' : ''}
                    ${rank === 3 ? 'bg-orange-500/[0.03] hover:bg-orange-500/[0.06]' : ''}
                    ${rank > 3 ? 'hover:bg-slate-850/50' : ''}
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
                        className={`w-9 h-9 rounded-full object-cover border ${isTopThree ? 'border-amber-400/60' : 'border-slate-700'}`}
                      />
                      <div>
                        <Link 
                          to={`/student/${student.registerNumber || student.id}`}
                          className="font-semibold text-white group-hover:text-amber-400 transition-colors flex items-center gap-1.5"
                        >
                          <span>{student.name}</span>
                          {rank === 1 && <Sparkles className="w-3 h-3 text-amber-400" />}
                        </Link>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span className="font-mono">{student.registerNumber}</span>
                          {student.githubUsername && (
                            <span className="text-slate-500 hidden sm:inline font-mono">
                              @{student.githubUsername}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Department & Year */}
                  <td className="py-3.5 px-4 hidden md:table-cell">
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {student.department} - {student.year || '2nd Year'} ({student.section || 'A'})
                    </span>
                  </td>

                  {/* Total Solved */}
                  <td className="py-3.5 px-4 text-center">
                    <span className="text-base font-bold font-mono text-white">
                      {student.totalSolved || 0}
                    </span>
                  </td>

                  {/* Easy */}
                  <td className="py-3.5 px-4 text-center hidden sm:table-cell font-mono font-medium text-emerald-400">
                    {student.easySolved || 0}
                  </td>

                  {/* Medium */}
                  <td className="py-3.5 px-4 text-center hidden sm:table-cell font-mono font-medium text-amber-400">
                    {student.mediumSolved || 0}
                  </td>

                  {/* Hard */}
                  <td className="py-3.5 px-4 text-center hidden sm:table-cell font-mono font-medium text-rose-400">
                    {student.hardSolved || 0}
                  </td>

                  {/* Progress Goal */}
                  <td className="py-3.5 px-4">
                    <ProgressBar 
                      current={student.totalSolved || 0} 
                      target={student.goal || 200}
                      size="sm"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
