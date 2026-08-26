import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Lock, 
  User, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight,
  GraduationCap,
  Sparkles,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export default function Login() {
  const [authMode, setAuthMode] = useState('student'); // 'student' or 'admin'
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { loginStudent, loginAdmin } = useAuth();
  const { students } = useData();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || (authMode === 'admin' ? '/admin/dashboard' : '/');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!identifier.trim() || !password.trim()) {
      setErrorMsg('Please enter both username/register number and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (authMode === 'admin') {
        const res = await loginAdmin(identifier.trim(), password.trim());
        if (res.success) {
          navigate('/admin/dashboard', { replace: true });
        } else {
          setErrorMsg(res.error || 'Invalid admin credentials.');
        }
      } else {
        const res = await loginStudent(identifier.trim(), password.trim(), students);
        if (res.success) {
          const targetUrl = res.student ? `/student/${res.student.registerNumber || res.student.id}` : '/';
          navigate(targetUrl, { replace: true });
        } else {
          setErrorMsg(res.error || 'Invalid student credentials.');
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4 animate-fade-in">
      <div className="glass-card max-w-md w-full p-8 border-sky-100 shadow-2xl relative overflow-hidden bg-white">
        {/* Glow effect */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-sky-400/10 rounded-full blur-2xl pointer-events-none" />

        {/* Branding header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center shadow-lg shadow-sky-500/25 mx-auto">
            {authMode === 'admin' ? (
              <ShieldCheck className="w-6 h-6 text-white stroke-[2.5]" />
            ) : (
              <GraduationCap className="w-6 h-6 text-white stroke-[2.5]" />
            )}
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {authMode === 'admin' ? 'Admin Portal' : 'Student Sign In'}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            {authMode === 'admin' 
              ? 'Sign in to access college roster controls and sync engine.' 
              : 'Sign in to manage your ECE profile, upload photo & showcase projects.'}
          </p>
        </div>

        {/* Auth Mode Toggle Tabs */}
        <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 mb-6">
          <button
            type="button"
            onClick={() => { setAuthMode('student'); setErrorMsg(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'student' 
                ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/25' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Student Login</span>
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('admin'); setErrorMsg(''); setIdentifier('vscec.ece'); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'admin' 
                ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/25' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Login</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
              {authMode === 'admin' ? 'Admin Username' : 'Username or Register Number'}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={authMode === 'admin' ? 'vscec.ece' : 'e.g. vasu_ece or 922525106360'}
                required
                autoComplete="username"
                className="input-field pl-10 py-2.5"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="input-field pl-10 py-2.5"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full py-2.5 mt-2 flex items-center justify-center gap-2 shadow-md shadow-sky-500/25"
          >
            {isSubmitting ? (
              <span>Signing In...</span>
            ) : (
              <>
                <span>{authMode === 'admin' ? 'Sign In to Admin Console' : 'Sign In as Student'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Student Register Callout */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-center space-y-2">
          {authMode === 'student' ? (
            <p className="text-xs text-slate-500 font-medium">
              New ECE Student?{' '}
              <Link to="/register" className="text-sky-600 hover:text-sky-800 hover:underline font-bold inline-flex items-center gap-1">
                <UserPlus className="w-3.5 h-3.5" />
                <span>Create your profile & register</span>
              </Link>
            </p>
          ) : (
            <p className="text-xs text-slate-500 font-medium">
              Student looking for profile?{' '}
              <button
                type="button"
                onClick={() => setAuthMode('student')}
                className="text-sky-600 hover:text-sky-800 hover:underline font-bold"
              >
                Switch to Student Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
