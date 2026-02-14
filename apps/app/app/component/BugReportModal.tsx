'use client';

import { useState } from 'react';

interface BugReportModalProps {
    onClose: () => void;
    onSubmit: (title: string, description: string, severity: 'LOW' | 'MEDIUM' | 'HIGH', bugImage?: BlobPart) => Promise<void>;
}

export default function BugReportModal({ onClose, onSubmit }: BugReportModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [severity, setSeverity] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('LOW');
    const [submitting, setSubmitting] = useState(false);
    const [bugImage, setBugImage] = useState<File | null>(null);

    const handleSubmit = async () => {
        if (!title || !severity) return;
        setSubmitting(true);
        await onSubmit(title, description, severity, bugImage || undefined);
        setSubmitting(false);
        setTitle('');
        setDescription('');
        setSeverity('LOW');
    };

    const severityColors = {
        LOW: 'border-l-4 border-green-500 bg-green-50',
        MEDIUM: 'border-l-4 border-yellow-500 bg-yellow-50',
        HIGH: 'border-l-4 border-red-500 bg-red-50',
    };

    return (
        <div className="fixed inset-0 bg-gray-800/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg max-w-md w-full shadow-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-lg">🐞</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">Report a Bug</h3>
                </div>
                
                <input
                    type="text"
                    placeholder="Give it a catchy title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full mb-4 p-3 border-2 border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                />
                
                <textarea
                    placeholder="Describe what went wrong..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full mb-4 p-3 border-2 border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition min-h-24 resize-none"
                />
                
                <div className={`w-full mb-6 p-3 rounded-md ${severityColors[severity]} transition`}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Severity Level</label>
                    <select
                        value={severity}
                        onChange={(e) => setSeverity(e.target.value as 'LOW' | 'MEDIUM' | 'HIGH')}
                        className="w-full p-2 border-2 border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 font-medium cursor-pointer"
                    >
                        <option value="LOW">🟢 Low</option>
                        <option value="MEDIUM">🟡 Medium</option>
                        <option value="HIGH">🔴 High</option>
                    </select>
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Attach Screenshot</label>
                    <input 
                        type="file"
                         accept=".png,.jpg,.jpeg"
                        onChange={(e) => setBugImage(e.target.files?.[0] || null)}
                        className="w-full p-3 border-2 border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition cursor-pointer file:mr-3 file:px-3 file:py-1.5 file:bg-blue-500 file:text-white file:rounded file:border-0 file:font-semibold file:cursor-pointer hover:file:bg-blue-600"
                    />
                    {bugImage && <p className="text-sm text-gray-600 mt-2">📎 {bugImage.name}</p>}
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition font-semibold"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="px-5 py-2.5 bg-blue-500 text-white rounded-md hover:shadow-lg hover:shadow-blue-500/30 transition font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {submitting ? 'Submitting...' : 'Submit Bug'}
                    </button>
                </div>
            </div>
        </div>
    );
}
