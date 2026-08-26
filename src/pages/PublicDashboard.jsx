import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Code2, 
  TrendingUp, 
  FolderGit2, 
  Trophy, 
  ArrowRight, 
  Sparkles,
  RefreshCw,
  Layers
} from 'lucide-react';
import StatCard from '../components/common/StatCard';
import DifficultyChart from '../components/dashboard/DifficultyChart';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import LeaderboardTable from '../components/leaderboard/LeaderboardTable';
import { useData } from '../context/DataContext';
import { formatRelativeTime } from '../utils/helpers';

export default function PublicDashboard() {
  const { students, activities, lastGlobalSync, isSyncingAll } = useData();

  // Aggregate statistics
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
      activeRepos: totalStudents
    };
  }, [students]);

  // Section-wise metrics for Sec A, Sec B, Sec V, Sec D, Sec E, Sec F
  const sectionsList = ['Sec A', 'Sec B', 'Sec V', 'Sec D', 'Sec E', 'Sec F'];
  
  const sectionMetrics = useMemo(() => {
    return sectionsList.map(sec => {
      // match "Sec A" or "A", "Sec V" or "V", etc.
      const rawLetter = sec.replace('Sec ', '');
      const secStudents = students.filter(s => s.section === sec || s.section === rawLetter);
      const totalSolved = secStudents.reduce((sum, s) => sum + (s.totalSolved || 0), 0);
      const avg = secStudents.length ? Math.round(totalSolved / secStudents.length) : 0;
      return {
        sectionName: sec,
        count: secStudents.length,
        totalSolved,
        avg
      };
    });
  }, [students]);

  // Greeting based on time of day
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning ☀️';
    if (hour < 18) return 'Good Afternoon 🌤️';
    return 'Good Evening 👋';
  }, []);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Hero Welcome Header */}
      <div className="glass-card p-6 sm:p-8 relative overflow-hidden border-slate-800">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ECE Department • LeetSync Automated Tracker</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {greeting}
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl leading-relaxed">
              Tracking Electronics & Communication Engineering (ECE) students across <strong className="text-white">Sec A, Sec B, Sec V, Sec D, Sec E, Sec F</strong> automatically via GitHub repositories.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/students"
              className="btn-primary flex items-center gap-2"
            >
              <span>Explore ECE Students</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/leaderboard"
              className="btn-secondary flex items-center gap-2"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Leaderboard</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Top 4 Metrics Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          title="Total ECE Students"
          value={stats.totalStudents}
          subtitle="Across Sec A, B, V, D, E, F"
          icon={Users}
          color="amber"
        />
        <StatCard
          title="Total Solved"
          value={stats.totalSolved.toLocaleString()}
          subtitle="Unique accepted solutions"
          icon={Code2}
          color="emerald"
        />
        <StatCard
          title="Average Solved"
          value={stats.avgSolved}
          subtitle="Problems per student"
          icon={TrendingUp}
          color="blue"
        />
        <StatCard
          title="Active Repos"
          value={stats.activeRepos}
          subtitle={`Last sync: ${formatRelativeTime(lastGlobalSync)}`}
          icon={FolderGit2}
          color="purple"
        />
      </div>

      {/* Section-Wise Quick Breakdown Grid (Sec A, Sec B, Sec V, Sec D, Sec E, Sec F) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              ECE Sections Performance
            </h2>
          </div>
          <Link to="/analytics" className="text-xs font-semibold text-amber-400 hover:underline">
            View Analytics →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {sectionMetrics.map((sec) => (
            <Link
              key={sec.sectionName}
              to={`/students?section=${encodeURIComponent(sec.sectionName)}`}
              className="glass-card-hover p-3.5 text-center group cursor-pointer border-slate-800/80"
            >
              <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:bg-amber-500/20 transition-colors">
                {sec.sectionName}
              </span>
              <p className="text-lg font-extrabold text-white mt-2 font-mono">
                {sec.totalSolved}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {sec.count} {sec.count === 1 ? 'student' : 'students'}
              </p>
              <p className="text-[10px] text-emerald-400 font-mono mt-0.5">
                ~{sec.avg} avg
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Charts & Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Difficulty Distribution */}
        <div className="lg:col-span-1">
          <DifficultyChart
            easy={stats.easyTotal}
            medium={stats.mediumTotal}
            hard={stats.hardTotal}
            title="ECE Problem Breakdown"
          />
        </div>

        {/* Live Activity Feed */}
        <div className="lg:col-span-2">
          <ActivityFeed activities={activities} />
        </div>
      </div>

      {/* Top Leaderboard Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              ECE Top Solvers Leaderboard
            </h2>
          </div>
          <Link
            to="/leaderboard"
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
          >
            <span>View Full Leaderboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <LeaderboardTable 
          students={students} 
          showExport={false} 
          limitCount={5} 
        />
      </div>
    </div>
  );
}
