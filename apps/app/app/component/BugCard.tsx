'use client';

import { Calendar, Image as ImageIcon, Trash2 } from 'lucide-react';

interface Screenshot {
    id: string;
    url: string;
}

interface Bug {
    id: string;
    title: string;
    description?: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    status: 'OPEN' | 'RESOLVED' | 'IN_PROGRESS' | 'CLOSED';
    createdAt: string;
    screenshots?: Screenshot[];
}

interface BugCardProps {
    bug: Bug;
    onDelete?: (bugId: string) => void;
}

export default function BugCard({ bug, onDelete }: BugCardProps) {
    const createdDate = new Date(bug.createdAt);
    const daysOld = Math.floor(
        (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const severityStyles = {
        LOW: 'bg-green-100 text-green-700',
        MEDIUM: 'bg-amber-100 text-amber-700',
        HIGH: 'bg-red-100 text-red-700',
    };

    const statusStyles = {
        OPEN: 'bg-red-50 text-red-600',
        RESOLVED: 'bg-slate-100 text-slate-600',
        IN_PROGRESS: 'bg-amber-50 text-amber-600',
        CLOSED: 'bg-gray-100 text-gray-600',
    };

    return (
        <div className="
      rounded-2xl border border-slate-200 bg-white
      p-5 shadow-sm transition hover:shadow-md
    ">

            {/* HEADER */}
            <div className="flex items-start justify-between gap-3">

                <div className="min-w-0">

                    <h3 className="text-sm font-semibold text-slate-900">
                        {bug.title}
                    </h3>

                    {/* TAGS */}
                    <div className="mt-2 flex gap-2">
                        <span className={`
                            inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium
                    ${severityStyles[bug.severity]}
                          `}>
                            {bug.severity}
                        </span>

                        <span className={`
        inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium
        ${statusStyles[bug.status]}
      `}>
                            {bug.status}
                        </span>
                    </div>
                </div>

                {/* DELETE ACTION */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete?.(bug.id);
                    }}
                    className="
      text-xs font-medium text-slate-400
      hover:text-red-600 transition
    "
                >
                    <Trash2 className="h-4 w-4" />
                </button>

            </div>

            {/* DESCRIPTION */}
            {bug.description && (
                <p className="mt-3 text-sm text-slate-600 line-clamp-3">
                    {bug.description}
                </p>
            )}

            {/* SCREENSHOTS */}
            {bug.screenshots && bug.screenshots.length > 0 && (
                <div className="mt-4">

                    <div className="mb-2 flex items-center gap-1 text-xs text-slate-500">
                        <ImageIcon className="h-3.5 w-3.5" />
                        Evidence ({bug.screenshots.length})
                    </div>

                    <div className="flex gap-2 overflow-x-auto">
                        {bug.screenshots.map((shot) => (
                            <img
                                key={shot.id}
                                src={shot.url}
                                className="h-16 w-24 rounded-lg object-cover border border-slate-200"
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* META */}
            <div className="mt-4 flex items-center justify-between text-xs text-slate-500">

                <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                        {daysOld === 0 ? 'Today' : `${daysOld}d old`}
                    </span>
                </div>

                <span>
                    {createdDate.toLocaleDateString()}
                </span>

            </div>
        </div>
    );
}