import React, { useState } from 'react';
import { calculatePercentage } from '../../utils/helpers';

export default function DifficultyChart({ easy = 0, medium = 0, hard = 0, title = 'Department Problem Complexity' }) {
  const [hoveredDiff, setHoveredDiff] = useState(null);
  const total = easy + medium + hard;

  const easyPct = calculatePercentage(easy, total);
  const medPct = calculatePercentage(medium, total);
  const hardPct = calculatePercentage(hard, total);

  // Exact geometric circle constants
  const size = 140;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2; // 63
  const circumference = 2 * Math.PI * radius; // ~395.84

  // Arc lengths
  const easyLen = total > 0 ? (easy / total) * circumference : 0;
  const medLen = total > 0 ? (medium / total) * circumference : 0;
  const hardLen = total > 0 ? (hard / total) * circumference : 0;

  // Offsets (starting from top -90deg)
  const easyOffset = 0;
  const medOffset = -easyLen;
  const hardOffset = -(easyLen + medLen);

  return (
    <div className="glass-card p-5 bg-white border-sky-100 flex flex-col justify-between shadow-sm h-auto">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-1 pb-2 border-b border-sky-100">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">{title}</h3>
          <span className="text-xs font-mono font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
            {total} Total
          </span>
        </div>
        <p className="text-xs text-slate-500 font-medium mt-1">Aggregated breakdown by problem complexity</p>
      </div>

      {total === 0 ? (
        <div className="py-12 text-center text-slate-400 text-xs">
          No problem breakdown available yet.
        </div>
      ) : (
        <div className="my-4 flex flex-col sm:flex-row items-center justify-center gap-6">
          {/* Geometrically Perfect Circular Donut Chart */}
          <div className="relative w-[140px] h-[140px] shrink-0 aspect-square flex items-center justify-center">
            <svg
              viewBox={`0 0 ${size} ${size}`}
              className="w-full h-full transform -rotate-90 origin-center drop-shadow-sm"
              style={{ overflow: 'visible' }}
            >
              {/* Background Track */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="#f1f5f9"
                strokeWidth={strokeWidth}
              />

              {/* Easy Arc */}
              {easy > 0 && (
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke="#00b8a3"
                  strokeWidth={hoveredDiff === 'Easy' ? strokeWidth + 2 : strokeWidth}
                  strokeDasharray={`${Math.max(0, easyLen - 2)} ${circumference}`}
                  strokeDashoffset={easyOffset}
                  strokeLinecap="round"
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredDiff('Easy')}
                  onMouseLeave={() => setHoveredDiff(null)}
                />
              )}

              {/* Medium Arc */}
              {medium > 0 && (
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth={hoveredDiff === 'Medium' ? strokeWidth + 2 : strokeWidth}
                  strokeDasharray={`${Math.max(0, medLen - 2)} ${circumference}`}
                  strokeDashoffset={medOffset}
                  strokeLinecap="round"
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredDiff('Medium')}
                  onMouseLeave={() => setHoveredDiff(null)}
                />
              )}

              {/* Hard Arc */}
              {hard > 0 && (
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth={hoveredDiff === 'Hard' ? strokeWidth + 2 : strokeWidth}
                  strokeDasharray={`${Math.max(0, hardLen - 2)} ${circumference}`}
                  strokeDashoffset={hardOffset}
                  strokeLinecap="round"
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredDiff('Hard')}
                  onMouseLeave={() => setHoveredDiff(null)}
                />
              )}
            </svg>

            {/* Centered Total Indicator */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-2xl font-black text-slate-900 leading-none font-mono tracking-tight">
                {hoveredDiff === 'Easy' ? easy : hoveredDiff === 'Medium' ? medium : hoveredDiff === 'Hard' ? hard : total}
              </span>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">
                {hoveredDiff ? hoveredDiff : 'SOLVED'}
              </span>
            </div>
          </div>

          {/* Legend Stats with Proper Spacing */}
          <div className="flex-1 w-full space-y-2">
            <div 
              onMouseEnter={() => setHoveredDiff('Easy')}
              onMouseLeave={() => setHoveredDiff(null)}
              className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer shadow-sm ${
                hoveredDiff === 'Easy' ? 'bg-emerald-50 border-emerald-300' : 'bg-slate-50/70 border-slate-100 hover:bg-emerald-50/40'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#00b8a3] shadow-sm shrink-0" />
                <span className="text-xs font-bold text-slate-800">Easy</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-extrabold text-slate-900 font-mono">{easy}</span>
                <span className="text-xs font-bold text-emerald-600 font-mono w-10 text-right">{easyPct}%</span>
              </div>
            </div>

            <div 
              onMouseEnter={() => setHoveredDiff('Medium')}
              onMouseLeave={() => setHoveredDiff(null)}
              className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer shadow-sm ${
                hoveredDiff === 'Medium' ? 'bg-sky-50 border-sky-300' : 'bg-slate-50/70 border-slate-100 hover:bg-sky-50/40'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#0284c7] shadow-sm shrink-0" />
                <span className="text-xs font-bold text-slate-800">Medium</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-extrabold text-slate-900 font-mono">{medium}</span>
                <span className="text-xs font-bold text-sky-600 font-mono w-10 text-right">{medPct}%</span>
              </div>
            </div>

            <div 
              onMouseEnter={() => setHoveredDiff('Hard')}
              onMouseLeave={() => setHoveredDiff(null)}
              className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer shadow-sm ${
                hoveredDiff === 'Hard' ? 'bg-rose-50 border-rose-300' : 'bg-slate-50/70 border-slate-100 hover:bg-rose-50/40'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#ef4444] shadow-sm shrink-0" />
                <span className="text-xs font-bold text-slate-800">Hard</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-extrabold text-slate-900 font-mono">{hard}</span>
                <span className="text-xs font-bold text-rose-600 font-mono w-10 text-right">{hardPct}%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
