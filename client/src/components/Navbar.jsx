import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Navbar({ searchQuery, setSearchQuery, cartCount, openAuth }) {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-white/90 backdrop-blur-xl rounded-2xl px-5 py-3 flex justify-between items-center shrink-0 relative overflow-hidden border border-white/60 shadow-soft">
      <div className="flex items-center gap-4 flex-1">
        {/* Logo */}
        <button onClick={() => navigate("/")} className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-codex-accent to-codex-accent-dark flex items-center justify-center shadow-lg shadow-codex-accent/25 group-hover:shadow-codex-accent/40 transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
              <path d="M17 8h1a4 4 0 0 1 0 8h-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M6 2v3M10 2v3M14 2v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="hidden sm:block">
            <span className="font-display text-lg font-bold text-codex-dark tracking-tight group-hover:text-codex-accent transition-colors duration-300">
              Codex
            </span>
            <span className="text-codex-muted text-[9px] block -mt-0.5 tracking-widest uppercase font-semibold">Coffee</span>
          </div>
        </button>

        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="Cari menu favorit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2.5 pl-10 pr-4 rounded-xl border border-gray-100 outline-none bg-gray-50/80 text-codex-dark placeholder-gray-400 text-sm focus:bg-white focus:border-codex-accent focus:ring-2 focus:ring-codex-accent/10 transition-all duration-300"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-codex-dark text-xs transition-colors w-5 h-5 flex items-center justify-center rounded-full hover:bg-gray-100">✕</button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isAdmin && (
          <button onClick={() => navigate("/admin")} className="text-[11px] bg-codex-navy/5 text-codex-navy font-semibold px-3 py-2 rounded-lg hover:bg-codex-navy/10 transition-all duration-300 border border-codex-navy/10 hidden sm:flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" />
            </svg>
            Admin
          </button>
        )}

        {user ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-1.5 border border-gray-100">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-codex-accent to-codex-accent-dark flex items-center justify-center text-white text-[11px] font-bold shadow-sm">
                {user.name?.[0]?.toUpperCase()}
              </div>
              <span className="text-sm text-codex-dark hidden md:block font-medium">{user.name.split(" ")[0]}</span>
            </div>
            <button onClick={logout} className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-all duration-300" title="Logout">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16,17 21,12 16,7" /><line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        ) : (
          <button onClick={openAuth} className="flex items-center gap-2 text-sm bg-codex-dark hover:bg-codex-warm text-white px-4 py-2.5 rounded-xl transition-all duration-300 font-semibold shadow-sm hover:shadow-md">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
            <span className="hidden sm:inline">Sign In</span>
          </button>
        )}

        {/* Cart */}
        <div className="relative group cursor-pointer hidden lg:block">
          <div className="w-10 h-10 bg-gradient-to-br from-codex-accent to-codex-accent-dark rounded-xl flex items-center justify-center text-white shadow-lg shadow-codex-accent/20 group-hover:shadow-codex-accent/35 group-hover:scale-105 transition-all duration-300">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" x2="21" y1="6" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg animate-scale-in ring-2 ring-white">
              {cartCount}
            </span>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
