import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, CheckCircle2, Clock, ExternalLink } from 'lucide-react';
import { formatRelativeTime } from '../../utils/helpers';

export default function ActivityFeed({ activities = [] }) {
  if (!activities.length) {
    return (
      <div className="glass-card p-6 text-center">
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

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-sky-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-sky-50 text-sky-600 border border-sky-200">
            <Activity className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Recent GitHub Activity
          </h3>
        </div>
        <span className="text-xs text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200 font-semibold font-mono">
          Live Feed
        </span>
      </div>

      <div className="space-y-2.5">
        {activities.slice(0, 7).map((act) => (
          <div
            key={act.id}
            className="flex items-center justify-between p-3 rounded-xl bg-sky-50/40 border border-sky-100/80 hover:border-sky-300 hover:bg-sky-50/80 transition-all gap-3 shadow-sm shadow-sky-500/5"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-700 truncate">
                  <Link 
                    to={`/student/${act.studentId}`} 
                    className="font-bold text-slate-900 hover:text-sky-600 transition-colors"
                  >
                    {act.studentName}
                  </Link>{' '}
                  solved{' '}
                  <span className="font-semibold text-slate-800">
                    {act.problemNumber ? `#${act.problemNumber} ` : ''}{act.problemTitle}
                  </span>
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-mono font-semibold ${difficultyColors[act.difficulty] || difficultyColors.Medium}`}>
                    {act.difficulty || 'Solved'}
                  </span>
                  {act.language && (
                    <span className="text-[10px] text-slate-500 font-mono">
                      {act.language}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[11px] text-slate-500 shrink-0 font-medium">
              <Clock className="w-3 h-3 text-sky-500" />
              <span>{formatRelativeTime(act.timestamp)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
