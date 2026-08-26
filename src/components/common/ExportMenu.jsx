import React, { useState, useRef, useEffect } from 'react';
import { Download, ChevronDown, FileText, FileSpreadsheet } from 'lucide-react';
import { exportLeaderboardWordDoc, exportLeaderboardExcel } from '../../utils/exportCsv';

export default function ExportMenu({
  data = [],
  buttonText = 'Export Report',
  className = '',
  align = 'right',
  size = 'md'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isSmall = size === 'sm';

  return (
    <div className={`relative inline-block ${className}`} ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`btn-secondary flex items-center gap-2 font-bold text-sky-700 hover:text-sky-800 bg-sky-50/80 hover:bg-sky-100/90 border-sky-200 shadow-sm transition-all ${
          isSmall ? '!py-1.5 !px-3 text-xs' : 'text-xs sm:text-sm'
        }`}
        title="Export report in Word Document (.doc) or Sheet Table (.xls)"
      >
        <Download className={`${isSmall ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-sky-600`} />
        <span>{buttonText}</span>
        <ChevronDown className={`${isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-sky-600 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className={`absolute ${
            align === 'left' ? 'left-0' : 'right-0'
          } mt-2 w-64 bg-white border border-sky-100 rounded-2xl shadow-xl z-50 p-2 animate-slide-up`}
        >
          <button
            onClick={() => {
              exportLeaderboardWordDoc(data);
              setIsOpen(false);
            }}
            className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-sky-50 transition-colors text-left group"
          >
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 group-hover:bg-blue-100 transition-colors shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800 group-hover:text-blue-700">Word Document (.doc)</div>
              <div className="text-[11px] text-slate-400 font-medium mt-0.5">Formatted Word Table with Styles</div>
            </div>
          </button>

          <button
            onClick={() => {
              exportLeaderboardExcel(data);
              setIsOpen(false);
            }}
            className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-emerald-50 transition-colors text-left group mt-1"
          >
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 group-hover:bg-emerald-100 transition-colors shrink-0">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-700">Excel / Sheet Table (.xls)</div>
              <div className="text-[11px] text-slate-400 font-medium mt-0.5">Native Multi-Column Spreadsheet</div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
