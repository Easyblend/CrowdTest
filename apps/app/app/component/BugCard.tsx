'use client';

import { FC } from 'react';

interface Bug {
    id: number;
    title: string;
    description: string;
    severity: 'HIGH' | 'MEDIUM' | 'LOW';
    createdAt: string;
}

interface BugCardProps {
    bug: Bug;
}

const BugCard: FC<BugCardProps> = ({ bug }) => {
    const severityStyles = {
        HIGH: 'bg-red-100 text-red-700',
        MEDIUM: 'bg-yellow-100 text-yellow-700',
        LOW: 'bg-green-100 text-green-700',
    };

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-slate-300 transition duration-200">
            <div className="flex justify-between items-start gap-3 mb-4">
                <h3 className="text-lg font-semibold text-slate-900 flex-1">{bug.title}</h3>
                <span
                    className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${severityStyles[bug.severity]}`}
                >
                    {bug.severity}
                </span>
            </div>

            <p className="text-slate-600 text-sm mb-4 leading-relaxed">{bug.description}</p>

            <p className="text-xs text-slate-500 border-t border-slate-100 pt-3">
                📅 {new Date(bug.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                })}
            </p>
        </div>
    );
};

export default BugCard;
