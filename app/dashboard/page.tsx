'use client';

import { useEffect, useState } from 'react';
import AddProjectModal from '../component/AddProjectModal';
import LogoutBtn from '../component/LogoutBtn';

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

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch('/api/projects');
        if (!res.ok) throw new Error('Failed to fetch projects');
        const data: Project[] = await res.json();
        setProjects(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  const handleProjectCreated = (project: Project) => {
    setProjects([project, ...projects]);
  };

  if (loading) return <p className="p-4 text-center text-gray-500">Loading projects...</p>;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-600 mt-1">Manage your projects and bugs</p>
          </div>
          <LogoutBtn />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Add Project Card */}
          <div
            className="bg-white border-2 border-dashed border-blue-300 rounded-xl shadow-sm p-6 flex flex-col justify-center items-center cursor-pointer hover:border-blue-500 hover:shadow-md transition-all duration-200"
            onClick={() => setShowForm(true)}
          >
            <p className="text-4xl font-bold text-blue-500 mb-2">+</p>
            <p className="text-slate-700 font-medium text-center">Add New Project</p>
          </div>

          {/* Existing Projects */}
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-lg hover:border-slate-300 transition-all duration-200">
              <h2 className="text-lg font-semibold text-slate-900 mb-2">{project.name}</h2>
              {project.description && <p className="text-slate-600 text-sm mb-3">{project.description}</p>}
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-medium text-sm mb-4 block hover:underline"
              >
                Visit Project →
              </a>
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <span className="text-slate-600 text-sm font-medium">Bugs reported:</span>
                <span className="inline-flex items-center justify-center bg-red-50 text-red-700 font-semibold rounded-full w-8 h-8">
                  {project.bugs.length}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showForm && (
        <AddProjectModal
          onClose={() => setShowForm(false)}
          onProjectCreated={handleProjectCreated}
        />
      )}
    </main>
  );
}
