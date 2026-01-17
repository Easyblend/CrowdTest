import { prisma } from '@/app/lib/prisma';
import ProjectCard from '../component/ProjectCard';
import { redirect } from 'next/navigation';


interface Bug {
  id: number;
  title: string;
  severity: string;
}

interface Project {
  id: number;
  name: string;
  url: string;
  description: string | null;
  bugs: Bug[];
}

export default async function AdminDashboard() {
    redirect("/");
    const projectsFromDb: Project[] = await prisma.project.findMany({
        include: { bugs: true },
    });

    const projects = projectsFromDb.map(project => ({
        ...project,
        description: project.description ?? undefined,
    }));

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 to-slate-800 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
                <p className="text-slate-400 mb-8">Manage your projects and bugs</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map(project => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            </div>
        </div>
    );
}
