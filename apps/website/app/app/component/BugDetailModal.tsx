'use client';
import { useState } from 'react';
import { X } from 'lucide-react';

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

    return (
        <>
            {/* Main modal */}
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">
                <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-8 relative transition-transform transform hover:scale-105">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors"
                    >
                        <X />
                    </button>
                    <h2 className="text-3xl font-bold mb-3 text-gray-900">{bug.title}</h2>
                    <p className="text-gray-700 mb-5">{bug.description}</p>
                    <p className="font-semibold mb-4 text-gray-800">
                        Severity:{" "}
                        <span
                            className={`ml-1 ${
                                bug.severity === 'HIGH'
                                    ? 'text-red-600'
                                    : bug.severity === 'MEDIUM'
                                    ? 'text-yellow-600'
                                    : 'text-green-600'
                            }`}
                        >
                            {bug.severity}
                        </span>
                    </p>
                    <p className="text-sm text-gray-600 mb-5">
                        Created at: {new Date(bug.createdAt).toLocaleString()}
                    </p>

                    {bug.screenshots && bug.screenshots.length > 0 && (
                        <div className="grid grid-cols-1 gap-4">
                            {bug.screenshots.map((screenshot) => (
                                <img
                                    key={screenshot.id}
                                    src={screenshot.url}
                                    alt="Bug screenshot"
                                    className="rounded-lg border border-gray-300 shadow-md cursor-zoom-in hover:scale-105 transition-transform"
                                    onClick={() => setZoomedImage(screenshot.url)}
                                />
                            ))}
                        </div>
                    )}
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
