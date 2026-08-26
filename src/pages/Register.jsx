import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  UserPlus, 
  Lock, 
  User, 
  Mail, 
  FolderGit2, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  Upload, 
  Image as ImageIcon,
  BookOpen
} from 'lucide-react';
import { GithubIcon, LeetCodeIcon } from '../components/common/Icons';
import { validateRepository } from '../services/githubService';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { addStudent, settings } = useData();
  const { registerStudent } = useAuth();
  const navigate = useNavigate();

  // Form State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
  const [bio, setBio] = useState('ECE Student • LeetCode & Developer');
  const [profileImage, setProfileImage] = useState('');

  // Validation State
  const [validationStatus, setValidationStatus] = useState({
    isValidating: false,
    isValid: null,
    message: '',
    owner: '',
    repo: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Auto-validate GitHub repo URL with debounce
  useEffect(() => {
    if (!githubRepoUrl || !githubRepoUrl.trim()) {
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

  // Handle local photo upload (converts to base64)
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setSubmitError('Photo must be less than 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!username.trim() || !password || !name.trim() || !registerNumber.trim() || !githubRepoUrl.trim()) {
      setSubmitError('Please fill in all required fields.');
      return;
    }

    if (password.length < 4) {
      setSubmitError('Password must be at least 4 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setSubmitError('Passwords do not match.');
      return;
    }

    if (validationStatus.isValid === false) {
      setSubmitError('Please provide a valid, accessible GitHub repository URL.');
      return;
    }

    setIsSubmitting(true);
    try {
      const studentData = {
        name: name.trim(),
        username: username.trim().toLowerCase(),
        registerNumber: registerNumber.trim().toUpperCase(),
        department,
        year,
        section,
        email: email.trim(),
        githubUsername: githubUsername.trim() || validationStatus.owner,
        githubRepoUrl: githubRepoUrl.trim(),
        githubRepoOwner: validationStatus.owner,
        githubRepoName: validationStatus.repo,
        leetcodeUsername: leetcodeUsername.trim() || username.trim(),
        goal: parseInt(goal, 10) || settings.defaultGoal || 4033,
        bio: bio.trim(),
        profileImage: profileImage.trim() || `https://api.dicebear.com/7.x/bottts/svg?seed=${githubUsername || username || name}`
      };

      // 1. Create student in DataContext / Firestore
      const created = await addStudent(studentData);

      // 2. Register credentials in AuthContext and log in
      registerStudent(created, password);

      // 3. Redirect directly to the newly created student profile!
      navigate(`/student/${created.registerNumber || created.id}`);
    } catch (err) {
      setSubmitError(err.message || 'Failed to create student account');
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultSections = ['Sec A', 'Sec B', 'Sec C', 'Sec D', 'Sec E', 'Sec F'];

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-16">
      {/* Top Banner */}
      <div className="glass-card p-6 sm:p-8 border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3 pb-6 border-b border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 shadow-lg shadow-amber-500/10">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Create Student Profile
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Register your ECE coding profile, sync LeetCode progress via GitHub, and showcase your projects.
            </p>
          </div>
        </div>

        {submitError && (
          <div className="mt-4 p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{submitError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Section 1: Account Credentials */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Lock className="w-3.5 h-3.5" />
              <span>1. Account Credentials (For Student Login)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                  Choose Username <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase())}
                  placeholder="e.g. vasu_ece"
                  required
                  className="input-field font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                  Password <span className="text-amber-400">*</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                  Confirm Password <span className="text-amber-400">*</span>
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Student Academic Details */}
          <div className="space-y-4 pt-4 border-t border-slate-800/80">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <User className="w-3.5 h-3.5" />
              <span>2. Student Academic Details</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                  Full Name <span className="text-amber-400">*</span>
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
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                  Register Number <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  value={registerNumber}
                  onChange={(e) => setRegisterNumber(e.target.value.toUpperCase())}
                  placeholder="e.g. ECE001"
                  required
                  className="input-field font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                  Department
                </label>
                <input
                  type="text"
                  value={department}
                  disabled
                  className="input-field opacity-80 cursor-not-allowed text-amber-400 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                    Year
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="input-field"
                  >
                    {(settings.years || ['1st Year', '2nd Year', '3rd Year', '4th Year']).map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                    Section
                  </label>
                  <select
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="input-field"
                  >
                    {(settings.sections || defaultSections).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                  College Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. student@college.edu"
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Section 3: LeetCode & GitHub Sync Settings */}
          <div className="space-y-4 pt-4 border-t border-slate-800/80">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>3. GitHub & LeetSync Configuration</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                  GitHub Repository URL (LeetSync) <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <GithubIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="url"
                    value={githubRepoUrl}
                    onChange={(e) => setGithubRepoUrl(e.target.value)}
                    placeholder="https://github.com/your-username/leetcode"
                    required
                    className={`input-field pl-10 ${
                      validationStatus.isValid === true ? 'border-emerald-500/60 ring-1 ring-emerald-500/30' :
                      validationStatus.isValid === false ? 'border-rose-500/60 ring-1 ring-rose-500/30' : ''
                    }`}
                  />
                </div>

                {validationStatus.isValidating && (
                  <p className="text-xs text-amber-400 mt-1.5 flex items-center gap-1.5 font-mono">
                    <span className="w-2.5 h-2.5 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                    <span>Validating repository on GitHub...</span>
                  </p>
                )}

                {validationStatus.isValid === true && (
                  <p className="text-xs text-emerald-400 mt-1.5 flex items-center gap-1.5 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>✓ Repository verified: {validationStatus.owner}/{validationStatus.repo}</span>
                  </p>
                )}

                {validationStatus.isValid === false && (
                  <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1.5 font-mono">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{validationStatus.message}</span>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
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
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                    LeetCode Username
                  </label>
                  <div className="relative">
                    <LeetCodeIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={leetcodeUsername}
                      onChange={(e) => setLeetcodeUsername(e.target.value)}
                      placeholder="e.g. vasu_123"
                      className="input-field pl-10 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Profile Photo & Bio */}
          <div className="space-y-4 pt-4 border-t border-slate-800/80">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>4. Profile Customization & Photo</span>
            </h2>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              <div className="relative group">
                <img
                  src={profileImage || `https://api.dicebear.com/7.x/bottts/svg?seed=${username || 'user'}`}
                  alt="Profile preview"
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-500/40 bg-slate-950 shadow-md"
                />
              </div>

              <div className="flex-1 w-full space-y-2">
                <label className="block text-xs font-semibold uppercase text-slate-400">
                  Upload Profile Photo (or provide Image URL)
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={profileImage}
                    onChange={(e) => setProfileImage(e.target.value)}
                    placeholder="Paste image URL..."
                    className="input-field flex-1 text-xs"
                  />
                  <label className="btn-secondary text-xs cursor-pointer flex items-center justify-center gap-2 shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                Bio / Headline
              </label>
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="e.g. ECE 3rd Year • Embedded Systems & DSA Enthusiast"
                className="input-field text-xs"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-amber-400 hover:underline font-semibold">
                Sign In here
              </Link>
            </p>

            <button
              type="submit"
              disabled={isSubmitting || validationStatus.isValidating}
              className="btn-primary w-full sm:w-auto px-6 py-2.5 flex items-center justify-center gap-2 text-sm font-semibold"
            >
              {isSubmitting ? (
                <span>Registering & Syncing...</span>
              ) : (
                <>
                  <span>Create My Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
