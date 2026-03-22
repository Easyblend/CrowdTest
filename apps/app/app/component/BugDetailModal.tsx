'use client';
import { useState } from 'react';
import { Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

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

interface BugDetailModalProps {
    bug: Bug;
    onClose: () => void;
}

export default function BugDetailModal({ bug, onClose }: BugDetailModalProps) {
    const [zoomedImage, setZoomedImage] = useState<string | null>(null);

    const handleResolve = async () => {
        try {
            const response = await fetch(`/api/bugs/${bug.id}`, {
                method: 'PUT',
            });

            if (!response.ok) {
                throw new Error('Failed to resolve bug');
            }

            // Optionally, you can update the UI or refetch data here
            onClose(); // Close the modal after resolving
        } catch (error) {
            toast.error('Error resolving bug. Please try again.')
        }
    };

    return (
        <>
            {/* Main modal */}
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 relative">

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
                    >
                        <X size={20} />
                    </button>

                    {/* Title */}
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                        {bug.title}
                    </h2>

                    {/* Description */}
                    <p className="text-gray-600 mb-4">
                        {bug.description}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center justify-between mb-4 text-sm">
                        <span
                            className={`font-medium ${bug.severity === 'HIGH'
                                    ? 'text-red-600'
                                    : bug.severity === 'MEDIUM'
                                        ? 'text-yellow-600'
                                        : 'text-green-600'
                                }`}
                        >
                            {bug.severity}
                        </span>

                        <span className="text-gray-400">
                            {new Date(bug.createdAt).toLocaleString()}
                        </span>
                    </div>

                    {/* Screenshots */}
                    {bug.screenshots?.length > 0 && (
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            {bug.screenshots.map((screenshot) => (
                                <img
                                    key={screenshot.id}
                                    src={screenshot.url}
                                    alt="Bug screenshot"
                                    className="rounded-lg border cursor-zoom-in hover:opacity-80 transition"
                                    onClick={() => setZoomedImage(screenshot.url)}
                                />
                            ))}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
                        >
                            Close
                        </button>

                        <button
                            onClick={handleResolve}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
                        >
                            <Check size={18} />
                            Mark as resolved
                        </button>
                    </div>

                </div>
            </div>

            {/* Zoomed Image Overlay */}
            {zoomedImage && (
                <div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-60 cursor-zoom-out"
                    onClick={() => setZoomedImage(null)}
                >
                    <img
                        src={zoomedImage}
                        alt="Zoomed screenshot"
                        className="max-h-[90%] max-w-[90%] rounded-lg shadow-lg"
                    />
                </div>
            )}

        </>
    );
}
