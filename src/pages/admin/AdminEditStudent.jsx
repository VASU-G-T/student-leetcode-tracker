import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Edit, 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw, 
  Save, 
  Info 
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { validateRepository } from '../../services/githubService';

export default function AdminEditStudent() {
  const { id } = useParams();
  const { getStudentById, updateStudent, syncStudent, settings } = useData();
  const navigate = useNavigate();

  const student = useMemo(() => getStudentById(id), [id, getStudentById]);

  const [name, setName] = useState('');
  const [registerNumber, setRegisterNumber] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');
  const [section, setSection] = useState('');
  const [email, setEmail] = useState('');
  const [githubUsername, setGithubUsername] = useState('');
  const [githubRepoUrl, setGithubRepoUrl] = useState('');
  const [leetcodeUsername, setLeetcodeUsername] = useState('');
  const [goal, setGoal] = useState(200);
  const [profileImage, setProfileImage] = useState('');

  const [isRepoChanged, setIsRepoChanged] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (student) {
      setName(student.name || '');
      setRegisterNumber(student.registerNumber || '');
      setDepartment(student.department || 'ECE');
      setYear(student.year || '2nd Year');
      setSection(student.section || 'A');
      setEmail(student.email || '');
      setGithubUsername(student.githubUsername || '');
      setGithubRepoUrl(student.githubRepoUrl || '');
      setLeetcodeUsername(student.leetcodeUsername || '');
      setGoal(student.goal || 200);
      setProfileImage(student.profileImage || '');
    }
  }, [student]);

  useEffect(() => {
    if (student && githubRepoUrl && githubRepoUrl.trim() !== (student.githubRepoUrl || '').trim()) {
      setIsRepoChanged(true);
    } else {
      setIsRepoChanged(false);
    }
  }, [githubRepoUrl, student]);

  if (!student) {
    return (
      <div className="glass-card p-12 text-center max-w-md mx-auto my-12">
        <AlertCircle className="w-12 h-12 text-slate-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-white">Student Not Found</h2>
        <p className="text-xs text-slate-400 mt-1 mb-4">The student record could not be found.</p>
        <Link to="/admin/students" className="btn-primary text-xs">Back to Students</Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim() || !registerNumber.trim() || !githubRepoUrl.trim()) {
      setErrorMessage('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await updateStudent(student.id, {
        name: name.trim(),
        registerNumber: registerNumber.trim().toUpperCase(),
        department,
        year,
        section,
        email: email.trim(),
        githubUsername: githubUsername.trim(),
        githubRepoUrl: githubRepoUrl.trim(),
        leetcodeUsername: leetcodeUsername.trim(),
        goal: parseInt(goal, 10) || 200,
        profileImage: profileImage.trim()
      });

      // If repo was changed, prompt to sync or trigger sync
      if (isRepoChanged) {
        await syncStudent(student.id);
      }

      navigate('/admin/students');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to update student');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-16">
      <div className="flex items-center justify-between">
        <Link
          to="/admin/students"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Students</span>
        </Link>
      </div>

      <div className="glass-card p-6 sm:p-8 border-slate-800 shadow-2xl relative">
        <div className="flex items-center gap-3 pb-6 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <Edit className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Edit Student: {student.name}
            </h1>
            <p className="text-xs text-slate-400">
              Update student information, academic details, and LeetSync repository settings.
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="mt-4 p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Repository Changed Notice (Requirement #29) */}
        {isRepoChanged && (
          <div className="mt-4 p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2.5">
            <Info className="w-4 h-4 shrink-0 text-amber-400" />
            <span className="font-semibold">
              Repository changed. Run Sync to update progress.
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Full Name <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Register Number <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                value={registerNumber}
                onChange={(e) => setRegisterNumber(e.target.value)}
                required
                className="input-field uppercase font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="input-field"
              >
                {(settings.departments || ['ECE', 'CSE', 'IT', 'AI&DS', 'MECH', 'EEE']).map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
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
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Section
                </label>
                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="input-field"
                >
                  {(settings.sections || ['Sec A', 'Sec B', 'Sec V', 'Sec D', 'Sec E', 'Sec F']).map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                College Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                GitHub Repository URL <span className="text-amber-400">*</span>
              </label>
              <input
                type="url"
                value={githubRepoUrl}
                onChange={(e) => setGithubRepoUrl(e.target.value)}
                required
                className="input-field font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                GitHub Username
              </label>
              <input
                type="text"
                value={githubUsername}
                onChange={(e) => setGithubUsername(e.target.value)}
                className="input-field font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                LeetCode Username
              </label>
              <input
                type="text"
                value={leetcodeUsername}
                onChange={(e) => setLeetcodeUsername(e.target.value)}
                className="input-field font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Target Problem Goal
              </label>
              <input
                type="number"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="input-field font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Profile Photo URL
              </label>
              <input
                type="url"
                value={profileImage}
                onChange={(e) => setProfileImage(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex items-center justify-end gap-3">
            <Link to="/admin/students" className="btn-secondary">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
