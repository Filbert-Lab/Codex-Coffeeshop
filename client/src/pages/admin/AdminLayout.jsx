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
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 bg-codex-dark flex flex-col shrink-0 shadow-xl">
        <div className="p-6 border-b border-codex-surface">
          <button onClick={() => navigate("/")} className="font-display text-2xl font-bold text-codex-accent block">Codex ☕</button>
          <p className="text-codex-muted text-xs mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-codex-accent text-white shadow-md shadow-codex-accent/30"
                    : "text-codex-muted hover:bg-codex-surface hover:text-codex-light"
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-codex-surface">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-codex-accent flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="text-codex-light text-sm font-semibold line-clamp-1">{user?.name}</p>
              <p className="text-codex-muted text-xs">Administrator</p>
            </div>
          </div>
          <button onClick={() => { logout(); navigate("/"); }}
            className="w-full text-center text-xs text-codex-muted hover:text-red-400 border border-codex-surface hover:border-red-400/50 py-2 rounded-lg transition">
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
