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
  Layers, 
  UserPlus, 
  ShieldCheck,
  ExternalLink,
  Award,
  GraduationCap,
  Edit3
} from 'lucide-react';
import { GithubIcon, LeetCodeIcon } from '../components/common/Icons';
import StatCard from '../components/common/StatCard';
import DifficultyChart from '../components/dashboard/DifficultyChart';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import LeaderboardTable from '../components/leaderboard/LeaderboardTable';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { formatRelativeTime } from '../utils/helpers';
import { CREATOR_PROFILE } from '../services/sampleData';

export default function PublicDashboard() {
  const { students, activities, lastGlobalSync, isSyncingAll } = useData();
  const { currentUser, isAdmin } = useAuth();

  // Find creator student dynamically from roster
  const creatorStudent = useMemo(() => {
    return students.find(s => s.id === 'vasu_gt_creator' || s.isCreator || s.username?.toUpperCase() === 'VASU-G-T') || 
           students.find(s => s.registerNumber === '922525106360' && s.name?.toLowerCase().includes('vasu')) || 
           CREATOR_PROFILE;
  }, [students]);

  const isCreatorOrAdmin = isAdmin || (currentUser && (
    currentUser.username?.toLowerCase() === 'vasu-g-t' ||
    currentUser.studentId === creatorStudent.id ||
    currentUser.registerNumber === creatorStudent.registerNumber
  ));

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

  // Section-wise metrics for Sec A, Sec B, Sec C, Sec D, Sec E, Sec F
  const sectionsList = ['Sec A', 'Sec B', 'Sec C', 'Sec D', 'Sec E', 'Sec F'];
  
  const sectionMetrics = useMemo(() => {
    return sectionsList.map(sec => {
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
      <div className="glass-card p-6 sm:p-8 relative overflow-hidden border-sky-100 bg-white space-y-6 shadow-sm">
        <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Top Headline & Actions */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>ECE Department • LeetSync Automated Tracker</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {greeting}
            </h1>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl leading-relaxed font-medium">
              Tracking Electronics & Communication Engineering (ECE) students across <strong className="text-slate-900">Sec A, Sec B, Sec C, Sec D, Sec E, Sec F</strong> automatically via GitHub repositories.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/students"
              className="btn-primary flex items-center gap-2 shadow-md shadow-sky-500/20"
            >
              <span>Explore ECE Students</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/register"
              className="btn-secondary flex items-center gap-2 text-sky-700 font-semibold border-sky-200 hover:border-sky-300 hover:bg-sky-50"
            >
              <UserPlus className="w-4 h-4 text-sky-600" />
              <span>Register Student Profile</span>
            </Link>
          </div>
        </div>

        {/* Dedicated App Creator & Lead Developer Profile Spotlight */}
        <div className="relative z-10 p-5 rounded-2xl bg-gradient-to-br from-sky-50/90 via-white to-blue-50/40 border border-sky-200 shadow-md shadow-sky-500/5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="flex items-center sm:items-start gap-4">
            <div className="relative group shrink-0">
              <img
                src={creatorStudent.profileImage || `https://api.dicebear.com/7.x/bottts/svg?seed=${creatorStudent.githubUsername || 'creator'}`}
                alt={creatorStudent.name}
                className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover border-2 border-sky-400 shadow-md shadow-sky-500/15 bg-white"
              />
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                  {creatorStudent.name}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-sky-100 border border-sky-200 text-[11px] font-bold text-sky-800 flex items-center gap-1 shadow-sm">
                  <Sparkles className="w-3 h-3 text-sky-600" />
                  <span>App Creator & Lead Developer</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-white border border-sky-200 text-[10px] font-mono text-slate-700 font-bold">
                  {creatorStudent.department} • {creatorStudent.section}
                </span>
              </div>

              <p className="text-xs text-slate-600 max-w-xl line-clamp-1 leading-relaxed">
                {creatorStudent.bio}
              </p>

              {/* Creator Skills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(creatorStudent.skills || ['React', 'Node.js', 'Vite', 'IoT / Embedded', 'LeetCode DSA', 'Firebase']).slice(0, 7).map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-white border border-sky-200 text-[10px] font-mono font-bold text-sky-700 shadow-sm"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Actions: View Profile, Edit Profile (if Admin/Creator), and GitHub */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto shrink-0">
            <Link
              to={`/student/${creatorStudent.registerNumber || creatorStudent.id}`}
              className="btn-primary flex-1 lg:flex-initial !py-2 !px-4 text-xs flex items-center justify-center gap-1.5 shadow-md shadow-sky-500/20"
            >
              <span>View Creator Profile & Projects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {isCreatorOrAdmin && (
              <Link
                to={`/student/edit/${creatorStudent.registerNumber || creatorStudent.id}`}
                className="btn-secondary !py-2 !px-3 text-xs flex items-center justify-center gap-1.5 text-sky-700 border-sky-200 hover:bg-sky-50 font-semibold"
                title="Edit Creator Profile, Photo & Projects"
              >
                <Edit3 className="w-3.5 h-3.5 text-sky-600" />
                <span>Edit Profile & Projects</span>
              </Link>
            )}

            <a
              href="https://github.com/VASU-G-T"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary !py-2 !px-3 text-xs flex items-center justify-center gap-1.5 bg-white text-slate-700 hover:text-sky-700"
              title="GitHub Profile"
            >
              <GithubIcon className="w-3.5 h-3.5 text-slate-700" />
              <span className="hidden sm:inline">GitHub</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </div>
      </div>

      {/* Top 4 Metrics Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          title="Total ECE Students"
          value={stats.totalStudents}
          subtitle="Across Sec A, B, C, D, E, F"
          icon={Users}
          color="sky"
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
          subtitle={`Last sync: ${lastGlobalSync ? formatRelativeTime(lastGlobalSync) : 'Ready to sync'}`}
          icon={FolderGit2}
          color="purple"
        />
      </div>

      {/* Section-Wise Quick Breakdown Grid (Sec A, Sec B, Sec C, Sec D, Sec E, Sec F) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-sky-50 text-sky-600 border border-sky-200">
              <Layers className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              ECE Sections Performance
            </h2>
          </div>
          <Link to="/analytics" className="text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline">
            View Analytics →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {sectionMetrics.map((sec) => (
            <Link
              key={sec.sectionName}
              to={`/students?section=${encodeURIComponent(sec.sectionName)}`}
              className="glass-card-hover p-3.5 text-center group cursor-pointer border-sky-100 bg-white"
            >
              <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                {sec.sectionName}
              </span>
              <p className="text-lg font-extrabold text-slate-900 mt-2 font-mono">
                {sec.totalSolved}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                {sec.count} {sec.count === 1 ? 'student' : 'students'}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Grid: Difficulty Chart & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <DifficultyChart
            easy={stats.easyTotal}
            medium={stats.mediumTotal}
            hard={stats.hardTotal}
            title="Department Problem Complexity"
          />
        </div>

        <div className="lg:col-span-2">
          <ActivityFeed activities={activities} />
        </div>
      </div>

      {/* Department Leaderboard Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-sky-50 text-sky-600 border border-sky-200">
                <Trophy className="w-5 h-5" />
              </div>
              <span>ECE Department Leaderboard</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Top performers ranked by total accepted LeetCode solutions.
            </p>
          </div>

          <Link
            to="/leaderboard"
            className="btn-secondary text-xs flex items-center gap-1.5 font-semibold text-sky-700 hover:text-sky-800"
          >
            <span>Full Leaderboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <LeaderboardTable
          students={students}
          limitCount={10}
        />
      </div>
    </div>
  );
}
