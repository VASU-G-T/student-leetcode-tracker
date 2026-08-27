import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Trophy, ExternalLink, ChevronRight, Award, Zap, Sparkles } from 'lucide-react';
import { getStudentActivityMetrics } from '../../utils/helpers';

export default function StreakLeadersList({ students = [] }) {
  // Sort students by highest active streak, then by total solved
  const streakLeaders = useMemo(() => {
    return [...students]
      .map(student => {
        const metrics = getStudentActivityMetrics(student);
        const streakDays = student.streak !== undefined ? student.streak : (metrics.streak || 0);
        return {
          ...student,
          streakDays,
          todayCount: student.todaySolved !== undefined ? student.todaySolved : (metrics.today || 0),
          weekCount: student.weekSolved !== undefined ? student.weekSolved : (metrics.week || 0)
        };
      })
      .sort((a, b) => {
        if (b.streakDays !== a.streakDays) {
          return b.streakDays - a.streakDays;
        }
        return (b.totalSolved || 0) - (a.totalSolved || 0);
      })
      .slice(0, 6);
  }, [students]);

  return (
    <div className="glass-card p-5 bg-white border-sky-100 shadow-sm flex flex-col justify-between h-full">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-2 pb-3 border-b border-sky-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-50 text-orange-600 border border-orange-200 shadow-sm">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 tracking-wide uppercase flex items-center gap-2">
                <span>Highest Streak Maintainers</span>
                <span className="inline-flex items-center gap-1 text-[10px] text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200 font-bold">
                  <Flame className="w-2.5 h-2.5 text-orange-500 fill-orange-500" />
                  Daily Consistency
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                Students maintaining the longest consecutive daily solving streaks
              </p>
            </div>
          </div>

          <Link
            to="/leaderboard"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Streak Leaders List */}
        {streakLeaders.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No active streaks recorded yet.
          </div>
        ) : (
          <div className="space-y-2.5 mt-3">
            {streakLeaders.map((student, idx) => {
              const isTop1 = idx === 0;
              const isTop2 = idx === 1;

              return (
                <div
                  key={student.id}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all gap-3 ${
                    isTop1
                      ? 'bg-gradient-to-r from-orange-50/70 via-amber-50/40 to-white border-orange-200 shadow-sm hover:border-orange-300'
                      : 'bg-sky-50/40 border-sky-100/80 hover:bg-sky-50/80 hover:border-sky-300'
                  }`}
                >
                  {/* Left: Rank & Avatar & Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Rank Badge */}
                    <div className="shrink-0 flex items-center justify-center">
                      {isTop1 ? (
                        <div className="w-7 h-7 rounded-xl bg-orange-500 text-white font-extrabold text-xs flex items-center justify-center shadow-md shadow-orange-500/25">
                          #1
                        </div>
                      ) : isTop2 ? (
                        <div className="w-7 h-7 rounded-xl bg-sky-600 text-white font-extrabold text-xs flex items-center justify-center shadow-md shadow-sky-500/25">
                          #2
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 font-extrabold text-xs flex items-center justify-center border border-slate-200">
                          #{idx + 1}
                        </div>
                      )}
                    </div>

                    {/* Avatar */}
                    <img
                      src={student.profileImage || `https://api.dicebear.com/7.x/bottts/svg?seed=${student.name}`}
                      alt={student.name}
                      className="w-8 h-8 rounded-full border border-sky-200 bg-white object-cover shrink-0"
                    />

                    {/* Name & Subtitle */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/student/${student.id}`}
                          className="font-extrabold text-xs text-slate-900 hover:text-sky-600 transition-colors truncate"
                        >
                          {student.name}
                        </Link>
                        {student.isCreator && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-sky-100 text-sky-700 font-bold border border-sky-200 shrink-0">
                            Creator
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5 font-medium">
                        <span className="font-mono font-bold text-sky-700">{student.registerNumber}</span>
                        <span>•</span>
                        <span className="font-semibold text-slate-600">{student.section || 'Sec F'}</span>
                        <span>•</span>
                        <span>{student.totalSolved || 0} Solved</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Streak Flame Pill */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right hidden sm:block">
                      <div className="text-[10px] text-emerald-700 font-bold font-mono">
                        +{student.todayCount} Today
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium font-mono">
                        {student.weekCount} this week
                      </div>
                    </div>

                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 shadow-sm shadow-orange-500/10">
                      <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
                      <span className="text-xs font-black font-mono text-orange-800">
                        {student.streakDays}d
                      </span>
                      <span className="text-[10px] font-bold text-orange-600 uppercase tracking-tight hidden xs:inline">
                        Streak
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
