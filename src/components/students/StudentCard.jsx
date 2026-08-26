import React from 'react';
import { Link } from 'react-router-dom';
import { 
  RefreshCw, 
  ExternalLink, 
  Eye, 
  Edit, 
  Trash2, 
  CheckCircle,
  GraduationCap
} from 'lucide-react';
import { GithubIcon } from '../common/Icons';
import ProgressBar from '../common/ProgressBar';
import { formatRelativeTime, getStudentActivityMetrics } from '../../utils/helpers';

export default function StudentCard({ 
  student, 
  isAdmin = false, 
  isSyncing = false, 
  onSync, 
  onEdit, 
  onDelete 
}) {
  return (
    <div className="glass-card-hover p-5 flex flex-col justify-between group">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={student.profileImage || `https://api.dicebear.com/7.x/bottts/svg?seed=${student.githubUsername || student.name}`}
              alt={student.name}
              className="w-12 h-12 rounded-2xl object-cover border border-sky-200 shadow-sm bg-sky-50 shrink-0"
            />
            <div>
              <Link
                to={`/student/${student.registerNumber || student.id}`}
                className="font-bold text-slate-900 group-hover:text-sky-600 transition-colors text-base line-clamp-1"
              >
                {student.name}
              </Link>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                <span className="font-mono bg-sky-50 px-2 py-0.5 rounded-full text-sky-700 font-bold border border-sky-200 text-[11px]">
                  {student.registerNumber}
                </span>
                <span className="font-medium text-slate-600">{student.department} • {student.section}</span>
              </div>
            </div>
          </div>

          {isAdmin && (
            <button
              onClick={() => onSync && onSync(student.id)}
              disabled={isSyncing}
              className="p-2 rounded-xl text-slate-500 hover:text-sky-600 hover:bg-sky-50 border border-slate-200 hover:border-sky-300 transition-colors"
              title="Sync repository"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-sky-600' : ''}`} />
            </button>
          )}
        </div>

        {/* Solved Stats Row */}
        <div className="grid grid-cols-3 gap-2 mt-4 mb-2 pt-3 border-t border-sky-100 text-center">
          <div className="bg-emerald-50/60 p-2 rounded-xl border border-emerald-200/80">
            <span className="text-[10px] text-emerald-700 block font-bold uppercase tracking-wider">Easy</span>
            <span className="text-sm font-extrabold text-emerald-700 font-mono">{student.easySolved || 0}</span>
          </div>
          <div className="bg-sky-50/60 p-2 rounded-xl border border-sky-200/80">
            <span className="text-[10px] text-sky-700 block font-bold uppercase tracking-wider">Med</span>
            <span className="text-sm font-extrabold text-sky-700 font-mono">{student.mediumSolved || 0}</span>
          </div>
          <div className="bg-rose-50/60 p-2 rounded-xl border border-rose-200/80">
            <span className="text-[10px] text-rose-700 block font-bold uppercase tracking-wider">Hard</span>
            <span className="text-sm font-extrabold text-rose-700 font-mono">{student.hardSolved || 0}</span>
          </div>
        </div>

        {/* Submissions Velocity & Streak */}
        {(() => {
          const metrics = getStudentActivityMetrics(student);
          return (
            <div className="grid grid-cols-4 gap-1.5 mb-3 text-center text-[10px] font-mono">
              <div className="bg-emerald-50 border border-emerald-200 py-1 px-1 rounded-lg">
                <span className="text-slate-500 block text-[9px] font-bold">TODAY</span>
                <span className="text-emerald-700 font-extrabold">{metrics.today > 0 ? `+${metrics.today}` : '0'}</span>
              </div>
              <div className="bg-sky-50 border border-sky-200 py-1 px-1 rounded-lg">
                <span className="text-slate-500 block text-[9px] font-bold">1 WEEK</span>
                <span className="text-sky-700 font-extrabold">{metrics.week}</span>
              </div>
              <div className="bg-amber-50 border border-amber-200 py-1 px-1 rounded-lg">
                <span className="text-slate-500 block text-[9px] font-bold">1 MONTH</span>
                <span className="text-amber-700 font-extrabold">{metrics.month}</span>
              </div>
              <div className="bg-orange-50 border border-orange-200 py-1 px-1 rounded-lg">
                <span className="text-slate-500 block text-[9px] font-bold">STREAK</span>
                <span className="text-orange-700 font-extrabold">🔥 {metrics.streak}d</span>
              </div>
            </div>
          );
        })()}

        {/* Goal Progress */}
        <div className="mb-4">
          <ProgressBar 
            current={student.totalSolved || 0} 
            target={student.goal || 4033}
            size="sm"
          />
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="pt-3 border-t border-sky-100 flex items-center justify-between text-xs">
        <span className="text-slate-500 text-[11px] font-medium">
          Synced {formatRelativeTime(student.lastSynced)}
        </span>

        <div className="flex items-center gap-1.5">
          <Link
            to={`/student/${student.registerNumber || student.id}`}
            className="p-1.5 text-sky-700 hover:text-white bg-sky-50 hover:bg-sky-600 rounded-lg border border-sky-200 transition-colors shadow-sm"
            title="View student profile"
          >
            <Eye className="w-3.5 h-3.5" />
          </Link>

          {isAdmin && onEdit && (
            <button
              onClick={() => onEdit(student)}
              className="p-1.5 text-amber-700 hover:text-white bg-amber-50 hover:bg-amber-500 rounded-lg border border-amber-200 transition-colors shadow-sm"
              title="Edit student"
            >
              <Edit className="w-3.5 h-3.5" />
            </button>
          )}

          {isAdmin && onDelete && (
            <button
              onClick={() => onDelete(student)}
              className="p-1.5 text-rose-700 hover:text-white bg-rose-50 hover:bg-rose-500 rounded-lg border border-rose-200 transition-colors shadow-sm"
              title="Delete student"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
