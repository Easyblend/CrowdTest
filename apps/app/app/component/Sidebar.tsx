"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import LogoutBtn from "@/component/LogoutBtn";

interface User {
    name: string;
    email: string;
    avatar_url?: string;
    role?: string;
}

const links = [
    { href: "/dashboard", label: "Dashboard" },
];

export default function Sidebar({ isOpen }: { isOpen: boolean }) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch("/api/me", {
                    credentials: "include",
                    cache: "no-store",
                });

                if (!res.ok) throw new Error("Failed to fetch user");

                const data = await res.json();

                setUser({
                    name: data.name,
                    email: data.email,
                    avatar_url: data.avatar_url,
                    role: data.role,
                });
            } catch (err) {
                console.error(err);
            }
        }

        fetchUser();
    }, []);

    return (
        <aside
            className={`
    fixed inset-y-0 left-0 z-50 w-72
    transform transition-transform duration-300 ease-out
    bg-linear-to-b from-slate-950 via-slate-900 to-slate-800
    border-r border-white/10 shadow-xl
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0 md:static md:flex md:h-screen
  `}
        >
            <div className="flex flex-col h-full w-full p-6">

                {/* 🔝 USER SECTION */}
                <div className="flex items-center gap-3 mb-8">
                    {/* Avatar */}
                    {user?.avatar_url ? (
                        <img
                            src={user.avatar_url}
                            alt="avatar"
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">
                            {user?.name?.charAt(0) || "U"}
                        </div>
                    )}

                    {/* Name */}
                    <div>
                        <p className="text-sm font-semibold text-white">
                            {user?.name || "Loading..."}
                        </p>
                        <p className="text-xs text-slate-400">
                            {user?.email}
                        </p>
                        {user?.role && user.role === 'ADMIN' && (
                            <p className="text-xs text-cyan-400 font-semibold">
                                ({user.role})
                            </p>
                        )}
                    </div>
                </div>

                {/* 🔗 NAV (scrollable) */}
                <nav className="flex-1 overflow-y-auto space-y-2 pr-2">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="group flex items-center rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
                        >
                            <span className="mr-3 text-slate-500 group-hover:text-cyan-400">
                                •
                            </span>
                            {link.label}
                        </Link>
                    ))}
                </nav>


                {/* Logout */}
                <LogoutBtn />

                {/* 🔻 FOOTER */}
                <div className="rounded-lg border border-cyan-500/30 bg-linear-to-br from-cyan-950/40 to-slate-900/40 mt-6 p-4 text-sm text-slate-200 hover:border-cyan-500/50 transition-colors duration-300">
                    <div className="flex items-start gap-2">
                        <span className="text-cyan-400 font-bold shrink-0 mt-0.5">💡</span>
                        <div>
                            <p className="font-semibold text-white mb-1">Improve your testing workflow</p>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Create a project first, then watch testers start reporting structured bugs with severity and screenshots.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </aside>
    );
}