import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Trophy, 
  Crown, 
  Medal, 
  Download, 
  SlidersHorizontal, 
  Sparkles, 
  Award, 
  Layers,
  FileText,
  FileSpreadsheet,
  ChevronDown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import LeaderboardTable from '../components/leaderboard/LeaderboardTable';
import FilterDropdown from '../components/common/FilterDropdown';
import SearchBar from '../components/common/SearchBar';
import { useData } from '../context/DataContext';
import { 
  exportLeaderboardWordDoc, 
  exportLeaderboardExcel, 
  exportLeaderboardCsv 
} from '../utils/exportCsv';

export default function PublicLeaderboard() {
  const { students, settings } = useData();

  const defaultSections = ['Sec A', 'Sec B', 'Sec C', 'Sec D', 'Sec E', 'Sec F'];

  const [searchTerm, setSearchTerm] = useState('');
  const [year, setYear] = useState('');
  const [section, setSection] = useState('');
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

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        !searchTerm ||
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.registerNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.githubUsername && s.githubUsername.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesYear = !year || s.year === year;
      const matchesSec = !section || 
        s.section === section || 
        s.section === section.replace('Sec ', '') ||
        `Sec ${s.section}` === section;

      return matchesSearch && matchesYear && matchesSec;
    });
  }, [students, searchTerm, year, section]);

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 relative overflow-hidden border-sky-100 bg-white shadow-sm">
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold mb-2 shadow-sm">
              <Trophy className="w-3.5 h-3.5 text-sky-600" />
              <span>ECE Department Hall of Fame</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              ECE LeetCode Leaderboard
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-xl font-medium leading-relaxed">
              Rankings computed automatically from synchronized GitHub solution repositories. Tie-breaker rule: Higher Hard count → Higher Medium count → Higher Easy count.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Export Dropdown Menu */}
            <div className="relative" ref={exportRef}>
              <button
                onClick={() => setIsExportOpen(!isExportOpen)}
                className="btn-secondary flex items-center gap-2 font-bold text-slate-700 hover:text-sky-700 shadow-sm border-sky-200"
              >
                <Download className="w-4 h-4 text-sky-600" />
                <span>Export Report</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExportOpen ? 'rotate-180' : ''}`} />
              </button>

              {isExportOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-sky-100 rounded-2xl shadow-xl z-50 p-1.5 animate-slide-up">
                  <button
                    onClick={() => {
                      exportLeaderboardWordDoc(filteredStudents);
                      setIsExportOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-sky-700 hover:bg-sky-50 rounded-xl transition-colors text-left"
                  >
                    <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <div className="font-bold">Word Document (.doc)</div>
                      <div className="text-[10px] text-slate-400 font-normal">Formatted Word Table with Styles</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      exportLeaderboardExcel(filteredStudents);
                      setIsExportOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors text-left mt-0.5"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <div className="font-bold">Excel Table (.xls)</div>
                      <div className="text-[10px] text-slate-400 font-normal">Native Multi-Column Spreadsheet</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      exportLeaderboardCsv(filteredStudents);
                      setIsExportOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-sky-700 hover:bg-sky-50 rounded-xl transition-colors text-left mt-0.5"
                  >
                    <Download className="w-4 h-4 text-sky-600 shrink-0" />
                    <div>
                      <div className="font-bold">Clean CSV (.csv)</div>
                      <div className="text-[10px] text-slate-400 font-normal">UTF-8 Raw Data Format</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={triggerCelebration}
              className="btn-primary flex items-center gap-2 shadow-md shadow-sky-500/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>Celebrate Leaders</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-card p-4 space-y-3 bg-white border-sky-100 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search rankers by name or register number..."
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <FilterDropdown
              label="Section"
              value={section}
              onChange={setSection}
              options={settings.sections || defaultSections}
            />
            <FilterDropdown
              label="Year"
              value={year}
              onChange={setYear}
              options={settings.years || ['1st Year', '2nd Year', '3rd Year', '4th Year']}
            />
          </div>
        </div>

        {/* Section Quick Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
          <span className="text-[11px] text-slate-500 mr-1 font-bold">Filter Section:</span>
          <button
            onClick={() => setSection('')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all shadow-sm ${!section ? 'bg-sky-500 text-white shadow-sky-500/25' : 'bg-white text-slate-600 hover:text-sky-700 hover:bg-sky-50 border border-slate-200'}`}
          >
            All Sections
          </button>
          {defaultSections.map((s) => (
            <button
              key={s}
              onClick={() => setSection(s)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all shadow-sm ${section === s ? 'bg-sky-500 text-white shadow-sky-500/25' : 'bg-white text-slate-600 hover:text-sky-700 hover:bg-sky-50 border border-slate-200'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard Table */}
      <LeaderboardTable students={filteredStudents} />
    </div>
  );
}
