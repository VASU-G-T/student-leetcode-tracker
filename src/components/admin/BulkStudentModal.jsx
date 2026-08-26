import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Sparkles, 
  Download, 
  Users 
} from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function BulkStudentModal({ isOpen, onClose }) {
  const { addMultipleStudents, students, settings, showToast } = useData();

  const [csvText, setCsvText] = useState('');
  const [parsedRows, setParsedRows] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleParseCsv = (text) => {
    setCsvText(text);
    setErrorMsg('');

    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) {
      setParsedRows([]);
      return;
    }

    const rows = [];
    const existingRegNos = new Set(students.map(s => s.registerNumber?.toUpperCase()));

    lines.forEach((line, idx) => {
      // Skip header if present
      if (idx === 0 && (line.toLowerCase().includes('name') || line.toLowerCase().includes('reg'))) {
        return;
      }

      // Format: Name, RegisterNumber, Section, GitHubRepoUrl, Email, Year
      const cols = line.split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
      if (cols.length >= 3) {
        const name = cols[0] || '';
        const regNo = (cols[1] || '').toUpperCase();
        let section = cols[2] || 'Sec A';
        if (!section.startsWith('Sec ') && ['A','B','C','D','E','F'].includes(section.toUpperCase())) {
          section = `Sec ${section.toUpperCase()}`;
        }
        const repoUrl = cols[3] || '';
        const email = cols[4] || '';
        const year = cols[5] || '2nd Year';

        const isDuplicate = existingRegNos.has(regNo);
        const isValid = Boolean(name && regNo && repoUrl.includes('github.com'));

        rows.push({
          id: `temp_${idx}`,
          name,
          registerNumber: regNo,
          department: 'ECE',
          year,
          section,
          email,
          githubRepoUrl: repoUrl,
          goal: settings.defaultGoal || 4033,
          isValid,
          isDuplicate,
          error: !isValid ? 'Missing name, regNo or invalid GitHub URL' : (isDuplicate ? 'Duplicate Reg No' : null)
        });
      }
    });

    setParsedRows(rows);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      handleParseCsv(event.target.result);
    };
    reader.readAsText(file);
  };

  const loadSampleTemplate = () => {
    const sample = `Name, Register Number, Section, GitHub Repository URL, Email, Year
Arun Kumar, 922525106001, Sec A, https://github.com/arunkumar/leetcode-solutions, arun@college.edu, 2nd Year
Bhavani S, 922525106002, Sec A, https://github.com/bhavani/leetcode-sync, bhavani@college.edu, 2nd Year
Dinesh R, 922525106003, Sec B, https://github.com/dinesh-r/leetcode-dsa, dinesh@college.edu, 2nd Year
Divya M, 922525106004, Sec B, https://github.com/divya-m/leetcode, divya@college.edu, 2nd Year
Elango K, 922525106005, Sec C, https://github.com/elango-k/leetcode-sync, elango@college.edu, 2nd Year
Fathima N, 922525106006, Sec C, https://github.com/fathima-n/leetcode-problems, fathima@college.edu, 2nd Year
Gokul V, 922525106007, Sec D, https://github.com/gokul-v/leetcode-tracker, gokul@college.edu, 2nd Year
Harini P, 922525106008, Sec E, https://github.com/harini-p/leetcode, harini@college.edu, 2nd Year
Karthik T, 922525106009, Sec F, https://github.com/karthik-t/leetcode-solutions, karthik@college.edu, 2nd Year`;

    handleParseCsv(sample);
  };

  const handleImport = async () => {
    const validRows = parsedRows.filter(r => r.isValid && !r.isDuplicate);
    if (validRows.length === 0) {
      setErrorMsg('No valid rows available to import.');
      return;
    }

    setIsProcessing(true);
    try {
      if (addMultipleStudents) {
        await addMultipleStudents(validRows);
      }
      showToast(`Successfully imported ${validRows.length} student profiles!`, 'success');
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Import failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const validCount = parsedRows.filter(r => r.isValid && !r.isDuplicate).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="glass-card max-w-3xl w-full max-h-[90vh] flex flex-col border-sky-100 bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-sky-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600 border border-sky-200">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Bulk Import Student Profiles (Up to 400+)</h2>
              <p className="text-xs text-slate-500 font-medium">Import entire ECE batches across Sec A, B, C, D, E, F via CSV or Excel</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-sky-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <label className="btn-secondary !py-1.5 !px-3 text-xs cursor-pointer flex items-center gap-1.5 font-semibold text-slate-700">
                <Upload className="w-3.5 h-3.5 text-sky-600" />
                <span>Upload CSV File</span>
                <input
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={loadSampleTemplate}
                className="btn-secondary !py-1.5 !px-3 text-xs text-sky-700 border-sky-200 hover:bg-sky-50 flex items-center gap-1.5 font-semibold"
              >
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span>Load Sample Template (Sec A-F)</span>
              </button>
            </div>

            <span className="text-slate-500 font-medium">
              Columns: <span className="text-slate-800 font-mono font-bold">Name, RegNo, Section, RepoUrl, Email, Year</span>
            </span>
          </div>

          {/* Paste Input */}
          <div>
            <textarea
              value={csvText}
              onChange={(e) => handleParseCsv(e.target.value)}
              placeholder="Paste comma-separated rows here:&#10;Name, Register Number, Section, GitHub Repo URL, Email, Year"
              rows={6}
              className="w-full bg-white border border-slate-200 rounded-xl p-3 font-mono text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 shadow-sm"
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Preview Table */}
          {parsedRows.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">
                  Preview ({validCount} Valid, {parsedRows.length - validCount} Issues)
                </span>
                <span className="text-slate-500 font-medium">
                  Ready to add {validCount} student profiles
                </span>
              </div>

              <div className="max-h-48 overflow-y-auto border border-sky-100 rounded-xl shadow-sm">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead className="sticky top-0 bg-sky-50 text-slate-600 border-b border-sky-100 font-bold">
                    <tr>
                      <th className="p-2">Status</th>
                      <th className="p-2">Name</th>
                      <th className="p-2">Reg No</th>
                      <th className="p-2">Section</th>
                      <th className="p-2">Repository</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sky-100/70 font-mono bg-white">
                    {parsedRows.map((r, i) => (
                      <tr key={i} className={r.isValid && !r.isDuplicate ? 'text-slate-800' : 'text-rose-600 bg-rose-50/50'}>
                        <td className="p-2">
                          {r.isValid && !r.isDuplicate ? (
                            <span className="text-emerald-600 font-bold">✓ Ready</span>
                          ) : (
                            <span className="text-rose-600 font-bold">✕ {r.error}</span>
                          )}
                        </td>
                        <td className="p-2 font-sans font-bold">{r.name}</td>
                        <td className="p-2 font-bold text-sky-700">{r.registerNumber}</td>
                        <td className="p-2">{r.section}</td>
                        <td className="p-2 truncate max-w-[200px] text-slate-600">{r.githubRepoUrl}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-sky-100 bg-sky-50/50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="btn-secondary !py-2 !px-4 text-xs font-semibold"
          >
            Cancel
          </button>

          <button
            onClick={handleImport}
            disabled={validCount === 0 || isProcessing}
            className="btn-primary !py-2 !px-6 text-xs flex items-center gap-2 shadow-md shadow-sky-500/25"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Importing {validCount} Profiles...</span>
              </>
            ) : (
              <>
                <Users className="w-3.5 h-3.5" />
                <span>Import {validCount} Student Profiles</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
