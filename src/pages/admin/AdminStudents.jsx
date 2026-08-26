import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, 
  UserPlus, 
  Search, 
  RefreshCw, 
  Download, 
  Trash2, 
  SlidersHorizontal,
  Edit,
  Eye,
  Layers,
  UploadCloud,
  FileSpreadsheet,
  FileText,
  ChevronDown
} from 'lucide-react';
import SearchBar from '../../components/common/SearchBar';
import FilterDropdown from '../../components/common/FilterDropdown';
import StudentTable from '../../components/students/StudentTable';
import ConfirmModal from '../../components/common/ConfirmModal';
import BulkStudentModal from '../../components/admin/BulkStudentModal';
import { useData } from '../../context/DataContext';
import { 
  exportLeaderboardWordDoc, 
  exportLeaderboardExcel, 
  exportLeaderboardCsv 
} from '../../utils/exportCsv';

export default function AdminStudents() {
  const { students, settings, syncingStudentId, syncStudent, deleteStudent } = useData();
  const navigate = useNavigate();

  const defaultSections = ['Sec A', 'Sec B', 'Sec C', 'Sec D', 'Sec E', 'Sec F'];

  const [searchTerm, setSearchTerm] = useState('');
  const [year, setYear] = useState('');
  const [section, setSection] = useState('');
  const [sortBy, setSortBy] = useState('totalSolved');
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
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
    return students
      .filter((s) => {
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
      })
      .sort((a, b) => {
        if (sortBy === 'totalSolved') return (b.totalSolved || 0) - (a.totalSolved || 0);
        if (sortBy === 'hardSolved') return (b.hardSolved || 0) - (a.hardSolved || 0);
        if (sortBy === 'mediumSolved') return (b.mediumSolved || 0) - (a.mediumSolved || 0);
        if (sortBy === 'easySolved') return (b.easySolved || 0) - (a.easySolved || 0);
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'lastSynced') {
          return new Date(b.lastSynced || 0) - new Date(a.lastSynced || 0);
        }
        return 0;
      });
  }, [students, searchTerm, year, section, sortBy]);

  const handleDeleteConfirm = () => {
    if (studentToDelete) {
      deleteStudent(studentToDelete.id);
      setStudentToDelete(null);
    }
  };

  const handleEditClick = (student) => {
    navigate(`/admin/students/edit/${student.id}`);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600 border border-sky-200 shadow-sm">
              <Users className="w-6 h-6" />
            </div>
            <span>ECE Student Roster Management (Up to 400+)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Manage student tracking records across Sec A, Sec B, Sec C, Sec D, Sec E, Sec F ({students.length} Total Registered).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsBulkModalOpen(true)}
            className="btn-secondary flex items-center gap-1.5 text-xs text-sky-700 border-sky-200 hover:bg-sky-50 font-semibold"
            title="Import up to 400+ students via CSV / Excel"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-sky-600" />
            <span>Bulk Import (CSV)</span>
          </button>

          {/* Multi-Format Export Dropdown */}
          <div className="relative" ref={exportRef}>
            <button
              onClick={() => setIsExportOpen(!isExportOpen)}
              className="btn-secondary flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-sky-700 shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-sky-600" />
              <span>Export Roster</span>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isExportOpen ? 'rotate-180' : ''}`} />
            </button>

            {isExportOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white border border-sky-100 rounded-2xl shadow-xl z-50 p-1.5 animate-slide-up">
                <button
                  onClick={() => {
                    exportLeaderboardWordDoc(filteredStudents);
                    setIsExportOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-sky-700 hover:bg-sky-50 rounded-xl transition-colors text-left"
                >
                  <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Word Document (.doc)</span>
                </button>
                <button
                  onClick={() => {
                    exportLeaderboardExcel(filteredStudents);
                    setIsExportOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors text-left mt-0.5"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Excel Table (.xls)</span>
                </button>
                <button
                  onClick={() => {
                    exportLeaderboardCsv(filteredStudents);
                    setIsExportOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-sky-700 hover:bg-sky-50 rounded-xl transition-colors text-left mt-0.5"
                >
                  <Download className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Clean CSV (.csv)</span>
                </button>
              </div>
            )}
          </div>

          <Link
            to="/admin/students/add"
            className="btn-primary flex items-center gap-2 text-xs font-semibold shadow-md shadow-sky-500/25"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Add Student</span>
          </Link>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-card p-4 space-y-3 bg-white border-sky-100 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search by student name, register number, or GitHub..."
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
              onChange={setSection}
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
                { value: 'totalSolved', label: 'Solved (Highest)' },
                { value: 'hardSolved', label: 'Hard (Highest)' },
                { value: 'mediumSolved', label: 'Medium (Highest)' },
                { value: 'easySolved', label: 'Easy (Highest)' },
                { value: 'name', label: 'Name (A-Z)' },
                { value: 'lastSynced', label: 'Recently Synced' },
              ]}
            />
          </div>
        </div>

        {/* Section Quick Filters */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
          <span className="text-[11px] text-slate-500 mr-1 font-bold">Quick Filter:</span>
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

      {/* Student Table */}
      <StudentTable
        students={filteredStudents}
        isAdmin={true}
        syncingStudentId={syncingStudentId}
        onSync={syncStudent}
        onEdit={handleEditClick}
        onDelete={setStudentToDelete}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(studentToDelete)}
        title="Delete Student Profile"
        message={`Are you sure you want to remove ${studentToDelete?.name} (${studentToDelete?.registerNumber}) from the tracker? This will remove their synchronized stats and project portfolio.`}
        confirmText="Yes, Delete Profile"
        type="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setStudentToDelete(null)}
      />

      {/* Bulk Import Modal */}
      <BulkStudentModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
      />
    </div>
  );
}
