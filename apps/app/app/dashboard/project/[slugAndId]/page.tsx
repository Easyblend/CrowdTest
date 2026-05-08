'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, AlertCircle, Trash } from 'lucide-react';
import BugReportModal from '@/component/BugReportModal';
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
    status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
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
    const [selectedBug, setSelectedBug] = useState<Bug | null>(null);

    // Load project
    useEffect(() => {
        async function load() {
            try {
                const res = await fetch(`/api/projects/${slugAndId}`);
                if (!res.ok) throw new Error('Failed to fetch project');
                const data = await res.json();
                setProject(data);
            } catch {
                toast.error("Could not load project.");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [slugAndId]);

    // Load user
    useEffect(() => {
        async function loadUser() {
            try {
                const res = await fetch('/api/me');
                if (!res.ok) throw new Error('Failed to fetch user');
                const data: User = await res.json();
                setUser(data);
            } catch {
                toast.error("This didn't work.");
            }
        }
        loadUser();
    }, []);

    const handleDeleteBug = async (bugId: string): Promise<void> => {
        const res = await fetch(`/api/bugs/${bugId}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed");

        setProject(prev =>
            prev
                ? { ...prev, bugs: prev.bugs.filter(b => b.id !== bugId) }
                : prev
        );
    };

    const handleDeleteProject = async (): Promise<void> => {
        try {
            const res = await fetch(`/api/projects/${slugAndId}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed");
            toast.success("Project deleted");
            router.push('/dashboard');
        } catch {
            toast.error("Failed to delete project");
        }
    };

    const handleSubmitBug = async (
        title: string,
        description: string,
        severity: "LOW" | "MEDIUM" | "HIGH",
        bugImage?: File
    ) => {
        try {
            const form = new FormData();
            form.append("title", title);
            form.append("description", description);
            form.append("severity", severity);

            if (bugImage) form.append("screenshot", bugImage);

            const res = await fetch(`/api/projects/${slugAndId}/bugs`, {
                method: "POST",
                body: form,
            });

            if (!res.ok) {
                const err = await res.json().catch(() => null);
                throw new Error(err?.error || "Failed to submit bug");
            }

            const newBug = await res.json();

            setProject(prev =>
                prev ? { ...prev, bugs: [newBug, ...prev.bugs] } : prev
            );

            setShowBugForm(false);
            toast.success("Bug successfully reported");
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to submit bug");
            throw err;
        }
    };

    // ✅ NEW: status-based filtering
    const openBugs = project?.bugs
        .filter(b => b.status !== 'RESOLVED' && b.status !== 'CLOSED')
        .map(b => ({ ...b, screenshots: b.screenshots ?? [] })) || [];

    const resolvedBugs = project?.bugs
        .filter(b => b.status === 'RESOLVED')
        .map(b => ({ ...b, screenshots: b.screenshots ?? [] })) || [];

    // ✅ status updates
    const handleResolveBug = (bugId: string) => {
        setProject(prev =>
            prev
                ? {
                    ...prev,
                    bugs: prev.bugs.map(b =>
                        b.id === bugId ? { ...b, status: 'RESOLVED' } : b
                    ),
                }
                : prev
        );
    };

    const onStatusChange = (bugId: string, status: Bug['status']) => {
        setProject(prev =>
            prev
                ? {
                    ...prev,
                    bugs: prev.bugs.map(b =>
                        b.id === bugId ? { ...b, status } : b
                    ),
                }
                : prev
        );
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

    return (
        <main className="h-max min-h-screen bg-linear-to-br from-slate-50 via-slate-50 to-blue-50 p-6 md:p-5">
            <div className="max-w-6xl mx-auto">

                {/* HEADER (unchanged) */}
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
                            onClick={handleDeleteProject}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-2 shadow-sm"
                        >
                            <Trash className="w-4 h-4" />
                            Delete
                        </button>
                    </div>
                </div>

                {/* BUG FORM */}
                {showBugForm && (
                    <BugReportModal
                        onClose={() => setShowBugForm(false)}
                        onSubmit={handleSubmitBug}
                    />
                )}

                {/* BUG SECTIONS */}
                <BugSection
                    title="Bug Reports"
                    bugs={openBugs}
                    emptyMessage="No bugs reported yet"
                    emptySubMessage="Keep up the great work! 🎉"
                    onBugClick={setSelectedBug}
                    onDelete={handleDeleteBug}
                    badgeColor="blue"
                />

                <BugSection
                    title="Resolved Bugs"
                    bugs={resolvedBugs}
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
                        onStatusChange={onStatusChange}
                    />
                )}

            </div>
        </main>
    );
}