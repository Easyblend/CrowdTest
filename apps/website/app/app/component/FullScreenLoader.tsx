import React from 'react'

export const FullScreenLoader = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading projects...</p>
        </div>
      </div>
  )
}
