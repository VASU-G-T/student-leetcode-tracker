import React from 'react';
import { calculatePercentage } from '../../utils/helpers';

export default function ProgressBar({ current = 0, target = 4033, showLabel = true, size = 'md' }) {
  const percentage = calculatePercentage(current, target);

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5 text-xs">
          <span className="font-medium text-slate-600">
            <span className="text-slate-900 font-bold">{current}</span> / {target} Solved
          </span>
          <span className="font-bold text-sky-600">{percentage}%</span>
        </div>
      )}
      <div className={`w-full bg-sky-100/80 rounded-full overflow-hidden ${heights[size] || heights.md} border border-sky-200/80 p-[1px]`}>
        <div 
          className="bg-gradient-to-r from-sky-400 via-sky-500 to-emerald-500 h-full rounded-full transition-all duration-500 ease-out shadow-sm"
          style={{ width: `${Math.min(100, percentage)}%` }}
        />
      </div>
    </div>
  );
}
