/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#0a0e17",
          card: "#111827",
          elevated: "#1a2332",
          hover: "#243044",
        },
        border: {
          DEFAULT: "#2d3f56",
          glow: "rgba(52, 152, 219, 0.25)",
        },
        text: {
          primary: "#f0f4f8",
          muted: "#8b9cb3",
        },
        accent: {
          danger: "#ef4444",
          warning: "#f59e0b",
          safe: "#22c55e",
          info: "#3b82f6",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      boxShadow: {
        panel: "0 4px 24px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255,255,255,0.04)",
        glow: "0 0 20px rgba(59, 130, 246, 0.15)",
        "glow-danger": "0 0 16px rgba(239, 68, 68, 0.25)",
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(45, 63, 86, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(45, 63, 86, 0.15) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "24px 24px",
      },
      animation: {
        pulse: "pulse-ring 2s ease-out infinite",
      },
    },
  },
  plugins: [],
};
