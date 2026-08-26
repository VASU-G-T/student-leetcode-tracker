import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  Trophy, 
  BarChart3, 
  RefreshCw, 
  Settings, 
  LogOut,
  ChevronRight,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export default function Sidebar({ isOpen, onClose }) {
  const { isAdmin, logout } = useAuth();
  const { isSyncingAll } = useData();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isInAdminSection = location.pathname.startsWith('/admin');

  // Navigation Links
  const publicLinks = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Students', path: '/students', icon: Users },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  ];

  const adminLinks = [
    { name: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Manage Students', path: '/admin/students', icon: Users },
    { name: 'Add Student', path: '/admin/students/add', icon: UserPlus },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Sync Repositories', path: '/admin/sync', icon: RefreshCw, spin: isSyncingAll },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const linksToRender = isAdmin && isInAdminSection ? adminLinks : publicLinks;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
        />
      )}

      <aside className={`
        fixed md:sticky top-0 md:top-[57px] left-0 z-50 md:z-30
        w-64 h-full md:h-[calc(100vh-57px)]
        bg-slate-950 md:bg-slate-950/60 md:backdrop-blur-md
        border-r border-slate-800/80
        flex flex-col justify-between
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Navigation list */}
        <div className="p-4 space-y-6 overflow-y-auto">
          {/* Section Header */}
          <div className="flex items-center justify-between px-2 pt-2">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-400">
              {isAdmin && isInAdminSection ? 'Admin Console' : 'Navigation'}
            </span>
            {isAdmin && (
              <span className="text-[10px] bg-amber-500/10 text-amber-400 font-mono px-2 py-0.5 rounded border border-amber-500/20">
                ADMIN
              </span>
            )}
          </div>

          <nav className="space-y-1">
            {linksToRender.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => onClose && onClose()}
                  className={({ isActive }) => `
                    flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all group
                    ${isActive 
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-sm' 
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900 border border-transparent'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${link.spin ? 'animate-spin text-amber-400' : ''}`} />
                    <span>{link.name}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-slate-500" />
                </NavLink>
              );
            })}
          </nav>

          {/* Section Switcher for Logged In Admin */}
          {isAdmin && (
            <div className="pt-4 border-t border-slate-800/60">
              <div className="px-2 mb-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Switch View
                </span>
              </div>
              {isInAdminSection ? (
                <NavLink
                  to="/"
                  onClick={() => onClose && onClose()}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-lg transition-colors"
                >
                  <Globe className="w-4 h-4 text-blue-400" />
                  <span>View Public Dashboard</span>
                </NavLink>
              ) : (
                <NavLink
                  to="/admin/dashboard"
                  onClick={() => onClose && onClose()}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg transition-colors"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin Dashboard</span>
                </NavLink>
              )}
            </div>
          )}
        </div>

        {/* Footer info / Logout */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 space-y-3">
          {isAdmin ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg border border-rose-500/20 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout Admin</span>
            </button>
          ) : (
            <div className="text-center">
              <p className="text-[11px] text-slate-500">LeetTrack College Suite</p>
              <p className="text-[10px] text-slate-600 font-mono mt-0.5">LeetSync Automated</p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
