import React, { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { 
  BarChart3, 
  Users, 
  Code2, 
  TrendingUp, 
  Layers, 
  Award,
  Flame
} from 'lucide-react';
import StatCard from '../components/common/StatCard';
import DifficultyChart from '../components/dashboard/DifficultyChart';
import { useData } from '../context/DataContext';

export default function PublicAnalytics() {
  const { students } = useData();

  const sectionsList = ['Sec A', 'Sec B', 'Sec C', 'Sec D', 'Sec E', 'Sec F'];

  // Section analytics calculation
  const sectionData = useMemo(() => {
    return sectionsList.map(sec => {
      const rawLetter = sec.replace('Sec ', '');
      const secStudents = students.filter(s => s.section === sec || s.section === rawLetter);
      let totalSolved = 0;
      let easy = 0;
      let medium = 0;
      let hard = 0;

      secStudents.forEach(s => {
        totalSolved += s.totalSolved || 0;
        easy += s.easySolved || 0;
        medium += s.mediumSolved || 0;
        hard += s.hardSolved || 0;
      });

      const avgSolved = secStudents.length ? Math.round(totalSolved / secStudents.length) : 0;

      return {
        section: sec,
        totalStudents: secStudents.length,
        totalSolved,
        easy,
        medium,
        hard,
        avgSolved
      };
    });
  }, [students]);

  // Top 8 Solvers for Bar Chart
  const topSolversData = useMemo(() => {
    return [...students]
      .sort((a, b) => (b.totalSolved || 0) - (a.totalSolved || 0))
      .slice(0, 8)
      .map(s => ({
        name: s.name.split(' ')[0],
        fullName: s.name,
        section: s.section,
        Easy: s.easySolved || 0,
        Medium: s.mediumSolved || 0,
        Hard: s.hardSolved || 0,
        Total: s.totalSolved || 0
      }));
  }, [students]);

  // Totals
  const totals = useMemo(() => {
    let easy = 0, med = 0, hard = 0, total = 0;
    students.forEach(s => {
      easy += s.easySolved || 0;
      med += s.mediumSolved || 0;
      hard += s.hardSolved || 0;
      total += s.totalSolved || 0;
    });
    return { 
      easy, 
      med, 
      hard, 
      total, 
      avg: students.length ? (total / students.length).toFixed(1) : 0 
    };
  }, [students]);

  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-2xl text-xs space-y-1">
          <p className="font-bold text-white mb-1.5">{label}</p>
          {payload.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between gap-4">
              <span className="text-slate-400 capitalize">{item.name}:</span>
              <span className="font-mono font-bold text-white">{item.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-2">
          <Layers className="w-3.5 h-3.5" />
          <span>ECE Department Performance</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <BarChart3 className="w-7 h-7 text-amber-400" />
          <span>Section-Wise LeetCode Analytics</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Comparative benchmarks across <strong className="text-white">Sec A, Sec B, Sec C, Sec D, Sec E, Sec F</strong> in Electronics & Communication Engineering.
        </p>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total ECE Students"
          value={students.length}
          subtitle="Enrolled cohort"
          icon={Users}
          color="amber"
        />
        <StatCard
          title="Total Solved"
          value={totals.total.toLocaleString()}
          subtitle="Verified via GitHub"
          icon={Code2}
          color="emerald"
        />
        <StatCard
          title="Average Per Student"
          value={totals.avg}
          subtitle="Department benchmark"
          icon={TrendingUp}
          color="blue"
        />
        <StatCard
          title="Active Sections"
          value={6}
          subtitle="Sec A, B, C, D, E, F"
          icon={Layers}
          color="purple"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section Comparison Chart */}
        <div className="glass-card p-5 flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Section Progress Comparison</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Average problems solved per student by section</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="section" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar dataKey="avgSolved" name="Avg Solved" fill="#ffa116" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Solvers Stacked Chart */}
        <div className="glass-card p-5 flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Top Solvers Difficulty Composition</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Distribution of Easy, Medium, and Hard solves</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topSolversData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip content={<CustomBarTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="Easy" stackId="a" fill="#00b8a3" />
                <Bar dataKey="Medium" stackId="a" fill="#ffc01e" />
                <Bar dataKey="Hard" stackId="a" fill="#ff375f" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Section Breakdown Summary Table */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white tracking-tight">
          ECE Section-Wise Summary Table
        </h2>

        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Section</th>
                  <th className="py-3 px-4 text-center">Enrolled Students</th>
                  <th className="py-3 px-4 text-center">Total Solved</th>
                  <th className="py-3 px-4 text-center text-emerald-400">Easy</th>
                  <th className="py-3 px-4 text-center text-amber-400">Medium</th>
                  <th className="py-3 px-4 text-center text-rose-400">Hard</th>
                  <th className="py-3 px-4 text-right">Avg / Student</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {sectionData.map((d) => (
                  <tr key={d.section} className="hover:bg-slate-850/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono text-xs">
                        {d.section}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-slate-300">
                      {d.totalStudents}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-white">
                      {d.totalSolved}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-emerald-400">
                      {d.easy}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-amber-400">
                      {d.medium}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-rose-400">
                      {d.hard}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-amber-400">
                      {d.avgSolved}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
