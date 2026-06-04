'use client';

import { Bug, Edit, Globe } from 'lucide-react';
import Link from 'next/link';

interface Bug {
  id: string;
  title: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'OPEN' | 'RESOLVED' | 'IN_PROGRESS';
}

interface Project {
  id: string;
  name: string;
  url: string;
  slug: string;
  description?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
  bugs?: Bug[];
  createdAt: string;
  lastActivityAt?: string;
}

interface ProjectCardProps {
  project: Project;
  setEditingProject?: React.Dispatch<React.SetStateAction<Project | null>>;
}

export default function ProjectCard({ project, setEditingProject }: ProjectCardProps) {
  const bugs = project.bugs ?? [];

  const openBugs = bugs.filter(b => b.status === 'OPEN' || b.status === 'IN_PROGRESS');
  const resolvedBugs = bugs.filter(b => b.status === 'RESOLVED');

  const createdDate = new Date(project.createdAt).toLocaleDateString();

  const lastActivityDate = project.lastActivityAt
    ? new Date(project.lastActivityAt)
    : null;

  const daysAgo = lastActivityDate
    ? Math.floor((Date.now() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const status = project.status ?? 'ACTIVE';

  // 🎯 STATE STYLES
  const stateStyles = {
    ACTIVE: {
      card: 'border-slate-200 bg-white',
      text: 'text-slate-900',
      subtext: 'text-slate-600',
      muted: 'text-slate-500',
      badge: 'bg-green-100 text-green-700'
    },
    INACTIVE: {
      card: 'border-amber-100 bg-amber-50/30',
      text: 'text-slate-800',
      subtext: 'text-slate-500',
      muted: 'text-slate-400',
      badge: 'bg-amber-100 text-amber-700'
    },
    ARCHIVED: {
      card: 'border-slate-100 bg-slate-50',
      text: 'text-slate-500',
      subtext: 'text-slate-400',
      muted: 'text-slate-400',
      badge: 'bg-slate-200 text-slate-600'
    }
  } as const;

  const s = stateStyles[status];

  // 🎯 SMART BANNERS
  const banner =
    status === 'ARCHIVED'
      ? {
          text: 'This project was archived due to prolonged inactivity.',
          style: 'bg-slate-100 text-slate-600 border-slate-200'
        }
      : status === 'INACTIVE'
      ? {
          text: `This project needs attention — Inactive for ${daysAgo} days with ${openBugs.length} neglected issue(s).`,
          style: 'bg-amber-50 text-amber-700 border-amber-200'
        }
      : null;

  return (
    <div className={`
      group relative rounded-2xl border p-6 shadow-sm
      transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg
      ${s.card}
      ${status === 'ARCHIVED' ? 'opacity-90' : ''}
    `}>

      {/* 🔔 BANNER */}
      {banner && (
        <div className={`
          mb-4 flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium
          ${banner.style}
        `}>
          <span className="h-2 w-2 rounded-full bg-current opacity-60" />
          {banner.text}
        </div>
      )}

      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">

        <div className="min-w-0">

          {/* TITLE + STATUS */}
          <div className="flex items-center gap-2">
            <h2 className={`text-base font-semibold tracking-tight ${s.text}`}>
              {project.name}
            </h2>

            <span className={`
              inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium
              ${s.badge}
            `}>
              {status}
            </span>
          </div>

          {/* DESCRIPTION */}
          <p className={`mt-2 text-sm line-clamp-2 ${s.subtext}`}>
            {project.description || "No description provided for this project yet."}
          </p>

          {/* META */}
          <div className={`mt-3 flex flex-wrap items-center gap-3 text-xs ${s.muted}`}>

            <div className="flex items-center gap-1">
              <Globe className="h-3.5 w-3.5 text-slate-400" />
              <span className="truncate max-w-[180px]">
                {project.url}
              </span>
            </div>

            <span>•</span>

            <span>Created {createdDate}</span>

            {daysAgo !== null && (
              <>
                <span>•</span>
                <span>
                  {daysAgo === 0 ? "Active today" : `Active ${daysAgo}d ago`}
                </span>
              </>
            )}

          </div>
        </div>

        {/* BUG BADGE */}
        <div className={`
          flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium
          ${status === 'INACTIVE'
            ? 'bg-amber-100 text-amber-800'
            : status === 'ARCHIVED'
            ? 'bg-slate-200 text-slate-600'
            : 'bg-slate-100 text-red-700'}
        `}>
          <Bug className={`
            h-3.5 w-3.5
            ${status === 'INACTIVE'
              ? 'text-amber-600'
              : status === 'ARCHIVED'
              ? 'text-slate-500'
              : 'text-red-600'}
          `} />
          {bugs.length}
        </div>

      </div>

      {/* BUG STATS */}
      <div className={`mt-5 flex gap-4 text-xs ${s.muted}`}>
        <span>{openBugs.length} open</span>
        <span>{resolvedBugs.length} resolved</span>
        <span>{bugs.length} total</span>
      </div>

      {/* ACTIONS */}
      <div className="
        mt-5 flex items-center justify-between
        border-t border-slate-100 pt-4
      ">

        <Link
          href={`/dashboard/project/${project.id}`}
          className={`
            text-sm font-medium transition
            ${status === 'ARCHIVED'
              ? 'text-slate-400 hover:text-slate-500'
              : 'text-blue-600 hover:text-blue-800'}
          `}
        >
          View project →
        </Link>

        <button
          onClick={() => setEditingProject?.(project)}
          className={`
            inline-flex items-center gap-1 rounded-lg px-3 py-1.5
            text-sm font-medium transition
            ${status === 'ARCHIVED'
              ? 'bg-slate-200 text-slate-500 hover:bg-slate-300'
              : 'bg-slate-900 text-white hover:bg-slate-800'}
          `}
        >
          <Edit className="h-4 w-4" />
          Edit
        </button>

      </div>
    </div>
  );
}