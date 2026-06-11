import { useEffect, useState } from "react";

// Dark-mode toggle persisted to localStorage; initializes from saved value
// or falls back to the system `prefers-color-scheme` preference. SSR-safe.

const KEY = "translator-theme";
type Theme = "light" | "dark";

function readInitial(): Theme {
  if (typeof window === "undefined") return "light";
  const saved = window.localStorage.getItem(KEY);
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");

  // Sync on mount (avoids SSR/client mismatch).
  useEffect(() => {
    setTheme(readInitial());
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    try {
      window.localStorage.setItem(KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  return { theme, toggle };
}
