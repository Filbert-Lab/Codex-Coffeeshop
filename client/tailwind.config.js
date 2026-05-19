/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        codex: {
          // Light cream base (elite cafe vibe)
          base:    "#FAF6EF",   // warmest cream
          bg:      "#F4ECDF",   // body
          surface: "#FFFFFF",   // cards primary
          raised:  "#FFFBF3",   // hovered/elevated
          panel:   "#FBF4E6",   // secondary panels
          border:  "#E8DCC4",   // soft cream border
          "border-strong": "#D4C19D",

          // Coffee/brown accent spectrum
          coffee:        "#3D2817",   // deep espresso (primary text)
          "coffee-soft": "#5C3D24",   // medium roast
          "coffee-light":"#8B6F47",   // latte
          "coffee-pale": "#C9A876",   // foam

          accent:         "#9C6B3F",  // primary action
          "accent-soft":  "#7A5230",
          "accent-deep":  "#5A3920",
          "accent-glow":  "#B88B5A",
          "accent-pale":  "#E8D4B8",

          // Text scale (on cream bg)
          text:        "#2A1B0E",  // primary
          "text-soft": "#5C4530",  // secondary
          muted:       "#8C7458",  // tertiary
          subtle:      "#B0997D",  // quaternary
          "on-dark":   "#FAF6EF",  // text on dark accent

          // Semantic
          success: "#5A9070",
          danger:  "#B85450",
          info:    "#5A6FB8",
          warning: "#C8924E",
          gold:    "#A5763E",
        },
      },
      fontFamily: {
        display: ["'Plus Jakarta Sans'", "'Inter'", "sans-serif"],
        sans:    ["'Inter'", "sans-serif"],
        serif:   ["'Playfair Display'", "Georgia", "serif"],
      },
      animation: {
        "fade-in":      "fadeIn 0.5s cubic-bezier(0.16,1,0.3,1)",
        "slide-up":     "slideUp 0.5s cubic-bezier(0.16,1,0.3,1)",
        "toast-in":     "toastIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards",
        "scale-in":     "scaleIn 0.4s cubic-bezier(0.16,1,0.3,1)",
        "float":        "float 6s ease-in-out infinite",
        "pulse-soft":   "pulseSoft 3s ease-in-out infinite",
        "shimmer":      "shimmer 2.5s infinite linear",
      },
      keyframes: {
        fadeIn:    { "0%": { opacity:"0", transform:"translateY(8px)" }, "100%": { opacity:"1", transform:"translateY(0)" } },
        slideUp:   { "0%": { opacity:"0", transform:"translateY(28px) scale(0.96)" }, "100%": { opacity:"1", transform:"translateY(0) scale(1)" } },
        // Toast slides up from below, stays centered (no horizontal drift)
        toastIn:   { "0%": { opacity:"0", transform:"translate(-50%, 24px)" }, "100%": { opacity:"1", transform:"translate(-50%, 0)" } },
        scaleIn:   { "0%": { opacity:"0", transform:"scale(0.85)" }, "100%": { opacity:"1", transform:"scale(1)" } },
        float:     { "0%,100%": { transform:"translateY(0px)" }, "50%": { transform:"translateY(-6px)" } },
        pulseSoft: { "0%,100%": { opacity:"0.5" }, "50%": { opacity:"1" } },
        shimmer:   { "0%": { backgroundPosition:"-200% 0" }, "100%": { backgroundPosition:"200% 0" } },
      },
      boxShadow: {
        "soft":        "0 1px 2px rgba(61,40,23,0.06), 0 4px 12px rgba(61,40,23,0.06)",
        "card":        "0 1px 3px rgba(61,40,23,0.08), 0 8px 20px rgba(61,40,23,0.06)",
        "card-hover":  "0 4px 8px rgba(61,40,23,0.1), 0 16px 32px rgba(61,40,23,0.12), 0 0 0 1px rgba(156,107,63,0.18)",
        "accent":      "0 4px 14px rgba(156,107,63,0.25)",
        "accent-lg":   "0 8px 28px rgba(156,107,63,0.4)",
        "panel":       "0 1px 2px rgba(61,40,23,0.04), 0 4px 16px rgba(61,40,23,0.05)",
      },
    },
  },
  plugins: [],
};
