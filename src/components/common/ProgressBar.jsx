import React from 'react';
import { calculatePercentage } from '../../utils/helpers';

export default function ProgressBar({ current = 0, target = 200, showLabel = true, size = 'md' }) {
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
          <span className="font-medium text-slate-300">
            <span className="text-white font-semibold">{current}</span> / {target} Solved
          </span>
          <span className="font-semibold text-amber-400">{percentage}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-800 rounded-full overflow-hidden ${heights[size] || heights.md} border border-slate-700/50 p-[1px]`}>
        <div 
          className="bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${Math.min(100, percentage)}%` }}
        />
      </div>
    </div>
  );
}
