import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";

const ICON = (path) => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    {path}
  </svg>
);

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", end: true, icon: ICON(<><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>) },
  { to: "/admin/products", label: "Products", icon: ICON(<><path d="M17 8h1a4 4 0 0 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z"/><path d="M6 2v3M10 2v3M14 2v3"/></>) },
  { to: "/admin/categories", label: "Categories", icon: ICON(<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>) },
  { to: "/admin/orders", label: "Orders", icon: ICON(<><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" x2="21" y1="6" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></>) },
  { to: "/admin/users", label: "Users", icon: ICON(<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>) },
  { to: "/admin/promos", label: "Promos", icon: ICON(<><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></>) },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem("codex_admin_collapsed") === "true");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => setMobileOpen(false), [location.pathname]);
  useEffect(() => localStorage.setItem("codex_admin_collapsed", String(collapsed)), [collapsed]);

  return (
    <div className="flex h-screen font-sans overflow-hidden" style={{ background: "#F4ECDF" }}>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-30 w-10 h-10 rounded-xl flex items-center justify-center transition-all surface-2"
        aria-label="Open menu"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ color: "#3D2817" }}>
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 animate-fade-in"
          style={{ background: "rgba(42,27,14,0.5)", backdropFilter: "blur(4px)" }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — dark espresso */}
      <aside
        className={`flex flex-col shrink-0 relative overflow-hidden transition-[width] duration-300 z-50 ${
          mobileOpen ? "fixed inset-y-0 left-0 w-[280px]" : "hidden md:flex"
        } ${collapsed ? "md:w-[78px]" : "md:w-[260px]"}`}
        style={{
          background: "linear-gradient(180deg, #3D2817 0%, #2A1B0E 100%)",
          borderRight: "1px solid #5C3D24",
          boxShadow: "1px 0 0 rgba(255,255,255,0.05) inset",
        }}
      >
        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] z-10"
          style={{ background: "linear-gradient(90deg, transparent, rgba(184,139,90,0.6), transparent)" }}
        />
        <div
          className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(184,139,90,0.1), transparent 70%)" }}
        />

        {/* Header — logo */}
        <div
          className={`${collapsed ? "p-3" : "p-4 px-5"} relative z-10`}
          style={{ borderBottom: "1px solid #5C3D24" }}
        >
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-3 group min-w-0"
              aria-label="Back to store"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:rotate-3 shrink-0"
                style={{
                  background: "linear-gradient(135deg, #C9A876 0%, #9C6B3F 50%, #5A3920 100%)",
                  boxShadow: "0 4px 14px rgba(156,107,63,0.5), 0 1px 0 rgba(255,255,255,0.2) inset",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ color: "#FAF6EF" }}>
                  <path d="M17 8h1a4 4 0 0 1 0 8h-1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M6 2v3M10 2v3M14 2v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              {!collapsed && (
                <div className="animate-fade-in min-w-0">
                  <span
                    className="font-display text-lg font-bold block leading-tight tracking-tight truncate"
                    style={{ color: "#FAF6EF" }}
                  >
                    Codex
                  </span>
                  <span
                    className="text-[9px] uppercase tracking-[0.15em] font-semibold"
                    style={{ color: "#C9A876" }}
                  >
                    Admin Panel
                  </span>
                </div>
              )}
            </button>

            {mobileOpen && (
              <button
                onClick={() => setMobileOpen(false)}
                className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                style={{ background: "#5C3D24", color: "#C9A876", border: "1px solid #7A5230" }}
                aria-label="Close menu"
              >
                ✕
              </button>
            )}
          </div>

          {/* Back to Store */}
          {!collapsed && (
            <button
              onClick={() => navigate("/")}
              className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all duration-300 group"
              style={{
                background: "rgba(250,246,239,0.04)",
                color: "#C9A876",
                border: "1px solid #5C3D24",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(184,139,90,0.12)";
                e.currentTarget.style.color = "#FAF6EF";
                e.currentTarget.style.borderColor = "rgba(184,139,90,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(250,246,239,0.04)";
                e.currentTarget.style.color = "#C9A876";
                e.currentTarget.style.borderColor = "#5C3D24";
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="group-hover:-translate-x-0.5 transition-transform">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              <span>Back to Store</span>
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className={`flex-1 ${collapsed ? "p-2" : "p-3"} space-y-1 overflow-y-auto relative z-10 mt-2`}>
          {!collapsed && (
            <p className="text-[9px] uppercase tracking-[0.2em] font-semibold px-4 mb-3" style={{ color: "#8B6F47" }}>
              Navigation
            </p>
          )}
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.to} item={item} collapsed={collapsed} />
          ))}
        </nav>

        {/* Collapse toggle — INSIDE sidebar, properly styled */}
        <div className="hidden md:block px-3 pb-2 relative z-10">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`w-full flex items-center ${collapsed ? "justify-center" : "justify-start gap-2"} px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-300`}
            style={{
              background: "rgba(250,246,239,0.04)",
              color: "#8B6F47",
              border: "1px solid #5C3D24",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(184,139,90,0.1)";
              e.currentTarget.style.color = "#C9A876";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(250,246,239,0.04)";
              e.currentTarget.style.color = "#8B6F47";
            }}
            title={collapsed ? "Expand" : "Collapse"}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              {collapsed ? <polyline points="9,18 15,12 9,6" /> : <polyline points="15,18 9,12 15,6" />}
            </svg>
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>

        {/* User section */}
        <div className={`${collapsed ? "p-3" : "p-4"} relative z-10`} style={{ borderTop: "1px solid #5C3D24" }}>
          {!collapsed ? (
            <>
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #C9A876, #5A3920)",
                    color: "#FAF6EF",
                    boxShadow: "0 3px 8px rgba(156,107,63,0.4), 0 1px 0 rgba(255,255,255,0.2) inset",
                  }}
                >
                  {user?.name?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold line-clamp-1" style={{ color: "#FAF6EF" }}>{user?.name}</p>
                  <p className="text-[9px] uppercase tracking-wider font-medium" style={{ color: "#8B6F47" }}>Administrator</p>
                </div>
              </div>
              <button
                onClick={() => { logout(); navigate("/"); }}
                className="w-full text-center text-xs py-2 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                style={{ color: "#8B6F47", border: "1px solid #5C3D24" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(184,84,80,0.5)";
                  e.currentTarget.style.background = "rgba(184,84,80,0.08)";
                  e.currentTarget.style.color = "#E5A19E";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#5C3D24";
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#8B6F47";
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16,17 21,12 16,7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Sign Out
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs"
                style={{ background: "linear-gradient(135deg, #C9A876, #5A3920)", color: "#FAF6EF" }}
              >
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <button
                onClick={() => { logout(); navigate("/"); }}
                className="hover:opacity-80 transition-colors"
                style={{ color: "#8B6F47" }}
                title="Sign Out"
                aria-label="Sign Out"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16,17 21,12 16,7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto relative" style={{ background: "#F4ECDF" }}>
        <Outlet />
      </main>
    </div>
  );
}

function NavItem({ item, collapsed }) {
  // CSS-only active state via NavLink isActive — no inline mutation
  return (
    <NavLink
      to={item.to}
      end={item.end}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        `flex items-center ${collapsed ? "justify-center" : ""} gap-3 ${
          collapsed ? "px-0 py-3" : "px-4 py-2.5"
        } rounded-xl text-sm font-medium transition-all duration-300 group ${
          isActive ? "nav-pill-active" : ""
        }`
      }
      style={({ isActive }) => (isActive ? undefined : { color: "#A08770" })}
      onMouseEnter={(e) => {
        if (!e.currentTarget.classList.contains("nav-pill-active")) {
          e.currentTarget.style.background = "rgba(184,139,90,0.1)";
          e.currentTarget.style.color = "#FAF6EF";
        }
      }}
      onMouseLeave={(e) => {
        if (!e.currentTarget.classList.contains("nav-pill-active")) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "#A08770";
        }
      }}
    >
      <span className="group-hover:scale-110 transition-transform duration-300 shrink-0">
        {item.icon}
      </span>
      {!collapsed && <span>{item.label}</span>}
    </NavLink>
  );
}
