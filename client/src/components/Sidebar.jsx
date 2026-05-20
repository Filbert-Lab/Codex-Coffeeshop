import CategoryIcon from "./CategoryIcon";

function Sidebar({ categories, activeCategoryId, setActiveCategoryId }) {
  return (
    <div className="surface-1 h-full rounded-2xl p-4 flex flex-col relative overflow-hidden">
      <div
        className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full pointer-events-none opacity-50"
        style={{
          background:
            "radial-gradient(circle, rgba(156,107,63,0.12), transparent 70%)",
        }}
      />

      {/* Header */}
      <div
        className="flex items-center gap-2 pb-3 mb-3"
        style={{ borderBottom: "1px solid #E8DCC4" }}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(156,107,63,0.15), rgba(156,107,63,0.05))",
            border: "1px solid rgba(156,107,63,0.2)",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{ color: "#9C6B3F" }}
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="16" y2="12" />
            <line x1="4" y1="18" x2="12" y2="18" />
          </svg>
        </div>
        <h3 className="font-display text-sm font-bold text-codex-text tracking-tight">
          Menu
        </h3>
      </div>

      {/* List — use pure className-based active state, no inline background mutation */}
      <ul className="list-none space-y-1 flex-1 relative z-10">
        {categories.map((cat, index) => (
          <SidebarItem
            key={cat.id ?? "all"}
            cat={cat}
            isActive={activeCategoryId === cat.id}
            onClick={() => setActiveCategoryId(cat.id)}
            delay={index * 50}
          />
        ))}
      </ul>

      <div className="pt-3 mt-2" style={{ borderTop: "1px solid #E8DCC4" }}>
        <div className="flex items-center gap-2 text-codex-subtle text-[10px]">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ color: "#9C6B3F" }}
          >
            <path d="M17 8h1a4 4 0 0 1 0 8h-1" />
            <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" />
          </svg>
          <span className="italic font-medium">Crafted with love</span>
        </div>
      </div>
    </div>
  );
}

function SidebarItem({ cat, isActive, onClick, delay }) {
  // Pure CSS approach: active uses .nav-pill-active (managed by class only)
  // Hover uses Tailwind's hover: utilities; no inline-style mutation needed
  return (
    <li
      onClick={onClick}
      style={{ animationDelay: `${delay}ms` }}
      className={`flex items-center gap-3 cursor-pointer p-2.5 rounded-xl transition-all duration-300 animate-fade-in group ${
        isActive
          ? "nav-pill-active scale-[1.02]"
          : "text-codex-text-soft hover:bg-codex-accent/10 hover:text-codex-text"
      }`}
    >
      <CategoryIcon
        icon={cat.icon}
        label={cat.name}
        active={isActive}
        size="sm"
        className={`transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`}
      />
      <span className="text-[13px] font-medium">{cat.name}</span>
      {isActive && (
        <div
          className="ml-auto w-1.5 h-1.5 rounded-full animate-scale-in"
          style={{ background: "rgba(250,246,239,0.85)" }}
        />
      )}
    </li>
  );
}

export default Sidebar;
