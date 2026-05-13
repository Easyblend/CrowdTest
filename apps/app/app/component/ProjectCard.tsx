'use client';

import { Bug, Edit, Globe } from 'lucide-react';
import Link from 'next/link';

interface Bug {
  id: string;
  title: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'OPEN' | 'RESOLVED';
}

interface Project {
  id: string;
  name: string;
  url: string;
  slug: string;
  bugs?: Bug[];
  createdAt: string;
}

interface ProjectCardProps {
  project: Project;
  setEditingProject?: React.Dispatch<React.SetStateAction<Project | null>>;
}

export default function ProjectCard({ project, setEditingProject }: ProjectCardProps) {

  const bugs = project.bugs ?? [];

  const openBugs = bugs.filter(b => b.status === 'OPEN');
  const resolvedBugs = bugs.filter(b => b.status === 'RESOLVED');

  const createdDate = new Date(project.createdAt).toLocaleDateString();

  return (
    <div className="
      group relative rounded-2xl border border-slate-200 bg-white
      p-6 shadow-sm transition-all duration-300
      hover:-translate-y-0.5 hover:shadow-lg hover:border-slate-300
    ">

      {/* HEADER */}
      <Link href={`/dashboard/project/${project.id}`} className="block">

        <div className="flex items-start justify-between gap-4">

          {/* TITLE */}
          <div className="min-w-0">

            <h2 className="
              text-base font-semibold text-slate-900
              tracking-tight
            ">
              {project.name}
            </h2>

            {/* META ROW (clean separation) */}
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">

              <div className="flex items-center gap-1">
                <Globe className="h-3.5 w-3.5 text-slate-400" />
                <span className="truncate max-w-[180px]">
                  {project.url}
                </span>
              </div>

              <span className="text-slate-300">•</span>

              <span>
                Created {createdDate}
              </span>

            </div>

          </div>

          {/* BUG BADGE (clean chip) */}
          <div className="
            flex items-center gap-1
            rounded-full bg-slate-100
            px-2.5 py-1 text-xs font-medium
            text-slate-700
          ">
            <Bug className="h-3.5 w-3.5 text-slate-500" />
            {bugs.length}
          </div>

        </div>

        {/* STATS */}
        <div className="mt-5 grid grid-cols-3 gap-3">

          <div className="rounded-xl border border-slate-100 bg-slate-50/60 py-2 text-center">
            <p className="text-[11px] text-slate-500">Open</p>
            <p className="mt-0.5 text-sm font-semibold text-slate-900">
              {openBugs.length}
            </p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/60 py-2 text-center">
            <p className="text-[11px] text-slate-500">Resolved</p>
            <p className="mt-0.5 text-sm font-semibold text-slate-900">
              {resolvedBugs.length}
            </p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/60 py-2 text-center">
            <p className="text-[11px] text-slate-500">Total</p>
            <p className="mt-0.5 text-sm font-semibold text-slate-900">
              {bugs.length}
            </p>
          </div>

        </div>
      </Link>

      {/* ACTIONS */}
      <div className="
        mt-5 flex items-center justify-between
        border-t border-slate-100 pt-4
      ">

        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="
            text-sm font-medium text-slate-600
            hover:text-slate-900 transition
          "
        >
          Open site →
        </a>

        <button
          onClick={() => setEditingProject?.(project)}
          className="
            inline-flex items-center gap-1
            rounded-lg bg-slate-900 px-3 py-1.5
            text-sm font-medium text-white
            hover:bg-slate-800 transition
          "
        >
          <Edit className="h-4 w-4" />
          Edit
        </button>

      </div>

    </div>
  );
}