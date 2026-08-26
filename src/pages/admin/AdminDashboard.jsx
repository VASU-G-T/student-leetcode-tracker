import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Code2, 
  TrendingUp, 
  FolderGit2, 
  RefreshCw, 
  UserPlus, 
  Trophy, 
  ShieldCheck,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import DifficultyChart from '../../components/dashboard/DifficultyChart';
import ActivityFeed from '../../components/dashboard/ActivityFeed';
import StudentTable from '../../components/students/StudentTable';
import ExportMenu from '../../components/common/ExportMenu';
import { useData } from '../../context/DataContext';
import { formatRelativeTime } from '../../utils/helpers';

export default function AdminDashboard() {
  const { 
    students, 
    activities, 
    lastGlobalSync, 
    isSyncingAll, 
    syncProgress, 
    syncAll, 
    syncStudent, 
    syncingStudentId, 
    deleteStudent 
  } = useData();

  const stats = useMemo(() => {
    const totalStudents = students.length;
    let totalSolved = 0;
    let easyTotal = 0;
    let mediumTotal = 0;
    let hardTotal = 0;

    students.forEach((s) => {
      totalSolved += s.totalSolved || 0;
      easyTotal += s.easySolved || 0;
      mediumTotal += s.mediumSolved || 0;
      hardTotal += s.hardSolved || 0;
    });

    const avgSolved = totalStudents > 0 ? (totalSolved / totalStudents).toFixed(1) : '0';

    return {
      totalStudents,
      totalSolved,
      easyTotal,
      mediumTotal,
      hardTotal,
      avgSolved,
      totalRepos: totalStudents
    };
  }, [students]);

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Top Banner */}
      <div className="glass-card p-6 sm:p-7 border-sky-100 bg-white relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-sky-50 text-sky-600 border border-sky-200">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <span className="text-xs font-mono uppercase tracking-wider text-sky-700 font-bold">
                Admin Control Console
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Platform Overview & Sync Engine
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm max-w-xl font-medium">
              Manage student cohorts, inspect GitHub repository trees, and automate LeetCode progress calculation.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={syncAll}
              disabled={isSyncingAll}
              className="btn-primary flex items-center gap-2 shadow-md shadow-sky-500/25"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncingAll ? 'animate-spin' : ''}`} />
              <span>{isSyncingAll ? `Syncing (${syncProgress.current}/${syncProgress.total})...` : 'Sync All Repos'}</span>
            </button>

            <Link
              to="/admin/students/add"
              className="btn-secondary flex items-center gap-2 font-semibold text-slate-700 hover:text-sky-700"
            >
              <UserPlus className="w-4 h-4 text-sky-600" />
              <span>Add Student</span>
            </Link>

            {/* Unified Export Menu */}
            <ExportMenu
              data={students}
              buttonText="Export Roster"
              size="md"
            />
          </div>
        </div>
      </div>

      {/* Top 5 Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          subtitle="Enrolled cohort"
          icon={Users}
          color="sky"
        />
        <StatCard
          title="Problems Solved"
          value={stats.totalSolved.toLocaleString()}
          subtitle="Verified via GitHub"
          icon={Code2}
          color="emerald"
        />
        <StatCard
          title="Avg Per Student"
          value={stats.avgSolved}
          subtitle="Solutions / student"
          icon={TrendingUp}
          color="blue"
        />
        <StatCard
          title="Total Repos"
          value={stats.totalRepos}
          subtitle="Configured trackers"
          icon={FolderGit2}
          color="purple"
        />
        <StatCard
          title="Last Sync"
          value={formatRelativeTime(lastGlobalSync)}
          subtitle="Automated background"
          icon={RefreshCw}
          color="rose"
        />
      </div>

      {/* Charts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <DifficultyChart
            easy={stats.easyTotal}
            medium={stats.mediumTotal}
            hard={stats.hardTotal}
            title="Difficulty Distribution"
          />
        </div>

        <div className="lg:col-span-2">
          <ActivityFeed activities={activities} />
        </div>
      </div>

      {/* Recent Students Table Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-sky-50 text-sky-600 border border-sky-200">
              <Users className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
              Enrolled Students
            </h2>
          </div>
          <Link
            to="/admin/students"
            className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1 transition-colors"
          >
            <span>Manage All Students</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <StudentTable
          students={students.slice(0, 5)}
          isAdmin={true}
          syncingStudentId={syncingStudentId}
          onSync={syncStudent}
        />
      </div>
    </div>
  );
}
