/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#7b68ee",
        "primary-dark": "#6452d3",
        background: "#ffffff",
        surface: "#f9f9fb",
        "on-background": "#1e293b",
        "on-surface": "#475569",
        "on-surface-variant": "#64748b",
        outline: "#e2e8f0",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        full: "9999px",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
