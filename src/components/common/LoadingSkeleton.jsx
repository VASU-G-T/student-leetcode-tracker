import React from 'react';

export function StatCardSkeleton() {
  return (
    <div className="glass-card p-5 animate-pulse bg-white border-sky-100 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="h-4 bg-sky-100 rounded w-24"></div>
        <div className="w-9 h-9 bg-sky-100 rounded-lg"></div>
      </div>
      <div className="h-8 bg-sky-100 rounded w-16 mb-2"></div>
      <div className="h-3 bg-sky-100 rounded w-32"></div>
    </div>
  );
}

export function TableRowSkeleton({ columns = 6 }) {
  return (
    <tr className="animate-pulse border-b border-sky-100">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="py-4 px-4">
          <div className="h-4 bg-sky-100/70 rounded w-full"></div>
        </td>
      ))}
    </tr>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="glass-card p-6 flex flex-col md:flex-row items-center gap-6 bg-white border-sky-100 shadow-sm">
        <div className="w-24 h-24 rounded-2xl bg-sky-100"></div>
        <div className="flex-1 space-y-3 text-center md:text-left">
          <div className="h-7 bg-sky-100 rounded w-48 mx-auto md:mx-0"></div>
          <div className="h-4 bg-sky-100 rounded w-32 mx-auto md:mx-0"></div>
          <div className="flex gap-2 justify-center md:justify-start">
            <div className="h-8 w-24 bg-sky-100 rounded-xl"></div>
            <div className="h-8 w-24 bg-sky-100 rounded-xl"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(n => (
          <div key={n} className="glass-card p-5 bg-white border-sky-100 shadow-sm">
            <div className="h-4 bg-sky-100 rounded w-20 mb-2"></div>
            <div className="h-7 bg-sky-100 rounded w-12"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
