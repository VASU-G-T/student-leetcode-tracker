import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  User, 
  Save, 
  Upload, 
  Plus, 
  Layers, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  FolderGit2,
  Trash2,
  Edit3
} from 'lucide-react';
import { GithubIcon, LeetCodeIcon } from '../../components/common/Icons';
import ProjectCard from '../../components/profile/ProjectCard';
import ProjectModal from '../../components/profile/ProjectModal';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export default function StudentEditProfile() {
  const { id } = useParams();
  const { currentUser, isStudent, isAdmin } = useAuth();
  const { 
    students, 
    updateStudentProfile, 
    getStudentProjects, 
    addStudentProject, 
    updateStudentProject, 
    deleteStudentProject,
    settings 
  } = useData();
  const navigate = useNavigate();

  // Find the student object corresponding to param or logged in user or creator
  const currentStudent = id
    ? (students.find(s => s.id === id || s.registerNumber?.toLowerCase() === id.toLowerCase() || s.username?.toLowerCase() === id.toLowerCase()) || students[0])
    : (students.find(s => 
        s.id === currentUser?.studentId || 
        s.username?.toLowerCase() === currentUser?.username?.toLowerCase() ||
        s.registerNumber?.toLowerCase() === currentUser?.registerNumber?.toLowerCase()
      ) || students.find(s => s.isCreator || s.id === 'vasu_gt_creator') || students[0]);

  const studentId = currentStudent?.id;

  // Form State
  const [name, setName] = useState('');
  const [registerNumber, setRegisterNumber] = useState('');
  const [department, setDepartment] = useState('ECE');
  const [year, setYear] = useState('2nd Year');
  const [section, setSection] = useState('Sec A');
  const [email, setEmail] = useState('');
  const [githubUsername, setGithubUsername] = useState('');
  const [githubRepoUrl, setGithubRepoUrl] = useState('');
  const [leetcodeUsername, setLeetcodeUsername] = useState('');
  const [goal, setGoal] = useState(4033);
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [skillsText, setSkillsText] = useState('');

  // Project Modal State
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Projects list
  const projects = studentId ? getStudentProjects(studentId) : [];

  useEffect(() => {
    if (currentStudent) {
      setName(currentStudent.name || '');
      setRegisterNumber(currentStudent.registerNumber || '');
      setDepartment(currentStudent.department || 'ECE');
      setYear(currentStudent.year || '2nd Year');
      setSection(currentStudent.section || 'Sec A');
      setEmail(currentStudent.email || '');
      setGithubUsername(currentStudent.githubUsername || '');
      setGithubRepoUrl(currentStudent.githubRepoUrl || '');
      setLeetcodeUsername(currentStudent.leetcodeUsername || '');
      setGoal(currentStudent.goal || 4033);
      setBio(currentStudent.bio || '');
      setProfileImage(currentStudent.profileImage || '');
      setSkillsText(Array.isArray(currentStudent.skills) ? currentStudent.skills.join(', ') : 'C++, Python, Java, DSA');
    }
  }, [currentStudent]);

  // Handle local photo upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be under 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!studentId) return;

    setIsSaving(true);
    try {
      await updateStudentProfile(studentId, {
        name,
        department,
        year,
        section,
        email,
        githubUsername,
        githubRepoUrl,
        leetcodeUsername,
        goal: parseInt(goal, 10) || 4033,
        bio,
        profileImage,
        skills: skillsText.split(',').map(s => s.trim()).filter(Boolean)
      });
      navigate(`/student/${currentStudent.registerNumber || currentStudent.id}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddProject = () => {
    setEditingProject(null);
    setIsProjectModalOpen(true);
  };

  const handleEditProject = (proj) => {
    setEditingProject(proj);
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = (projectData) => {
    if (!studentId) return;
    if (editingProject) {
      updateStudentProject(studentId, editingProject.id, projectData);
    } else {
      addStudentProject(studentId, projectData);
    }
  };

  const handleDeleteProject = (proj) => {
    if (window.confirm(`Are you sure you want to remove "${proj.title}" from your project showcase?`)) {
      deleteStudentProject(studentId, proj.id);
    }
  };

  if (!currentStudent) {
    return (
      <div className="glass-card p-12 text-center max-w-lg mx-auto my-12 bg-white border-sky-100 shadow-sm">
        <User className="w-12 h-12 text-sky-300 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-900">No Student Profile Found</h2>
        <p className="text-xs text-slate-500 mt-1 mb-4 font-medium">Please register your student account first.</p>
        <Link to="/register" className="btn-primary inline-flex items-center gap-2">
          <span>Create Profile</span>
        </Link>
      </div>
    );
  }

  const defaultSections = ['Sec A', 'Sec B', 'Sec C', 'Sec D', 'Sec E', 'Sec F'];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to={`/student/${currentStudent.registerNumber || currentStudent.id}`}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-sky-600 hover:border-sky-300 transition-colors shadow-sm"
            title="Back to profile"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-sky-50 text-sky-600 border border-sky-200 shadow-sm">
                <User className="w-6 h-6" />
              </div>
              <span>Edit My Profile & Portfolio</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
              Customize your photo, academic details, and manage unlimited project showcases.
            </p>
          </div>
        </div>

        <Link
          to={`/student/${currentStudent.registerNumber || currentStudent.id}`}
          className="btn-secondary text-xs font-semibold text-slate-700 hover:text-sky-700"
        >
          View Public Profile
        </Link>
      </div>

      {/* Main Profile Edit Form */}
      <div className="glass-card p-6 sm:p-8 border-sky-100 shadow-xl space-y-6 bg-white">
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-sky-100">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Personal & Academic Details
            </h2>
            <button
              type="submit"
              disabled={isSaving}
              className="btn-primary flex items-center gap-2 text-xs shadow-md shadow-sky-500/25"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>

          {/* Photo Uploader */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-sky-50/50 border border-sky-100">
            <div className="relative group shrink-0">
              <img
                src={profileImage || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentStudent.githubUsername || name}`}
                alt={name}
                className="w-24 h-24 rounded-2xl object-cover border-2 border-sky-300 bg-white shadow-md"
              />
            </div>

            <div className="space-y-2 flex-1 w-full text-center sm:text-left">
              <label className="block text-xs font-bold uppercase text-slate-700">
                Profile Photo (Upload from Device or URL)
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={profileImage}
                  onChange={(e) => setProfileImage(e.target.value)}
                  placeholder="Paste image URL here..."
                  className="input-field flex-1 text-xs"
                />
                <label className="btn-secondary text-xs cursor-pointer flex items-center justify-center gap-2 shrink-0 font-semibold text-slate-700">
                  <Upload className="w-3.5 h-3.5 text-sky-600" />
                  <span>Upload Local File</span>
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

          {/* Core Info Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                Full Name <span className="text-sky-600">*</span>
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
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                Register Number
              </label>
              <input
                type="text"
                value={registerNumber}
                disabled
                className="input-field opacity-80 cursor-not-allowed font-mono text-sky-700 font-bold bg-sky-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                Department
              </label>
              <input
                type="text"
                value={department}
                disabled
                className="input-field opacity-80 cursor-not-allowed text-sky-700 font-bold bg-sky-50/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  Year
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="input-field cursor-pointer font-medium"
                >
                  {(settings.years || ['1st Year', '2nd Year', '3rd Year', '4th Year']).map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  Section
                </label>
                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="input-field cursor-pointer font-medium"
                >
                  {(settings.sections || defaultSections).map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
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
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                Bio / Headline
              </label>
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="e.g. ECE Student passionate about IoT, Embedded Systems & LeetCode DSA"
                className="input-field"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                Skills & Tech Stack (Comma-separated)
              </label>
              <input
                type="text"
                value={skillsText}
                onChange={(e) => setSkillsText(e.target.value)}
                placeholder="e.g. C++, Python, Embedded C, Arduino, React, DSA"
                className="input-field font-mono text-xs"
              />
            </div>
          </div>

          {/* GitHub & LeetCode Settings */}
          <div className="space-y-4 pt-4 border-t border-sky-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-sky-700 flex items-center gap-2">
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>LeetCode & GitHub Sync Settings</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  GitHub Repository URL (LeetSync)
                </label>
                <div className="relative">
                  <GithubIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="url"
                    value={githubRepoUrl}
                    onChange={(e) => setGithubRepoUrl(e.target.value)}
                    required
                    className="input-field pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
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
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  LeetCode Username
                </label>
                <div className="relative">
                  <LeetCodeIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={leetcodeUsername}
                    onChange={(e) => setLeetcodeUsername(e.target.value)}
                    className="input-field pl-10 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Unlimited Projects Showcase Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600 border border-sky-200 shadow-sm">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                My Projects & Portfolio Showcase
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Add unlimited apps, hardware projects, and GitHub repositories to your profile.
              </p>
            </div>
          </div>

          <button
            onClick={handleAddProject}
            className="btn-primary flex items-center gap-1.5 text-xs font-semibold shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Project</span>
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="glass-card p-10 text-center border-dashed border-sky-200 bg-white shadow-sm">
            <Layers className="w-10 h-10 text-sky-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">No projects added yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto mb-4 font-medium">
              Showcase your web apps, mobile apps, and ECE embedded/IoT builds here!
            </p>
            <button
              onClick={handleAddProject}
              className="btn-primary text-xs inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Your First Project</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((proj) => (
              <ProjectCard
                key={proj.id}
                project={proj}
                isOwner={true}
                onEdit={handleEditProject}
                onDelete={handleDeleteProject}
              />
            ))}
          </div>
        )}
      </div>

      {/* Project Modal */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        project={editingProject}
        onClose={() => setIsProjectModalOpen(false)}
        onSave={handleSaveProject}
      />
    </div>
  );
}
