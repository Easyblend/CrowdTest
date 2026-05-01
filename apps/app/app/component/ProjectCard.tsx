'use client';

import { Edit } from 'lucide-react';
import Link from 'next/link';

interface Bug {
  id: number;
  title: string;
  severity: string;
}

interface Project {
  id: number;
  name: string;
  url: string;
  slug: string;
  description?: string;
  bugs?: Bug[];
}

interface ProjectCardProps {
  project: Project;
  setEditingProject?: React.Dispatch<React.SetStateAction<Project | null>>;
}

export default function ProjectCard({ project, setEditingProject }: ProjectCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6 hover:shadow-xl hover:border-blue-300 transition-all duration-300 group">
      <div className="flex flex-col h-full">
        <Link href={`/dashboard/project/${project.id}`} className="block flex-1 hover:no-underline">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
              {project.name}
            </h2>

            {project.description && (
              <p className="text-slate-600 text-sm line-clamp-2">{project.description}</p>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100 mt-auto">
            <span className="text-slate-600 text-sm font-medium">Bugs:</span>
            <span className="bg-red-100 text-red-700 font-bold rounded-full px-3 py-1 text-sm">
              {project.bugs?.length ?? 0}
            </span>
          </div>
        </Link>

        <div className="flex items-center justify-between gap-2 mt-4 pt-4 border-t border-slate-100">
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 font-medium text-sm hover:underline transition-colors flex-1"
          >
            Visit →
          </a>
          <button
            onClick={() => setEditingProject?.(project)}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1"
            title="Edit project"
          >
            <Edit className="w-4 h-4" />
            <span className="text-sm font-medium">Edit</span>
          </button>
        </div>
      </div>
    </div>
  );
}
