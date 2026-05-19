function Sidebar({ categories, activeCategory, setActiveCategory }) {
  return (
    <div className="bg-white/90 backdrop-blur-xl h-full rounded-2xl p-4 flex flex-col relative overflow-hidden border border-white/60 shadow-soft">
      {/* Decorative orb */}
      <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-codex-accent/5 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center gap-2 pb-3 mb-3 border-b border-gray-100">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-codex-accent/15 to-codex-accent/5 flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-codex-accent">
            <line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="16" y2="12" /><line x1="4" y1="18" x2="12" y2="18" />
          </svg>
        </div>
        <h3 className="font-display text-sm font-bold text-codex-dark tracking-tight">
          Menu
        </h3>
      </div>

      <ul className="list-none space-y-1 flex-1 relative z-10">
        {categories.map((cat, index) => (
          <li
            key={cat.name || cat}
            onClick={() => setActiveCategory(cat.name || cat)}
            style={{ animationDelay: `${index * 50}ms` }}
            className={`flex items-center gap-3 cursor-pointer p-2.5 rounded-xl transition-all duration-300 animate-fade-in group ${
              activeCategory === (cat.name || cat)
                ? "bg-gradient-to-r from-codex-accent to-codex-accent-dark text-white font-semibold shadow-lg shadow-codex-accent/25 scale-[1.02]"
                : "hover:bg-codex-accent/5 text-gray-600 hover:text-codex-dark"
            }`}
          >
            <span className={`text-base transition-all duration-300 ${
              activeCategory === (cat.name || cat) ? "scale-110 drop-shadow-sm" : "group-hover:scale-110"
            }`}>
              {cat.icon || "☕"}
            </span>
            <span className="text-[13px] font-medium">{cat.name || cat}</span>
            {activeCategory === (cat.name || cat) && (
              <div className="ml-auto w-2 h-2 rounded-full bg-white/80 animate-scale-in shadow-sm" />
            )}
          </li>
        ))}
      </ul>

      <div className="pt-3 mt-2 border-t border-gray-100">
        <div className="flex items-center gap-2 text-gray-400 text-[10px]">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-codex-accent/50">
            <path d="M17 8h1a4 4 0 0 1 0 8h-1" /><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" />
          </svg>
          <span className="italic font-medium">Crafted with love</span>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
