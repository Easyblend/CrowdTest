'use client';

import { useEffect, useState } from 'react';
import ProjectCard from '@/component/ProjectCard';
import { FullScreenLoader } from '@/component/FullScreenLoader';
import toast from 'react-hot-toast';

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

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch projects from the new API
  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch('/api/projects');
        if (!res.ok) throw new Error('Failed to fetch projects');
        const data: Project[] = await res.json();
        setProjects(data);
      } catch (err) {
        toast.error((err as Error).message || 'An error occurred while fetching projects');
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  if (loading) return <FullScreenLoader />;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-slate-400 mb-8">Manage your projects and bugs</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}