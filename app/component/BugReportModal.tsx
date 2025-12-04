'use client';

import { useState } from 'react';

interface BugReportModalProps {
    onClose: () => void;
    onSubmit: (title: string, description: string, severity: 'LOW' | 'MEDIUM' | 'HIGH') => void;
}

export default function BugReportModal({ onClose, onSubmit }: BugReportModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [severity, setSeverity] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('LOW');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!title || !severity) return;
        setSubmitting(true);
        await onSubmit(title, description, severity);
        setSubmitting(false);
        setTitle('');
        setDescription('');
        setSeverity('LOW');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl max-w-md w-full shadow-lg">
                <h3 className="text-2xl font-semibold mb-6 text-gray-800">Report a Bug</h3>
                <input
                    type="text"
                    placeholder="Bug title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full mb-4 p-3 border border-gray-300 rounded bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <textarea
                    placeholder="Bug description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full mb-4 p-3 border border-gray-300 rounded bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 min-h-24"
                />
                <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as 'LOW' | 'MEDIUM' | 'HIGH')}
                    className="w-full mb-6 p-3 border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                </select>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition font-medium disabled:opacity-50"
                    >
                        {submitting ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </div>
        </div>
    );
}
