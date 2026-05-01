/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        codex: {
          light: "#F5F0E8",
          dark: "#1C1A17",
          gray: "#7A7F84",
          accent: "#C8962C",
          surface: "#2A2520",
          muted: "#9A8E7F",
          success: "#2D7A4F",
          danger: "#C0392B",
        },
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "bounce-sm": "bounceSm 0.4s ease",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: { "0%": { opacity: "0", transform: "translateY(20px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        bounceSm: { "0%,100%": { transform: "scale(1)" }, "50%": { transform: "scale(1.1)" } },
      },
    },
  },
  plugins: [],
};