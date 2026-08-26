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
    <div className="glass-card-hover flex flex-col justify-between overflow-hidden border-slate-800/80 group rounded-xl">
      {/* Optional Project Banner / Image */}
      {project.imageUrl && (
        <div className="h-40 w-full overflow-hidden relative border-b border-slate-800/80 bg-slate-950">
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          {project.category && (
            <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-sm border border-slate-800 text-[10px] font-mono text-amber-400 font-semibold">
              {project.category}
            </span>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-white text-base tracking-tight group-hover:text-amber-400 transition-colors">
                {project.title}
              </h3>
            </div>

            {/* Owner Actions */}
            {isOwner && (
              <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                {onEdit && (
                  <button
                    onClick={() => onEdit(project)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Edit project"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(project)}
                    className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                    title="Delete project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>

          <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Tech Stack Badges */}
        {project.techStack && project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.techStack.map((tech, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Links Footer */}
        <div className="flex items-center gap-2 pt-3 border-t border-slate-800/60">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary !py-1.5 !px-3 text-xs flex-1 flex items-center justify-center gap-1.5 bg-slate-950/80"
            >
              <GithubIcon className="w-3.5 h-3.5 text-slate-300" />
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
