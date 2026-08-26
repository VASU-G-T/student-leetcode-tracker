import React from 'react';
import { 
  ExternalLink, 
  FolderGit2, 
  Globe, 
  Edit3, 
  Trash2, 
  Tag, 
  Sparkles,
  Layers
} from 'lucide-react';
import { GithubIcon } from '../common/Icons';

export default function ProjectCard({ 
  project, 
  isOwner = false, 
  onEdit = null, 
  onDelete = null 
}) {
  if (!project) return null;

  return (
    <div className="glass-card-hover flex flex-col justify-between overflow-hidden border-sky-100 group rounded-2xl shadow-sm">
      {/* Optional Project Banner / Image */}
      {project.imageUrl && (
        <div className="h-40 w-full overflow-hidden relative border-b border-sky-100 bg-sky-50">
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          {project.category && (
            <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-sm border border-sky-200 text-[10px] font-mono text-sky-700 font-bold shadow-sm">
              {project.category}
            </span>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4 bg-white">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-sky-50 text-sky-600 border border-sky-200 shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-base tracking-tight group-hover:text-sky-600 transition-colors">
                {project.title}
              </h3>
            </div>

            {/* Owner Actions */}
            {isOwner && (
              <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                {onEdit && (
                  <button
                    onClick={() => onEdit(project)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                    title="Edit project"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(project)}
                    className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                    title="Delete project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>

          <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Tech Stack Badges */}
        {project.techStack && project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.techStack.map((tech, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-sky-50 border border-sky-200 text-[10px] font-mono font-bold text-sky-700"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Links Footer */}
        <div className="flex items-center gap-2 pt-3 border-t border-sky-100">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary !py-1.5 !px-3 text-xs flex-1 flex items-center justify-center gap-1.5 font-semibold text-slate-700"
            >
              <GithubIcon className="w-3.5 h-3.5 text-slate-700" />
              <span>Source Code</span>
            </a>
          )}

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary !py-1.5 !px-3 text-xs flex-1 flex items-center justify-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Live Demo</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
