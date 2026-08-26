import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
import Pagination from '../components/common/Pagination';
import { useData } from '../context/DataContext';

export default function StudentDirectory() {
  const { students, settings, syncingStudentId, syncStudent } = useData();
  const [searchParams, setSearchParams] = useSearchParams();

  const sectionParam = searchParams.get('section') || '';

  const [searchTerm, setSearchTerm] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');
  const [section, setSection] = useState(sectionParam);
  const [sortBy, setSortBy] = useState('totalSolved');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(30);

  useEffect(() => {
    if (sectionParam) {
      setSection(sectionParam);
    }
  }, [sectionParam]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, department, year, section, sortBy]);

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
        
        // Flexible section matching (e.g. "Sec A" or "A")
        const matchesSec = !section || 
          s.section === section || 
          s.section === section.replace('Sec ', '') ||
          `Sec ${s.section}` === section;

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

  const paginatedGridStudents = useMemo(() => {
    return filteredStudents.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  }, [filteredStudents, currentPage, pageSize]);

  const defaultSections = ['Sec A', 'Sec B', 'Sec C', 'Sec D', 'Sec E', 'Sec F'];

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600 border border-sky-200 shadow-sm">
              <Users className="w-6 h-6" />
            </div>
            <span>ECE Student Directory</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Browse and inspect up to 400+ ECE student profiles across Sec A, Sec B, Sec C, Sec D, Sec E, Sec F ({students.length} Registered)
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl shadow-sm">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/25' : 'text-slate-500 hover:text-slate-800'}`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/25' : 'text-slate-500 hover:text-slate-800'}`}
            title="Table View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="glass-card p-4 space-y-3 bg-white border-sky-100 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search by student name, register number (e.g. 9225...), or GitHub username..."
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <FilterDropdown
              label="Year"
              value={year}
              onChange={setYear}
              options={[
                { value: '', label: 'All Years' },
                ...(settings.years || ['1st Year', '2nd Year', '3rd Year', '4th Year']).map(y => ({ value: y, label: y }))
              ]}
            />

            <FilterDropdown
              label="Section"
              value={section}
              onChange={(val) => { setSection(val); setSearchParams(val ? { section: val } : {}); }}
              options={[
                { value: '', label: 'All Sections' },
                ...defaultSections.map(s => ({ value: s, label: s }))
              ]}
            />

            <FilterDropdown
              label="Sort By"
              value={sortBy}
              onChange={setSortBy}
              options={[
                { value: 'totalSolved', label: 'Most Problems Solved' },
                { value: 'hardSolved', label: 'Most Hard Solved' },
                { value: 'mediumSolved', label: 'Most Medium Solved' },
                { value: 'easySolved', label: 'Most Easy Solved' },
                { value: 'name', label: 'Name (A-Z)' },
                { value: 'lastSynced', label: 'Recently Synced' },
              ]}
            />
          </div>
        </div>

        {/* Quick Section Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
          <span className="text-[11px] text-slate-500 mr-1 font-bold">Quick Section:</span>
          <button
            onClick={() => { setSection(''); setSearchParams({}); }}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all shadow-sm ${!section ? 'bg-sky-500 text-white shadow-sky-500/25' : 'bg-white text-slate-600 hover:text-sky-700 hover:bg-sky-50 border border-slate-200'}`}
          >
            All Sections
          </button>
          {defaultSections.map((s) => (
            <button
              key={s}
              onClick={() => { setSection(s); setSearchParams({ section: s }); }}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all shadow-sm ${section === s ? 'bg-sky-500 text-white shadow-sky-500/25' : 'bg-white text-slate-600 hover:text-sky-700 hover:bg-sky-50 border border-slate-200'}`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Active Filter Chips indicator */}
        {(searchTerm || year || section) && (
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
            <span>Filtering active:</span>
            <span className="font-bold text-sky-700">{filteredStudents.length} matching students</span>
            <button
              onClick={() => { setSearchTerm(''); setYear(''); setSection(''); setSearchParams({}); }}
              className="text-sky-600 hover:text-sky-800 underline ml-2 font-semibold"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Student List View */}
      {filteredStudents.length === 0 ? (
        <div className="glass-card p-12 text-center text-slate-400 bg-white border-sky-100 shadow-sm">
          <Users className="w-12 h-12 mx-auto text-sky-300 mb-3" />
          <h3 className="text-base font-bold text-slate-800">No students found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto font-medium">
            We couldn't find any students matching your search criteria. Try modifying or clearing your filters.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedGridStudents.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                isAdmin={false}
                isSyncing={syncingStudentId === student.id}
                onSync={syncStudent}
              />
            ))}
          </div>

          {filteredStudents.length > 30 && (
            <div className="glass-card overflow-hidden shadow-sm">
              <Pagination
                currentPage={currentPage}
                totalItems={filteredStudents.length}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
                pageSizeOptions={[30, 60, 120, 400]}
              />
            </div>
          )}
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
