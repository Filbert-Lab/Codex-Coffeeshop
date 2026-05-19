function Sidebar({ categories, activeCategory, setActiveCategory }) {
  return (
    <div className="h-full rounded-2xl p-4 flex flex-col relative overflow-hidden"
      style={{ background:"#251C16", border:"1px solid #3D2E22", boxShadow:"0 2px 16px rgba(0,0,0,0.35)" }}>
      <div className="absolute -bottom-8 -left-8 w-20 h-20 rounded-full blur-2xl pointer-events-none"
        style={{ background:"rgba(232,160,69,0.06)" }} />

      <div className="flex items-center gap-2 pb-3 mb-3" style={{ borderBottom:"1px solid #3D2E22" }}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background:"rgba(232,160,69,0.1)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-codex-accent">
            <line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="16" y2="12"/><line x1="4" y1="18" x2="12" y2="18"/>
          </svg>
        </div>
        <h3 className="font-display text-sm font-bold text-codex-text tracking-tight">Menu</h3>
      </div>

      <ul className="list-none space-y-1 flex-1 relative z-10">
        {categories.map((cat, index) => {
          const isActive = activeCategory === (cat.name || cat);
          return (
            <li
              key={cat.name || cat}
              onClick={() => setActiveCategory(cat.name || cat)}
              className="flex items-center gap-3 cursor-pointer p-2.5 rounded-xl transition-all duration-300 animate-fade-in group"
              style={{
                animationDelay:`${index * 50}ms`,
                ...(isActive
                  ? { background:"linear-gradient(135deg, #E8A045, #C8832A)", color:"#1C1410", fontWeight:600, transform:"scale(1.02)", boxShadow:"0 4px 16px rgba(232,160,69,0.3)" }
                  : { color:"#B09880" }
                )
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "rgba(232,160,69,0.06)"; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
            >
              <span className={`text-base transition-all duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`}>
                {cat.icon || "☕"}
              </span>
              <span className="text-[13px] font-medium">{cat.name || cat}</span>
              {isActive && <div className="ml-auto w-2 h-2 rounded-full bg-codex-bg/60 animate-scale-in" />}
            </li>
          );
        })}
      </ul>

      <div className="pt-3 mt-2" style={{ borderTop:"1px solid #3D2E22" }}>
        <div className="flex items-center gap-2 text-codex-muted text-[10px]">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-codex-accent/50">
            <path d="M17 8h1a4 4 0 0 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z"/>
          </svg>
          <span className="italic font-medium">Crafted with love</span>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
