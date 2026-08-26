import React, { useState, useMemo } from 'react';
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
  FileSpreadsheet
} from 'lucide-react';
import SearchBar from '../../components/common/SearchBar';
import FilterDropdown from '../../components/common/FilterDropdown';
import StudentTable from '../../components/students/StudentTable';
import ConfirmModal from '../../components/common/ConfirmModal';
import BulkStudentModal from '../../components/admin/BulkStudentModal';
import { useData } from '../../context/DataContext';
import { exportLeaderboardCsv } from '../../utils/exportCsv';

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
        if (sortBy === 'easySolved') return (b.easySolved || 0) - (a.easySolved || 0);
        if (sortBy === 'mediumSolved') return (b.mediumSolved || 0) - (a.mediumSolved || 0);
        if (sortBy === 'hardSolved') return (b.hardSolved || 0) - (a.hardSolved || 0);
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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-7 h-7 text-amber-400" />
            <span>ECE Student Roster Management (Up to 400+)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage student tracking records across Sec A, Sec B, Sec C, Sec D, Sec E, Sec F ({students.length} Total Registered).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsBulkModalOpen(true)}
            className="btn-secondary flex items-center gap-1.5 text-xs text-amber-400 border-amber-500/30 hover:bg-amber-500/10"
            title="Import up to 400+ students via CSV / Excel"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Bulk Import (CSV)</span>
          </button>

          <button
            onClick={() => exportLeaderboardCsv(students)}
            className="btn-secondary flex items-center gap-1.5 text-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Roster</span>
          </button>

          <Link
            to="/admin/students/add"
            className="btn-primary flex items-center gap-2 text-xs font-semibold"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Add Student</span>
          </Link>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-card p-4 space-y-3">
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
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800/60">
          <span className="text-[11px] text-slate-400 mr-1 font-medium">Quick Filter:</span>
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
