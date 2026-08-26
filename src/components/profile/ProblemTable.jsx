import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Code2, 
  ExternalLink, 
  Search, 
  Filter, 
  FileCode, 
  Sparkles,
  Download,
  ChevronDown,
  FileText,
  FileSpreadsheet
} from 'lucide-react';
import { exportStudentProblemsWordDoc, exportStudentProblemsExcel } from '../../utils/exportCsv';

export default function ProblemTable({ problems = [], studentName = 'Student' }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const exportRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportRef.current && !exportRef.current.contains(event.target)) {
        setIsExportOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Extract all distinct languages present in solved problems
  const availableLanguages = useMemo(() => {
    const langs = new Set();
    problems.forEach(p => {
      if (p.allLanguages && Array.isArray(p.allLanguages)) {
        p.allLanguages.forEach(l => langs.add(l));
      } else if (p.language) {
        langs.add(p.language);
      }
    });
    return Array.from(langs);
  }, [problems]);

  // Filter problems based on search and selected tags
  const filteredProblems = useMemo(() => {
    return problems.filter(p => {
      const matchesSearch = 
        !searchTerm ||
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(p.problemNumber).includes(searchTerm);

      const matchesDiff = 
        !selectedDifficulty || 
        p.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

      const matchesLang = 
        !selectedLanguage ||
        (p.allLanguages ? p.allLanguages.includes(selectedLanguage) : p.language === selectedLanguage);

      return matchesSearch && matchesDiff && matchesLang;
    });
  }, [problems, searchTerm, selectedDifficulty, selectedLanguage]);

  const difficultyBadges = {
    Easy: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold',
    Medium: 'bg-sky-50 text-sky-700 border-sky-200 font-semibold',
    Hard: 'bg-rose-50 text-rose-700 border-rose-200 font-semibold'
  };

  return (
    <div className="glass-card overflow-hidden shadow-sm">
      {/* Header & Controls */}
      <div className="p-4 sm:p-5 border-b border-sky-100 space-y-3 bg-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-sky-50 text-sky-600 border border-sky-200">
              <Code2 className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Solved LeetCode Problems
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 font-mono font-bold border border-sky-200">
              {filteredProblems.length} of {problems.length}
            </span>
          </div>

          {/* Export Dropdown Menu */}
          {problems.length > 0 && (
            <div className="relative" ref={exportRef}>
              <button
                onClick={() => setIsExportOpen(!isExportOpen)}
                className="btn-secondary !py-1.5 !px-3 text-xs flex items-center gap-1.5 font-bold text-sky-700 hover:text-sky-800 bg-sky-50/80 hover:bg-sky-100/90 border-sky-200 shadow-sm"
              >
                <Download className="w-3.5 h-3.5 text-sky-600" />
                <span>Export Report</span>
                <ChevronDown className={`w-3 h-3 text-sky-600 transition-transform duration-200 ${isExportOpen ? 'rotate-180' : ''}`} />
              </button>

              {isExportOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-sky-100 rounded-2xl shadow-xl z-50 p-2 animate-slide-up">
                  <button
                    onClick={() => {
                      exportStudentProblemsWordDoc(studentName, filteredProblems);
                      setIsExportOpen(false);
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
                      exportStudentProblemsExcel(studentName, filteredProblems);
                      setIsExportOpen(false);
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
          )}
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search problem title or #..."
              className="input-field pl-9 py-2 text-xs w-full bg-white text-slate-800 border-slate-200 focus:border-sky-500 shadow-sm"
            />
          </div>

          {/* Difficulty Filter */}
          <div className="relative">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="input-field py-2 text-xs w-full bg-white text-slate-800 border-slate-200 focus:border-sky-500 shadow-sm"
            >
              <option value="">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* Language Filter */}
          <div className="relative">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="input-field py-2 text-xs w-full bg-white text-slate-800 border-slate-200 focus:border-sky-500 shadow-sm"
            >
              <option value="">All Tech Stacks / Languages</option>
              {availableLanguages.map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-sky-100 bg-sky-50/70 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <th className="py-3 px-4 w-16 text-center">#</th>
              <th className="py-3 px-4">Problem</th>
              <th className="py-3 px-4 text-center">Difficulty</th>
              <th className="py-3 px-4">Tech Stack</th>
              <th className="py-3 px-4 text-right">GitHub Solution</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sky-100/60 font-sans text-xs">
            {filteredProblems.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400">
                  No problems match your current search / filter criteria.
                </td>
              </tr>
            ) : (
              filteredProblems.map((p, idx) => (
                <tr 
                  key={p.problemNumber || idx}
                  className="hover:bg-sky-50/40 transition-colors group"
                >
                  <td className="py-3 px-4 text-center font-mono font-bold text-sky-700">
                    {p.problemNumber || idx + 1}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                    {p.title}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] border ${difficultyBadges[p.difficulty] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                      {p.difficulty}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {p.allLanguages && p.allLanguages.length > 0 ? (
                        p.allLanguages.map((lang, lIdx) => (
                          <span key={lIdx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-sky-50 border border-sky-200 text-sky-800 text-[10px] font-mono font-medium">
                            <FileCode className="w-2.5 h-2.5 text-sky-600" />
                            {lang}
                          </span>
                        ))
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-sky-50 border border-sky-200 text-sky-800 text-[10px] font-mono font-medium">
                          <FileCode className="w-2.5 h-2.5 text-sky-600" />
                          {p.language || 'Java'}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {p.githubUrl ? (
                      <a
                        href={p.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-800 hover:underline"
                      >
                        <span>View Code</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-slate-400 text-xs">--</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
