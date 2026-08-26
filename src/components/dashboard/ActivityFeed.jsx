import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, CheckCircle2, Clock, ExternalLink } from 'lucide-react';
import { formatRelativeTime } from '../../utils/helpers';

export default function ActivityFeed({ activities = [] }) {
  if (!activities.length) {
    return (
      <div className="glass-card p-6 text-center">
        <Activity className="w-8 h-8 mx-auto text-slate-600 mb-2" />
        <p className="text-sm text-slate-400 font-medium">No recent activity detected</p>
        <p className="text-xs text-slate-500 mt-1">
          Activity will appear automatically when LeetSync pushes problem solutions to GitHub.
        </p>
      </div>
    );
  }

  const difficultyColors = {
    Easy: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    Medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    Hard: 'text-rose-400 bg-rose-500/10 border-rose-500/20'
  };

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
            Recent GitHub Activity
          </h3>
        </div>
        <span className="text-xs text-slate-500 font-mono">Live Feed</span>
      </div>

      <div className="space-y-3">
        {activities.slice(0, 7).map((act) => (
          <div
            key={act.id}
            className="flex items-center justify-between p-3 rounded-lg bg-slate-950/50 border border-slate-800/60 hover:border-slate-700 transition-colors gap-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-300 truncate">
                  <Link 
                    to={`/student/${act.studentId}`} 
                    className="font-semibold text-white hover:text-amber-400 transition-colors"
                  >
                    {act.studentName}
                  </Link>{' '}
                  solved{' '}
                  <span className="font-medium text-slate-200">
                    {act.problemNumber ? `#${act.problemNumber} ` : ''}{act.problemTitle}
                  </span>
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-[10px] px-1.5 py-0.2 rounded border font-mono ${difficultyColors[act.difficulty] || difficultyColors.Medium}`}>
                    {act.difficulty || 'Solved'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[11px] text-slate-500 shrink-0">
              <Clock className="w-3 h-3" />
              <span>{formatRelativeTime(act.timestamp)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
