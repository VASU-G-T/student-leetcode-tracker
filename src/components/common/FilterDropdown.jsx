import React from 'react';
import { Filter } from 'lucide-react';

export default function FilterDropdown({ label, value, onChange, options = [], allLabel = 'All' }) {
  return (
    <div className="flex items-center gap-1.5 min-w-[130px]">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-field py-2 text-xs font-medium cursor-pointer bg-slate-900/90 text-slate-200 border-slate-800"
      >
        <option value="">{label}: {allLabel}</option>
        {options.map((opt) => {
          const val = typeof opt === 'object' ? opt.value : opt;
          const lbl = typeof opt === 'object' ? opt.label : opt;
          return (
            <option key={val} value={val} className="bg-slate-900 text-slate-200">
              {lbl}
            </option>
          );
        })}
      </select>
    </div>
  );
}
