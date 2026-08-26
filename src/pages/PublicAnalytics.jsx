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
  Building2, 
  Award,
  Flame
} from 'lucide-react';
import StatCard from '../components/common/StatCard';
import DifficultyChart from '../components/dashboard/DifficultyChart';
import { useData } from '../context/DataContext';

export default function PublicAnalytics() {
  const { students } = useData();

  // Department analytics calculation
  const departmentData = useMemo(() => {
    const map = {};
    students.forEach((s) => {
      const dept = s.department || 'Other';
      if (!map[dept]) {
        map[dept] = {
          department: dept,
          totalStudents: 0,
          totalSolved: 0,
          easy: 0,
          medium: 0,
          hard: 0
        };
      }
      map[dept].totalStudents += 1;
      map[dept].totalSolved += s.totalSolved || 0;
      map[dept].easy += s.easySolved || 0;
      map[dept].medium += s.mediumSolved || 0;
      map[dept].hard += s.hardSolved || 0;
    });

    return Object.values(map).map(d => ({
      ...d,
      avgSolved: d.totalStudents > 0 ? Math.round(d.totalSolved / d.totalStudents) : 0
    }));
  }, [students]);

  // Top 8 Solvers for Bar Chart
  const topSolversData = useMemo(() => {
    return [...students]
      .sort((a, b) => (b.totalSolved || 0) - (a.totalSolved || 0))
      .slice(0, 8)
      .map(s => ({
        name: s.name.split(' ')[0], // First name for clean axis
        fullName: s.name,
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
    return { easy, med, hard, total, avg: students.length ? (total / students.length).toFixed(1) : 0 };
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
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <BarChart3 className="w-7 h-7 text-amber-400" />
          <span>Class & Department Analytics</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Comparative performance metrics, difficulty breakdowns, and department benchmarks.
        </p>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={students.length}
          subtitle="Across all departments"
          icon={Users}
          color="amber"
        />
        <StatCard
          title="Total Solved"
          value={totals.total.toLocaleString()}
          subtitle="Cumulative verified solves"
          icon={Code2}
          color="emerald"
        />
        <StatCard
          title="Average Per Student"
          value={totals.avg}
          subtitle="College benchmark"
          icon={TrendingUp}
          color="blue"
        />
        <StatCard
          title="Departments"
          value={departmentData.length}
          subtitle="Active academic streams"
          icon={Building2}
          color="purple"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Comparison Chart */}
        <div className="glass-card p-5 flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>Department Progress Comparison</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Average problems solved per student by department</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="department" stroke="#94a3b8" fontSize={11} />
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

      {/* Department Breakdown Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white tracking-tight">
          Departmental Summary Table
        </h2>

        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4 text-center">Students</th>
                  <th className="py-3 px-4 text-center">Total Solved</th>
                  <th className="py-3 px-4 text-center text-emerald-400">Easy</th>
                  <th className="py-3 px-4 text-center text-amber-400">Medium</th>
                  <th className="py-3 px-4 text-center text-rose-400">Hard</th>
                  <th className="py-3 px-4 text-right">Avg / Student</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {departmentData.map((d) => (
                  <tr key={d.department} className="hover:bg-slate-850/50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-white">
                      {d.department}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-slate-300">
                      {d.totalStudents}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-white">
                      {d.totalSolved}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-emerald-400">
                      {d.easy}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-amber-400">
                      {d.medium}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-rose-400">
                      {d.hard}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-amber-400">
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
