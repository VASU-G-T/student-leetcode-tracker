import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Save, 
  Database, 
  ShieldCheck, 
  CheckCircle2, 
  Server,
  Cloud,
  Flame,
  Key,
  RefreshCw,
  Download,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { 
  isFirebaseConfigured, 
  getActiveFirebaseConfig, 
  saveCustomFirebaseConfig 
} from '../../services/firebase';
import { testCloudConnection } from '../../services/cloudSync';

export default function AdminSettings() {
  const { settings, updateSettings, students, projectsByStudent, showToast } = useData();

  const [appName, setAppName] = useState(settings.appName || 'ECE LeetTrack');
  const [tagline, setTagline] = useState(settings.tagline || 'ECE Department • Track. Solve. Improve.');
  const [defaultGoal, setDefaultGoal] = useState(settings.defaultGoal || 4033);
  const [autoSyncInterval, setAutoSyncInterval] = useState(settings.autoSyncInterval || 15);
  const [defaultDepartment, setDefaultDepartment] = useState(settings.defaultDepartment || 'ECE');
  const [leaderboardVisibility, setLeaderboardVisibility] = useState(settings.leaderboardVisibility || 'public');

  // Firebase Cloud Config Form State
  const activeConfig = getActiveFirebaseConfig();
  const [apiKey, setApiKey] = useState(activeConfig.apiKey || '');
  const [authDomain, setAuthDomain] = useState(activeConfig.authDomain || '');
  const [projectId, setProjectId] = useState(activeConfig.projectId || '');
  const [storageBucket, setStorageBucket] = useState(activeConfig.storageBucket || '');
  const [messagingSenderId, setMessagingSenderId] = useState(activeConfig.messagingSenderId || '');
  const [appId, setAppId] = useState(activeConfig.appId || '');

  const [jsonConfigInput, setJsonConfigInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isTestingCloud, setIsTestingCloud] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSettings({
        appName,
        tagline,
        defaultGoal: parseInt(defaultGoal, 10) || 4033,
        autoSyncInterval: parseInt(autoSyncInterval, 10),
        defaultDepartment,
        leaderboardVisibility
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleJsonPaste = (text) => {
    setJsonConfigInput(text);
    try {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        if (parsed.apiKey) setApiKey(parsed.apiKey);
        if (parsed.authDomain) setAuthDomain(parsed.authDomain);
        if (parsed.projectId) setProjectId(parsed.projectId);
        if (parsed.storageBucket) setStorageBucket(parsed.storageBucket);
        if (parsed.messagingSenderId) setMessagingSenderId(parsed.messagingSenderId);
        if (parsed.appId) setAppId(parsed.appId);
        showToast('Parsed Firebase config JSON successfully!', 'success');
      }
    } catch (e) {}
  };

  const handleSaveCloudConfig = (e) => {
    e.preventDefault();
    if (!apiKey.trim() || !projectId.trim()) {
      showToast('API Key and Project ID are required to connect Firebase Cloud', 'error');
      return;
    }

    const newConfig = {
      apiKey: apiKey.trim(),
      authDomain: authDomain.trim(),
      projectId: projectId.trim(),
      storageBucket: storageBucket.trim(),
      messagingSenderId: messagingSenderId.trim(),
      appId: appId.trim()
    };

    saveCustomFirebaseConfig(newConfig);
    showToast('Firebase Cloud credentials saved! Reloading real-time connection...', 'success');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleTestConnection = async () => {
    setIsTestingCloud(true);
    setTestResult(null);
    try {
      const result = await testCloudConnection();
      setTestResult(result);
      if (result.connected) {
        showToast(result.message, 'success');
      } else {
        showToast(result.message, 'error');
      }
    } finally {
      setIsTestingCloud(false);
    }
  };

  const handleExportData = () => {
    const backupData = {
      exportedAt: new Date().toISOString(),
      platform: 'ECE LeetTrack',
      settings,
      students,
      projectsByStudent
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `leettrack_backup_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    downloadAnchor.remove();

    showToast('Platform data backup downloaded!', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sky-50 text-sky-600 border border-sky-200 shadow-sm">
            <Settings className="w-6 h-6" />
          </div>
          <span>Application & Cloud Settings</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
          Configure real-time cloud sync, global problem goals, and multi-device persistence for ECE.
        </p>
      </div>

      {/* Real-time Cloud Sync Manager */}
      <div className="glass-card p-6 sm:p-8 border-sky-100 bg-white relative overflow-hidden shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-sky-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold mb-2 shadow-sm">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              <span>Real-Time Cloud Synchronization</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Firebase Realtime Database Live Synchronization
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Syncs all student profiles, registrations, problem submissions, and projects across all devices, browsers, and emails in real time.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTestConnection}
              disabled={isTestingCloud}
              className="btn-secondary !py-2 !px-3 text-xs flex items-center gap-1.5 font-semibold text-sky-700"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-sky-600 ${isTestingCloud ? 'animate-spin' : ''}`} />
              <span>Test Connection</span>
            </button>
            <button
              onClick={handleExportData}
              className="btn-secondary !py-2 !px-3 text-xs flex items-center gap-1.5 text-slate-700 font-semibold"
              title="Download JSON Backup"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Export Backup</span>
            </button>
          </div>
        </div>

        {/* Live Status Indicator */}
        <div className="my-5 p-4 rounded-2xl bg-sky-50/50 border border-sky-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isFirebaseConfigured ? 'bg-emerald-400' : 'bg-sky-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${isFirebaseConfigured ? 'bg-emerald-500' : 'bg-sky-500'}`}></span>
            </span>
            <div>
              <p className="text-xs font-bold text-slate-900">
                {isFirebaseConfigured 
                  ? 'Real-Time Cloud Database Active' 
                  : 'Local Storage Mode (Standalone)'}
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                {isFirebaseConfigured 
                  ? `Connected to Firebase Cloud (${projectId || 'cloud'}). All edits sync immediately to all browsers.` 
                  : 'Data is saved in this browser. Configure Firebase below to enable real-time sync across other devices and emails.'}
              </p>
            </div>
          </div>

          <span className={`text-[11px] px-2.5 py-1 rounded-full font-mono font-bold ${isFirebaseConfigured ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-sky-50 text-sky-700 border border-sky-200'}`}>
            {isFirebaseConfigured ? 'LIVE SYNC ON' : 'LOCAL ONLY'}
          </span>
        </div>

        {testResult && (
          <div className={`p-3 rounded-xl text-xs mb-5 flex items-start gap-2 font-medium ${testResult.connected ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
            {testResult.connected ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" /> : <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />}
            <span>{testResult.message}</span>
          </div>
        )}

        {/* Firebase Config Inputs */}
        <form onSubmit={handleSaveCloudConfig} className="space-y-4 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-sky-600" />
            <span>Connect / Update Firebase Project Credentials</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                API Key <span className="text-sky-600">*</span>
              </label>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="input-field font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                Project ID <span className="text-sky-600">*</span>
              </label>
              <input
                type="text"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                placeholder="leetcode-tracker-xxxxx"
                className="input-field font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                Auth Domain
              </label>
              <input
                type="text"
                value={authDomain}
                onChange={(e) => setAuthDomain(e.target.value)}
                placeholder="project.firebaseapp.com"
                className="input-field font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                App ID
              </label>
              <input
                type="text"
                value={appId}
                onChange={(e) => setAppId(e.target.value)}
                placeholder="1:123456789:web:abcdef"
                className="input-field font-mono text-xs"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              className="btn-primary !py-2 !px-5 text-xs flex items-center gap-1.5 shadow-md shadow-sky-500/25"
            >
              <Cloud className="w-3.5 h-3.5" />
              <span>Save & Connect Cloud Database</span>
            </button>
          </div>
        </form>
      </div>

      {/* Main General Settings Form */}
      <div className="glass-card p-6 sm:p-8 border-sky-100 bg-white shadow-xl">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-sky-100">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              General Platform Configuration
            </h2>
            <button
              type="submit"
              disabled={isSaving}
              className="btn-primary flex items-center gap-2 text-xs shadow-md shadow-sky-500/25"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
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
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
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
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                Default Problem Goal
              </label>
              <input
                type="number"
                min="10"
                max="5000"
                value={defaultGoal}
                onChange={(e) => setDefaultGoal(e.target.value)}
                className="input-field font-mono"
              />
              <p className="text-[11px] text-slate-500 mt-1 font-medium">Default target problem count for all students (standard: 4033).</p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                Auto Sync Interval
              </label>
              <select
                value={autoSyncInterval}
                onChange={(e) => setAutoSyncInterval(e.target.value)}
                className="input-field font-medium cursor-pointer"
              >
                <option value="5">Every 5 minutes</option>
                <option value="15">Every 15 minutes (Recommended)</option>
                <option value="30">Every 30 minutes</option>
                <option value="60">Every 1 hour</option>
              </select>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">Background frequency for checking GitHub updates.</p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                Department
              </label>
              <input
                type="text"
                value={defaultDepartment}
                disabled
                className="input-field opacity-80 cursor-not-allowed font-bold text-sky-700 bg-sky-50/50"
              />
              <p className="text-[11px] text-slate-500 mt-1 font-medium">Configured for Electronics & Communication Engineering.</p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                Leaderboard Visibility
              </label>
              <select
                value={leaderboardVisibility}
                onChange={(e) => setLeaderboardVisibility(e.target.value)}
                className="input-field font-medium cursor-pointer"
              >
                <option value="public">Public (Everyone)</option>
                <option value="students_only">Enrolled Students Only</option>
                <option value="admin_only">Admin Only</option>
              </select>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
