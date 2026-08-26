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
  ArrowRight,
  Download,
  Sparkles
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import DifficultyChart from '../../components/dashboard/DifficultyChart';
import ActivityFeed from '../../components/dashboard/ActivityFeed';
import StudentTable from '../../components/students/StudentTable';
import { useData } from '../../context/DataContext';
import { formatRelativeTime } from '../../utils/helpers';
import { exportLeaderboardCsv } from '../../utils/exportCsv';

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
      <div className="glass-card p-6 sm:p-7 border-amber-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
                Admin Control Console
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Platform Overview & Sync Engine
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl">
              Manage student cohorts, inspect GitHub repository trees, and automate LeetCode progress calculation.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={syncAll}
              disabled={isSyncingAll}
              className="btn-primary flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncingAll ? 'animate-spin' : ''}`} />
              <span>{isSyncingAll ? `Syncing (${syncProgress.current}/${syncProgress.total})...` : 'Sync All Repos'}</span>
            </button>

            <Link
              to="/admin/students/add"
              className="btn-secondary flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4 text-amber-400" />
              <span>Add Student</span>
            </Link>

            <button
              onClick={() => exportLeaderboardCsv(students)}
              className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Export all student data to CSV"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Top 5 Statistics (per Requirement #5) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          subtitle="Enrolled cohort"
          icon={Users}
          color="amber"
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
            <Users className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Enrolled Students
            </h2>
          </div>
          <Link
            to="/admin/students"
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
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
