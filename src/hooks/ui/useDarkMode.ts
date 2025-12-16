"use client";

import { useEffect, useState } from "react";

export type Theme = "light" | "dark" | "auto";

export function useDarkMode() {
  const [theme, setTheme] = useState<Theme>("auto");

  useEffect(() => {
    const savedTheme = (localStorage.getItem("theme") as Theme) || "auto";
    applyTheme(savedTheme);
    setTheme(savedTheme);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemChange = (e: MediaQueryListEvent) => {
      if (theme === "auto") {
        applyTheme(e.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleSystemChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemChange);
    };
  }, [theme]);

  const applyTheme = (newTheme: Theme) => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    const themeToApply =
      newTheme === "auto" ? (prefersDark ? "dark" : "light") : newTheme;

    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(themeToApply);
  };

  const toggleTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  return { theme, toggleTheme };
}
