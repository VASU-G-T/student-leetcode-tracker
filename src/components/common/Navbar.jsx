import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Code2, 
  RefreshCw, 
  ShieldCheck, 
  LogIn, 
  LogOut, 
  Menu, 
  Search,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { formatRelativeTime } from '../../utils/helpers';

export default function Navbar({ onMobileMenuToggle }) {
  const { currentUser, isAdmin, logout } = useAuth();
  const { lastGlobalSync, isSyncingAll, syncProgress, syncAll } = useData();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMobileMenuToggle}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            aria-label="Toggle navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Code2 className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                LeetTrack
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono border border-amber-500/20">
                  v1.0
                </span>
              </span>
              <span className="text-[10px] text-slate-400 hidden sm:block font-medium">
                Track. Solve. Improve.
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Live Sync Status Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <div className={`w-2 h-2 rounded-full ${isSyncingAll ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
          <span className="font-medium">
            {isSyncingAll 
              ? `Syncing (${syncProgress.current}/${syncProgress.total})...`
              : 'Auto Sync'
            }
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">
            Last synced {formatRelativeTime(lastGlobalSync)}
          </span>
        </div>

        {/* Right: Quick actions & Auth */}
        <div className="flex items-center gap-2.5">
          {isAdmin ? (
            <div className="flex items-center gap-2">
              <button
                onClick={syncAll}
                disabled={isSyncingAll}
                className="btn-secondary !py-1.5 !px-3 text-xs flex items-center gap-1.5"
                title="Sync all student repositories"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingAll ? 'animate-spin text-amber-400' : ''}`} />
                <span className="hidden sm:inline">Sync All</span>
              </button>

              <Link
                to="/admin/dashboard"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold hover:bg-amber-500/20 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin Panel
              </Link>

              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                title="Logout admin session"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-medium transition-colors"
            >
              <LogIn className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Login</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
