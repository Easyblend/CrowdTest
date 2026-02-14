'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, AlertCircle } from 'lucide-react';
import BugReportModal from '@/component/BugReportModal';
import BugCard from '@/component/BugCard';
import toast from 'react-hot-toast';
import { FullScreenLoader } from '@/component/FullScreenLoader';
import BugDetailModal from '@/component/BugDetailModal';

interface Screenshot {
    id: number;
    url: string;
}

interface Bug {
    id: number;
    title: string;
    description: string;
    severity: 'HIGH' | 'MEDIUM' | 'LOW';
    createdAt: string;
    projectId: number;
    createdBy: number;
    screenshots: Screenshot[];
}

interface Project {
    id: number;
    name: string;
    url: string;
    description?: string;
    createdAt: string;
    bugs: Bug[];
}

interface User {
    id: number;
    role: 'DEV' | 'TESTER' | 'ADMIN';
}

export default function ProjectPage() {
    const { id } = useParams();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    const [showBugForm, setShowBugForm] = useState(false);
    const [bugTitle, setBugTitle] = useState('');
    const [bugSeverity, setBugSeverity] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('LOW');
    const [bugDescription, setBugDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const [selectedBug, setSelectedBug] = useState<Bug | null>(null);


    // Load project
    useEffect(() => {
        async function load() {
            try {
                const res = await fetch(`/api/projects/${id}`);
                if (!res.ok) throw new Error('Failed to fetch project');
                const data = await res.json();
                setProject(data);
            } catch (err) {
                toast.error("Could not load project.");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [id]);

    // Load current user
    useEffect(() => {
        async function loadUser() {
            try {
                const res = await fetch('/api/me'); // /api/me returning { id, role }
                if (!res.ok) throw new Error('Failed to fetch user');
                const data: User = await res.json();
                setUser(data);
            } catch (err) {
                toast.error("This didn't work.")
            }
        }
        loadUser();
    }, []);

    const handleDeleteBug = async (bugId: number): Promise<void> => {
        const res = await fetch(`/api/bugs/${bugId}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed");

        setProject(prev => prev ? {
            ...prev,
            bugs: prev.bugs.filter(b => b.id !== bugId)
        } : prev);
    };

    if (loading) return FullScreenLoader();

    if (!project) return (
        <div className="min-h-screen flex flex-col gap-4 items-center justify-center bg-linear-to-br from-slate-50 to-slate-100">
            <AlertCircle className="w-12 h-12 text-red-500" />
            <p className="text-red-600 text-xl font-semibold">Project not found</p>
            <Link href="/dashboard" className="text-blue-600 hover:underline flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Go back
            </Link>
        </div>
    );

    const handleSubmitBug = async (title: string, description: string, severity: 'LOW' | 'MEDIUM' | 'HIGH', bugImage?: BlobPart) => {
        if (!title) {
            toast.error("Please enter a bug title");
            return;
        }
        if (!severity) {
            toast.error("Please select a severity");
            return;
        }

        setSubmitting(true);
        try {
            // optionally attach image if provided
            const form = new FormData();
            form.append("title", title);
            form.append("description", description);
            form.append("severity", severity);

            if (bugImage) {
                form.append("screenshot", new Blob([bugImage]), "bug.png");
            }

            const res = await fetch(`/api/projects/${id}/bugs`, {
                method: 'POST',
                body: form,
            });

            if (!res.ok) throw new Error('Failed to submit bug');
            const newBug: Bug = await res.json();
            setProject({ ...project, bugs: [newBug, ...project.bugs] });
            setShowBugForm(false);
            setBugTitle('');
            setBugSeverity('LOW');
            setBugDescription('');
            toast.success("Bug successfully reported")
        } catch (err) {
            toast.error("An error occurred while submitting the bug.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-linear-to-br from-slate-50 via-slate-50 to-blue-50 p-6 md:p-10">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-start mb-8 gap-4">
                    <div className="flex-1">
                        <h1 className="text-5xl font-bold text-slate-900 mb-3">{project.name}</h1>
                        <div className="flex items-center gap-2">
                            <a
                                href={project.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 hover:underline text-sm md:text-base break-all flex items-center gap-1"
                            >
                                {project.url}
                                <ExternalLink className="w-4 h-4 shrink-0" />
                            </a>
                        </div>
                    </div>

                    <Link
                        href="/dashboard"
                        className="px-4 py-2 text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 shadow-sm transition flex items-center gap-2 whitespace-nowrap"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Link>
                </div>

                {/* Description */}
                {project.description && (
                    <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8 shadow-sm hover:shadow-md transition">
                        <p className="text-slate-700 text-lg leading-relaxed">{project.description}</p>
                        <p className="text-xs text-slate-500 mt-4">
                            Created on {new Date(project.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                )}

                {/* Tester Bug Button */}
                {(user?.role === 'TESTER' || user?.role === 'ADMIN') && (
                    <div className="mb-6">
                        <button
                            onClick={() => setShowBugForm(!showBugForm)}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                        >
                            {showBugForm ? 'Cancel' : 'Report Bug'}
                        </button>
                    </div>
                )}

                {/* Bug Form */}
                {showBugForm && (
                    <BugReportModal
                        onClose={() => setShowBugForm(false)}
                        onSubmit={handleSubmitBug}
                    />

                )}

                {/* Bugs Section */}
                <section>
                    <div className="flex items-center gap-3 mb-8">
                        <h2 className="text-3xl font-bold text-slate-900">Bug Reports</h2>
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                            {project.bugs.length}
                        </span>
                    </div>

                    {project.bugs.length === 0 && (
                        <div className="bg-white border-2 border-dashed border-slate-200 rounded-xl p-12 text-center">
                            <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500 text-lg">No bugs reported yet</p>
                            <p className="text-slate-400 text-sm mt-1">Keep up the great work! 🎉</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {project.bugs.map((bug) => (
                            <div
                                key={bug.id}
                                onClick={() => setSelectedBug(bug)}
                                className="cursor-pointer"
                            >
                                <BugCard bug={bug} onDelete={handleDeleteBug} />
                            </div>
                        ))}

                    </div>

                    {selectedBug && (
                        <BugDetailModal
                            bug={selectedBug}
                            onClose={() => setSelectedBug(null)}
                        />
                    )}

                </section>
            </div>
        </main>
    );
}
