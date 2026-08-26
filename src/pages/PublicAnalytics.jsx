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
        <div className="bg-white border border-sky-200 p-3 rounded-xl shadow-lg text-xs space-y-1">
          <p className="font-bold text-slate-800 mb-1">{label}</p>
          {payload.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between gap-4">
              <span className="text-slate-600 capitalize font-medium">{item.name}:</span>
              <span className="font-mono font-bold text-slate-900">{item.value}</span>
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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold mb-2 shadow-sm">
          <Layers className="w-3.5 h-3.5 text-sky-600" />
          <span>ECE Department Performance</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sky-50 text-sky-600 border border-sky-200 shadow-sm">
            <BarChart3 className="w-6 h-6" />
          </div>
          <span>Section-Wise LeetCode Analytics</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
          Comparative benchmarks across <strong className="text-slate-800">Sec A, Sec B, Sec C, Sec D, Sec E, Sec F</strong> in Electronics & Communication Engineering.
        </p>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total ECE Students"
          value={students.length}
          subtitle="Enrolled cohort"
          icon={Users}
          color="sky"
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
        <div className="glass-card p-5 flex flex-col justify-between bg-white border-sky-100 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <div className="p-1 rounded bg-sky-50 text-sky-600 border border-sky-200">
                <Layers className="w-4 h-4" />
              </div>
              <span>Section Progress Comparison</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">Average problems solved per student by section</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="section" stroke="#64748b" fontSize={11} fontBold="true" />
                <YAxis stroke="#64748b" fontSize={11} fontBold="true" />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar dataKey="avgSolved" name="Avg Solved" fill="#0284c7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Solvers Stacked Chart */}
        <div className="glass-card p-5 flex flex-col justify-between bg-white border-sky-100 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <div className="p-1 rounded bg-emerald-50 text-emerald-600 border border-emerald-200">
                <Award className="w-4 h-4" />
              </div>
              <span>Top Solvers Difficulty Composition</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">Distribution of Easy, Medium, and Hard solves</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topSolversData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} fontBold="true" />
                <YAxis stroke="#64748b" fontSize={11} fontBold="true" />
                <Tooltip content={<CustomBarTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="Easy" stackId="a" fill="#00b8a3" />
                <Bar dataKey="Medium" stackId="a" fill="#0284c7" />
                <Bar dataKey="Hard" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Section Breakdown Summary Table */}
      <div className="space-y-4">
        <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
          ECE Section-Wise Summary Table
        </h2>

        <div className="glass-card overflow-hidden bg-white border-sky-100 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-sky-100 bg-sky-50/70 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Section</th>
                  <th className="py-3.5 px-4 text-center">Enrolled Students</th>
                  <th className="py-3.5 px-4 text-center">Total Solved</th>
                  <th className="py-3.5 px-4 text-center text-emerald-700">Easy</th>
                  <th className="py-3.5 px-4 text-center text-sky-700">Medium</th>
                  <th className="py-3.5 px-4 text-center text-rose-700">Hard</th>
                  <th className="py-3.5 px-4 text-right">Avg / Student</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-100/70 text-sm bg-white">
                {sectionData.map((d) => (
                  <tr key={d.section} className="hover:bg-sky-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 font-mono text-xs font-bold">
                        {d.section}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-slate-600 font-semibold">
                      {d.totalStudents}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-extrabold text-slate-900">
                      {d.totalSolved}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-600">
                      {d.easy}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-sky-600">
                      {d.medium}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-rose-600">
                      {d.hard}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-extrabold text-sky-700">
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
