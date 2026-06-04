/*
 * Tailwind v3 reference config.
 * Design tokens are defined in src/app/globals.css via @theme (Tailwind v4).
 * This file is kept for documentation and v3 compatibility reference.
 */

const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4CAF50",
          light: "#81C784",
          dark: "#388E3C",
        },
        accent: {
          DEFAULT: "#FF9800",
          light: "#FFB74D",
        },
        bg: "#F5F7FA",
        text: "#1A1A2E",
      },
      animation: {
        "breathe-in": "breatheIn 3s ease-in-out",
        "breathe-out": "breatheOut 3s ease-in-out",
      },
      keyframes: {
        breatheIn: {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(0.7)", opacity: "0.7" },
        },
        breatheOut: {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.3)", opacity: "0.7" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
