'use client';

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
  description?: string;
  bugs: Bug[];
}

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-lg hover:border-slate-300 transition-all duration-200 cursor-pointer">
      <Link href={`/dashboard/project/${project.id}`} className="block">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">{project.name}</h2>
        {project.description && <p className="text-slate-600 text-sm mb-3">{project.description}</p>}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <span className="text-slate-600 text-sm font-medium">Bugs reported:</span>
        <span className="inline-flex items-center justify-center bg-red-50 text-red-700 font-semibold rounded-full w-8 h-8">
          {project.bugs.length}
        </span>
      </div>
      </Link>

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
