/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        codex: {
          light: "#FAFAFA",
          dark: "#1A1A2E",
          gray: "#64748B",
          accent: "#E67E22",
          "accent-dark": "#D35400",
          "accent-light": "#F39C12",
          surface: "#16213E",
          muted: "#94A3B8",
          success: "#27AE60",
          danger: "#E74C3C",
          cream: "#FFF8F0",
          warm: "#2C3E50",
          navy: "#0F3460",
        },
      },
      fontFamily: {
        display: ["'Poppins'", "sans-serif"],
        sans: ["'Inter'", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s cubic-bezier(0.16,1,0.3,1)",
        "slide-up": "slideUp 0.5s cubic-bezier(0.16,1,0.3,1)",
        "slide-down": "slideDown 0.3s cubic-bezier(0.16,1,0.3,1)",
        "scale-in": "scaleIn 0.4s cubic-bezier(0.16,1,0.3,1)",
        "bounce-sm": "bounceSm 0.5s ease",
        "shimmer": "shimmer 2s infinite linear",
        "float": "float 6s ease-in-out infinite",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
        "spin-slow": "spin 8s linear infinite",
        "wiggle": "wiggle 1s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(30px) scale(0.95)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.85)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        bounceSm: {
          "0%,100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.08)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseSoft: {
          "0%,100%": { opacity: "0.4" },
          "50%": { opacity: "0.9" },
        },
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(230,126,34,0.2)" },
          "100%": { boxShadow: "0 0 40px rgba(230,126,34,0.4)" },
        },
        wiggle: {
          "0%,100%": { transform: "rotate(-2deg)" },
          "50%": { transform: "rotate(2deg)" },
        },
      },
      boxShadow: {
        "glass": "0 8px 32px rgba(0,0,0,0.06)",
        "glass-lg": "0 16px 48px rgba(0,0,0,0.1)",
        "inner-glow": "inset 0 1px 0 rgba(255,255,255,0.05)",
        "card-hover": "0 20px 50px rgba(230,126,34,0.12), 0 0 0 1px rgba(230,126,34,0.08)",
        "accent-glow": "0 8px 30px rgba(230,126,34,0.3)",
        "soft": "0 2px 15px rgba(0,0,0,0.04)",
      },
      backdropBlur: {
        xs: "2px",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
