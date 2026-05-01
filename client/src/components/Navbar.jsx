import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Navbar({ searchQuery, setSearchQuery, cartCount, openAuth }) {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="glass-dark rounded-2xl px-6 py-4 flex justify-between items-center shrink-0 relative overflow-hidden">
      {/* Subtle accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-codex-accent/60 to-transparent" />

      <div className="flex items-center gap-5 flex-1">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-codex-accent to-codex-accent-dark flex items-center justify-center shadow-lg shadow-codex-accent/20 group-hover:shadow-codex-accent/40 transition-all duration-300 group-hover:scale-105">
            <span className="text-white text-lg">☕</span>
          </div>
          <span className="font-display text-xl font-bold text-codex-accent tracking-wide group-hover:text-codex-accent/80 transition-colors duration-300">
            Codex
          </span>
        </button>

        <div className="relative flex-1 max-w-xs">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-codex-muted/60 pointer-events-none"
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="Search menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2.5 pl-10 pr-4 rounded-xl border-none outline-none bg-white/[0.07] text-codex-light placeholder-codex-muted/50 text-sm focus:bg-white/[0.12] focus:ring-1 focus:ring-codex-accent/30 transition-all duration-300"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {isAdmin && (
          <button
            onClick={() => navigate("/admin")}
            className="text-xs bg-codex-accent/15 text-codex-accent font-semibold px-3.5 py-2 rounded-lg hover:bg-codex-accent/25 transition-all duration-300 border border-codex-accent/20"
          >
            ✦ Admin
          </button>
        )}

        {user ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/[0.06] rounded-lg px-3 py-1.5">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-codex-accent to-codex-accent-dark flex items-center justify-center text-white text-[10px] font-bold">
                {user.name?.[0]?.toUpperCase()}
              </div>
              <span className="text-sm text-codex-muted hidden md:block">
                {user.name.split(" ")[0]}
              </span>
            </div>
            <button
              onClick={logout}
              className="text-xs text-codex-muted/70 hover:text-red-400 px-2.5 py-1.5 rounded-lg hover:bg-red-400/10 transition-all duration-300"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={openAuth}
            className="flex items-center gap-2 text-sm bg-white/[0.07] hover:bg-white/[0.12] text-codex-light/80 hover:text-codex-light px-4 py-2.5 rounded-xl transition-all duration-300 border border-white/[0.06]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
            Sign In
          </button>
        )}

        {/* Cart Badge */}
        <div className="relative group cursor-pointer">
          <div className="w-10 h-10 bg-gradient-to-br from-codex-accent to-codex-accent-dark rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-codex-accent/20 group-hover:shadow-codex-accent/40 group-hover:scale-105 transition-all duration-300">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" x2="21" y1="6" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg animate-scale-in ring-2 ring-codex-dark">
              {cartCount}
            </span>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;