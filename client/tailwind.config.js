/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        codex: {
          // Background layers (darkest → lightest, building depth)
          base:    "#15100C",   // deepest layer
          bg:      "#1B1410",   // body background
          surface: "#241A14",   // cards default
          raised:  "#2D2118",   // hovered cards / panels
          panel:   "#36281D",   // navbar / elevated surfaces
          border:  "#3F2E22",   // subtle border
          "border-light": "#4F3A2A",  // brighter border

          // Accent tones (warm gold spectrum)
          accent:        "#E89B3D",   // primary
          "accent-soft": "#D4862C",   // pressed
          "accent-deep": "#A86519",   // dark variant
          "accent-glow": "#F4B96A",   // light/glow variant
          "accent-pale": "#FCE8C3",   // text on accent

          // Text scale
          text:      "#F5EBDC",  // primary
          "text-soft": "#D4C5B0", // secondary
          muted:     "#A08770",  // tertiary
          subtle:    "#6B5847",  // quaternary

          // Semantic colors (tuned for dark bg)
          success: "#5DD4A6",
          danger:  "#F26B6B",
          info:    "#7B8FF5",
          warning: "#F4B95E",

          // Special
          gold:    "#E5B650",
          rose:    "#E08B7F",
        },
      },
      fontFamily: {
        display: ["'Plus Jakarta Sans'", "'Inter'", "sans-serif"],
        sans:    ["'Inter'", "sans-serif"],
      },
      animation: {
        "fade-in":     "fadeIn 0.5s cubic-bezier(0.16,1,0.3,1)",
        "slide-up":    "slideUp 0.5s cubic-bezier(0.16,1,0.3,1)",
        "slide-down":  "slideDown 0.3s cubic-bezier(0.16,1,0.3,1)",
        "slide-right": "slideRight 0.4s cubic-bezier(0.16,1,0.3,1)",
        "scale-in":    "scaleIn 0.4s cubic-bezier(0.16,1,0.3,1)",
        "float":       "float 6s ease-in-out infinite",
        "pulse-soft":  "pulseSoft 3s ease-in-out infinite",
        "shimmer":     "shimmer 2.5s infinite linear",
        "glow":        "glow 2.4s ease-in-out infinite alternate",
        "gradient":    "gradient 6s ease infinite",
      },
      keyframes: {
        fadeIn:     { "0%": { opacity:"0", transform:"translateY(8px)" }, "100%": { opacity:"1", transform:"translateY(0)" } },
        slideUp:    { "0%": { opacity:"0", transform:"translateY(28px) scale(0.96)" }, "100%": { opacity:"1", transform:"translateY(0) scale(1)" } },
        slideDown:  { "0%": { opacity:"0", transform:"translateY(-12px)" }, "100%": { opacity:"1", transform:"translateY(0)" } },
        slideRight: { "0%": { opacity:"0", transform:"translateX(-20px)" }, "100%": { opacity:"1", transform:"translateX(0)" } },
        scaleIn:    { "0%": { opacity:"0", transform:"scale(0.85)" }, "100%": { opacity:"1", transform:"scale(1)" } },
        float:      { "0%,100%": { transform:"translateY(0px)" }, "50%": { transform:"translateY(-8px)" } },
        pulseSoft:  { "0%,100%": { opacity:"0.5" }, "50%": { opacity:"1" } },
        shimmer:    { "0%": { backgroundPosition:"-200% 0" }, "100%": { backgroundPosition:"200% 0" } },
        glow:       { "0%": { boxShadow:"0 0 18px rgba(232,155,61,0.18)" }, "100%": { boxShadow:"0 0 36px rgba(232,155,61,0.4)" } },
        gradient:   { "0%,100%": { backgroundPosition:"0% 50%" }, "50%": { backgroundPosition:"100% 50%" } },
      },
      boxShadow: {
        "soft":        "0 1px 3px rgba(0,0,0,0.3), 0 4px 16px rgba(0,0,0,0.2)",
        "card":        "0 2px 4px rgba(0,0,0,0.2), 0 8px 24px rgba(0,0,0,0.3)",
        "card-hover":  "0 4px 12px rgba(0,0,0,0.4), 0 16px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(232,155,61,0.18)",
        "accent":      "0 4px 14px rgba(232,155,61,0.25)",
        "accent-lg":   "0 8px 28px rgba(232,155,61,0.4)",
        "inset-line":  "inset 0 1px 0 rgba(255,255,255,0.04)",
        "inset-glow":  "inset 0 1px 0 rgba(244,185,106,0.1)",
        "panel":       "inset 0 1px 0 rgba(255,255,255,0.04), 0 1px 0 rgba(0,0,0,0.6)",
      },
    },
  },
  plugins: [],
};
