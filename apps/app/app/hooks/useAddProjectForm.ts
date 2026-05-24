// /hooks/useAddProjectForm.ts

'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

interface UseAddProjectFormProps {
    onClose: () => void;
    onProjectCreated: (project: any) => void;
}

export function useAddProjectForm({
    onClose,
    onProjectCreated,
}: UseAddProjectFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        url: '',
        description: '',
    });

    const [saving, setSaving] = useState(false);
    const [improving, setImproving] = useState(false);

    // -----------------------------------
    // HANDLE INPUT CHANGE
    // -----------------------------------
    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement
        >
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // -----------------------------------
    // CREATE PROJECT
    // -----------------------------------
    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        setSaving(true);

        try {
            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const err = await res.json().catch(() => null);
                throw new Error(err?.error || 'Failed to create project');
            }

            const newProject = await res.json();

            onProjectCreated(newProject);

            setFormData({
                name: '',
                url: '',
                description: '',
            });

            toast.success('Project created');

            onClose();
        } catch (err) {
            toast.error(
                (err as Error).message ||
                'Failed to create project'
            );
        } finally {
            setSaving(false);
        }
    };

    // -----------------------------------
    // AI IMPROVE
    // -----------------------------------
    const handleImproveWithAI = async () => {
        if (!formData.url.trim()) {
            toast.error(
                'Enter a project URL first'
            );
            return;
        }

        try {
            setImproving(true);

            const res = await fetch(
                '/api/ai/improve-project',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type':
                            'application/json',
                    },
                    body: JSON.stringify({
                        url: formData.url,
                    }),
                }
            );

            if (!res.ok) {
                const err = await res.json().catch(() => null);
                throw new Error(err?.error || 'Failed to improve project');
            }

            const data = await res.json();

            setFormData((prev) => ({
                ...prev,
                name: data.name || prev.name,
                description:
                    data.description ||
                    prev.description,
            }));

            toast.success(
                'Project details generated'
            );
        } catch (err) {
            toast.error(
                (err as Error).message ||
                'AI generation failed'
            );
        } finally {
            setImproving(false);
        }
    };

    return {
        formData,
        saving,
        improving,

        handleChange,
        handleSubmit,
        handleImproveWithAI,
    };
}