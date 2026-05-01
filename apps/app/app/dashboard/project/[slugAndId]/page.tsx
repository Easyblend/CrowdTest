'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, AlertCircle, Trash } from 'lucide-react';
import BugReportModal from '@/component/BugReportModal';
import BugCard from '@/component/BugCard';
import { Screenshot } from '@prisma/client';
import toast from 'react-hot-toast';
import { FullScreenLoader } from '@/component/FullScreenLoader';
import BugDetailModal from '@/component/BugDetailModal';
import BugSection from '@/component/BugSection';


interface Bug {
    id: string;
    title: string;
    description: string;
    severity: 'HIGH' | 'MEDIUM' | 'LOW';
    createdAt: string;
    projectId: string;
    createdBy: string;
    resolved: boolean;
    screenshots: Screenshot[];
}

interface Project {
    id: string;
    name: string;
    url: string;
    description?: string;
    createdAt: string;
    bugs: Bug[];
}

interface User {
    id: string;
    role: 'DEV' | 'TESTER' | 'ADMIN';
}

export default function ProjectPage() {
    const { slugAndId } = useParams();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    const [showBugForm, setShowBugForm] = useState(false);
    const router = useRouter();
    const [bugTitle, setBugTitle] = useState('');
    const [bugSeverity, setBugSeverity] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('LOW');
    const [bugDescription, setBugDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const [selectedBug, setSelectedBug] = useState<Bug | null>(null);


    // Load project
    useEffect(() => {
        async function load() {
            try {
                const res = await fetch(`/api/projects/${slugAndId}`);
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
    }, [slugAndId]);

    // Load current user
    useEffect(() => {
        async function loadUser() {
            try {
                const res = await fetch('/api/me'); // /api/me returning { id, role }
                if (!res.ok) throw new Error('Failed to fetch user');
                const data: User = await res.json();
                console.log('Fetched user:', data);
                setUser(data);
            } catch (err) {
                toast.error("This didn't work.")
            }
        }
        loadUser();
    }, []);

    const handleDeleteBug = async (bugId: string): Promise<void> => {
        const res = await fetch(`/api/bugs/${bugId}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed");

        setProject(prev => prev ? {
            ...prev,
            bugs: prev.bugs.filter(b => b.id !== bugId)
        } : prev);
    };

    const handleDeleteProject = async (): Promise<void> => {
        try {
            const res = await fetch(`/api/projects/${slugAndId}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete project");
            toast.success("Project deleted");
            router.push('/dashboard');
        } catch (error) {
            toast.error("Failed to delete project");
        }
    }

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

            const res = await fetch(`/api/projects/${slugAndId}/bugs`, {
                method: 'POST',
                body: form,
            });

            if (!res.ok) throw new Error('Failed to submit bug');
            const newBug: Bug = await res.json();
            setProject(prev => prev ? { ...prev, bugs: [newBug, ...prev.bugs] } : prev);
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

    const unresolvedBugs = project.bugs
        .filter(b => !b.resolved)
        .map(b => ({ ...b, screenshots: b.screenshots ?? [] }));

    const handleResolveBug = (bugId: string) => {
        setProject(prev => {
            if (!prev) return prev;

            return {
                ...prev,
                bugs: prev.bugs.map(b =>
                    b.id === bugId ? { ...b, resolved: true } : b
                ),
            };
        });
    };

    const handleUnResolveBug = (bugId: string) => {
        setProject(prev => {
            if (!prev) return prev;

            return {
                ...prev,
                bugs: prev.bugs.map(b =>
                    b.id === bugId ? { ...b, resolved: false } : b
                ),
            };
        });
    };

    return (
        <main className="h-max min-h-screen bg-linear-to-br from-slate-50 via-slate-50 to-blue-50 p-6 md:p-5">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 wrap-break-word">
                            {project.name}
                        </h1>

                        <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center gap-1"
                        >
                            {project.url}
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/dashboard"
                            className="px-4 py-2 text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </Link>

                        <button
                            onClick={() => {
                                handleDeleteProject()
                            }}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-2 shadow-sm"
                        >
                            <Trash className="w-4 h-4" />
                            Delete
                        </button>
                    </div>
                </div>

                {/* Project Overview */}
                <div className="grid gap-6 lg:grid-cols-[1.8fr_0.95fr] mb-8">
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                            <div>
                                <h2 className="text-xl font-semibold text-slate-900">Project overview</h2>
                                <p className="text-sm text-slate-500 mt-1">
                                    A quick summary and timeline for this project.
                                </p>
                            </div>
                            <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-700 px-3 py-1 text-xs font-medium">
                                Created {new Date(project.createdAt).toLocaleDateString(undefined, {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                })} • {new Date(project.createdAt).toLocaleTimeString(undefined, {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                        </div>

                        <p className="text-slate-700 text-md leading-relaxed min-h-[120px]">
                            {project.description ?? "No description has been added for this project yet. Use the bug report form below to share issues and help improve the experience."}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition">
                            <h3 className="text-lg font-semibold text-slate-900 mb-3">Project stats</h3>
                            <div className="grid gap-3">
                                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                                    <span className="text-sm text-slate-600">Open bugs</span>
                                    <span className="text-sm font-semibold text-slate-900">{unresolvedBugs.length}</span>
                                </div>
                                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                                    <span className="text-sm text-slate-600">Resolved bugs</span>
                                    <span className="text-sm font-semibold text-slate-900">{project.bugs.filter(b => b.resolved).length}</span>
                                </div>
                                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                                    <span className="text-sm text-slate-600">Total reports</span>
                                    <span className="text-sm font-semibold text-slate-900">{project.bugs.length}</span>
                                </div>
                            </div>
                        </div>

                        {(user?.role === 'TESTER' || user?.role === 'ADMIN') && (
                            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition">
                                <p className="text-slate-700 text-sm mb-4">
                                    Share new issues or improvements with the team.
                                </p>
                                <button
                                    onClick={() => setShowBugForm(!showBugForm)}
                                    className="w-full px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition font-medium"
                                >
                                    {showBugForm ? 'Cancel' : 'Report a bug'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bug Form */}
                {showBugForm && (
                    <BugReportModal
                        onClose={() => setShowBugForm(false)}
                        onSubmit={handleSubmitBug}
                    />

                )}

                {/* Bugs Section */}

                <BugSection
                    title="Bug Reports"
                    bugs={unresolvedBugs}
                    emptyMessage="No bugs reported yet"
                    emptySubMessage="Keep up the great work! 🎉"
                    onBugClick={setSelectedBug}
                    onDelete={handleDeleteBug}
                    badgeColor="blue"
                />

                <BugSection
                    title="Resolved Bugs"
                    bugs={project.bugs.filter(b => b.resolved)}
                    emptyMessage="No resolved bugs yet"
                    emptySubMessage="Keep pushing forward! 🛠️"
                    onBugClick={setSelectedBug}
                    onDelete={handleDeleteBug}
                    badgeColor="green"
                />
                {selectedBug && (
                    <BugDetailModal
                        bug={selectedBug}
                        onClose={() => setSelectedBug(null)}
                        onResolved={handleResolveBug}
                        onUnResolved={handleUnResolveBug}
                    />
                )}
            </div>
        </main>
    );
}
