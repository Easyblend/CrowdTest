import { Screenshot } from '@prisma/client';
import { AlertCircle } from 'lucide-react';
import React from 'react'
import BugCard from './BugCard';

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

interface BugSectionProps {
    title: string;
    bugs: Bug[];
    emptyMessage: string;
    emptySubMessage: string;
    onBugClick: (bug: Bug) => void;
    onDelete: (bugId: string) => void;
    badgeColor: string;
}

function BugSection({ title, bugs, emptyMessage, emptySubMessage, onBugClick, onDelete, badgeColor }: BugSectionProps) {
    return (
        <section className="mt-8">
            <div className="flex items-center gap-3 mb-8">
                <h2 className="text-3xl font-bold text-slate-900">{title}</h2>
                <span className={`bg-${badgeColor}-100 text-${badgeColor}-700 px-3 py-1 rounded-full text-sm font-semibold`}>
                    {bugs.length}
                </span>
            </div>

            {bugs.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-xl p-12 text-center">
                    <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 text-lg">{emptyMessage}</p>
                    <p className="text-slate-400 text-sm mt-1">{emptySubMessage}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {bugs.map(bug => (
                        <div key={bug.id} onClick={() => onBugClick(bug)} className="cursor-pointer">
                            <BugCard bug={bug} onDelete={onDelete} />
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

export default BugSection;