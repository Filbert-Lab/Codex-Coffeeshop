import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

const navItems = [
  { to:"/admin", label:"Dashboard", end:true, icon:<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
  { to:"/admin/products", label:"Products", icon:<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 8h1a4 4 0 0 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z"/><path d="M6 2v3M10 2v3M14 2v3"/></svg> },
  { to:"/admin/categories", label:"Categories", icon:<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg> },
  { to:"/admin/orders", label:"Orders", icon:<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" x2="21" y1="6" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> },
  { to:"/admin/users", label:"Users", icon:<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { to:"/admin/promos", label:"Promos", icon:<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg> },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen font-sans overflow-hidden" style={{ background:"#1C1410" }}>
      {/* Sidebar */}
      <aside className={`${collapsed ? "w-[72px]" : "w-[250px]"} flex flex-col shrink-0 relative overflow-hidden transition-all duration-300`}
        style={{ background:"#1A1208", borderRight:"1px solid #3D2E22" }}>
        {/* Top accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-codex-accent/70 to-transparent z-10" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full blur-3xl pointer-events-none" style={{ background:"rgba(232,160,69,0.04)" }} />

        {/* Logo */}
        <div className={`${collapsed ? "p-4" : "p-5 px-6"} relative z-10`} style={{ borderBottom:"1px solid #3D2E22" }}>
          <button onClick={() => navigate("/")} className="flex items-center gap-3 group w-full">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-codex-accent to-codex-accent-dark flex items-center justify-center shadow-lg shadow-codex-accent/25 group-hover:shadow-codex-accent/40 transition-all duration-300 group-hover:scale-105 group-hover:rotate-3 shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-codex-bg">
                <path d="M17 8h1a4 4 0 0 1 0 8h-1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M6 2v3M10 2v3M14 2v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            {!collapsed && (
              <div className="animate-fade-in">
                <span className="font-display text-lg font-bold text-codex-text block leading-tight tracking-tight">Codex</span>
                <span className="text-codex-muted text-[9px] uppercase tracking-[0.15em] font-semibold">Admin Panel</span>
              </div>
            )}
          </button>
        </div>

        {/* Collapse toggle */}
        <button onClick={() => setCollapsed(!collapsed)}
          className="absolute top-[26px] -right-3 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 z-20 shadow-md"
          style={{ background:"#2E2218", border:"1px solid #3D2E22", color:"#8A7060" }}
          onMouseEnter={e => { e.currentTarget.style.color="#E8A045"; e.currentTarget.style.borderColor="rgba(232,160,69,0.3)"; }}
          onMouseLeave={e => { e.currentTarget.style.color="#8A7060"; e.currentTarget.style.borderColor="#3D2E22"; }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            {collapsed ? <polyline points="9,18 15,12 9,6"/> : <polyline points="15,18 9,12 15,6"/>}
          </svg>
        </button>

        {/* Nav */}
        <nav className={`flex-1 ${collapsed ? "p-2" : "p-3"} space-y-1 overflow-y-auto relative z-10 mt-2`}>
          {!collapsed && <p className="text-[9px] text-codex-muted uppercase tracking-[0.2em] font-semibold px-4 mb-3">Navigation</p>}
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center ${collapsed ? "justify-center" : ""} gap-3 ${collapsed ? "px-0 py-3" : "px-4 py-2.5"} rounded-xl text-sm font-medium transition-all duration-300 group`
              }
              style={({ isActive }) => isActive
                ? { background:"linear-gradient(135deg, #E8A045, #C8832A)", color:"#1C1410", boxShadow:"0 4px 16px rgba(232,160,69,0.25)" }
                : { color:"#8A7060" }
              }
              onMouseEnter={(e) => { if (!e.currentTarget.style.background.includes("gradient")) { e.currentTarget.style.background="rgba(232,160,69,0.06)"; e.currentTarget.style.color="#F0E6D8"; }}}
              onMouseLeave={(e) => { if (!e.currentTarget.style.background.includes("gradient")) { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="#8A7060"; }}}
            >
              <span className="group-hover:scale-110 transition-transform duration-300 shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className={`${collapsed ? "p-3" : "p-4"} relative z-10`} style={{ borderTop:"1px solid #3D2E22" }}>
          {!collapsed ? (
            <>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-codex-accent to-codex-accent-dark flex items-center justify-center text-codex-bg font-bold text-sm shadow-md shadow-codex-accent/15 shrink-0">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-codex-text text-sm font-semibold line-clamp-1">{user?.name}</p>
                  <p className="text-codex-muted text-[9px] uppercase tracking-wider font-medium">Administrator</p>
                </div>
              </div>
              <button onClick={() => { logout(); navigate("/"); }}
                className="w-full text-center text-xs text-codex-muted hover:text-red-400 py-2 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                style={{ border:"1px solid #3D2E22" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(239,68,68,0.3)"; e.currentTarget.style.background="rgba(239,68,68,0.05)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor="#3D2E22"; e.currentTarget.style.background="transparent"; }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Sign Out
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-codex-accent to-codex-accent-dark flex items-center justify-center text-codex-bg font-bold text-xs shadow-md">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <button onClick={() => { logout(); navigate("/"); }} className="text-codex-muted hover:text-red-400 transition-colors" title="Sign Out">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto relative" style={{ background:"#1C1410" }}>
        <Outlet />
      </main>
    </div>
  );
}
