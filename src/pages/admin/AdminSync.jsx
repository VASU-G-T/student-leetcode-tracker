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
      <div className="glass-card p-6 sm:p-7 border-slate-800 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-2">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>GitHub Engine Synchronizer</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Repository Sync Control
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
              Inspect student GitHub repositories, discover newly pushed LeetCode solutions, calculate Easy/Medium/Hard counts, and refresh Firestore metrics.
            </p>
          </div>

          <button
            onClick={syncAll}
            disabled={isSyncingAll}
            className="btn-primary flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncingAll ? 'animate-spin' : ''}`} />
            <span>{isSyncingAll ? `Synchronizing (${syncProgress.current}/${syncProgress.total})...` : 'Trigger Sync All'}</span>
          </button>
        </div>

        {/* Sync Progress Bar */}
        {isSyncingAll && (
          <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-2">
            <div className="flex justify-between text-xs text-slate-300">
              <span>Synchronizing: <span className="font-semibold text-amber-400">{syncProgress.currentName || 'Student'}</span></span>
              <span className="font-mono text-slate-400">{syncProgress.current} / {syncProgress.total}</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700">
              <div 
                className="bg-amber-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${(syncProgress.current / syncProgress.total) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Auto Sync & Rate Limit Guide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card p-4 flex items-start gap-3 border-slate-800">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Auto Sync Interval</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Scheduled auto-sync runs automatically every <span className="font-semibold text-white">{settings.autoSyncInterval || 15} minutes</span> in the background. Last completed {formatRelativeTime(lastGlobalSync)}.
            </p>
          </div>
        </div>

        <div className="glass-card p-4 flex items-start gap-3 border-slate-800">
          <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Rate Limit Optimization</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              LeetTrack uses tree-level caching and throttled sequential API queries to conserve GitHub REST API quotas.
            </p>
          </div>
        </div>
      </div>

      {/* Student Sync Status Table */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white tracking-tight">
          Individual Repository Sync Status
        </h2>

        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Repository</th>
                  <th className="py-3 px-4 text-center">Problems Detected</th>
                  <th className="py-3 px-4">Last Synced</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {students.map((student) => {
                  const isSyncing = syncingStudentId === student.id;
                  const isFailed = student.syncStatus === 'failed';

                  return (
                    <tr key={student.id} className="hover:bg-slate-850/50 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-white">
                        {student.name}
                        <span className="block text-xs font-normal font-mono text-slate-400">
                          {student.registerNumber}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <a
                          href={student.githubRepoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-mono text-slate-300 hover:text-amber-400 flex items-center gap-1.5"
                        >
                          <GithubIcon className="w-3.5 h-3.5" />
                          <span>{student.githubRepoOwner || 'owner'}/{student.githubRepoName || 'repo'}</span>
                          <ExternalLink className="w-3 h-3 text-slate-500" />
                        </a>
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono font-bold text-white">
                        {student.totalSolved || 0}
                      </td>

                      <td className="py-3.5 px-4 text-xs text-slate-300">
                        {formatDateTime(student.lastSynced)}
                      </td>

                      <td className="py-3.5 px-4">
                        {isSyncing ? (
                          <span className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-medium">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Syncing...</span>
                          </span>
                        ) : isFailed ? (
                          <span className="inline-flex items-center gap-1.5 text-xs text-rose-400 font-medium" title={student.syncError}>
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>✕ Failed</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>✓ Synced</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => syncStudent(student.id)}
                          disabled={isSyncing || isSyncingAll}
                          className="btn-secondary !py-1 !px-2.5 text-xs flex items-center gap-1.5 ml-auto"
                        >
                          <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin text-amber-400' : ''}`} />
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
