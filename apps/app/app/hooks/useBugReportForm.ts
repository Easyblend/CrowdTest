'use client';

import { useState, ChangeEvent } from 'react';
import toast from 'react-hot-toast';

export type Severity = 'LOW' | 'MEDIUM' | 'HIGH';

export type BugSubmitFn = (
    title: string,
    description: string,
    severity: Severity,
    bugImage?: File
) => Promise<String | void>;

interface UseBugReportFormArgs {
    onSubmit: BugSubmitFn;
}

const SEVERITY_CLASSES: Record<Severity, string> = {
    LOW: 'border-l-4 border-green-500 bg-green-50',
    MEDIUM: 'border-l-4 border-yellow-500 bg-yellow-50',
    HIGH: 'border-l-4 border-red-500 bg-red-50',
};

/**
 * Holds all state + behavior for the bug report form.
 * The component using it only renders JSX.
 */
export function useBugReportForm({ onSubmit }: UseBugReportFormArgs) {
    const [improving, setImproving] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [severity, setSeverity] = useState<Severity>('LOW');
    const [bugImage, setBugImage] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setSeverity('LOW');
        setBugImage(null);
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        setBugImage(e.target.files?.[0] || null);
    };

    const handleSubmit = async () => {
        if (!title) return;

        if (!description) {
            toast("No description provided. It's recommended to add details.", {
                icon: '⚠️',
            });
        }

        setSubmitting(true);
        try {
            await onSubmit(title, description, severity, bugImage || undefined);
            resetForm();
        } catch (err) {
            // parent already showed a toast for the failure
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleImproveWithAI = async () => {
        if (!title && !description) {
            toast.error('Nothing to improve');
            return;
        }

        setImproving(true);

        try {
            const res = await fetch('/api/ai/improve-bug', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    description,
                }),
            });

            if (!res.ok) {
                throw new Error('AI request failed');
            }

            const data = await res.json();

            if (data?.title) setTitle(data.title);
            if (data?.description) setDescription(data.description);

            toast.success('Bug report improved ✨');
        } catch (err) {
            console.error(err);
            toast.error('Failed to improve bug report');
        } finally {
            setImproving(false);
        }
    };

    const canSubmit = Boolean(title) && !submitting;

    return {
        // state
        title,
        description,
        improving,
        severity,
        bugImage,
        submitting,

        // setters & handlers
        setTitle,
        setDescription,
        setSeverity,
        handleImageChange,
        handleSubmit,
        handleImproveWithAI,
        // derived helpers
        canSubmit,
        severityClasses: SEVERITY_CLASSES,
    };
}
