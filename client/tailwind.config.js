/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        codex: {
          bg:      "#1C1410",   // background utama — coklat gelap
          surface: "#251C16",   // card/panel surface
          panel:   "#2E2218",   // sidebar/navbar
          border:  "#3D2E22",   // border subtle
          accent:  "#E8A045",   // orange-gold accent
          "accent-dark": "#C8832A",
          "accent-light": "#F0B865",
          muted:   "#8A7060",   // text muted
          text:    "#F0E6D8",   // text utama
          "text-dim": "#B09880", // text sekunder
          success: "#4CAF7D",
          danger:  "#E05252",
          gold:    "#D4A843",
        },
      },
      fontFamily: {
        display: ["'Poppins'", "sans-serif"],
        sans:    ["'Inter'", "sans-serif"],
      },
      animation: {
        "fade-in":    "fadeIn 0.5s cubic-bezier(0.16,1,0.3,1)",
        "slide-up":   "slideUp 0.5s cubic-bezier(0.16,1,0.3,1)",
        "slide-down": "slideDown 0.3s cubic-bezier(0.16,1,0.3,1)",
        "scale-in":   "scaleIn 0.4s cubic-bezier(0.16,1,0.3,1)",
        "float":      "float 6s ease-in-out infinite",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
        "shimmer":    "shimmer 2s infinite linear",
        "glow":       "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        fadeIn:    { "0%": { opacity:"0", transform:"translateY(8px)" }, "100%": { opacity:"1", transform:"translateY(0)" } },
        slideUp:   { "0%": { opacity:"0", transform:"translateY(28px) scale(0.96)" }, "100%": { opacity:"1", transform:"translateY(0) scale(1)" } },
        slideDown: { "0%": { opacity:"0", transform:"translateY(-10px)" }, "100%": { opacity:"1", transform:"translateY(0)" } },
        scaleIn:   { "0%": { opacity:"0", transform:"scale(0.88)" }, "100%": { opacity:"1", transform:"scale(1)" } },
        float:     { "0%,100%": { transform:"translateY(0px)" }, "50%": { transform:"translateY(-8px)" } },
        pulseSoft: { "0%,100%": { opacity:"0.5" }, "50%": { opacity:"1" } },
        shimmer:   { "0%": { backgroundPosition:"-200% 0" }, "100%": { backgroundPosition:"200% 0" } },
        glow:      { "0%": { boxShadow:"0 0 20px rgba(232,160,69,0.15)" }, "100%": { boxShadow:"0 0 40px rgba(232,160,69,0.35)" } },
      },
      boxShadow: {
        "card":        "0 2px 16px rgba(0,0,0,0.35)",
        "card-hover":  "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(232,160,69,0.12)",
        "accent-glow": "0 6px 24px rgba(232,160,69,0.3)",
        "inner":       "inset 0 1px 0 rgba(255,255,255,0.04)",
      },
    },
  },
  plugins: [],
};
