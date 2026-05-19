import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

const navItems = [
  { to: "/admin", label: "Dashboard", end: true, icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
  )},
  { to: "/admin/products", label: "Products", icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 8h1a4 4 0 0 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z"/><path d="M6 2v3M10 2v3M14 2v3"/></svg>
  )},
  { to: "/admin/categories", label: "Categories", icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
  )},
  { to: "/admin/orders", label: "Orders", icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" x2="21" y1="6" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
  )},
  { to: "/admin/users", label: "Users", icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  )},
  { to: "/admin/promos", label: "Promos", icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
  )},
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen font-sans overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <aside className={`${collapsed ? "w-[72px]" : "w-[250px]"} glass-dark flex flex-col shrink-0 relative overflow-hidden transition-all duration-300`}>
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-codex-accent via-codex-accent-light to-codex-accent-dark z-10" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-codex-accent/5 rounded-full blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className={`${collapsed ? "p-4" : "p-5 px-6"} border-b border-white/[0.06] relative z-10`}>
          <button onClick={() => navigate("/")} className="flex items-center gap-3 group w-full">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-codex-accent to-codex-accent-dark flex items-center justify-center shadow-lg shadow-codex-accent/25 group-hover:shadow-codex-accent/40 transition-all duration-300 group-hover:scale-105 group-hover:rotate-3 shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M17 8h1a4 4 0 0 1 0 8h-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M6 2v3M10 2v3M14 2v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            {!collapsed && (
              <div className="animate-fade-in">
                <span className="font-display text-lg font-bold text-white block leading-tight tracking-tight">Codex</span>
                <span className="text-gray-500 text-[9px] uppercase tracking-[0.15em] font-semibold">Admin Panel</span>
              </div>
            )}
          </button>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute top-[26px] -right-3 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-codex-accent hover:border-codex-accent/30 transition-all duration-200 z-20 shadow-md"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            {collapsed ? <polyline points="9,18 15,12 9,6" /> : <polyline points="15,18 9,12 15,6" />}
          </svg>
        </button>

        {/* Navigation */}
        <nav className={`flex-1 ${collapsed ? "p-2" : "p-3"} space-y-1 overflow-y-auto relative z-10 mt-2`}>
          {!collapsed && (
            <p className="text-[9px] text-gray-600 uppercase tracking-[0.2em] font-semibold px-4 mb-3">Navigation</p>
          )}
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center ${collapsed ? "justify-center" : ""} gap-3 ${collapsed ? "px-0 py-3" : "px-4 py-2.5"} rounded-xl text-sm font-medium transition-all duration-300 group relative ${
                  isActive
                    ? "bg-gradient-to-r from-codex-accent to-codex-accent-dark text-white shadow-lg shadow-codex-accent/30"
                    : "text-gray-400 hover:bg-white/[0.06] hover:text-white"
                }`
              }
            >
              <span className="group-hover:scale-110 transition-transform duration-300 shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className={`${collapsed ? "p-3" : "p-4"} border-t border-white/[0.06] relative z-10`}>
          {!collapsed ? (
            <>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-codex-accent to-codex-accent-dark flex items-center justify-center text-white font-bold text-sm shadow-md shadow-codex-accent/15 shrink-0">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold line-clamp-1">{user?.name}</p>
                  <p className="text-gray-500 text-[9px] uppercase tracking-wider font-medium">Administrator</p>
                </div>
              </div>
              <button onClick={() => { logout(); navigate("/"); }}
                className="w-full text-center text-xs text-gray-500 hover:text-red-400 border border-white/[0.06] hover:border-red-400/30 hover:bg-red-400/5 py-2 rounded-xl transition-all duration-300 flex items-center justify-center gap-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16,17 21,12 16,7" /><line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Sign Out
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-codex-accent to-codex-accent-dark flex items-center justify-center text-white font-bold text-xs shadow-md">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <button onClick={() => { logout(); navigate("/"); }} className="text-gray-500 hover:text-red-400 transition-colors" title="Sign Out">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16,17 21,12 16,7" /><line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative bg-gray-50/80">
        <Outlet />
      </main>
    </div>
  );
}
