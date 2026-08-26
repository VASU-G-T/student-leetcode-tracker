import React, { useState, useMemo } from 'react';
import { 
  Code2, 
  ExternalLink, 
  Search, 
  Filter, 
  FileCode, 
  Sparkles,
  Download
} from 'lucide-react';
import { exportToCsv } from '../../utils/exportCsv';

export default function ProblemTable({ problems = [], studentName = 'Student' }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');

  // Extract all distinct languages present in solved problems
  const availableLanguages = useMemo(() => {
    const langs = new Set();
    problems.forEach(p => {
      if (p.allLanguages && Array.isArray(p.allLanguages)) {
        p.allLanguages.forEach(l => langs.add(l));
      } else if (p.language) {
        langs.add(p.language);
      }
    });
    return Array.from(langs);
  }, [problems]);

  // Filter problems based on search and selected tags
  const filteredProblems = useMemo(() => {
    return problems.filter(p => {
      const matchesSearch = 
        !searchTerm ||
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(p.problemNumber).includes(searchTerm);

      const matchesDiff = 
        !selectedDifficulty || 
        p.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

      const matchesLang = 
        !selectedLanguage ||
        (p.allLanguages ? p.allLanguages.includes(selectedLanguage) : p.language === selectedLanguage);

      return matchesSearch && matchesDiff && matchesLang;
    });
  }, [problems, searchTerm, selectedDifficulty, selectedLanguage]);

  const handleExport = () => {
    const headers = ['Problem Number', 'Title', 'Difficulty', 'Languages', 'GitHub URL'];
    const rows = filteredProblems.map(p => [
      p.problemNumber,
      p.title,
      p.difficulty,
      p.allLanguages ? p.allLanguages.join(', ') : p.language,
      p.githubUrl
    ]);
    exportToCsv(`${studentName}_Solved_Problems`, headers, rows);
  };

  const difficultyBadges = {
    Easy: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold',
    Medium: 'bg-sky-50 text-sky-700 border-sky-200 font-semibold',
    Hard: 'bg-rose-50 text-rose-700 border-rose-200 font-semibold'
  };

  return (
    <div className="glass-card overflow-hidden shadow-sm">
      {/* Header & Controls */}
      <div className="p-4 sm:p-5 border-b border-sky-100 space-y-3 bg-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-sky-50 text-sky-600 border border-sky-200">
              <Code2 className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Solved LeetCode Problems
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 font-mono font-bold border border-sky-200">
              {filteredProblems.length} of {problems.length}
            </span>
          </div>

          {problems.length > 0 && (
            <button
              onClick={handleExport}
              className="btn-secondary !py-1.5 !px-3 text-xs flex items-center gap-1.5 font-semibold text-sky-700 hover:text-sky-800"
            >
              <Download className="w-3.5 h-3.5 text-sky-600" />
              <span>Export List</span>
            </button>
          )}
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search problem title or #..."
              className="input-field pl-9 py-2 text-xs w-full bg-white text-slate-800 border-slate-200 focus:border-sky-500 shadow-sm"
            />
          </div>

          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="input-field py-2 text-xs bg-white text-slate-700 font-semibold border-slate-200 focus:border-sky-500 shadow-sm cursor-pointer"
          >
            <option value="">Difficulty: All</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          {/* Language Filter */}
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="input-field py-2 text-xs bg-white text-slate-700 font-semibold border-slate-200 focus:border-sky-500 shadow-sm cursor-pointer"
          >
            <option value="">Language: All</option>
            {availableLanguages.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      {filteredProblems.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-white">
          <FileCode className="w-10 h-10 mx-auto text-sky-300 mb-2" />
          <p className="text-sm font-bold text-slate-700">No problems found</p>
          <p className="text-xs text-slate-500 mt-1">
            {problems.length === 0 
              ? "No LeetCode solutions detected in this repository yet. Make sure LeetSync has pushed files." 
              : "Try adjusting your search or difficulty filter."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-sky-100 bg-sky-50/70 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-4 w-16 text-center">#</th>
                <th className="py-3.5 px-4">Problem</th>
                <th className="py-3.5 px-4">Difficulty</th>
                <th className="py-3.5 px-4">Language</th>
                <th className="py-3.5 px-4 text-right">GitHub</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-100/70 text-sm bg-white">
              {filteredProblems.map((problem) => {
                const languages = problem.allLanguages && problem.allLanguages.length > 0 
                  ? problem.allLanguages 
                  : [problem.language || 'Code'];

                return (
                  <tr 
                    key={problem.id || `p_${problem.problemNumber}`}
                    className="hover:bg-sky-50/50 transition-colors group"
                  >
                    {/* Problem Number */}
                    <td className="py-3.5 px-4 text-center font-mono text-xs font-bold text-slate-500">
                      {problem.problemNumber}
                    </td>

                    {/* Title */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                        {problem.title}
                      </span>
                    </td>

                    {/* Difficulty */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border font-mono ${difficultyBadges[problem.difficulty] || difficultyBadges.Medium}`}>
                        {problem.difficulty}
                      </span>
                    </td>

                    {/* Languages Used */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1.5">
                        {languages.map((lang, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 text-[11px] font-mono font-bold border border-sky-200 shadow-sm"
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* GitHub Direct Link */}
                    <td className="py-3.5 px-4 text-right">
                      {problem.githubUrl ? (
                        <a
                          href={problem.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-600 hover:text-white text-sky-700 text-xs font-semibold transition-colors border border-sky-200 shadow-sm"
                        >
                          <span>View Code</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400 font-mono">N/A</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
