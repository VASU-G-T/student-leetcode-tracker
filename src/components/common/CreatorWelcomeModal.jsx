import React, { useState, useEffect } from 'react';
import { 
  Star, 
  UserPlus, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Heart,
  Code2,
  X
} from 'lucide-react';
import { GithubIcon } from './Icons';
import { useAuth } from '../../context/AuthContext';
import { CREATOR_PROFILE } from '../../services/sampleData';

const SEEN_CREATOR_KEY = 'leettrack_seen_creator_welcome_v1';

export default function CreatorWelcomeModal() {
  const { currentUser, isStudent } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [hasStarred, setHasStarred] = useState(false);
  const [hasFollowed, setHasFollowed] = useState(false);

  useEffect(() => {
    // Show on first login/registration for students
    if (currentUser && isStudent) {
      const seen = localStorage.getItem(`${SEEN_CREATOR_KEY}_${currentUser.username || currentUser.uid}`);
      if (!seen) {
        setIsOpen(true);
      }
    }
  }, [currentUser, isStudent]);

  if (!isOpen) return null;

  const handleDismiss = () => {
    if (currentUser) {
      localStorage.setItem(`${SEEN_CREATOR_KEY}_${currentUser.username || currentUser.uid}`, 'true');
    }
    setIsOpen(false);
  };

  const handleFollowClick = () => {
    setHasFollowed(true);
    window.open('https://github.com/VASU-G-T', '_blank');
  };

  const handleStarClick = () => {
    setHasStarred(true);
    window.open('https://github.com/VASU-G-T/student-leetcode-tracker', '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="glass-card max-w-lg w-full p-6 sm:p-8 border-amber-500/40 shadow-2xl relative overflow-hidden text-center space-y-6">
        {/* Glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Dismiss X */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Creator Avatar & Welcome Badge */}
        <div className="space-y-3">
          <div className="relative inline-block">
            <img
              src={CREATOR_PROFILE.profileImage}
              alt="Vasu G T"
              className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-400 shadow-xl shadow-amber-500/30 mx-auto"
            />
            <div className="absolute -bottom-2 -right-2 p-1.5 rounded-lg bg-amber-500 text-slate-950 shadow-md">
              <Sparkles className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-1">
              <Heart className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>Welcome to ECE LeetTrack</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Connect with the App Creator
            </h2>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              Built and developed by <strong className="text-white font-bold">Vasu G T (@VASU-G-T)</strong> for ECE students. Support the project and stay updated on new features!
            </p>
          </div>
        </div>

        {/* Actions to Star & Follow */}
        <div className="space-y-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <p className="text-xs font-semibold text-slate-300">
            Support the Creator on GitHub:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handleStarClick}
              className={`py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
                hasStarred
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-400 font-bold shadow-md shadow-amber-500/20'
              }`}
            >
              {hasStarred ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Starred on GitHub!</span>
                </>
              ) : (
                <>
                  <Star className="w-4 h-4 fill-slate-950 text-slate-950" />
                  <span>⭐ Star Project</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleFollowClick}
              className={`py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
                hasFollowed
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                  : 'bg-slate-900 hover:bg-slate-800 text-white border-slate-700'
              }`}
            >
              {hasFollowed ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Followed @VASU-G-T</span>
                </>
              ) : (
                <>
                  <GithubIcon className="w-4 h-4 text-slate-200" />
                  <span>👤 Follow @VASU-G-T</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Enter App Button */}
        <div>
          <button
            type="button"
            onClick={handleDismiss}
            className="btn-primary w-full py-3 flex items-center justify-center gap-2 text-sm font-bold shadow-xl shadow-amber-500/20"
          >
            <span>Enter ECE LeetTrack & Explore Profiles</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
