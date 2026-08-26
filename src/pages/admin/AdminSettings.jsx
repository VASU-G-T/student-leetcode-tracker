import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  RefreshCw, 
  Database, 
  Trash2, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  Info 
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { isFirebaseConfigured } from '../../services/firebase';

export default function AdminSettings() {
  const { settings, updateSettings, resetToSampleData, clearSampleData, students } = useData();

  const [appName, setAppName] = useState(settings.appName || 'LeetTrack');
  const [tagline, setTagline] = useState(settings.tagline || 'Track. Solve. Improve.');
  const [defaultGoal, setDefaultGoal] = useState(settings.defaultGoal || 200);
  const [autoSyncInterval, setAutoSyncInterval] = useState(settings.autoSyncInterval || 15);
  const [defaultDepartment, setDefaultDepartment] = useState(settings.defaultDepartment || 'ECE');
  const [leaderboardVisibility, setLeaderboardVisibility] = useState(settings.leaderboardVisibility || 'public');

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSettings({
        appName,
        tagline,
        defaultGoal: parseInt(defaultGoal, 10),
        autoSyncInterval: parseInt(autoSyncInterval, 10),
        defaultDepartment,
        leaderboardVisibility
      });
    } finally {
      setIsSaving(false);
    }
  };

  const sampleCount = students.filter(s => s.isSample).length;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Settings className="w-7 h-7 text-amber-400" />
          <span>Application Settings</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Configure global tracking defaults, auto-sync timers, and sample data controls.
        </p>
      </div>

      {/* Main Settings Form */}
      <div className="glass-card p-6 sm:p-8 border-slate-800 shadow-xl">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              General Configuration
            </h2>
            <button
              type="submit"
              disabled={isSaving}
              className="btn-primary flex items-center gap-2 text-xs"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                Application Name
              </label>
              <input
                type="text"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                Default Problem Goal
              </label>
              <input
                type="number"
                value={defaultGoal}
                onChange={(e) => setDefaultGoal(e.target.value)}
                min="1"
                className="input-field font-mono"
              />
              <p className="text-[11px] text-slate-500 mt-1">Target problem count applied to newly enrolled students.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                Auto Sync Interval (Minutes)
              </label>
              <select
                value={autoSyncInterval}
                onChange={(e) => setAutoSyncInterval(e.target.value)}
                className="input-field"
              >
                <option value="5">Every 5 minutes</option>
                <option value="15">Every 15 minutes (Recommended)</option>
                <option value="30">Every 30 minutes</option>
                <option value="60">Every 1 hour</option>
              </select>
              <p className="text-[11px] text-slate-500 mt-1">Background frequency for checking GitHub updates.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                Default Department
              </label>
              <select
                value={defaultDepartment}
                onChange={(e) => setDefaultDepartment(e.target.value)}
                className="input-field"
              >
                {(settings.departments || ['ECE', 'CSE', 'IT', 'AI&DS']).map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                Leaderboard Visibility
              </label>
              <select
                value={leaderboardVisibility}
                onChange={(e) => setLeaderboardVisibility(e.target.value)}
                className="input-field"
              >
                <option value="public">Public (Everyone)</option>
                <option value="students_only">Enrolled Students Only</option>
                <option value="admin_only">Admin Only</option>
              </select>
            </div>
          </div>
        </form>
      </div>

      {/* Backend & Firebase Status Card */}
      <div className="glass-card p-6 border-slate-800 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
          <Database className="w-4 h-4 text-amber-400" />
          <span>Storage & Cloud Infrastructure</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Firebase Firestore</span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${isFirebaseConfigured ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                {isFirebaseConfigured ? 'CONNECTED' : 'LOCAL FALLBACK'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-2">
              {isFirebaseConfigured 
                ? 'Connected to Firebase Cloud Firestore & Authentication.' 
                : 'Using LocalStorage persistence. Add your Firebase keys in .env for production.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">GitHub REST API</span>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-2">
              Connected to api.github.com for parsing LeetSync commits & directory trees.
            </p>
          </div>
        </div>
      </div>

      {/* Roster Data Management */}
      <div className="glass-card p-6 border-slate-800 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
          <Database className="w-4 h-4 text-amber-400" />
          <span>ECE Student Roster Management</span>
        </h2>
        <p className="text-xs text-slate-400">
          Currently tracking <strong className="text-white font-mono">{students.length}</strong> student profile(s) across ECE Sections (Sec A, Sec B, Sec V, Sec D, Sec E, Sec F).
        </p>

        {students.length > 0 && (
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Are you sure you want to clear all student profiles from this tracker?")) {
                  clearSampleData();
                }
              }}
              className="btn-danger flex items-center gap-2 text-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All Student Profiles</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
