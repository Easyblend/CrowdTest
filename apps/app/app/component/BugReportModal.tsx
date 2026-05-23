'use client';

import { useBugReportForm, Severity, BugSubmitFn } from '@/hooks/useBugReportForm';

interface BugReportModalProps {
    onClose: () => void;
    onSubmit: BugSubmitFn;
}

export default function BugReportModal({ onClose, onSubmit }: BugReportModalProps) {
    const {
        title,
        description,
        severity,
        bugImage,
        submitting,
        setTitle,
        setDescription,
        improving,
        setSeverity,
        handleImageChange,
        handleSubmit,
        canSubmit,
        severityClasses,
        handleImproveWithAI,
    } = useBugReportForm({ onSubmit });

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl max-w-md w-full shadow-xl border border-gray-200 animate-fadeIn">

                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-lg">🐞</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">Report a Bug</h3>
                </div>

                {/* Title */}
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Title <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    placeholder="Give it a catchy title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full mb-4 p-3 border-2 border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                />

                {/* Description */}
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Description <span className="text-gray-400">(optional but recommended)</span>
                </label>
                <textarea
                    placeholder="Describe what went wrong..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full mb-2 p-3 border-2 border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition min-h-24 resize-none"
                />

                {/* Improve with AI */}
                <div className="mb-4 flex justify-end">
                    <button
                        type="button"
                        onClick={handleImproveWithAI}
                        disabled={improving || submitting || (!title.trim() && !description.trim())}
                        className="px-3 py-1.5 text-sm font-semibold rounded-md bg-linear-to-r from-purple-500 to-blue-500 text-white hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed transition"
                    > {improving ? 'Improving…' : '✨ Improve with AI'} </button> </div>

                {/* Severity */}
                <div className={`w-full mb-6 p-3 rounded-md ${severityClasses[severity]} transition`}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Severity Level</label>
                    <select
                        value={severity}
                        onChange={(e) => setSeverity(e.target.value as Severity)}
                        className="w-full p-2 border-2 border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 font-medium cursor-pointer"
                    >
                        <option value="LOW">🟢 Low</option>
                        <option value="MEDIUM">🟡 Medium</option>
                        <option value="HIGH">🔴 High</option>
                    </select>
                </div>

                {/* Screenshot */}
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Attach Screenshot</label>
                    <input
                        type="file"
                        accept=".png,.jpg,.jpeg"
                        onChange={handleImageChange}
                        className="w-full p-3 border-2 border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition cursor-pointer file:mr-3 file:px-3 file:py-1.5 file:bg-blue-500 file:text-white file:rounded file:border-0 file:font-semibold file:cursor-pointer hover:file:bg-blue-600"
                    />
                    {bugImage && <p className="text-sm text-gray-600 mt-2">📎 {bugImage.name}</p>}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition font-semibold"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!canSubmit}
                        className="px-5 py-2.5 bg-blue-500 text-white rounded-md hover:shadow-lg hover:shadow-blue-500/30 transition font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {submitting ? 'Submitting...' : 'Submit Bug'}
                    </button>
                </div>
            </div>
        </div>
    );
}
