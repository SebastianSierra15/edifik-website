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
        premium: {
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
        },

        cliente: {
          primary: "#8B4513", // Marrón Tierra
          primaryLight: "#A0522D", // Marrón Claro
          primaryDark: "#5D4037", // Marrón Oscuro

          secondary: "#D2B48C", // Ocre Claro
          secondaryLight: "#E4CBA8", // Ocre Más Claro
          secondaryDark: "#C19A6B", // Ocre Oscuro

          contrast: "#5D4037", // Marrón Oscuro
          contrastLight: "#7E5A44", // Marrón Claro
          contrastDark: "#4B3225", // Marrón Más Oscuro

          background: "#EDEDED", // Gris Claro
          backgroundLight: "#F5F5F5", // Gris Más Claro
          backgroundDark: "#D9D9D9", // Gris Oscuro
          backgroundAlt: "#FFFFFF", // Blanco

          highlight: "#DAA520", // Dorado Claro
          highlightLight: "#E6B800", // Dorado Brillante
          highlightDark: "#B8860B", // Dorado Oscuro

          textPrimary: "#333333",
          textSecondary: "#4D4D4D",
          textPlaceholder: "#9E9E9E",

          borderColor: "#C19A6B",
          borderColorHover: "#A0522D",
        },
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
      backgroundImage: {
        "custom-pattern":
          "radial-gradient(rgba(12, 12, 12, 0.171) 2px, transparent 0)",
      },
    },
  },
  plugins: [],
};

export default config;
