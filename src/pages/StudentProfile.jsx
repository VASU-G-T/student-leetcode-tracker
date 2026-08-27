import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Flame, 
  Target, 
  Calendar, 
  BookOpen, 
  CheckCircle2, 
  FolderGit2,
  Layers,
  Plus,
  Sparkles
} from 'lucide-react';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProblemTable from '../components/profile/ProblemTable';
import DifficultyChart from '../components/dashboard/DifficultyChart';
import ProjectCard from '../components/profile/ProjectCard';
import ProjectModal from '../components/profile/ProjectModal';
import { ProfileSkeleton } from '../components/common/LoadingSkeleton';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

export default function StudentProfile() {
  const { id } = useParams();
  const { 
    getStudentById, 
    getStudentProblems, 
    getStudentProjects,
    addStudentProject,
    updateStudentProject,
    deleteStudentProject,
    syncStudent, 
    syncingStudentId, 
    loading 
  } = useData();
  const { currentUser, isAdmin } = useAuth();

  const student = useMemo(() => getStudentById(id), [id, getStudentById]);
  const problems = useMemo(() => student ? getStudentProblems(student.id) : [], [student, getStudentProblems]);
  const projects = useMemo(() => student ? getStudentProjects(student.id) : [], [student, getStudentProjects]);

  // Project Modal State
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (!student) {
    return (
      <div className="glass-card p-12 text-center max-w-lg mx-auto my-12 space-y-4 bg-white border-sky-100 shadow-sm">
        <FolderGit2 className="w-12 h-12 text-sky-300 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Student Not Found</h2>
        <p className="text-sm text-slate-500">
          No student found with identifier <span className="font-mono font-bold text-sky-700">"{id}"</span>.
        </p>
        <Link to="/students" className="btn-primary inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Students</span>
        </Link>
      </div>
    );
  }

  const isOwner = currentUser && (
    currentUser.studentId === student.id ||
    currentUser.username?.toLowerCase() === student.username?.toLowerCase() ||
    currentUser.registerNumber?.toLowerCase() === student.registerNumber?.toLowerCase() ||
    isAdmin
  );

  const isSyncing = syncingStudentId === student.id;

  const handleAddProject = () => {
    setEditingProject(null);
    setIsProjectModalOpen(true);
  };

  const handleEditProject = (proj) => {
    setEditingProject(proj);
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = (projectData) => {
    if (editingProject) {
      updateStudentProject(student.id, editingProject.id, projectData);
    } else {
      addStudentProject(student.id, projectData);
    }
  };

  const handleDeleteProject = (proj) => {
    if (window.confirm(`Delete "${proj.title}" from your project showcase?`)) {
      deleteStudentProject(student.id, proj.id);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Back button link */}
      <div>
        <Link
          to="/students"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-sky-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-sky-500" />
          <span>Back to Student Directory</span>
        </Link>
      </div>

      {/* Main Profile Header */}
      <ProfileHeader
        student={student}
        isSyncing={isSyncing}
        onSync={syncStudent}
        onAddProject={isOwner ? handleAddProject : null}
      />

      {/* Unlimited Projects & Portfolio Showcase Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600 border border-sky-200">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                Featured Projects & Engineering Portfolio
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Software applications, IoT builds, and GitHub repositories created by {student.name}.
              </p>
            </div>
          </div>

          {isOwner && (
            <button
              onClick={handleAddProject}
              className="btn-primary flex items-center gap-1.5 text-xs font-semibold"
            >
              <Plus className="w-4 h-4" />
              <span>Add Project</span>
            </button>
          )}
        </div>

        {projects.length === 0 ? (
          <div className="glass-card p-8 text-center border-dashed border-sky-200 bg-white shadow-sm">
            <Layers className="w-8 h-8 text-sky-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-800">No external projects showcased yet</p>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto font-medium">
              {isOwner 
                ? 'Click "Add Project" above to showcase your apps, hardware builds, and GitHub repositories on your profile!'
                : `${student.name} hasn't added external project showcases yet.`}
            </p>
            {isOwner && (
              <button
                onClick={handleAddProject}
                className="btn-secondary text-xs mt-4 inline-flex items-center gap-1.5 text-sky-700 border-sky-200 hover:bg-sky-50 font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Your First Project</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((proj) => (
              <ProjectCard
                key={proj.id}
                project={proj}
                isOwner={isOwner}
                onEdit={handleEditProject}
                onDelete={handleDeleteProject}
              />
            ))}
          </div>
        )}
      </div>

      {/* LeetCode Analytics Breakdown & Solved Problems */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Difficulty Breakdown */}
        <div className="lg:col-span-1 space-y-6">
          <DifficultyChart
            easy={student.easySolved || 0}
            medium={student.mediumSolved || 0}
            hard={student.hardSolved || 0}
            title="LeetCode Problem Breakdown"
          />

          {/* Quick Insights Card */}
          <div className="glass-card p-5 space-y-4 bg-white border-sky-100 shadow-sm">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-lg bg-orange-50 text-orange-600 border border-orange-200">
                  <Flame className="w-4 h-4" />
                </div>
                <span>Progress Insights</span>
              </div>
              {student.streak > 0 && (
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 font-bold border border-orange-200">
                  🔥 {student.streak}d Streak
                </span>
              )}
            </h3>

            <div className="space-y-2.5 text-xs text-slate-700">
              {/* Goal & Progress Bar */}
              <div className="p-3 rounded-xl bg-sky-50/50 border border-sky-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium">Target Goal</span>
                  <span className="font-mono font-extrabold text-sky-700">{student.goal || 4033} Solved</span>
                </div>
                <div className="w-full bg-sky-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-sky-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(1, Math.round(((student.totalSolved || 0) / (student.goal || 4033)) * 100)))}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Completion</span>
                  <span className="font-mono font-bold text-emerald-700">
                    {Math.round(((student.totalSolved || 0) / (student.goal || 4033)) * 100)}%
                  </span>
                </div>
              </div>

              {/* Velocity */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100 text-center">
                  <span className="text-[10px] text-slate-500 font-medium block">Today</span>
                  <span className="font-mono font-extrabold text-emerald-700 text-sm">+{student.todaySolved || 0}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-sky-50/50 border border-sky-100 text-center">
                  <span className="text-[10px] text-slate-500 font-medium block">1 Week</span>
                  <span className="font-mono font-extrabold text-sky-700 text-sm">{student.weekSolved || 0}</span>
                </div>
              </div>

              {/* Hard Ratio */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-sky-50/50 border border-sky-100">
                <span className="text-slate-600 font-medium">Hard Problem Ratio</span>
                <span className="font-mono font-extrabold text-rose-700">
                  {student.totalSolved > 0 ? Math.round(((student.hardSolved || 0) / student.totalSolved) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Solved Problems Table */}
        <div className="lg:col-span-2">
          <ProblemTable
            problems={problems}
            studentName={student.name}
          />
        </div>
      </div>

      {/* Project Modal */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        project={editingProject}
        onClose={() => setIsProjectModalOpen(false)}
        onSave={handleSaveProject}
      />
    </div>
  );
}
