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
import { formatRelativeTime } from '../../utils/helpers';

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
              className="w-12 h-12 rounded-xl object-cover border border-slate-700 shadow-md"
            />
            <div>
              <Link
                to={`/student/${student.registerNumber || student.id}`}
                className="font-bold text-white group-hover:text-amber-400 transition-colors text-base line-clamp-1"
              >
                {student.name}
              </Link>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span className="font-mono bg-slate-800 px-1.5 py-0.5 rounded text-amber-400/90 border border-slate-700">
                  {student.registerNumber}
                </span>
                <span>{student.department}</span>
              </div>
            </div>
          </div>

          {isAdmin && (
            <button
              onClick={() => onSync && onSync(student.id)}
              disabled={isSyncing}
              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 border border-slate-800 transition-colors"
              title="Sync repository"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-amber-400' : ''}`} />
            </button>
          )}
        </div>

        {/* Solved Stats Row */}
        <div className="grid grid-cols-3 gap-2 my-4 pt-3 border-t border-slate-800/80 text-center">
          <div className="bg-slate-950/40 p-2 rounded-lg border border-emerald-500/20">
            <span className="text-[10px] text-slate-400 block font-medium uppercase">Easy</span>
            <span className="text-sm font-bold text-emerald-400 font-mono">{student.easySolved || 0}</span>
          </div>
          <div className="bg-slate-950/40 p-2 rounded-lg border border-amber-500/20">
            <span className="text-[10px] text-slate-400 block font-medium uppercase">Med</span>
            <span className="text-sm font-bold text-amber-400 font-mono">{student.mediumSolved || 0}</span>
          </div>
          <div className="bg-slate-950/40 p-2 rounded-lg border border-rose-500/20">
            <span className="text-[10px] text-slate-400 block font-medium uppercase">Hard</span>
            <span className="text-sm font-bold text-rose-400 font-mono">{student.hardSolved || 0}</span>
          </div>
        </div>

        {/* Goal Progress */}
        <div className="mb-4">
          <ProgressBar 
            current={student.totalSolved || 0} 
            target={student.goal || 200}
            size="sm"
          />
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <span className="text-slate-500 text-[11px]">
          Synced {formatRelativeTime(student.lastSynced)}
        </span>

        <div className="flex items-center gap-1.5">
          <Link
            to={`/student/${student.registerNumber || student.id}`}
            className="p-1.5 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            title="View student profile"
          >
            <Eye className="w-3.5 h-3.5" />
          </Link>

          {isAdmin && onEdit && (
            <button
              onClick={() => onEdit(student)}
              className="p-1.5 text-amber-400/90 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 rounded-lg border border-amber-500/20 transition-colors"
              title="Edit student"
            >
              <Edit className="w-3.5 h-3.5" />
            </button>
          )}

          {isAdmin && onDelete && (
            <button
              onClick={() => onDelete(student)}
              className="p-1.5 text-rose-400/90 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg border border-rose-500/20 transition-colors"
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
