import React, { useState } from 'react';
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
import Pagination from '../common/Pagination';
import { formatRelativeTime, getStudentActivityMetrics } from '../../utils/helpers';

export default function StudentTable({ 
  students = [], 
  isAdmin = false, 
  syncingStudentId = null, 
  onSync, 
  onEdit, 
  onDelete 
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  if (!students.length) {
    return (
      <div className="glass-card p-12 text-center text-slate-500">
        <p className="text-sm font-bold text-slate-700">No students found matching current filters.</p>
      </div>
    );
  }

  const paginatedStudents = students.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="glass-card overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-sky-100 bg-sky-50/70 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <th className="py-3.5 px-4 w-12 text-center">#</th>
              <th className="py-3.5 px-4">Student</th>
              <th className="py-3.5 px-4">Reg No</th>
              <th className="py-3.5 px-4">Dept & Sec</th>
              <th className="py-3.5 px-4 text-center">Solved</th>
              <th className="py-3.5 px-4 text-center text-emerald-700">Today</th>
              <th className="py-3.5 px-4 text-center text-sky-700">1 Week</th>
              <th className="py-3.5 px-4 text-center text-amber-700">1 Month</th>
              <th className="py-3.5 px-4 text-center text-orange-700">Streak</th>
              <th className="py-3.5 px-4 text-center hidden lg:table-cell text-emerald-700">Easy</th>
              <th className="py-3.5 px-4 text-center hidden lg:table-cell text-sky-700">Med</th>
              <th className="py-3.5 px-4 text-center hidden lg:table-cell text-rose-700">Hard</th>
              <th className="py-3.5 px-4 w-32">Sync Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sky-100/70 text-sm bg-white">
            {paginatedStudents.map((student, idx) => {
              const globalIndex = (currentPage - 1) * pageSize + idx + 1;
              const isSyncing = syncingStudentId === student.id;
              const metrics = getStudentActivityMetrics(student);

              return (
                <tr 
                  key={student.id} 
                  className="hover:bg-sky-50/50 transition-colors group"
                >
                  <td className="py-3.5 px-4 text-center font-mono text-xs text-slate-500 font-bold">
                    {globalIndex}
                  </td>

                  {/* Student */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={student.profileImage || `https://api.dicebear.com/7.x/bottts/svg?seed=${student.githubUsername || student.name}`}
                        alt={student.name}
                        className="w-9 h-9 rounded-xl object-cover border border-sky-200 shadow-sm shrink-0 bg-sky-50"
                      />
                      <div>
                        <Link
                          to={`/student/${student.registerNumber || student.id}`}
                          className="font-bold text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-1"
                        >
                          {student.name}
                        </Link>
                        {student.githubUsername && (
                          <span className="block text-[11px] text-slate-500 font-mono font-medium">
                            @{student.githubUsername}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Register Number */}
                  <td className="py-3.5 px-4 font-mono text-xs font-bold text-sky-700">
                    <span className="bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                      {student.registerNumber}
                    </span>
                  </td>

                  {/* Department & Section */}
                  <td className="py-3.5 px-4 text-xs text-slate-600">
                    <div>
                      <span className="font-bold text-slate-800">{student.department}</span>
                      <span className="text-slate-500 block text-[11px] font-medium">{student.section} • {student.year || '2nd Yr'}</span>
                    </div>
                  </td>

                  {/* Solved */}
                  <td className="py-3.5 px-4 text-center font-mono font-extrabold text-slate-900">
                    {student.totalSolved || 0}
                  </td>

                  {/* Today */}
                  <td className="py-3.5 px-4 text-center font-mono">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold border ${metrics.today > 0 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                      {metrics.today > 0 ? `+${metrics.today}` : '0'}
                    </span>
                  </td>

                  {/* 1 Week */}
                  <td className="py-3.5 px-4 text-center font-mono">
                    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
                      {metrics.week}
                    </span>
                  </td>

                  {/* 1 Month */}
                  <td className="py-3.5 px-4 text-center font-mono">
                    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      {metrics.month}
                    </span>
                  </td>

                  {/* Streak */}
                  <td className="py-3.5 px-4 text-center font-mono">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border ${metrics.streak > 0 ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                      {metrics.streak > 0 ? `🔥 ${metrics.streak}d` : '0d'}
                    </span>
                  </td>

                  {/* Easy */}
                  <td className="py-3.5 px-4 text-center hidden lg:table-cell font-mono font-bold text-emerald-600">
                    {student.easySolved || 0}
                  </td>

                  {/* Medium */}
                  <td className="py-3.5 px-4 text-center hidden lg:table-cell font-mono font-bold text-sky-600">
                    {student.mediumSolved || 0}
                  </td>

                  {/* Hard */}
                  <td className="py-3.5 px-4 text-center hidden lg:table-cell font-mono font-bold text-rose-600">
                    {student.hardSolved || 0}
                  </td>

                  {/* Sync Status */}
                  <td className="py-3.5 px-4">
                    <SyncStatus 
                      student={student}
                      isSyncing={isSyncing}
                      onSync={() => onSync && onSync(student.id)}
                    />
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        to={`/student/${student.registerNumber || student.id}`}
                        className="p-1.5 text-sky-700 hover:text-white bg-sky-50 hover:bg-sky-600 rounded-lg border border-sky-200 transition-colors shadow-sm"
                        title="View profile"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>

                      {isAdmin && (
                        <>
                          <button
                            onClick={() => onSync && onSync(student.id)}
                            disabled={isSyncing}
                            className="p-1.5 text-slate-600 hover:text-sky-700 bg-slate-50 hover:bg-sky-50 border border-slate-200 rounded-lg transition-colors shadow-sm"
                            title="Sync student"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-sky-600' : ''}`} />
                          </button>

                          {onEdit && (
                            <button
                              onClick={() => onEdit(student)}
                              className="p-1.5 text-amber-700 hover:text-white bg-amber-50 hover:bg-amber-500 rounded-lg border border-amber-200 transition-colors shadow-sm"
                              title="Edit student"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {onDelete && (
                            <button
                              onClick={() => onDelete(student)}
                              className="p-1.5 text-rose-700 hover:text-white bg-rose-50 hover:bg-rose-500 rounded-lg border border-rose-200 transition-colors shadow-sm"
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

      {students.length > 25 && (
        <Pagination
          currentPage={currentPage}
          totalItems={students.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          pageSizeOptions={[25, 50, 100, 400]}
        />
      )}
    </div>
  );
}
