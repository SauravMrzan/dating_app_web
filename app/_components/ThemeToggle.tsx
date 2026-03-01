"use client";

import { useState } from "react";
import { AppTheme, getStoredTheme, setTheme } from "@/lib/theme";

export default function ThemeToggle() {
  const [theme, setThemeState] = useState<AppTheme>(() => {
    if (typeof document === "undefined") return "light";
    return (
      getStoredTheme() ??
      (document.documentElement.classList.contains("dark") ? "dark" : "light")
    );
  });

  const cycle = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    setThemeState(nextTheme);
  };

  const label = theme === "dark" ? "Dark" : "Light";

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      title={`Theme: ${label}`}
      onClick={cycle}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-black/10 dark:border-white/15 hover:bg-foreground/5 transition-colors"
    >
      {/* Icon changes with theme label; simple shapes to avoid extra deps */}
      {theme === "dark" ? (
        // Moon
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z" />
        </svg>
      ) : (
        // Sun
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm0 4.5a.75.75 0 0 0 .75-.75v-1.5a.75.75 0 0 0-1.5 0v1.5c0 .414.336.75.75.75Zm0-19.5a.75.75 0 0 0 .75-.75V.75a.75.75 0 0 0-1.5 0v1.5c0 .414.336.75.75.75Zm9 9a.75.75 0 0 0 .75-.75v-1.5a.75.75 0 0 0-1.5 0v1.5c0 .414.336.75.75.75ZM3.75 12a.75.75 0 0 0 .75-.75v-1.5a.75.75 0 0 0-1.5 0v1.5c0 .414.336.75.75.75Zm13.03 7.22a.75.75 0 0 0 1.06 0l1.06-1.06a.75.75 0 0 0-1.06-1.06l-1.06 1.06a.75.75 0 0 0 0 1.06Zm-12.56-12.56a.75.75 0 0 0 1.06 0l1.06-1.06A.75.75 0 1 0 5.28 3.54L4.22 4.6a.75.75 0 0 0 0 1.06Zm12.56-1.06a.75.75 0 0 0 0 1.06l1.06 1.06a.75.75 0 1 0 1.06-1.06l-1.06-1.06a.75.75 0 0 0-1.06 0ZM4.22 18.72a.75.75 0 0 0 1.06 0l1.06-1.06a.75.75 0 1 0-1.06-1.06L4.22 17.66a.75.75 0 0 0 0 1.06Z" />
        </svg>
      )}
    </button>
  );
}