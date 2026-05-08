'use client';

import { useState, useEffect } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface Screenshot {
    id: string;
    url: string;
}

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

interface BugDetailModalProps {
    bug: Bug;
    onClose: () => void;
    onStatusChange: (bugId: string, status: Bug['status']) => void;
}

export default function BugDetailModal({
    bug,
    onClose,
    onStatusChange
}: BugDetailModalProps) {

    const [zoomedImage, setZoomedImage] = useState<string | null>(null);
    const [currentStatus, setCurrentStatus] = useState(bug.status);
    const [open, setOpen] = useState(false);

    const statuses: Bug['status'][] = [
        'OPEN',
        'IN_PROGRESS',
        'RESOLVED',
        'CLOSED'
    ];

    const statusStyles: Record<Bug['status'], string> = {
        OPEN: "bg-red-100 text-red-700 border-red-200",
        IN_PROGRESS: "bg-blue-100 text-blue-700 border-blue-200",
        RESOLVED: "bg-green-100 text-green-700 border-green-200",
        CLOSED: "bg-gray-200 text-gray-700 border-gray-300",
    };

    const updateStatus = async (status: Bug['status']) => {
        try {
            const response = await fetch(`/api/bugs/${bug.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status }),
            });

            if (!response.ok) throw new Error();

            setCurrentStatus(status); // 👈 update UI immediately

            setCurrentStatus(status);

            // ALWAYS notify parent
            onStatusChange?.(bug.id, status);
        } catch (error) {
            toast.error('Something went wrong. Please try again.');
        }
    };

    useEffect(() => {
        setCurrentStatus(bug.status);
    }, [bug.status]);

    return (
        <>
            {/* MODAL BACKDROP */}
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

                <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full min-h-[45vh] max-h-[90vh] overflow-y-auto p-6 relative flex flex-col">

                    {/* CLOSE */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
                    >
                        <X size={20} />
                    </button>

                    {/* TITLE */}
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                        {bug.title}
                    </h2>

                    {/* DESCRIPTION */}
                    <p className="text-gray-600 mb-4">
                        {bug.description}
                    </p>

                    {/* META */}
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
                    {/* STATUS DROPDOWN */}
                    <div className="mb-5 relative text-gray-900">

                        <span className="text-xs text-gray-500 block mb-1">
                            Status
                        </span>

                        {/* TRIGGER */}
                        <button
                            onClick={() => setOpen(!open)}
                            className={`w-full sm:w-auto inline-flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-xs font-semibold border transition
                            ${statusStyles[currentStatus]} hover:shadow-sm`}
                        >
                            <span className="capitalize">
                                {currentStatus.replace('_', ' ').toLowerCase()}
                            </span>

                            <ChevronDown
                                size={14}
                                className={`transition-transform ${open ? 'rotate-180' : ''}`}
                            />
                        </button>

                        {/* BACKDROP */}
                        {open && (
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setOpen(false)}
                            />
                        )}

                        {/* DROPDOWN */}
                        {open && (
                            <div className="absolute left-0 mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">

                                {statuses.map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => {
                                            setOpen(false);
                                            updateStatus(status);
                                        }}
                                        className={`w-full flex items-center justify-between px-3 py-2 text-sm transition hover:bg-gray-50
                    ${status === currentStatus ? 'bg-gray-50 font-medium' : ''}`}
                                    >
                                        <span className="capitalize">
                                            {status.replace('_', ' ').toLowerCase()}
                                        </span>

                                        {currentStatus === status && (
                                            <Check size={14} className="text-green-600" />
                                        )}
                                    </button>
                                ))}

                            </div>
                        )}
                    </div>


                    {/* SCREENSHOTS */}
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

                    {/* CLOSE BUTTON */}
                    <div className="flex justify-end mt-auto pt-4">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>

            {/* IMAGE ZOOM */}
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