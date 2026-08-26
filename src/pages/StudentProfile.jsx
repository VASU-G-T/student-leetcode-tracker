import React, { useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Flame, 
  Target, 
  Calendar, 
  BookOpen, 
  CheckCircle2,
  FolderGit2
} from 'lucide-react';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProblemTable from '../components/profile/ProblemTable';
import DifficultyChart from '../components/dashboard/DifficultyChart';
import { ProfileSkeleton } from '../components/common/LoadingSkeleton';
import { useData } from '../context/DataContext';

export default function StudentProfile() {
  const { id } = useParams();
  const { getStudentById, getStudentProblems, syncStudent, syncingStudentId, loading } = useData();

  const student = useMemo(() => getStudentById(id), [id, getStudentById]);
  const problems = useMemo(() => student ? getStudentProblems(student.id) : [], [student, getStudentProblems]);

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (!student) {
    return (
      <div className="glass-card p-12 text-center max-w-lg mx-auto my-12 space-y-4">
        <FolderGit2 className="w-12 h-12 text-slate-600 mx-auto" />
        <h2 className="text-xl font-bold text-white">Student Not Found</h2>
        <p className="text-sm text-slate-400">
          No student found with identifier <span className="font-mono text-amber-400">"{id}"</span>.
        </p>
        <Link to="/students" className="btn-primary inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Students</span>
        </Link>
      </div>
    );
  }

  const isSyncing = syncingStudentId === student.id;

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Back button link */}
      <div>
        <Link
          to="/students"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Student Directory</span>
        </Link>
      </div>

      {/* Main Profile Header */}
      <ProfileHeader
        student={student}
        isSyncing={isSyncing}
        onSync={syncStudent}
      />

      {/* Analytics Breakdown & Solved Problems */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Difficulty Breakdown */}
        <div className="lg:col-span-1 space-y-6">
          <DifficultyChart
            easy={student.easySolved || 0}
            medium={student.mediumSolved || 0}
            hard={student.hardSolved || 0}
            title="Problem Complexity"
          />

          {/* Quick Insights Card */}
          <div className="glass-card p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <span>Progress Insights</span>
            </h3>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/40 border border-slate-800">
                <span className="text-slate-400">Target Goal</span>
                <span className="font-mono font-bold text-amber-400">{student.goal || 200} Solved</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/40 border border-slate-800">
                <span className="text-slate-400">Completion</span>
                <span className="font-mono font-bold text-emerald-400">
                  {Math.round(((student.totalSolved || 0) / (student.goal || 200)) * 100)}%
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/40 border border-slate-800">
                <span className="text-slate-400">Hard Problem Ratio</span>
                <span className="font-mono font-bold text-rose-400">
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
    </div>
  );
}
