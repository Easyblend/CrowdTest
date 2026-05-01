"use client";

import { navLinks } from "../../data/navLinks";
import { MenuIcon, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
    const [openMobileMenu, setOpenMobileMenu] = useState(false);

    // Prevent background scroll when mobile menu is open
    useEffect(() => {
        if (openMobileMenu) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [openMobileMenu]);

    return (
        <header className="fixed top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors">
            <nav className="flex items-center justify-between px-6 lg:px-24 xl:px-32 py-4">
                
                {/* LEFT: Logo */}
                <Link
                    href="#home"
                    className="flex items-center gap-2 hover:opacity-80 transition"
                >
                    <Image
                        src="/assets/logo-light (1).png"
                        alt="Crowdtest logo"
                        width={36}
                        height={36}
                        priority
                        className="h-9 w-auto"
                    />
                    <span className="hidden md:block text-lg font-semibold tracking-tight">
                        Crowd<span className="text-purple-600">Test</span>
                    </span>
                </Link>

                {/* CENTER: Desktop Nav */}
                <div className="hidden md:flex items-center gap-8 lg:gap-10">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* RIGHT: Actions */}
                <div className="flex items-center gap-3">
                    <ThemeToggle />

                    {/* Sign up CTA */}
                    <Link
                        href="https://app.crowdtest.dev/signup"
                        className="hidden md:inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md transition"
                    >
                        Sign up
                    </Link>

                    {/* Mobile toggle */}
                    <button
                        onClick={() => setOpenMobileMenu((prev) => !prev)}
                        className="md:hidden p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        aria-label="Toggle navigation menu"
                        aria-expanded={openMobileMenu}
                    >
                        {openMobileMenu ? (
                            <XIcon size={24} />
                        ) : (
                            <MenuIcon size={24} />
                        )}
                    </button>
                </div>
            </nav>

            {/* MOBILE MENU */}
            <div
                className={`md:hidden fixed inset-0 top-16 bg-white dark:bg-slate-950 flex flex-col items-center gap-6 pt-10 text-lg font-medium transition-all duration-300 ${
                    openMobileMenu
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-full pointer-events-none"
                }`}
            >
                {navLinks.map((link) => (
                    <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => setOpenMobileMenu(false)}
                        className="text-slate-700 dark:text-slate-300 hover:text-purple-600 transition"
                    >
                        {link.name}
                    </Link>
                ))}

                {/* Mobile CTA */}
                <Link
                    href=""
                    onClick={() => setOpenMobileMenu(false)}
                    className="mt-4 px-6 py-3 text-white bg-purple-600 hover:bg-purple-700 rounded-md transition"
                >
                    Sign up
                </Link>
            </div>
        </header>
    );
}