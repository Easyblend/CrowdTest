'use client';

import { Trash2 } from 'lucide-react';
import { FC, useState } from 'react';
import DeleteBugModal from './DeleteBugModal';

interface Bug {
    id: string;
    title: string;
    description: string;
    severity: 'HIGH' | 'MEDIUM' | 'LOW';
    createdAt: string;
}

interface BugCardProps {
    bug: Bug;
    onDelete: (id: string) => void;
}

const BugCard: FC<BugCardProps> = ({ bug, onDelete }) => {

    const [open, setOpen] = useState(false);

    const severityStyles = {
        HIGH: 'bg-red-100 text-red-700',
        MEDIUM: 'bg-yellow-100 text-yellow-700',
        LOW: 'bg-green-100 text-green-700',
    };

    return (
        <div className="bg-white border border-slate-200 rounded-lg p-5 hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer">
            <div className="flex justify-between items-start gap-3 mb-3">
                <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-slate-900 truncate hover:text-blue-600 transition">
                        {bug.title}
                    </h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${severityStyles[bug.severity]}`}
                    >
                        {bug.severity}
                    </span>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setOpen(true);
                        }}
                        className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded transition-colors"
                        aria-label="Delete bug"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            <p className="text-slate-600 text-sm mb-3 line-clamp-2 leading-relaxed">
                {bug.description}
            </p>

            <div className="flex items-center text-xs text-slate-500 border-t border-slate-100 pt-3">
                <span>📅</span>
                <span className="ml-1.5">
                    {new Date(bug.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                    })}
                </span>
            </div>

            <DeleteBugModal
                open={open}
                onClose={() => setOpen(false)}
                bugId={bug.id}
                onDelete={onDelete}
            />
        </div>
    );
};

export default BugCard;
