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
  Layers
} from 'lucide-react';
import SearchBar from '../../components/common/SearchBar';
import FilterDropdown from '../../components/common/FilterDropdown';
import StudentTable from '../../components/students/StudentTable';
import ConfirmModal from '../../components/common/ConfirmModal';
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
            <span>ECE Student Roster Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Add, configure repositories, trigger syncs, and manage student tracking records across Sec A, Sec B, Sec C, Sec D, Sec E, Sec F.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
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
            <span>Add Student</span>
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

        {/* Section Quick Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800/60">
          <span className="text-[11px] text-slate-400 mr-1 font-medium">Quick Section:</span>
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

      {/* Students Table */}
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
        title="Delete Student Tracking Record?"
        message={`Are you sure you want to delete ${studentToDelete?.name} (${studentToDelete?.registerNumber})? This will remove the student's profile and progress metrics from the dashboard. (Their actual GitHub repository will NOT be affected).`}
        confirmText="Remove Profile"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setStudentToDelete(null)}
        isDanger={true}
      />
    </div>
  );
}
