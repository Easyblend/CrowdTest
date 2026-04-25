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
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-lg hover:border-slate-300 transition-all duration-200 cursor-pointer">
      <div>

        <Link href={`/dashboard/project/${project.id}`} className="block">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">
            {project.name}
          </h2>

          {project.description && (
            <p className="text-slate-600 text-sm mb-3">{project.description}</p>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <span className="text-slate-600 text-sm font-medium">Bugs reported:</span>
            <span className="bg-red-50 text-red-700 font-semibold rounded-full w-8 h-8 flex items-center justify-center">
              {project.bugs ? project.bugs.length : 0}
            </span>
          </div>
        </Link>

        {/* Actions OUTSIDE link */}
        <div className="flex justify-end mt-4">
          <button
            onClick={() => {
              setEditingProject && setEditingProject(project);
            }}
            className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
        </div>
      </div>

      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 font-medium text-sm mb-4 block hover:underline"
      >
        Visit Project →
      </a>

    </div>
  );
}
