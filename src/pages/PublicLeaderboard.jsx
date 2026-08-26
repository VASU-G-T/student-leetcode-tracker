import React, { useState, useMemo } from 'react';
import { 
  Trophy, 
  Crown, 
  Medal, 
  Download, 
  SlidersHorizontal, 
  Sparkles,
  Award,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import LeaderboardTable from '../components/leaderboard/LeaderboardTable';
import FilterDropdown from '../components/common/FilterDropdown';
import SearchBar from '../components/common/SearchBar';
import { useData } from '../context/DataContext';

export default function PublicLeaderboard() {
  const { students, settings } = useData();

  const defaultSections = ['Sec A', 'Sec B', 'Sec V', 'Sec D', 'Sec E', 'Sec F'];

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
      <div className="glass-card p-6 sm:p-8 relative overflow-hidden border-slate-800">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-2">
              <Trophy className="w-3.5 h-3.5" />
              <span>ECE Department Hall of Fame</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              ECE LeetCode Leaderboard
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
              Rankings computed automatically from synchronized GitHub solution repositories. Tie-breaker rule: Higher Hard count → Higher Medium count → Higher Easy count.
            </p>
          </div>

          <button
            onClick={triggerCelebration}
            className="btn-primary flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Celebrate Leaders</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-card p-4 space-y-3">
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
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800/60">
          <span className="text-[11px] text-slate-400 mr-1 font-medium">Filter Section:</span>
          <button
            onClick={() => setSection('')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${!section ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'}`}
          >
            All Sections
          </button>
          {defaultSections.map((s) => (
            <button
              key={s}
              onClick={() => setSection(s)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${section === s ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard Table */}
      <LeaderboardTable
        students={filteredStudents}
        showExport={true}
      />
    </div>
  );
}
