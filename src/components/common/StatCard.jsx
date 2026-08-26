import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'sky', trend }) {
  const colorMap = {
    sky: {
      border: 'hover:border-sky-300',
      iconBg: 'bg-sky-50 text-sky-600 border-sky-200',
      badge: 'text-sky-600'
    },
    amber: {
      border: 'hover:border-amber-300',
      iconBg: 'bg-amber-50 text-amber-600 border-amber-200',
      badge: 'text-amber-600'
    },
    emerald: {
      border: 'hover:border-emerald-300',
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      badge: 'text-emerald-600'
    },
    blue: {
      border: 'hover:border-blue-300',
      iconBg: 'bg-blue-50 text-blue-600 border-blue-200',
      badge: 'text-blue-600'
    },
    rose: {
      border: 'hover:border-rose-300',
      iconBg: 'bg-rose-50 text-rose-600 border-rose-200',
      badge: 'text-rose-600'
    },
    purple: {
      border: 'hover:border-purple-300',
      iconBg: 'bg-purple-50 text-purple-600 border-purple-200',
      badge: 'text-purple-600'
    }
  };

  const scheme = colorMap[color] || colorMap.sky;

  return (
    <div className={`glass-card-hover p-5 ${scheme.border} group`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{title}</span>
        {Icon && (
          <div className={`p-2.5 rounded-xl border ${scheme.iconBg} transition-transform duration-200 group-hover:scale-105 shadow-sm`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">{value}</span>
        {trend && (
          <span className="text-xs font-bold text-emerald-600">
            {trend}
          </span>
        )}
      </div>
      {subtitle && (
        <p className="mt-1 text-xs text-slate-500 font-medium">{subtitle}</p>
      )}
    </div>
  );
}
