function Sidebar({ categories, activeCategory, setActiveCategory }) {
  return (
    <div className="glass-dark h-full rounded-2xl p-5 flex flex-col relative overflow-hidden">
      {/* Ambient glow */}
      <div className="ambient-orb ambient-orb-2" style={{ width: 120, height: 120, bottom: -40, left: -40, opacity: 0.15 }} />

      <div className="flex items-center gap-2 pb-4 mb-3 border-b border-white/[0.06]">
        <div className="w-7 h-7 rounded-lg bg-codex-accent/15 flex items-center justify-center">
          <span className="text-codex-accent text-sm">☰</span>
        </div>
        <h3 className="font-display text-base font-bold text-codex-accent tracking-wide">
          Menu
        </h3>
      </div>

      <ul className="list-none space-y-1 flex-1 relative z-10">
        {categories.map((cat, index) => (
          <li
            key={cat.name || cat}
            onClick={() => setActiveCategory(cat.name || cat)}
            style={{ animationDelay: `${index * 40}ms` }}
            className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl transition-all duration-300 animate-fade-in group ${
              activeCategory === (cat.name || cat)
                ? "bg-gradient-to-r from-codex-accent to-codex-accent-dark text-white font-semibold shadow-lg shadow-codex-accent/20"
                : "hover:bg-white/[0.06] text-codex-muted hover:text-codex-light"
            }`}
          >
            <span className={`text-lg transition-transform duration-300 ${
              activeCategory === (cat.name || cat) ? "scale-110" : "group-hover:scale-110"
            }`}>
              {cat.icon || "☕"}
            </span>
            <span className="text-sm">{cat.name || cat}</span>
            {activeCategory === (cat.name || cat) && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-scale-in" />
            )}
          </li>
        ))}
      </ul>

      <div className="pt-4 mt-2 border-t border-white/[0.06]">
        <div className="flex items-center gap-2 text-codex-muted/50 text-xs">
          <span>☕</span>
          <span className="font-display italic">Crafted with love</span>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;