import React, { useState, useMemo } from 'react';
import { 
  Trophy, 
  Crown, 
  Medal, 
  SlidersHorizontal, 
  Sparkles, 
  Award, 
  Layers 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import LeaderboardTable from '../components/leaderboard/LeaderboardTable';
import FilterDropdown from '../components/common/FilterDropdown';
import SearchBar from '../components/common/SearchBar';
import ExportMenu from '../components/common/ExportMenu';
import { useData } from '../context/DataContext';

export default function PublicLeaderboard() {
  const { students, settings } = useData();

  const defaultSections = ['Sec A', 'Sec B', 'Sec C', 'Sec D', 'Sec E', 'Sec F'];

  const [searchTerm, setSearchTerm] = useState('');
  const [year, setYear] = useState('');
  const [section, setSection] = useState('');

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
              Analytical-powered ranking computed directly from synchronized GitHub solution repositories based purely on <strong>Total Problems Solved</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Unified Export Menu Dropdown */}
            <ExportMenu
              data={filteredStudents}
              buttonText="Export Report"
              size="md"
            />

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
