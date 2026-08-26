import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  UserPlus, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Code, 
  Sparkles, 
  RefreshCw 
} from 'lucide-react';
import { GithubIcon } from '../../components/common/Icons';
import { useData } from '../../context/DataContext';
import { validateRepository } from '../../services/githubService';
import { parseGitHubRepoUrl } from '../../utils/helpers';

export default function AdminAddStudent() {
  const { addStudent, settings } = useData();
  const navigate = useNavigate();

  // Form State
  const [name, setName] = useState('');
  const [registerNumber, setRegisterNumber] = useState('');
  const [department, setDepartment] = useState(settings.defaultDepartment || 'ECE');
  const [year, setYear] = useState('2nd Year');
  const [section, setSection] = useState('Sec A');
  const [email, setEmail] = useState('');
  const [githubUsername, setGithubUsername] = useState('');
  const [githubRepoUrl, setGithubRepoUrl] = useState('');
  const [leetcodeUsername, setLeetcodeUsername] = useState('');
  const [goal, setGoal] = useState(settings.defaultGoal || 4033);
  const [profileImage, setProfileImage] = useState('');

  // Repo Validation State
  const [validationStatus, setValidationStatus] = useState({
    isValidating: false,
    isValid: null,
    message: '',
    owner: '',
    repo: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Debounced Live Repo Validation
  useEffect(() => {
    if (!githubRepoUrl.trim()) {
      setValidationStatus({ isValidating: false, isValid: null, message: '', owner: '', repo: '' });
      return;
    }

    const timer = setTimeout(async () => {
      setValidationStatus(prev => ({ ...prev, isValidating: true, message: 'Validating GitHub repository...' }));
      const result = await validateRepository(githubRepoUrl);

      if (result.isValid) {
        setValidationStatus({
          isValidating: false,
          isValid: true,
          message: '✓ Valid GitHub Repository',
          owner: result.owner,
          repo: result.repo
        });

        // Auto-fill github username if empty
        if (!githubUsername && result.owner) {
          setGithubUsername(result.owner);
        }
      } else {
        setValidationStatus({
          isValidating: false,
          isValid: false,
          message: result.error || 'Invalid GitHub repository URL',
          owner: '',
          repo: ''
        });
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [githubRepoUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!name.trim() || !registerNumber.trim() || !githubRepoUrl.trim()) {
      setSubmitError('Please complete all required fields.');
      return;
    }

    if (validationStatus.isValid === false) {
      setSubmitError('Please provide a valid accessible GitHub repository URL.');
      return;
    }

    setIsSubmitting(true);
    try {
      const studentData = {
        name: name.trim(),
        registerNumber: registerNumber.trim().toUpperCase(),
        department,
        year,
        section,
        email: email.trim(),
        githubUsername: githubUsername.trim() || validationStatus.owner,
        githubRepoUrl: githubRepoUrl.trim(),
        githubRepoOwner: validationStatus.owner,
        githubRepoName: validationStatus.repo,
        leetcodeUsername: leetcodeUsername.trim(),
        goal: parseInt(goal, 10) || settings.defaultGoal || 4033,
        profileImage: profileImage.trim() || `https://api.dicebear.com/7.x/bottts/svg?seed=${githubUsername || name}`
      };

      const created = await addStudent(studentData);
      navigate(`/student/${created.registerNumber || created.id}`);
    } catch (err) {
      setSubmitError(err.message || 'Failed to add student');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/students"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-sky-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Students</span>
        </Link>
      </div>

      <div className="glass-card p-6 sm:p-8 border-sky-100 bg-white shadow-xl relative">
        <div className="flex items-center gap-3 pb-6 border-b border-sky-100">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-200 shadow-sm">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Add New Student
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Register a student and link their LeetSync GitHub repository for automated tracking.
            </p>
          </div>
        </div>

        {submitError && (
          <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{submitError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Section 1: Academic Information */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-sky-700 mb-3">
              1. Student Academic Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                  Full Name <span className="text-sky-600">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. G T Vasudevan"
                  required
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                  Register Number <span className="text-sky-600">*</span>
                </label>
                <input
                  type="text"
                  value={registerNumber}
                  onChange={(e) => setRegisterNumber(e.target.value)}
                  placeholder="e.g. 922525106360"
                  required
                  className="input-field uppercase font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="input-field font-medium cursor-pointer"
                >
                  {(settings.departments || ['ECE', 'CSE', 'IT', 'AI&DS', 'MECH', 'EEE']).map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                    Year
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="input-field font-medium cursor-pointer"
                  >
                    {(settings.years || ['1st Year', '2nd Year', '3rd Year', '4th Year']).map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                    Section
                  </label>
                  <select
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="input-field font-medium cursor-pointer"
                  >
                    {(settings.sections || ['Sec A', 'Sec B', 'Sec C', 'Sec D', 'Sec E', 'Sec F']).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                  College Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@college.edu"
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Section 2: GitHub Repository & LeetSync Link */}
          <div className="pt-4 border-t border-sky-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-sky-700 mb-3 flex items-center gap-1.5">
              <GithubIcon className="w-3.5 h-3.5" />
              <span>2. GitHub Repository & LeetSync Integration</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                  GitHub Repository URL <span className="text-sky-600">*</span>
                </label>
                <input
                  type="url"
                  value={githubRepoUrl}
                  onChange={(e) => setGithubRepoUrl(e.target.value)}
                  placeholder="https://github.com/username/leetcode"
                  required
                  className="input-field font-mono"
                />

                {/* Validation Status Feedback Pill */}
                {githubRepoUrl.trim() && (
                  <div className="mt-2 text-xs flex items-center gap-2">
                    {validationStatus.isValidating ? (
                      <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-600" />
                        <span>Validating repository on GitHub...</span>
                      </span>
                    ) : validationStatus.isValid ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{validationStatus.message} (Owner: {validationStatus.owner}, Repo: {validationStatus.repo})</span>
                      </span>
                    ) : validationStatus.isValid === false ? (
                      <span className="text-rose-700 font-bold flex items-center gap-1.5 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                        <AlertCircle className="w-4 h-4 text-rose-500" />
                        <span>{validationStatus.message}</span>
                      </span>
                    ) : null}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                    GitHub Username
                  </label>
                  <input
                    type="text"
                    value={githubUsername}
                    onChange={(e) => setGithubUsername(e.target.value)}
                    placeholder="e.g. Vasudevan123"
                    className="input-field font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                    LeetCode Username <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={leetcodeUsername}
                    onChange={(e) => setLeetcodeUsername(e.target.value)}
                    placeholder="e.g. vasudevan123"
                    className="input-field font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                    Target Problem Goal
                  </label>
                  <input
                    type="number"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    min="1"
                    className="input-field font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                    Custom Profile Photo URL <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="url"
                    value={profileImage}
                    onChange={(e) => setProfileImage(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-6 border-t border-sky-100 flex items-center justify-end gap-3">
            <Link
              to="/admin/students"
              className="btn-secondary"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting || validationStatus.isValid === false}
              className="btn-primary flex items-center gap-2 shadow-md shadow-sky-500/25"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving & Initializing Sync...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Add Student</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
