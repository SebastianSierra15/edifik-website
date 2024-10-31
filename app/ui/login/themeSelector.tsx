import { FaSun, FaMoon, FaAdjust } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function ThemeSelector({
  closeMenu,
}: {
  closeMenu: () => void;
}) {
  const [theme, setTheme] = useState<"light" | "dark" | "auto">("auto");

  useEffect(() => {
    const savedTheme =
      (localStorage.getItem("theme") as "light" | "dark" | "auto") || "auto";
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const initialTheme =
      savedTheme === "auto" ? (prefersDark ? "dark" : "light") : savedTheme;
    setTheme(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);
  }, []);

  const handleThemeChange = (newTheme: "light" | "dark" | "auto") => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const appliedTheme =
      newTheme === "auto" ? (prefersDark ? "dark" : "light") : newTheme;
    document.documentElement.setAttribute("data-theme", appliedTheme);
    closeMenu();
  };

  return (
    <div className="flex flex-col">
      <button
        onClick={() => handleThemeChange("light")}
        className={`flex items-center px-4 py-2 hover:bg-backgroundLight dark:hover:bg-darkBackgroundLight rounded ${
          theme === "light"
            ? "font-bold text-primary"
            : "text-textPrimary dark:text-textSecondary"
        }`}
      >
        <FaSun className="mr-2 text-yellow-400" />
        Modo Claro
      </button>

      <button
        onClick={() => handleThemeChange("dark")}
        className={`flex items-center px-4 py-2 hover:bg-backgroundLight dark:hover:bg-darkBackgroundLight rounded ${
          theme === "dark"
            ? "font-bold text-primary"
            : "text-textPrimary dark:text-textSecondary"
        }`}
      >
        <FaMoon className="mr-2 dark:text-textPrimary" />
        Modo Oscuro
      </button>

      <button
        onClick={() => handleThemeChange("auto")}
        className={`flex items-center px-4 py-2 hover:bg-backgroundLight dark:hover:bg-darkBackgroundLight rounded ${
          theme === "auto"
            ? "font-bold text-primary"
            : "text-textPrimary dark:text-textSecondary"
        }`}
      >
        <FaAdjust className="mr-2 text-blue-500" />
        Automático
      </button>
    </div>
  );
}
