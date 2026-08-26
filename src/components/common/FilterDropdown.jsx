import React from 'react';
import { Filter } from 'lucide-react';

export default function FilterDropdown({ label, value, onChange, options = [], allLabel = 'All' }) {
  return (
    <div className="flex items-center gap-1.5 min-w-[130px]">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-field py-2 text-xs font-semibold cursor-pointer bg-white text-slate-700 border-slate-200 hover:border-sky-300 focus:border-sky-500 focus:ring-sky-500/25 shadow-sm"
      >
        <option value="">{label}: {allLabel}</option>
        {options.map((opt) => {
          const val = typeof opt === 'object' ? opt.value : opt;
          const lbl = typeof opt === 'object' ? opt.label : opt;
          return (
            <option key={val} value={val} className="bg-white text-slate-800">
              {lbl}
            </option>
          );
        })}
      </select>
    </div>
  );
}
