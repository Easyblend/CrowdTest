'use client';

import { useThemeContext } from "../../context/ThemeContext";
import { MoonIcon, SunIcon } from "lucide-react";

export default function ThemeToggle() {
    const { theme, setTheme } = useThemeContext();
    const toggleTheme = () => {
        if (theme === "dark") {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        } else {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        }
        setTheme(theme === "dark" ? "light" : "dark");
    };

    return (
        <button onClick={toggleTheme} className="flex items-center justify-center size-9 p-2 rounded-full bg-slate-950/5 hover:bg-slate-950/10 dark:bg-white/10 dark:hover:bg-white/20 transition-colors duration-200 ease-in-out">
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>
    );
}