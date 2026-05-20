const FALLBACK_ICON = "coffee-cup";

const ICONS = {
  "coffee-cup": {
    emoji: "☕",
    svg: (
      <>
        <path d="M6.2 8.2h9.4v4.3a4.4 4.4 0 0 1-4.4 4.4h-.6a4.4 4.4 0 0 1-4.4-4.4V8.2Z" />
        <path d="M15.6 9.4h1.1a2.4 2.4 0 0 1 0 4.8h-1.1" />
        <path d="M7.4 19h8.2" />
        <path d="M8.5 5.4c-.7-.8-.1-1.6.4-2.2M11 5.4c-.7-.8-.1-1.6.4-2.2M13.5 5.4c-.7-.8-.1-1.6.4-2.2" />
      </>
    ),
  },
  "espresso-bean": {
    emoji: "🫘",
    svg: (
      <>
        <path d="M7.6 4.3c3.1-1.3 7.8 1.2 8.8 5.5.7 3.1-.5 6.8-3.2 7.9-3 1.2-7.8-1.3-8.8-5.6-.7-3 .5-6.6 3.2-7.8Z" />
        <path d="M13.9 5.7c-3.2 2.3-4.5 5.6-3.8 10" />
        <path d="M16.6 8.8c-1.4.5-2.6.5-3.9-.1" />
      </>
    ),
  },
  "iced-drink": {
    emoji: "🧋",
    svg: (
      <>
        <path d="m8 7.3 1 11.7h6l1-11.7H8Z" />
        <path d="M7.2 7.3h9.6" />
        <path d="m13.2 2.8-2 4.5" />
        <path d="M9.3 10.5h5.4" />
        <circle cx="10.4" cy="16.2" r=".8" />
        <circle cx="13.8" cy="16.2" r=".8" />
      </>
    ),
  },
  croissant: {
    emoji: "🥐",
    svg: (
      <>
        <path d="M4.8 13.5c1.1-5.8 7-8.9 12.4-5.2-1.8.4-3.3 1.5-4.3 3.1" />
        <path d="M4.8 13.5c2.1 4.2 8.7 4.7 12.7.8-1.8-.1-3.4-.8-4.6-2.1" />
        <path d="M7.6 10.3c1.9.1 3.6.8 5.3 2" />
        <path d="M9.3 7.9c2.1.6 3.8 1.8 5.1 3.5" />
      </>
    ),
  },
  "honey-spark": {
    emoji: "🍯",
    svg: (
      <>
        <path d="M8 8.5h8v8.1a2.3 2.3 0 0 1-2.3 2.3h-3.4A2.3 2.3 0 0 1 8 16.6V8.5Z" />
        <path d="M7.4 8.5h9.2l-.8-3.1H8.2l-.8 3.1Z" />
        <path d="M10 12.2c1.2.7 2.8.7 4 0" />
        <path d="M18.5 4.2v2.3M17.4 5.4h2.2" />
      </>
    ),
  },
  teapot: {
    emoji: "🫖",
    svg: (
      <>
        <path d="M8.5 9.2h6.8a3.6 3.6 0 0 1-3.6 7.2h-.5a3.6 3.6 0 0 1-3.6-3.6V10a.8.8 0 0 1 .9-.8Z" />
        <path d="M15.4 10.2h1.1a2.2 2.2 0 0 1 0 4.4h-.9" />
        <path d="M7.8 10.6 4.7 9.2c-.3-.1-.5.2-.3.5l3.2 3" />
        <path d="M10 7.2h4" />
        <path d="M11.2 5.1h1.6" />
      </>
    ),
  },
  cake: {
    emoji: "🍰",
    svg: (
      <>
        <path d="M5.5 10.4 17 6.8v10.4H5.5v-6.8Z" />
        <path d="M5.5 13.2H17" />
        <path d="M8.4 9.5v7.7" />
        <path d="M13.8 7.8v9.4" />
        <path d="M10.2 5.1c.5.4.5.9 0 1.3" />
      </>
    ),
  },
  spark: {
    emoji: "✨",
    svg: (
      <>
        <path d="M12 3.6 13.8 9l5.4 1.8-5.4 1.8L12 18l-1.8-5.4-5.4-1.8L10.2 9 12 3.6Z" />
        <path d="m18 4.8.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5-1.5-.5 1.5-.5.5-1.5Z" />
      </>
    ),
  },
};

const LEGACY_ICON_ALIASES = {
  "☕": "coffee-cup",
  "🫘": "espresso-bean",
  "🧋": "iced-drink",
  "🥤": "iced-drink",
  "🥐": "croissant",
  "🥯": "croissant",
  "🍰": "cake",
  "🧁": "cake",
  "🍯": "honey-spark",
  "🫖": "teapot",
  "✨": "spark",
};

const normalizeIcon = (icon) => {
  if (typeof icon !== "string") return FALLBACK_ICON;
  const value = icon.trim();
  return LEGACY_ICON_ALIASES[value] || (ICONS[value] ? value : FALLBACK_ICON);
};

function CategoryIcon({
  icon,
  label = "Category",
  active = false,
  size = "md",
  className = "",
}) {
  const sizes = {
    sm: "w-7 h-7 rounded-lg",
    md: "w-10 h-10 rounded-xl",
    lg: "w-12 h-12 rounded-2xl",
  };
  const iconKey = normalizeIcon(icon);
  const iconConfig = ICONS[iconKey] || ICONS[FALLBACK_ICON];

  return (
    <span
      aria-label={`${label} icon`}
      title={label}
      className={`inline-flex shrink-0 items-center justify-center ${sizes[size] || sizes.md} ${className}`}
      style={{
        background: active
          ? "linear-gradient(135deg, #D7B56D 0%, #9C6B3F 55%, #4B2D17 100%)"
          : "radial-gradient(circle at 30% 25%, #FFF8EA 0%, #EED7AD 42%, #B88B5A 100%)",
        border: active
          ? "1px solid rgba(255,248,234,0.45)"
          : "1px solid rgba(156,107,63,0.22)",
        boxShadow: active
          ? "0 8px 20px rgba(92,61,36,0.28), inset 0 1px 0 rgba(255,255,255,0.28)"
          : "0 6px 16px rgba(92,61,36,0.12), inset 0 1px 0 rgba(255,255,255,0.65)",
      }}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-[58%] w-[58%] drop-shadow-sm"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ color: active ? "#FFF8EA" : "#5A3920" }}
      >
        {iconConfig.svg}
      </svg>
      <span className="sr-only">{iconConfig.emoji}</span>
    </span>
  );
}

export { FALLBACK_ICON, ICONS, normalizeIcon };
export default CategoryIcon;
