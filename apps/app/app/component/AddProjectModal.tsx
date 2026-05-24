'use client';

import { useAddProjectForm } from '@/hooks/useAddProjectForm';

interface AddProjectModalProps {
  onClose: () => void;
  onProjectCreated: (project: any) => void;
}

export default function AddProjectModal({
  onClose,
  onProjectCreated,
}: AddProjectModalProps) {
  const {
    formData,
    saving,
    improving,
    handleChange,
    handleSubmit,
    handleImproveWithAI,
  } = useAddProjectForm({
    onClose,
    onProjectCreated,
  });

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">

        <h2 className="text-3xl font-bold mb-6 text-gray-900">
          Add New Project
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* NAME */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Project Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project URL
            </label>

            <input
              type="url"
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

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Auto generate by clicking Generate with AI"
              className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4">

            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {saving
                ? 'Saving...'
                : 'Create'}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}