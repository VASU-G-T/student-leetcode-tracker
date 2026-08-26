import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Eye, 
  Edit, 
  Trash2, 
  RefreshCw, 
  ExternalLink 
} from 'lucide-react';
import { GithubIcon } from '../common/Icons';
import SyncStatus from '../dashboard/SyncStatus';
import ProgressBar from '../common/ProgressBar';
import { formatRelativeTime } from '../../utils/helpers';

export default function StudentTable({ 
  students = [], 
  isAdmin = false, 
  syncingStudentId = null, 
  onSync, 
  onEdit, 
  onDelete 
}) {
  if (!students.length) {
    return (
      <div className="glass-card p-12 text-center text-slate-400">
        <p className="text-sm font-medium text-slate-300">No students found matching current filters.</p>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4 w-12 text-center">#</th>
              <th className="py-3 px-4">Student</th>
              <th className="py-3 px-4">Reg No</th>
              <th className="py-3 px-4">Dept</th>
              <th className="py-3 px-4 text-center">Solved</th>
              <th className="py-3 px-4 text-center text-emerald-400">Easy</th>
              <th className="py-3 px-4 text-center text-amber-400">Med</th>
              <th className="py-3 px-4 text-center text-rose-400">Hard</th>
              <th className="py-3 px-4 w-32">Sync Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm">
            {students.map((student, idx) => {
              const isSyncing = syncingStudentId === student.id;

              return (
                <tr 
                  key={student.id} 
                  className="hover:bg-slate-850/50 transition-colors group"
                >
                  <td className="py-3 px-4 text-center font-mono text-xs text-slate-500">
                    {idx + 1}
                  </td>

                  {/* Student */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={student.profileImage || `https://api.dicebear.com/7.x/bottts/svg?seed=${student.githubUsername || student.name}`}
                        alt={student.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-700"
                      />
                      <div>
                        <Link
                          to={`/student/${student.registerNumber || student.id}`}
                          className="font-semibold text-white group-hover:text-amber-400 transition-colors"
                        >
                          {student.name}
                        </Link>
                        {student.githubUsername && (
                          <span className="block text-[11px] text-slate-500 font-mono">
                            @{student.githubUsername}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Register Number */}
                  <td className="py-3 px-4 font-mono text-xs text-amber-400/90 font-medium">
                    {student.registerNumber}
                  </td>

                  {/* Department */}
                  <td className="py-3 px-4 text-xs text-slate-300">
                    {student.department} ({student.year || '2nd'})
                  </td>

                  {/* Solved */}
                  <td className="py-3 px-4 text-center font-mono font-bold text-white">
                    {student.totalSolved || 0}
                  </td>

                  {/* Easy */}
                  <td className="py-3 px-4 text-center font-mono text-emerald-400">
                    {student.easySolved || 0}
                  </td>

                  {/* Medium */}
                  <td className="py-3 px-4 text-center font-mono text-amber-400">
                    {student.mediumSolved || 0}
                  </td>

                  {/* Hard */}
                  <td className="py-3 px-4 text-center font-mono text-rose-400">
                    {student.hardSolved || 0}
                  </td>

                  {/* Sync Status */}
                  <td className="py-3 px-4">
                    <SyncStatus student={student} isSyncing={isSyncing} />
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        to={`/student/${student.registerNumber || student.id}`}
                        className="p-1.5 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors"
                        title="View profile"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>

                      {isAdmin && (
                        <>
                          <button
                            onClick={() => onSync && onSync(student.id)}
                            disabled={isSyncing}
                            className="p-1.5 text-slate-300 hover:text-amber-400 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors"
                            title="Sync student"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-amber-400' : ''}`} />
                          </button>

                          {onEdit && (
                            <button
                              onClick={() => onEdit(student)}
                              className="p-1.5 text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded-md transition-colors"
                              title="Edit student"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {onDelete && (
                            <button
                              onClick={() => onDelete(student)}
                              className="p-1.5 text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-md transition-colors"
                              title="Delete student"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
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
