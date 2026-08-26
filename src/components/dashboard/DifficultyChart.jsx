import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { calculatePercentage } from '../../utils/helpers';

export default function DifficultyChart({ easy = 0, medium = 0, hard = 0, title = 'Difficulty Distribution' }) {
  const total = easy + medium + hard;

  const data = [
    { name: 'Easy', value: easy, color: '#00b8a3', bgClass: 'text-emerald-600' },
    { name: 'Medium', value: medium, color: '#0284c7', bgClass: 'text-sky-600' },
    { name: 'Hard', value: hard, color: '#ef4444', bgClass: 'text-rose-600' }
  ];

  const easyPct = calculatePercentage(easy, total);
  const medPct = calculatePercentage(medium, total);
  const hardPct = calculatePercentage(hard, total);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      const pct = calculatePercentage(item.value, total);
      return (
        <div className="bg-white border border-sky-200 px-3.5 py-2 rounded-xl shadow-lg text-xs">
          <p className="font-bold text-slate-800">{item.name}</p>
          <p className="text-slate-600 font-mono mt-0.5">
            {item.value} solved ({pct}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-1 pb-2 border-b border-sky-100">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">{title}</h3>
          <span className="text-xs font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">{total} Total</span>
        </div>
        <p className="text-xs text-slate-500 font-medium mt-1">Aggregated breakdown by problem complexity</p>
      </div>

      {total === 0 ? (
        <div className="py-12 text-center text-slate-400 text-xs">
          No problem breakdown available yet.
        </div>
      ) : (
        <div className="my-3 flex flex-col sm:flex-row items-center gap-4">
          {/* Donut Chart */}
          <div className="w-40 h-40 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CustomTooltip />} />
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-extrabold text-slate-900 leading-none">{total}</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest mt-1 font-bold">Solved</span>
            </div>
          </div>

          {/* Legend Stats */}
          <div className="flex-1 w-full space-y-2">
            <div className="flex items-center justify-between p-2 rounded-xl bg-sky-50/50 border border-sky-100 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00b8a3]" />
                <span className="text-xs font-semibold text-slate-700">Easy</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-900 font-mono">{easy}</span>
                <span className="text-xs font-bold text-emerald-600 font-mono w-10 text-right">{easyPct}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-sky-50/50 border border-sky-100 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]" />
                <span className="text-xs font-semibold text-slate-700">Medium</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-900 font-mono">{medium}</span>
                <span className="text-xs font-bold text-sky-600 font-mono w-10 text-right">{medPct}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-sky-50/50 border border-sky-100 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
                <span className="text-xs font-semibold text-slate-700">Hard</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-900 font-mono">{hard}</span>
                <span className="text-xs font-bold text-rose-600 font-mono w-10 text-right">{hardPct}%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
