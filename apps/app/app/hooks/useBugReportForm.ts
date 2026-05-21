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

    const canSubmit = Boolean(title) && !submitting;

    return {
        // state
        title,
        description,
        severity,
        bugImage,
        submitting,

        // setters & handlers
        setTitle,
        setDescription,
        setSeverity,
        handleImageChange,
        handleSubmit,

        // derived helpers
        canSubmit,
        severityClasses: SEVERITY_CLASSES,
    };
}
