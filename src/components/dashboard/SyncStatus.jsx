import React from 'react';
import { RefreshCw, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { formatRelativeTime } from '../../utils/helpers';

export default function SyncStatus({ student, onSync, isSyncing }) {
  if (!student) return null;

  const isFailed = student.syncStatus === 'failed';

  return (
    <div className="flex items-center gap-2">
      {isSyncing ? (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-medium animate-pulse">
          <RefreshCw className="w-3 h-3 animate-spin" />
          <span>Syncing...</span>
        </span>
      ) : isFailed ? (
        <span 
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-medium"
          title={student.syncError || 'Sync failed'}
        >
          <AlertCircle className="w-3 h-3" />
          <span>Sync failed</span>
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium">
          <CheckCircle className="w-3 h-3" />
          <span>{formatRelativeTime(student.lastSynced)}</span>
        </span>
      )}
    </div>
  );
}
