function Sidebar({ categories, activeCategoryId, setActiveCategoryId }) {
  return (
    <div className="surface-1 h-full rounded-2xl p-4 flex flex-col relative overflow-hidden">
      {/* Decorative orb */}
      <div
        className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full pointer-events-none opacity-60"
        style={{ background: "radial-gradient(circle, rgba(232,155,61,0.12), transparent 70%)" }}
      />

      <div className="flex items-center gap-2 pb-3 mb-3" style={{ borderBottom: "1px solid #3F2E22" }}>
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, rgba(232,155,61,0.18), rgba(168,101,25,0.08))",
            border: "1px solid rgba(232,155,61,0.2)",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-codex-accent">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="16" y2="12" />
            <line x1="4" y1="18" x2="12" y2="18" />
          </svg>
        </div>
        <h3 className="font-display text-sm font-bold text-codex-text tracking-tight">Menu</h3>
      </div>

      <ul className="list-none space-y-1 flex-1 relative z-10">
        {categories.map((cat, index) => {
          const isActive = activeCategoryId === cat.id;
          return (
            <li
              key={cat.id ?? "all"}
              onClick={() => setActiveCategoryId(cat.id)}
              className={`flex items-center gap-3 cursor-pointer p-2.5 rounded-xl transition-all duration-300 animate-fade-in group ${
                isActive ? "nav-pill nav-pill-active" : ""
              }`}
              style={{
                animationDelay: `${index * 50}ms`,
                ...(!isActive && { color: "#A08770" }),
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "rgba(232,155,61,0.08)";
                  e.currentTarget.style.color = "#F5EBDC";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#A08770";
                }
              }}
            >
              <span
                className={`text-base transition-transform duration-300 ${
                  isActive ? "scale-110" : "group-hover:scale-110"
                }`}
              >
                {cat.icon || "☕"}
              </span>
              <span className="text-[13px] font-medium">{cat.name}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-codex-bg/70 animate-scale-in" />
              )}
            </li>
          );
        })}
      </ul>

      <div className="pt-3 mt-2" style={{ borderTop: "1px solid #3F2E22" }}>
        <div className="flex items-center gap-2 text-codex-subtle text-[10px]">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-codex-accent/60">
            <path d="M17 8h1a4 4 0 0 1 0 8h-1" />
            <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" />
          </svg>
          <span className="italic font-medium">Crafted with love</span>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
