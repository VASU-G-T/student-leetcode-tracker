import React, { useState, useMemo } from 'react';
import { 
  Users, 
  LayoutGrid, 
  List, 
  Search, 
  SlidersHorizontal,
  ArrowUpDown,
  UserPlus
} from 'lucide-react';
import SearchBar from '../components/common/SearchBar';
import FilterDropdown from '../components/common/FilterDropdown';
import StudentCard from '../components/students/StudentCard';
import StudentTable from '../components/students/StudentTable';
import { useData } from '../context/DataContext';

export default function StudentDirectory() {
  const { students, settings, syncingStudentId, syncStudent } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');
  const [section, setSection] = useState('');
  const [sortBy, setSortBy] = useState('totalSolved');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

  // Filter and sort students
  const filteredStudents = useMemo(() => {
    return students
      .filter((s) => {
        const matchesSearch =
          !searchTerm ||
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.registerNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (s.githubUsername && s.githubUsername.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesDept = !department || s.department === department;
        const matchesYear = !year || s.year === year;
        const matchesSec = !section || s.section === section;

        return matchesSearch && matchesDept && matchesYear && matchesSec;
      })
      .sort((a, b) => {
        if (sortBy === 'totalSolved') return (b.totalSolved || 0) - (a.totalSolved || 0);
        if (sortBy === 'easySolved') return (b.easySolved || 0) - (a.easySolved || 0);
        if (sortBy === 'mediumSolved') return (b.mediumSolved || 0) - (a.mediumSolved || 0);
        if (sortBy === 'hardSolved') return (b.hardSolved || 0) - (a.hardSolved || 0);
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'lastSynced') {
          return new Date(b.lastSynced || 0) - new Date(a.lastSynced || 0);
        }
        return 0;
      });
  }, [students, searchTerm, department, year, section, sortBy]);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-7 h-7 text-amber-400" />
            <span>Student Directory</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse and inspect college student coding profiles & repositories ({students.length} Total)
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'}`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-md transition-colors ${viewMode === 'table' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'}`}
            title="Table View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search & Filters Card */}
      <div className="glass-card p-4 sm:p-5 space-y-3">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search by student name, register number, or GitHub username..."
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <FilterDropdown
              label="Dept"
              value={department}
              onChange={setDepartment}
              options={settings.departments || ['ECE', 'CSE', 'IT', 'AI&DS']}
            />
            <FilterDropdown
              label="Year"
              value={year}
              onChange={setYear}
              options={settings.years || ['1st Year', '2nd Year', '3rd Year', '4th Year']}
            />
            <FilterDropdown
              label="Sec"
              value={section}
              onChange={setSection}
              options={settings.sections || ['A', 'B', 'C']}
            />

            {/* Sort Select */}
            <div className="flex items-center gap-1.5 min-w-[140px]">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field py-2 text-xs font-medium cursor-pointer bg-slate-900/90 text-slate-200 border-slate-800"
              >
                <option value="totalSolved">Sort: Total Solved</option>
                <option value="easySolved">Sort: Easy Solved</option>
                <option value="mediumSolved">Sort: Medium Solved</option>
                <option value="hardSolved">Sort: Hard Solved</option>
                <option value="name">Sort: Name (A-Z)</option>
                <option value="lastSynced">Sort: Recent Sync</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Chips indicator */}
        {(searchTerm || department || year || section) && (
          <div className="flex items-center gap-2 pt-2 border-t border-slate-800/60 text-xs text-slate-400">
            <span>Filtering active:</span>
            <span className="font-semibold text-amber-400">{filteredStudents.length} matching students</span>
            <button
              onClick={() => { setSearchTerm(''); setDepartment(''); setYear(''); setSection(''); }}
              className="text-slate-400 hover:text-white underline ml-2"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Student List View */}
      {filteredStudents.length === 0 ? (
        <div className="glass-card p-12 text-center text-slate-400">
          <Users className="w-12 h-12 mx-auto text-slate-600 mb-3" />
          <h3 className="text-base font-semibold text-slate-300">No students found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            We couldn't find any students matching your search criteria. Try modifying or clearing your filters.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredStudents.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              isAdmin={false}
              isSyncing={syncingStudentId === student.id}
              onSync={syncStudent}
            />
          ))}
        </div>
      ) : (
        <StudentTable
          students={filteredStudents}
          isAdmin={false}
          syncingStudentId={syncingStudentId}
          onSync={syncStudent}
        />
      )}
    </div>
  );
}
