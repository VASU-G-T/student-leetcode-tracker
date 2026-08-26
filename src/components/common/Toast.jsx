import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function Toast() {
  const { toast, clearToast } = useData();

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        clearToast();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, clearToast]);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-600 shrink-0" />
  };

  const borderColors = {
    success: 'border-emerald-200 bg-white text-slate-800 shadow-emerald-500/10',
    error: 'border-rose-200 bg-white text-slate-800 shadow-rose-500/10',
    info: 'border-sky-200 bg-white text-slate-800 shadow-sky-500/10'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up max-w-md">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-xl backdrop-blur-md ${borderColors[toast.type] || borderColors.info}`}>
        {icons[toast.type] || icons.info}
        <p className="text-sm font-semibold text-slate-800 flex-1">{toast.message}</p>
        <button 
          onClick={clearToast}
          className="p-1 text-slate-400 hover:text-slate-600 rounded-md transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
