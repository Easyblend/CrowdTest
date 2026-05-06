"use client";

import { useState } from "react";
import Sidebar from "@/component/Sidebar";

export default function AuditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">

      {/* SIDEBAR */}
      <Sidebar isOpen={isOpen} />

      {/* OVERLAY (mobile only) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">

        {/* HEADER */}
        <header className="p-4 shadow bg-white flex items-center md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded hover:bg-gray-100 text-2xl text-gray-950"
          >
            ☰
          </button>
          <h1 className="ml-4 text-xl font-semibold text-gray-900">Audit Trail</h1>
        </header>

        {/* SCROLLABLE CONTENT */}
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>

      </div>
    </div>
  );
}