/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        codex: {
          light: "#FAF7F2",
          dark: "#1A1714",
          gray: "#7A7F84",
          accent: "#D4A23A",
          "accent-dark": "#B8862E",
          surface: "#252017",
          muted: "#9A8E7F",
          success: "#2D7A4F",
          danger: "#C0392B",
          cream: "#F0E8D8",
          warm: "#3D3429",
        },
      },
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        sans: ["'Inter'", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.4s cubic-bezier(0.16,1,0.3,1)",
        "slide-up": "slideUp 0.4s cubic-bezier(0.16,1,0.3,1)",
        "slide-down": "slideDown 0.3s cubic-bezier(0.16,1,0.3,1)",
        "scale-in": "scaleIn 0.3s cubic-bezier(0.16,1,0.3,1)",
        "bounce-sm": "bounceSm 0.4s ease",
        "shimmer": "shimmer 2s infinite linear",
        "float": "float 6s ease-in-out infinite",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(24px) scale(0.96)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
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
          "50%": { transform: "translateY(-8px)" },
        },
        pulseSoft: {
          "0%,100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(212,162,58,0.15)" },
          "100%": { boxShadow: "0 0 40px rgba(212,162,58,0.3)" },
        },
      },
      boxShadow: {
        "glass": "0 8px 32px rgba(0,0,0,0.08)",
        "glass-lg": "0 16px 48px rgba(0,0,0,0.12)",
        "inner-glow": "inset 0 1px 0 rgba(255,255,255,0.05)",
        "card-hover": "0 20px 40px rgba(0,0,0,0.08), 0 0 0 1px rgba(212,162,58,0.1)",
        "accent-glow": "0 8px 24px rgba(212,162,58,0.25)",
      },
      backdropBlur: {
        xs: "2px",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "noise": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};