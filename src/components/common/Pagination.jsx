import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export default function Pagination({
  currentPage = 1,
  totalItems = 0,
  pageSize = 25,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [25, 50, 100, 400]
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(totalItems, currentPage * pageSize);

  if (totalItems <= 10 && pageSize >= 25) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-sky-100 bg-sky-50/50 text-xs text-slate-600">
      <div className="flex items-center gap-2">
        <span>
          Showing <span className="font-bold text-slate-900">{startItem}</span> to <span className="font-bold text-slate-900">{endItem}</span> of <span className="font-bold text-sky-600">{totalItems}</span> students
        </span>

        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 ml-3 pl-3 border-l border-slate-200">
            <span className="text-[11px] text-slate-500">Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                onPageSizeChange(Number(e.target.value));
                onPageChange(1);
              }}
              className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700 font-semibold focus:outline-none focus:border-sky-500 shadow-sm"
            >
              {pageSizeOptions.map(size => (
                <option key={size} value={size}>
                  {size === 400 ? '400 (All)' : size}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-sky-700 hover:bg-sky-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-sm"
          title="First page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-sky-700 hover:bg-sky-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-sm"
          title="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="px-3 py-1 font-mono font-bold text-slate-700">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-sky-700 hover:bg-sky-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-sm"
          title="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-sky-700 hover:bg-sky-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-sm"
          title="Last page"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
