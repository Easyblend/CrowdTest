"use client";
import { createContext, useContext, useEffect, useState } from "react";

export const ThemeContext = createContext({ theme: "dark", setTheme: (theme: string) => {} });

export function ThemeContextProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState("dark");

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme) {
            setTheme(storedTheme);
            document.documentElement.classList.add(storedTheme)
            console.log("stored theme:", storedTheme);
        } else {
            setTheme("dark");
            document.documentElement.classList.add("dark")
        }
    }, []);

    return (
        <ThemeContext.Provider value={{
            theme, setTheme
        }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useThemeContext() {
    return useContext(ThemeContext);
}