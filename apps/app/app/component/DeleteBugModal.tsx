"use client";

import { useState } from "react";
import toast from "react-hot-toast";

interface Props {
  open: boolean;
  onClose: () => void;
  bugId: number;
  onDelete: (id: number) => void;
}

export default function DeleteBugModal({ open, onClose, bugId, onDelete }: Props) {
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function handleDelete(
  e: React.MouseEvent<HTMLButtonElement>
) {
  e.stopPropagation();
  setLoading(true);

  try {
    await onDelete(bugId);     // remove from parent state
    onClose();           // close modal
    toast.success("Bug has been deleted");

  } catch (err) {
    console.error(err);
    toast.error("Failed to delete bug");
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-xl p-6 w-[400px] shadow-xl">
        <h2 className="text-lg font-semibold mb-3 text-red-600">
          Delete Bug
        </h2>

        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to delete this bug?  
          This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={(e)=>{
                e.stopPropagation()
                onClose()
            }}
            className="px-4 py-2 text-sm rounded-md border bg-amber-400"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
