import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./ui/**/*.{js,ts,jsx,tsx,mdx}",
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
        backgroundAlt: "var(--background-alt)",

        textPrimary: "var(--text-primary)",
        textSecondary: "var(--text-secondary)",
        textPlaceholder: "var(--text-placeholder)",

        borderColor: "var(--border-color)",
        borderColorHover: "var(--border-color-hover)",

        hoverColor: "var(--primary-dark)",
        focusColor: "var(--secondary-light)",
      },
      animation: {
        gradient: "gradient 3s ease-in-out infinite",
      },
      keyframes: {
        gradient: {
          "0%": { "background-position": "200% 0%" },
          "100%": { "background-position": "-200% 0%" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
