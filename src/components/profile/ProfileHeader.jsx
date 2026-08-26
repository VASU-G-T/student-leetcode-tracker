import React from 'react';
import { Link } from 'react-router-dom';
import { 
  RefreshCw, 
  ExternalLink, 
  Calendar, 
  Award, 
  Mail, 
  GraduationCap, 
  Sparkles, 
  Share2,
  Edit3,
  Plus,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { GithubIcon, LeetCodeIcon } from '../common/Icons';
import ProgressBar from '../common/ProgressBar';
import { formatDateTime, formatRelativeTime, getStudentActivityMetrics } from '../../utils/helpers';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

export default function ProfileHeader({ student, isSyncing, onSync, onAddProject }) {
  const { showToast } = useData();
  const { currentUser, isAdmin } = useAuth();

  if (!student) return null;

  const isOwner = currentUser && (
    currentUser.studentId === student.id ||
    currentUser.username?.toLowerCase() === student.username?.toLowerCase() ||
    currentUser.registerNumber?.toLowerCase() === student.registerNumber?.toLowerCase() ||
    isAdmin
  );

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Profile URL copied to clipboard!', 'info');
    }
  };

  return (
    <div className="glass-card p-6 border-sky-100 relative overflow-hidden space-y-5 shadow-sm">
      {/* Top Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sky-400/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
        {/* Left: Avatar + Details */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left w-full lg:w-auto">
          <div className="relative group">
            <img
              src={student.profileImage || `https://api.dicebear.com/7.x/bottts/svg?seed=${student.githubUsername || student.name}`}
              alt={student.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-sky-300 shadow-md shadow-sky-500/10 bg-white"
            />
            {student.accessStatus === 'pending' && (
              <span className="absolute -bottom-2 -right-2 text-[9px] bg-sky-100 text-sky-700 border border-sky-200 px-2 py-0.5 rounded-full font-mono font-bold">
                Pending Review
              </span>
            )}
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {student.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-xs font-mono text-sky-700 font-bold shadow-sm">
                {student.registerNumber}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1.5 text-xs text-slate-600 font-medium">
              <div className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-sky-600" />
                <span>{student.department || 'ECE'} • {student.year || '2nd Year'} ({student.section || 'Sec A'})</span>
              </div>
              {student.email && (
                <div className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-sky-600" />
                  <span className="text-slate-500">{student.email}</span>
                </div>
              )}
            </div>

            {/* Student Bio */}
            {student.bio && (
              <p className="text-xs text-slate-600 max-w-xl line-clamp-2 leading-relaxed">
                {student.bio}
              </p>
            )}

            {/* Social / External Links & Owner Actions */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-1">
              {student.githubRepoUrl && (
                <a
                  href={student.githubRepoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary !py-1.5 !px-3 text-xs flex items-center gap-1.5"
                >
                  <GithubIcon className="w-3.5 h-3.5 text-slate-700" />
                  <span>LeetCode Repo</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              )}

              {student.leetcodeUsername && (
                <a
                  href={`https://leetcode.com/${student.leetcodeUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary !py-1.5 !px-3 text-xs flex items-center gap-1.5 hover:text-sky-600 hover:border-sky-300"
                >
                  <LeetCodeIcon className="w-3.5 h-3.5 text-sky-500" />
                  <span>LeetCode</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              )}

              {isOwner && (
                <>
                  <Link
                    to="/student/edit-profile"
                    className="btn-primary !py-1.5 !px-3 text-xs flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit Profile</span>
                  </Link>
                  {onAddProject && (
                    <button
                      onClick={onAddProject}
                      className="btn-secondary !py-1.5 !px-3 text-xs flex items-center gap-1.5 text-sky-700 border-sky-200 hover:bg-sky-50"
                    >
                      <Plus className="w-3 h-3" />
                      <span>+ Add Project</span>
                    </button>
                  )}
                </>
              )}

              <button
                onClick={handleShare}
                className="p-2 text-slate-500 hover:text-sky-600 bg-white border border-slate-200 rounded-xl hover:border-sky-300 transition-colors shadow-sm"
                title="Share profile link"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Sync Action & Goal Progress */}
        <div className="w-full lg:w-80 flex flex-col justify-between gap-3.5 p-4 rounded-2xl bg-sky-50/60 border border-sky-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Target Goal
            </span>
            <button
              onClick={() => onSync && onSync(student.id)}
              disabled={isSyncing}
              className="btn-secondary !py-1 !px-2.5 text-xs flex items-center gap-1.5 font-semibold text-sky-700"
              title="Fetch latest commits and problem solutions from GitHub"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin text-sky-600' : 'text-sky-600'}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Repo'}</span>
            </button>
          </div>

          <ProgressBar 
            current={student.totalSolved || 0} 
            target={student.goal || 4033}
            size="md"
          />

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1.5 border-t border-sky-100 font-medium">
            <span>Last Synced:</span>
            <span className="font-bold text-slate-700">
              {formatRelativeTime(student.lastSynced)}
            </span>
          </div>
        </div>
      </div>

      {/* Submission Metrics Banner */}
      {(() => {
        const metrics = getStudentActivityMetrics(student);
        return (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-sky-100">
            <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200/80 text-center shadow-sm">
              <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block">Today's Solved</span>
              <span className="text-xl font-extrabold font-mono text-emerald-700">
                {metrics.today > 0 ? `+${metrics.today}` : '0'}
              </span>
              <span className="text-[10px] text-emerald-600 block mt-0.5 font-semibold">Last 24 Hours</span>
            </div>

            <div className="bg-sky-50/70 p-3 rounded-2xl border border-sky-200/80 text-center shadow-sm">
              <span className="text-[10px] text-sky-700 font-bold uppercase tracking-wider block">Last 1 Week</span>
              <span className="text-xl font-extrabold font-mono text-sky-700">
                {metrics.week}
              </span>
              <span className="text-[10px] text-sky-600 block mt-0.5 font-semibold">Past 7 Days</span>
            </div>

            <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-200/80 text-center shadow-sm">
              <span className="text-[10px] text-amber-700 font-bold uppercase tracking-wider block">Last 1 Month</span>
              <span className="text-xl font-extrabold font-mono text-amber-700">
                {metrics.month}
              </span>
              <span className="text-[10px] text-amber-600 block mt-0.5 font-semibold">Past 30 Days</span>
            </div>

            <div className="bg-orange-50/70 p-3 rounded-2xl border border-orange-200/80 text-center shadow-sm">
              <span className="text-[10px] text-orange-700 font-bold uppercase tracking-wider block">Daily Streak</span>
              <span className="text-xl font-extrabold font-mono text-orange-700 flex items-center justify-center gap-1">
                🔥 {metrics.streak}d
              </span>
              <span className="text-[10px] text-orange-600 block mt-0.5 font-semibold">Active Consistency</span>
            </div>
          </div>
        );
      })()}

      {/* Skills Badges */}
      {student.skills && student.skills.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-sky-100 text-xs">
          <span className="text-slate-500 text-xs font-bold">Skills:</span>
          {student.skills.map((skill, idx) => (
            <span
              key={idx}
              className="px-2.5 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-[11px] font-mono font-bold text-sky-700 shadow-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
