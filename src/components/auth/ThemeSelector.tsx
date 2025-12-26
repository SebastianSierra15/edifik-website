"use client";

import { Moon, Sun, SunMoon } from "lucide-react";
import { useDarkMode } from "@/src/hooks/ui";

interface ThemeSelectorProps {
  closeMenu: () => void;
}

export function ThemeSelector({ closeMenu }: ThemeSelectorProps) {
  const { theme, toggleTheme } = useDarkMode();

  const handleThemeChange = (newTheme: "light" | "dark" | "auto") => {
    toggleTheme(newTheme);
    closeMenu();
  };

  return (
    <div className="flex flex-col">
      <button
        onClick={() => handleThemeChange("light")}
        className={`hover:bg-backgroundLight dark:hover:bg-darkBackgroundLight flex items-center rounded px-4 py-2 ${
          theme === "light"
            ? "text-primary font-bold"
            : "text-textPrimary dark:text-textSecondary"
        }`}
      >
        <Sun className="mr-2 text-yellow-400" />
        Modo Claro
      </button>

      <button
        onClick={() => handleThemeChange("dark")}
        className={`hover:bg-backgroundLight dark:hover:bg-darkBackgroundLight flex items-center rounded px-4 py-2 ${
          theme === "dark"
            ? "text-primary font-bold"
            : "text-textPrimary dark:text-textSecondary"
        }`}
      >
        <Moon className="dark:text-textPrimary mr-2" />
        Modo Oscuro
      </button>

      <button
        onClick={() => handleThemeChange("auto")}
        className={`hover:bg-backgroundLight dark:hover:bg-darkBackgroundLight flex items-center rounded px-4 py-2 ${
          theme === "auto"
            ? "text-primary font-bold"
            : "text-textPrimary dark:text-textSecondary"
        }`}
      >
        <SunMoon className="mr-2 text-blue-500" />
        Automático
      </button>
    </div>
  );
}
