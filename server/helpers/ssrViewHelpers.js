const LEGACY_ICON_ALIASES = {
  "coffee-cup": "☕",
  "espresso-bean": "🫘",
  "iced-drink": "🧋",
  "🥤": "🧋",
  croissant: "🥐",
  "honey-spark": "🍯",
  teapot: "🫖",
  cake: "🍰",
  spark: "✨",
};

const formatCurrency = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

function iconGlyph(icon) {
  if (typeof icon !== "string") return "☕";
  const value = icon.trim();
  return LEGACY_ICON_ALIASES[value] || value || "☕";
}

function serializeState(value) {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

module.exports = {
  formatCurrency,
  iconGlyph,
  serializeState,
};
