import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Code2, 
  RefreshCw, 
  ShieldCheck, 
  LogIn, 
  LogOut, 
  Menu, 
  UserPlus,
  User,
  Edit3,
  Layers
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { formatRelativeTime } from '../../utils/helpers';

export default function Navbar({ onMobileMenuToggle }) {
  const { currentUser, isAdmin, isStudent, currentStudentId, logout } = useAuth();
  const { lastGlobalSync, isSyncingAll, syncProgress, syncAll, students } = useData();
  const navigate = useNavigate();

  const loggedInStudent = isStudent 
    ? students.find(s => 
        s.id === currentStudentId || 
        s.username?.toLowerCase() === currentUser?.username?.toLowerCase() ||
        s.registerNumber?.toLowerCase() === currentUser?.registerNumber?.toLowerCase()
      )
    : null;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-sky-100 px-4 sm:px-6 py-3 shadow-sm shadow-sky-500/5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMobileMenuToggle}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:text-sky-600 hover:bg-sky-50 focus:outline-none transition-colors"
            aria-label="Toggle navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center shadow-md shadow-sky-500/25 group-hover:scale-105 transition-transform">
              <Code2 className="w-5 h-5 text-white stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-slate-900 flex items-center gap-1.5">
                ECE LeetTrack
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 font-mono font-semibold border border-sky-200">
                  ECE Dept
                </span>
              </span>
              <span className="text-[10px] text-slate-500 hidden sm:block font-medium">
                Sec A • Sec B • Sec C • Sec D • Sec E • Sec F
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Live Sync Status Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50/80 border border-sky-200 text-xs text-slate-700 font-medium shadow-sm shadow-sky-500/5">
          <div className={`w-2 h-2 rounded-full ${isSyncingAll ? 'bg-sky-500 animate-ping' : 'bg-emerald-500'}`} />
          <span>
            {isSyncingAll 
              ? `Syncing (${syncProgress.current}/${syncProgress.total})...`
              : 'Auto Sync'
            }
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500 font-normal">
            Last synced {formatRelativeTime(lastGlobalSync)}
          </span>
        </div>

        {/* Right: Actions depending on Auth State */}
        <div className="flex items-center gap-2.5">
          {isAdmin ? (
            /* Admin Logged In */
            <div className="flex items-center gap-2">
              <button
                onClick={syncAll}
                disabled={isSyncingAll}
                className="btn-secondary !py-1.5 !px-3 text-xs flex items-center gap-1.5"
                title="Sync all student repositories"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingAll ? 'animate-spin text-sky-600' : 'text-slate-600'}`} />
                <span className="hidden sm:inline font-semibold">Sync All</span>
              </button>

              <Link
                to="/admin/dashboard"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 text-sky-700 border border-sky-200 text-xs font-semibold hover:bg-sky-100 transition-colors shadow-sm"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Console</span>
              </Link>

              <button
                onClick={handleLogout}
                className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                title="Logout session"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : isStudent ? (
            /* Student Logged In */
            <div className="flex items-center gap-2">
              <Link
                to={`/student/${loggedInStudent?.registerNumber || loggedInStudent?.id || currentUser?.username}`}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white border border-sky-200 hover:border-sky-400 hover:bg-sky-50/50 transition-colors shadow-sm"
              >
                <img
                  src={loggedInStudent?.profileImage || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser?.username}`}
                  alt="Student avatar"
                  className="w-6 h-6 rounded-full object-cover border border-sky-300"
                />
                <span className="text-xs font-semibold text-slate-800 hidden sm:inline">
                  {loggedInStudent?.name || currentUser?.displayName || currentUser?.username}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-100 text-sky-700 font-mono font-medium hidden md:inline">
                  {loggedInStudent?.section || 'ECE'}
                </span>
              </Link>

              <Link
                to="/student/edit-profile"
                className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-sky-50 text-sky-700 border border-sky-200 text-xs font-semibold hover:bg-sky-100 transition-colors shadow-sm"
                title="Edit profile and portfolio"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </Link>

              <button
                onClick={handleLogout}
                className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                title="Logout student account"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Guest (Not Logged In) */
            <div className="flex items-center gap-2">
              <Link
                to="/register"
                className="btn-primary !py-1.5 !px-3.5 text-xs flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Register Profile</span>
              </Link>

              <Link
                to="/login"
                className="btn-secondary !py-1.5 !px-3 text-xs flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5 text-sky-600" />
                <span>Sign In</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
