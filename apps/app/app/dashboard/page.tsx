'use client';

import { useEffect, useState } from 'react';
import AddProjectModal from '@/component/AddProjectModal';
import LogoutBtn from '@/component/LogoutBtn';
import ProjectCard from '@/component/ProjectCard';
import { FullScreenLoader } from '@/component/FullScreenLoader';
import toast from 'react-hot-toast';
import EditProjectModal from '@/component/EditProjectModal';

interface Bug {
  id: number;
  title: string;
  severity: string;
}

interface Project {
  id: number;
  name: string;
  slug: string;
  url: string;
  description?: string;
  bugs?: Bug[];
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch('/api/projects',
          { credentials: 'include' }
        );
        
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

  const handleProjectCreated = (project: Project) => {
    setProjects(prev => [project, ...prev]);
  };

if (loading) {
  return <FullScreenLoader />;
}

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-600 mt-1">Manage your projects and bugs</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Add Project Card */}
          <div
            className="bg-white border-2 border-dashed border-blue-300 rounded-xl shadow-sm p-6 flex flex-col justify-center items-center cursor-pointer hover:border-blue-500 hover:shadow-lg hover:scale-105 transition-all duration-300 group"
            onClick={() => setShowForm(true)}
          >
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
              <span className="text-2xl font-bold text-blue-500">+</span>
            </div>
            <p className="text-slate-700 font-medium text-center">Add New Project</p>
          </div>

          {/* Existing Projects */}
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} setEditingProject={setEditingProject} />
          ))}
        </div>
      </div>

      {showForm && (
        <AddProjectModal
          onClose={() => setShowForm(false)}
          onProjectCreated={handleProjectCreated}
        />
      )}

      {editingProject && (
        <EditProjectModal
          project={editingProject}
          onClose={() => setEditingProject(null)}
          onProjectUpdated={(updated: Project) => {
            setProjects(prev =>
              prev.map(p => p.id === updated.id ? updated : p)
            );
          }}
        />
      )}
    </main>
  );
}
