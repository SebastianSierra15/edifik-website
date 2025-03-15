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
          primary: "var(--premium-primary)",
          primaryLight: "var(--premium-primary-light)",
          primaryDark: "var(--premium-primary-dark)",

          secondary: "var(--premium-secondary)",
          secondaryLight: "var(--premium-secondary-light)",
          secondaryDark: "var(--premium-secondary-dark)",

          background: "var(--premium-background)",
          backgroundLight: "var(--premium-background-light)",
          backgroundDark: "var(--premium-background-dark)",
          backgroundAlt: "var(--premium-background-alt)",

          textPrimary: "var(--premium-text-primary)",
          textSecondary: "var(--premium-text-secondary)",
          textPlaceholder: "var(--premium-text-placeholder)",

          borderColor: "var(--premium-border-color)",
          borderColorHover: "var(--premium-border-color-hover)",
        },

        client: {
          primary: "var(--client-primary)",
          primaryLight: "var(--client-primary-light)",
          primaryDark: "var(--client-primary-dark)",
          primaryHover: "var(--client-primary-hover)",

          secondary: "var(--client-secondary)",
          secondaryLight: "var(--client-secondary-light)",
          secondaryDark: "var(--client-secondary-dark)",
          secondaryHover: "var(--client-secondary-hover)",

          accent: "var(--client-accent)",
          accentLight: "var(--client-accent-light)",
          accentDark: "var(--client-accent-dark)",
          accentHover: "var(--client-accent-hover)",

          white: "var(--client-white)",
          whiteOff: "var(--client-white-off)",

          background: "var(--client-background)",
          backgroundLight: "var(--client-background-light)",
          backgroundDark: "var(--client-background-dark)",
          backgroundAlt: "var(--client-background-alt)",

          text: "var(--client-text-primary)",
          textSecondary: "var(--client-text-secondary)",
          textPlaceholder: "var(--client-text-placeholder)",
        },
      },
      animation: {
        gradient: "gradient 3s ease-in-out infinite",
        "slide-left-infinite": "slide-left 16s linear infinite",
      },
      keyframes: {
        gradient: {
          "0%": { "background-position": "200% 0%" },
          "100%": { "background-position": "-200% 0%" },
        },
        "slide-left": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-100%)" },
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
