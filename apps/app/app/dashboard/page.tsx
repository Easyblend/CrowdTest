'use client';

import { useEffect, useMemo, useState } from 'react';
import AddProjectModal from '@/component/AddProjectModal';
import EditProjectModal from '@/component/EditProjectModal';
import { FullScreenLoader } from '@/component/FullScreenLoader';
import toast from 'react-hot-toast';
import { Plus, ArrowDown } from 'lucide-react';
import ProjectCard from '@/component/ProjectCard';

interface Bug {
  id: string;
  title: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'OPEN' | 'RESOLVED';
  createdAt?: string;
}

interface Project {
  id: string;
  name: string;
  slug: string;
  url: string;
  description?: string;
  bugs?: Bug[];
  createdAt: string;
  updatedAt?: string;
}

function severityClasses(sev: Bug['severity']) {
  switch (sev) {
    case 'HIGH': return 'bg-blue-600 text-white';
    case 'MEDIUM': return 'bg-blue-50 text-blue-600 ring-1 ring-blue-200';
    case 'LOW': return 'bg-slate-100 text-slate-500 ring-1 ring-slate-200';
  }
}

function timeAgo(iso?: string) {
  if (!iso) return '—';
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/projects', { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to fetch projects');
        setProjects(await res.json());
      } catch (err) {
        toast.error((err as Error).message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const stats = useMemo(() => {
    const allBugs = projects.flatMap(p => p.bugs ?? []);
    const open = allBugs.filter(b => b.status === 'OPEN').length;
    const resolved = allBugs.filter(b => b.status === 'RESOLVED').length;
    const sevScore = { LOW: 1, MEDIUM: 2, HIGH: 3 } as const;
    const avg = allBugs.length
      ? (allBugs.reduce((s, b) => s + sevScore[b.severity], 0) / allBugs.length).toFixed(1)
      : '0.0';
    return [
      { label: 'Active Projects', value: String(projects.length) },
      { label: 'Open Bugs', value: String(open) },
      { label: 'Resolved', value: String(resolved) },
      { label: 'Avg Severity', value: avg },
    ];
  }, [projects]);

  const recentBugs = useMemo(() => {
    return projects
      .flatMap(p => (p.bugs ?? []).map(b => ({ ...b, project: p.name })))
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 8);
  }, [projects]);

  if (loading) return <FullScreenLoader />;

  return (
    <div className="flex flex-col min-h-full bg-[#fafbfc] text-slate-900 font-[Work_Sans,system-ui,sans-serif]">
      {/* Header */}
      <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 md:px-8">
        <h1 className="font-mono text-sm font-semibold tracking-widest uppercase">
          Operations Dashboard
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md text-xs font-semibold hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="size-3.5" strokeWidth={2.5} />
          New Project
        </button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 border-b border-slate-200 bg-white">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`p-6 md:p-8 ${i < stats.length - 1 ? 'lg:border-r border-slate-200' : ''} ${i < 2 ? 'border-b lg:border-b-0' : ''} ${i === 0 || i === 2 ? 'border-r' : ''}`}
          >
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter mb-2">
              {s.label}
            </p>
            <p className="text-3xl font-mono font-semibold">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Split */}
      <div className="flex flex-1 min-h-0 flex-col lg:flex-row">
        {/* Projects */}
        <section className="lg:w-3/5 overflow-y-auto border-b lg:border-b-0 lg:border-r border-dashed border-slate-200 p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-mono text-xs font-semibold text-slate-500 uppercase tracking-widest">
              Active Repositories
            </h2>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-blue-600">
              Sorted by activity <ArrowDown className="size-3" />
            </span>
          </div>

          <div className="space-y-3">
            {/* Add card */}
            <button
              onClick={() => setShowForm(true)}
              className="w-full p-5 border border-dashed border-slate-300 rounded-lg bg-white hover:border-blue-400 hover:bg-blue-50/30 transition-colors text-left flex items-center gap-3"
            >
              <div className="size-10 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
                <Plus className="size-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">Add new project</p>
                <p className="text-xs text-slate-500 font-mono mt-0.5">Start tracking bugs</p>
              </div>
            </button>

            {projects.map(p => {
              return (
                <ProjectCard key={p.id} project={p} setEditingProject={setEditingProject} />
              );
            })}
          </div>
        </section>

        {/* Live bug feed */}
        <section className="lg:w-2/5 overflow-y-auto bg-slate-50/60 p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="size-2 rounded-full bg-blue-600 animate-pulse" />
            <h2 className="font-mono text-xs font-semibold text-slate-500 uppercase tracking-widest">
              Live Bug Feed
            </h2>
          </div>

          {recentBugs.length === 0 ? (
            <p className="text-xs text-slate-500 font-mono">No bugs reported yet.</p>
          ) : (
            <div>
              {recentBugs.map((b, i) => {
                const isLast = i === recentBugs.length - 1;
                return (
                  <div key={b.id} className="flex gap-4">
                    <div className="flex flex-col items-center gap-2">
                      <div className={`size-2 rounded-full border-2 ${i === 0 ? 'border-blue-600' : 'border-slate-200'}`} />
                      {!isLast && <div className="w-px flex-1 bg-slate-200" />}
                    </div>
                    <div className={isLast ? '' : 'pb-6'}>
                      <p className="text-[10px] font-mono text-slate-500 mb-1">{timeAgo(b.createdAt)}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 text-[9px] font-mono tracking-tighter font-semibold ${severityClasses(b.severity)}`}>
                          {b.severity}
                        </span>
                        <span className="text-xs font-semibold">{(b as any).project}</span>
                      </div>
                      <p className="text-xs font-medium text-slate-700 leading-relaxed">{b.title}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {showForm && (
        <AddProjectModal
          onClose={() => setShowForm(false)}
          onProjectCreated={(project: Project) => setProjects(prev => [project, ...prev])}
        />
      )}
      {editingProject && (
        <EditProjectModal
          project={editingProject}
          onClose={() => setEditingProject(null)}
          onProjectUpdated={(updated: Project) =>
            setProjects(prev => prev.map(p => (p.id === updated.id ? updated : p)))
          }
        />
      )}
    </div>
  );
}
