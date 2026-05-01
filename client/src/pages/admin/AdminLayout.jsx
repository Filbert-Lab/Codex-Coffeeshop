import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: "📊", end: true },
  { to: "/admin/products", label: "Products", icon: "☕" },
  { to: "/admin/categories", label: "Categories", icon: "🗂️" },
  { to: "/admin/orders", label: "Orders", icon: "📦" },
  { to: "/admin/users", label: "Users", icon: "👥" },
  { to: "/admin/promos", label: "Promos", icon: "🏷️" },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-codex-light font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[240px] glass-dark flex flex-col shrink-0 relative overflow-hidden">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-codex-accent/60 to-transparent z-10" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-codex-accent/8 rounded-full blur-3xl pointer-events-none" />

        <div className="p-6 border-b border-white/[0.06] relative z-10">
          <button onClick={() => navigate("/")} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-codex-accent to-codex-accent-dark flex items-center justify-center shadow-lg shadow-codex-accent/20 group-hover:shadow-codex-accent/40 transition-all duration-300 group-hover:scale-105">
              <span className="text-white text-sm">☕</span>
            </div>
            <span className="font-display text-lg font-bold text-codex-accent">Codex</span>
          </button>
          <p className="text-codex-muted/40 text-[10px] uppercase tracking-widest mt-2 ml-0.5">Admin Panel</p>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto relative z-10">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group ${
                  isActive
                    ? "bg-gradient-to-r from-codex-accent to-codex-accent-dark text-white shadow-lg shadow-codex-accent/20"
                    : "text-codex-muted hover:bg-white/[0.06] hover:text-codex-light"
                }`
              }
            >
              <span className="text-base group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/[0.06] relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-codex-accent to-codex-accent-dark flex items-center justify-center text-white font-bold text-sm shadow-md shadow-codex-accent/15">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-codex-light text-sm font-semibold line-clamp-1">{user?.name}</p>
              <p className="text-codex-muted/40 text-[10px] uppercase tracking-wider">Administrator</p>
            </div>
          </div>
          <button onClick={() => { logout(); navigate("/"); }}
            className="w-full text-center text-xs text-codex-muted/50 hover:text-red-400 border border-white/[0.06] hover:border-red-400/30 hover:bg-red-400/5 py-2.5 rounded-xl transition-all duration-300">
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-codex-accent/[0.03] to-transparent pointer-events-none" />
        <Outlet />
      </main>
    </div>
  );
}
