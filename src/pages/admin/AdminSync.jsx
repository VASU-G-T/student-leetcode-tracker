import React from 'react';
import { 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Info, 
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { GithubIcon } from '../../components/common/Icons';
import ProgressBar from '../../components/common/ProgressBar';
import { useData } from '../../context/DataContext';
import { formatDateTime, formatRelativeTime } from '../../utils/helpers';

export default function AdminSync() {
  const { 
    students, 
    syncStudent, 
    syncAll, 
    syncingStudentId, 
    isSyncingAll, 
    syncProgress, 
    lastGlobalSync,
    settings 
  } = useData();

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Top Banner */}
      <div className="glass-card p-6 sm:p-7 border-sky-100 bg-white relative overflow-hidden shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold mb-2 shadow-sm">
              <RefreshCw className="w-3.5 h-3.5 text-sky-600" />
              <span>GitHub Engine Synchronizer</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Repository Sync Control
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-xl font-medium">
              Inspect student GitHub repositories, discover newly pushed LeetCode solutions, calculate Easy/Medium/Hard counts, and refresh cloud metrics.
            </p>
          </div>

          <button
            onClick={syncAll}
            disabled={isSyncingAll}
            className="btn-primary flex items-center gap-2 shadow-md shadow-sky-500/25"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncingAll ? 'animate-spin' : ''}`} />
            <span>{isSyncingAll ? `Synchronizing (${syncProgress.current}/${syncProgress.total})...` : 'Trigger Sync All'}</span>
          </button>
        </div>

        {/* Sync Progress Bar */}
        {isSyncingAll && (
          <div className="mt-6 pt-4 border-t border-sky-100 space-y-2">
            <div className="flex justify-between text-xs text-slate-700 font-medium">
              <span>Synchronizing: <span className="font-bold text-sky-700">{syncProgress.currentName || 'Student'}</span></span>
              <span className="font-mono font-bold text-slate-500">{syncProgress.current} / {syncProgress.total}</span>
            </div>
            <div className="w-full bg-sky-100 rounded-full h-2.5 overflow-hidden border border-sky-200 p-[1px]">
              <div 
                className="bg-sky-500 h-full rounded-full transition-all duration-300 shadow-sm"
                style={{ width: `${(syncProgress.current / syncProgress.total) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Auto Sync & Rate Limit Guide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card p-4 flex items-start gap-3 border-sky-100 bg-white shadow-sm">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Auto Sync Interval</h2>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Scheduled auto-sync runs automatically every <span className="font-bold text-slate-800">{settings.autoSyncInterval || 15} minutes</span> in the background. Last completed {formatRelativeTime(lastGlobalSync)}.
            </p>
          </div>
        </div>

        <div className="glass-card p-4 flex items-start gap-3 border-sky-100 bg-white shadow-sm">
          <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600 border border-sky-200 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Rate Limit Optimization</h2>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              LeetTrack uses tree-level caching and throttled sequential API queries to conserve GitHub REST API quotas.
            </p>
          </div>
        </div>
      </div>

      {/* Student Sync Status Table */}
      <div className="space-y-4">
        <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
          Individual Repository Sync Status
        </h2>

        <div className="glass-card overflow-hidden bg-white border-sky-100 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-sky-100 bg-sky-50/70 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">Repository</th>
                  <th className="py-3.5 px-4 text-center">Problems Detected</th>
                  <th className="py-3.5 px-4">Last Synced</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-100/70 text-sm bg-white">
                {students.map((student) => {
                  const isSyncing = syncingStudentId === student.id;
                  const isFailed = student.syncStatus === 'failed';

                  return (
                    <tr key={student.id} className="hover:bg-sky-50/50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {student.name}
                        <span className="block text-xs font-normal font-mono text-sky-700 font-bold">
                          {student.registerNumber}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <a
                          href={student.githubRepoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-mono text-slate-600 hover:text-sky-600 font-medium flex items-center gap-1.5"
                        >
                          <GithubIcon className="w-3.5 h-3.5 text-slate-700" />
                          <span>{student.githubRepoOwner || 'owner'}/{student.githubRepoName || 'repo'}</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </a>
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono font-extrabold text-slate-900">
                        {student.totalSolved || 0}
                      </td>

                      <td className="py-3.5 px-4 text-xs text-slate-600 font-medium">
                        {formatDateTime(student.lastSynced)}
                      </td>

                      <td className="py-3.5 px-4">
                        {isSyncing ? (
                          <span className="inline-flex items-center gap-1.5 text-xs text-sky-700 font-bold bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-600" />
                            <span>Syncing...</span>
                          </span>
                        ) : isFailed ? (
                          <span className="inline-flex items-center gap-1.5 text-xs text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200" title={student.syncError}>
                            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                            <span>✕ Failed</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                            <span>✓ Synced</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => syncStudent(student.id)}
                          disabled={isSyncing || isSyncingAll}
                          className="btn-secondary !py-1 !px-2.5 text-xs flex items-center gap-1.5 ml-auto font-semibold text-sky-700"
                        >
                          <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin text-sky-600' : 'text-sky-600'}`} />
                          <span>Sync</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
