import React from 'react';
import { 
  RefreshCw, 
  ExternalLink, 
  Calendar, 
  Award, 
  Mail, 
  GraduationCap, 
  Sparkles, 
  Share2 
} from 'lucide-react';
import { GithubIcon, LeetCodeIcon } from '../common/Icons';
import ProgressBar from '../common/ProgressBar';
import { formatDateTime, formatRelativeTime } from '../../utils/helpers';
import { useData } from '../../context/DataContext';

export default function ProfileHeader({ student, isSyncing, onSync }) {
  const { showToast } = useData();

  if (!student) return null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Profile URL copied to clipboard!', 'info');
    }
  };

  return (
    <div className="glass-card p-6 border-slate-800 relative overflow-hidden">
      {/* Top Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
        {/* Left: Avatar + Details */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left w-full lg:w-auto">
          <div className="relative group">
            <img
              src={student.profileImage || `https://api.dicebear.com/7.x/bottts/svg?seed=${student.githubUsername || student.name}`}
              alt={student.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-amber-500/40 shadow-xl shadow-amber-500/10"
            />
            {student.isSample && (
              <span className="absolute -bottom-2 -right-2 text-[9px] bg-slate-800 text-amber-400 border border-slate-700 px-1.5 py-0.5 rounded font-mono">
                Sample
              </span>
            )}
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {student.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-mono text-amber-400 font-semibold">
                {student.registerNumber}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-slate-400" />
                <span>{student.department} • {student.year || '2nd Year'} (Sec {student.section || 'A'})</span>
              </div>
              {student.email && (
                <div className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-400">{student.email}</span>
                </div>
              )}
            </div>

            {/* Social / External Links */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-1">
              {student.githubRepoUrl && (
                <a
                  href={student.githubRepoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary !py-1.5 !px-3 text-xs flex items-center gap-1.5 bg-slate-900"
                >
                  <GithubIcon className="w-3.5 h-3.5 text-slate-300" />
                  <span>GitHub Repository</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              )}

              {student.leetcodeUsername && (
                <a
                  href={`https://leetcode.com/${student.leetcodeUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary !py-1.5 !px-3 text-xs flex items-center gap-1.5 bg-slate-900 hover:text-amber-400"
                >
                  <LeetCodeIcon className="w-3.5 h-3.5 text-amber-500" />
                  <span>LeetCode Profile</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              )}

              <button
                onClick={handleShare}
                className="p-1.5 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors"
                title="Share profile link"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Sync Action & Goal Progress */}
        <div className="w-full lg:w-80 flex flex-col justify-between gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Target Goal
            </span>
            <button
              onClick={() => onSync && onSync(student.id)}
              disabled={isSyncing}
              className="btn-secondary !py-1 !px-2.5 text-xs flex items-center gap-1.5"
              title="Fetch latest commits and problem solutions from GitHub"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin text-amber-400' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Repo'}</span>
            </button>
          </div>

          <ProgressBar 
            current={student.totalSolved || 0} 
            target={student.goal || 200}
            size="md"
          />

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
            <span>Last Synced:</span>
            <span className="font-medium text-slate-300">
              {formatRelativeTime(student.lastSynced)}
            </span>
          </div>
        </div>
      </div>

      {/* Numerical Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-slate-800/80">
        <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/60">
          <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">Total Solved</span>
          <p className="text-2xl font-bold text-white mt-1 font-mono">{student.totalSolved || 0}</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/40 border border-emerald-500/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase text-emerald-400 tracking-wider">Easy</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-1 font-mono">{student.easySolved || 0}</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/40 border border-amber-500/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase text-amber-400 tracking-wider">Medium</span>
            <span className="w-2 h-2 rounded-full bg-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400 mt-1 font-mono">{student.mediumSolved || 0}</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/40 border border-rose-500/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase text-rose-400 tracking-wider">Hard</span>
            <span className="w-2 h-2 rounded-full bg-rose-400" />
          </div>
          <p className="text-2xl font-bold text-rose-400 mt-1 font-mono">{student.hardSolved || 0}</p>
        </div>
      </div>
    </div>
  );
}
