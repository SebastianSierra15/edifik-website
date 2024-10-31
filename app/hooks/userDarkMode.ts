import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "auto";

export default function useDarkMode() {
  const [theme, setTheme] = useState<Theme>("auto");

  useEffect(() => {
    const savedTheme = (localStorage.getItem("theme") as Theme) || "auto";
    applyTheme(savedTheme);
    setTheme(savedTheme);

    const handleSystemChange = (e: MediaQueryListEvent) => {
      if (theme === "auto") {
        applyTheme(e.matches ? "dark" : "light");
      }
    };

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", handleSystemChange);

    return () => {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", handleSystemChange);
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
