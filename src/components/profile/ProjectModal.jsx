import React, { useState, useEffect } from 'react';
import { 
  X, 
  Layers, 
  Globe, 
  Image as ImageIcon, 
  Tag, 
  Save, 
  AlertCircle 
} from 'lucide-react';
import { GithubIcon } from '../common/Icons';

export default function ProjectModal({
  isOpen,
  project = null,
  onClose,
  onSave
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [techStack, setTechStack] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('Web Application');
  const [error, setError] = useState('');

  useEffect(() => {
    if (project) {
      setTitle(project.title || '');
      setDescription(project.description || '');
      setTechStack(Array.isArray(project.techStack) ? project.techStack.join(', ') : project.techStack || '');
      setGithubUrl(project.githubUrl || '');
      setLiveUrl(project.liveUrl || '');
      setImageUrl(project.imageUrl || '');
      setCategory(project.category || 'Web Application');
    } else {
      setTitle('');
      setDescription('');
      setTechStack('React, Node.js, Tailwind CSS');
      setGithubUrl('');
      setLiveUrl('');
      setImageUrl('');
      setCategory('Web Application');
    }
    setError('');
  }, [project, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Project title is required.');
      return;
    }
    if (!description.trim()) {
      setError('Please provide a brief description of your project.');
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim(),
      techStack: techStack.split(',').map(s => s.trim()).filter(Boolean),
      githubUrl: githubUrl.trim(),
      liveUrl: liveUrl.trim(),
      imageUrl: imageUrl.trim(),
      category
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-card max-w-lg w-full p-6 sm:p-7 border-slate-800 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              {project ? 'Edit Project' : 'Add Project to Showcase'}
            </h2>
            <p className="text-xs text-slate-400">
              Highlight your apps, hardware builds, and GitHub repositories.
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-5">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
              Project Title <span className="text-amber-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Smart IoT Monitoring System"
              required
              className="input-field"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input-field"
              >
                <option value="Web Application">Web Application</option>
                <option value="Mobile App">Mobile App</option>
                <option value="IoT / Embedded">IoT / Embedded (ECE)</option>
                <option value="AI / ML / Robotics">AI / ML / Robotics</option>
                <option value="Open Source Tool">Open Source Tool</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                Tech Stack (Comma-separated)
              </label>
              <input
                type="text"
                value={techStack}
                onChange={(e) => setTechStack(e.target.value)}
                placeholder="e.g. Arduino, C++, ESP32, MQTT"
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
              Description <span className="text-amber-400">*</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain the purpose of this project, problem solved, and key features..."
              required
              className="input-field py-2"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                GitHub Repository URL
              </label>
              <div className="relative">
                <GithubIcon className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/username/project"
                  className="input-field pl-9"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                Live Demo / Website URL
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="url"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  placeholder="https://my-live-project.com"
                  className="input-field pl-9"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
              Project Preview Image / Banner URL (Optional)
            </label>
            <div className="relative">
              <ImageIcon className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... or image link"
                className="input-field pl-9"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary text-xs flex items-center gap-2"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{project ? 'Save Changes' : 'Add Project'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
