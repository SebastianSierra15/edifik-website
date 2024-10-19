import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        primaryLight: "var(--primary-light)",
        primaryDark: "var(--primary-dark)",

        secondary: "var(--secondary)",
        secondaryLight: "var(--secondary-light)",
        secondaryDark: "var(--secondary-dark)",

        background: "var(--background)",
        backgroundLight: "var(--background-light)",
        backgroundDark: "var(--background-dark)",

        darkBackground: "var(--background)",
        darkBackgroundLight: "var(--background-light)",
        darkBackgroundDark: "var(--background-dark)",

        darkHeader: "var(--secondary)",

        textPrimary: "var(--text-primary)",
        textSecondary: "var(--text-secondary)",
        textPlaceholder: "var(--text-placeholder)",

        darkTextPrimary: "var(--text-primary)",
        darkTextSecondary: "var(--text-secondary)",
        darkTextPlaceholder: "var(--text-placeholder)",

        borderColor: "var(--border-color)",
        borderColorHover: "var(--border-color-hover)",

        darkBorderColor: "var(--border-color)",
        darkBorderColorHover: "var(--border-color-hover)",

        hoverColor: "var(--primary-dark)",
        focusColor: "var(--secondary-light)",
      },
    },
  },
  plugins: [],
};

export default config;
