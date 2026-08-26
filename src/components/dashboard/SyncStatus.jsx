import React from 'react';
import { RefreshCw, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { formatRelativeTime } from '../../utils/helpers';

export default function SyncStatus({ student, onSync, isSyncing }) {
  if (!student) return null;

  const isFailed = student.syncStatus === 'failed';

  return (
    <div className="flex items-center gap-2">
      {isSyncing ? (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-100 text-sky-700 border border-sky-200 text-xs font-semibold animate-pulse shadow-sm">
          <RefreshCw className="w-3 h-3 animate-spin text-sky-600" />
          <span>Syncing...</span>
        </span>
      ) : isFailed ? (
        <span 
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-200 text-xs font-semibold shadow-sm"
          title={student.syncError || 'Sync failed'}
        >
          <AlertCircle className="w-3 h-3" />
          <span>Sync failed</span>
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold shadow-sm">
          <CheckCircle className="w-3 h-3 text-emerald-600" />
          <span>{formatRelativeTime(student.lastSynced)}</span>
        </span>
      )}
    </div>
  );
}
