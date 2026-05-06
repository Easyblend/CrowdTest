"use client";

import { useEffect, useState, Fragment } from "react";
import { FullScreenLoader } from "@/component/FullScreenLoader";
import toast from "react-hot-toast";

type AuditLog = {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata: any;
  createdAt: string;
};

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [openRow, setOpenRow] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await fetch("/api/audit", {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch audit logs");

        const data = await res.json();
        setLogs(data);
      } catch (err) {
        toast.error("Failed to load activity");
      } finally {
        setLoading(false);
      }
    }

    fetchLogs();
  }, []);

  if (loading) return <FullScreenLoader />;

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      <div className="p-6 md:p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
            Activity Log
          </h1>
          <p className="text-slate-700 mt-2">
            Complete audit trail of system actions
          </p>
        </div>

        {/* Table */}
        <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
          <div className="border-b border-slate-700 px-5 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-slate-100 text-sm font-semibold">
                Activity history
              </p>
              <p className="text-slate-400 text-xs">
                Showing {logs.length} item{logs.length === 1 ? "" : "s"}.
              </p>
            </div>
            <p className="text-slate-400 text-xs">
              Click any row to view details.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-sm border-separate border-spacing-y-2">
              <thead className="bg-slate-700 text-slate-200">
                <tr>
                  <th className="text-left p-4 font-semibold">Action</th>
                  <th className="text-left p-4 font-semibold">Entity</th>
                  <th className="text-left p-4 font-semibold">Time</th>
                  <th className="p-4"></th>
                </tr>
              </thead>

              <tbody>
                {logs.map((log) => {
                  const isOpen = openRow === log.id;

                  return (
                    <Fragment key={log.id}>
                      {/* MAIN ROW */}
                      <tr
                        onClick={() =>
                          setOpenRow(isOpen ? null : log.id)
                        }
                        className={`border border-slate-700 transition hover:bg-slate-700/60 cursor-pointer ${
                          isOpen ? "bg-slate-700" : "bg-slate-800"
                        }`}
                      >
                        {/* ACTION */}
                        <td className="p-4">
                          <ActionBadge action={log.action} />
                        </td>

                        {/* ENTITY */}
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="text-slate-100 font-medium">
                              {log.metadata?.snapshot?.name || log.entityId}
                            </span>
                            <span className="text-xs text-slate-400">
                              {log.entityType}
                            </span>
                          </div>
                        </td>

                        {/* TIME */}
                        <td className="p-4 text-slate-400 text-xs whitespace-nowrap">
                          {formatTime(log.createdAt)}
                        </td>

                        {/* INDICATOR */}
                        <td className="p-4 text-right text-slate-400">
                          <span
                            className={`inline-block transition ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          >
                            ▼
                          </span>
                        </td>
                      </tr>

                      {/* DROPDOWN */}
                      {isOpen && (
                        <tr className="bg-slate-900">
                          <td
                            colSpan={4}
                            className="p-5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="bg-slate-800 border border-slate-600 rounded-xl p-4 text-xs font-mono text-slate-300 overflow-x-auto">
                              <pre className="whitespace-pre-wrap">
                                {JSON.stringify(log.metadata, null, 2)}
                              </pre>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Empty state */}
          {logs.length === 0 && (
            <div className="p-10 text-center text-slate-400">
              <div className="text-4xl mb-2">📭</div>
              <p className="text-lg font-medium">No activity yet</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

/* ---------------- ACTION BADGE ---------------- */

function ActionBadge({ action }: { action: string }) {
  const styles: Record<string, string> = {
    PROJECT_CREATED: "bg-green-500/20 text-green-400",
    PROJECT_DELETED: "bg-red-500/20 text-red-400",
    USER_SIGNIN: "bg-blue-500/20 text-blue-400",
  };

  const labels: Record<string, string> = {
    PROJECT_CREATED: "Created",
    PROJECT_DELETED: "Deleted",
    USER_SIGNIN: "Login",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        styles[action] || "bg-slate-600 text-slate-300"
      }`}
    >
      {labels[action] || action}
    </span>
  );
}

/* ---------------- TIME FORMAT ---------------- */

function formatTime(date: string) {
  return new Date(date).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}