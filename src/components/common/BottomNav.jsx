import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Trophy, BarChart3, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function BottomNav() {
  const { isAdmin } = useAuth();
  const location = useLocation();
  const isInAdmin = location.pathname.startsWith('/admin');

  const links = isAdmin && isInAdmin ? [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Students', path: '/admin/students', icon: Users },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
  ] : [
    { name: 'Home', path: '/', icon: LayoutDashboard },
    { name: 'Students', path: '/students', icon: Users },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-sky-100 px-2 py-1.5 flex justify-around items-center shadow-lg shadow-sky-500/10">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) => `
              flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[10px] font-medium transition-colors
              ${isActive ? 'text-sky-600 font-bold' : 'text-slate-500 hover:text-slate-800'}
            `}
          >
            <Icon className="w-5 h-5 mb-0.5" />
            <span>{link.name}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
