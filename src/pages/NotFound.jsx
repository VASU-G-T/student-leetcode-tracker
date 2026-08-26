import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 text-center">
      <div className="glass-card max-w-md w-full p-8 border-slate-800 space-y-4">
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-extrabold text-white">404</h1>
        <p className="text-sm font-semibold text-slate-300">Page Not Found</p>
        <p className="text-xs text-slate-400">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="pt-2">
          <Link to="/" className="btn-primary inline-flex items-center gap-2">
            <Home className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
