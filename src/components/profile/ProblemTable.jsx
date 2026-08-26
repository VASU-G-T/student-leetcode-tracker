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
    Easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Hard: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
  };

  return (
    <div className="glass-card overflow-hidden">
      {/* Header & Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-semibold text-white">
              Solved LeetCode Problems
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono border border-slate-700">
              {filteredProblems.length} of {problems.length}
            </span>
          </div>

          {problems.length > 0 && (
            <button
              onClick={handleExport}
              className="btn-secondary !py-1.5 !px-3 text-xs flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export List</span>
            </button>
          )}
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search problem title or #..."
              className="input-field pl-9 py-1.5 text-xs w-full bg-slate-950/60"
            />
          </div>

          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="input-field py-1.5 text-xs bg-slate-950/60 text-slate-200"
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
            className="input-field py-1.5 text-xs bg-slate-950/60 text-slate-200"
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
        <div className="p-12 text-center text-slate-400">
          <FileCode className="w-10 h-10 mx-auto text-slate-600 mb-2" />
          <p className="text-sm font-medium text-slate-300">No problems found</p>
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
              <tr className="border-b border-slate-800 bg-slate-950/40 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4 w-16 text-center">#</th>
                <th className="py-3 px-4">Problem</th>
                <th className="py-3 px-4">Difficulty</th>
                <th className="py-3 px-4">Language</th>
                <th className="py-3 px-4 text-right">GitHub</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {filteredProblems.map((problem) => {
                const languages = problem.allLanguages && problem.allLanguages.length > 0 
                  ? problem.allLanguages 
                  : [problem.language || 'Code'];

                return (
                  <tr 
                    key={problem.id || `p_${problem.problemNumber}`}
                    className="hover:bg-slate-850/50 transition-colors group"
                  >
                    {/* Problem Number */}
                    <td className="py-3 px-4 text-center font-mono text-xs font-semibold text-slate-400">
                      {problem.problemNumber}
                    </td>

                    {/* Title */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white group-hover:text-amber-400 transition-colors">
                          {problem.title}
                        </span>
                      </div>
                    </td>

                    {/* Difficulty */}
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border font-mono ${difficultyBadges[problem.difficulty] || difficultyBadges.Medium}`}>
                        {problem.difficulty}
                      </span>
                    </td>

                    {/* Languages Used */}
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1.5">
                        {languages.map((lang, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-slate-800/90 text-slate-300 text-[11px] font-mono border border-slate-700/80"
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* GitHub Direct Link */}
                    <td className="py-3 px-4 text-right">
                      {problem.githubUrl ? (
                        <a
                          href={problem.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors border border-slate-700"
                        >
                          <span>View Code</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-xs text-slate-600">N/A</span>
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
