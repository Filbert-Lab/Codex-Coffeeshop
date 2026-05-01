function Sidebar({ categories, activeCategory, setActiveCategory }) {
  return (
    <div className="bg-codex-dark text-codex-light h-full rounded-2xl p-5 shadow-lg flex flex-col">
      <h3 className="font-display text-lg font-bold text-codex-accent border-b border-codex-surface pb-3 mb-4">
        Menu
      </h3>
      <ul className="list-none space-y-1 flex-1">
        {categories.map((cat) => (
          <li
            key={cat.name || cat}
            onClick={() => setActiveCategory(cat.name || cat)}
            className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl transition-all duration-200 ${
              activeCategory === (cat.name || cat)
                ? "bg-codex-accent text-white font-semibold shadow-md"
                : "hover:bg-codex-surface text-codex-muted hover:text-codex-light"
            }`}
          >
            <span className="text-lg">{cat.icon || "☕"}</span>
            <span className="text-sm">{cat.name || cat}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;