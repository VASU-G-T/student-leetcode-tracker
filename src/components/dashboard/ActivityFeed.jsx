import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Activity, CheckCircle2, Clock, ExternalLink, Flame, Sparkles } from 'lucide-react';
import { formatRelativeTime } from '../../utils/helpers';

export default function ActivityFeed({ activities = [] }) {
  const [filter24hOnly, setFilter24hOnly] = useState(false);

  // Filter for last 24 hours submissions
  const processedActivities = useMemo(() => {
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;

    const listWith24hFlag = activities.map(act => {
      const actTime = new Date(act.timestamp).getTime();
      const isWithin24h = !isNaN(actTime) && (now - actTime) <= oneDayMs;
      return { ...act, isWithin24h };
    });

    if (filter24hOnly) {
      const filtered = listWith24hFlag.filter(a => a.isWithin24h);
      return filtered.length > 0 ? filtered : listWith24hFlag.slice(0, 5);
    }

    return listWith24hFlag;
  }, [activities, filter24hOnly]);

  if (!activities.length) {
    return (
      <div className="glass-card p-6 text-center bg-white border-sky-100">
        <Activity className="w-8 h-8 mx-auto text-sky-400 mb-2" />
        <p className="text-sm text-slate-700 font-bold">No recent activity detected</p>
        <p className="text-xs text-slate-500 mt-1">
          Activity will appear automatically when LeetSync pushes problem solutions to GitHub.
        </p>
      </div>
    );
  }

  const difficultyColors = {
    Easy: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    Medium: 'text-sky-700 bg-sky-50 border-sky-200',
    Hard: 'text-rose-700 bg-rose-50 border-rose-200'
  };

  const count24h = activities.filter(a => {
    const actTime = new Date(a.timestamp).getTime();
    return !isNaN(actTime) && (Date.now() - actTime) <= 24 * 60 * 60 * 1000;
  }).length;

  return (
    <div className="glass-card p-5 bg-white border-sky-100 shadow-sm">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-sky-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sky-50 text-sky-600 border border-sky-200 shadow-sm">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-wide uppercase flex items-center gap-2">
              <span>Recent GitHub Submissions</span>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Feed
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              Verified solutions pushed to student repositories within the last 24 hours
            </p>
          </div>
        </div>

        {/* 24-Hour Filter Pill */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter24hOnly(!filter24hOnly)}
            className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 border shadow-sm ${
              filter24hOnly
                ? 'bg-sky-600 text-white border-sky-600 shadow-sky-500/20'
                : 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>24h Only ({count24h})</span>
          </button>
        </div>
      </div>

      {/* Activities List */}
      <div className="space-y-2.5">
        {processedActivities.slice(0, 8).map((act) => (
          <div
            key={act.id}
            className="flex items-center justify-between p-3 rounded-xl bg-sky-50/40 border border-sky-100/80 hover:border-sky-300 hover:bg-sky-50/80 transition-all gap-3 shadow-sm shadow-sky-500/5 group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 shrink-0 group-hover:scale-105 transition-transform">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-700 truncate">
                  <Link 
                    to={`/student/${act.studentId}`} 
                    className="font-bold text-slate-900 hover:text-sky-600 transition-colors mr-1"
                  >
                    {act.studentName}
                  </Link>
                  <span className="text-slate-500">solved</span>{' '}
                  <span className="font-bold text-slate-900">
                    {act.problemNumber ? `#${act.problemNumber} ` : ''}{act.problemTitle}
                  </span>
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded-md border font-mono font-bold ${difficultyColors[act.difficulty] || difficultyColors.Medium}`}>
                    {act.difficulty || 'Solved'}
                  </span>
                  {act.language && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-mono font-semibold">
                      {act.language}
                    </span>
                  )}
                  {act.isWithin24h && (
                    <span className="text-[9px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold border border-emerald-200">
                      ⚡ Last 24h
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 shrink-0 font-medium">
              <Clock className="w-3.5 h-3.5 text-sky-500" />
              <span className="font-mono text-slate-600">{formatRelativeTime(act.timestamp)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
