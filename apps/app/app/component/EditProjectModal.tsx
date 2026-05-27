'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface Project {
  id: string;
  name: string;
  slug: string;
  url: string;
  description?: string;
  createdAt: string;
}

interface EditProjectModalProps {
  project: Project;
  onClose: () => void;
  onProjectUpdated: (project: Project) => void;
}

export default function EditProjectModal({ onClose, onProjectUpdated, project }: EditProjectModalProps) {
  const [formData, setFormData] = useState({
    name: project.name,
    url: project.url,
    description: project.description || '',
  });
  const [saving, setSaving] = useState(false);
  const [improving, setImproving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to update project');

      const updatedProject = await res.json();
      onProjectUpdated(updatedProject);
      toast.success('Project updated successfully');
      onClose();
    } catch (err) {
      toast.error((err as Error).message || 'An error occurred while updating the project');
    } finally {
      setSaving(false);
    }
  };

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

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">Edit Project</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Project Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project URL</label>
            <input
              type="text"
              name="url"
              value={formData.url}
              onChange={handleChange}
              className="w-full border border-gray-300 text-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {/* AI BUTTON */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleImproveWithAI}
              disabled={
                improving ||
                saving ||
                !formData.url.trim()
              }
              className="px-3 py-2 text-sm font-semibold rounded-md bg-linear-to-r from-purple-500 to-blue-500 text-white hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {improving
                ? 'Analyzing...'
                : '✨ Generate with AI'}
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
