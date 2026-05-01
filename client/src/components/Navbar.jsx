import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Navbar({ searchQuery, setSearchQuery, cartCount, openAuth }) {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="flex justify-between items-center bg-codex-dark text-codex-light py-4 px-6 rounded-2xl shadow-lg shrink-0">
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={() => navigate("/")}
          className="font-display text-2xl font-bold text-codex-accent tracking-wide hover:opacity-90 transition"
        >
          Codex ☕
        </button>
        <input
          type="text"
          placeholder="Search drinks or pastries..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="py-2.5 px-4 rounded-xl border-none outline-none bg-codex-surface text-codex-light placeholder-codex-muted w-64 focus:ring-2 focus:ring-codex-accent/50 transition"
        />
      </div>

      <div className="flex items-center gap-3">
        {isAdmin && (
          <button
            onClick={() => navigate("/admin")}
            className="text-xs bg-codex-accent text-white font-semibold px-3 py-1.5 rounded-lg hover:brightness-110 transition"
          >
            Admin Panel
          </button>
        )}

        {user ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-codex-muted hidden md:block">Hi, {user.name.split(" ")[0]}</span>
            <button
              onClick={logout}
              className="text-xs text-codex-muted hover:text-codex-light border border-codex-surface px-3 py-1.5 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={openAuth}
            className="flex items-center gap-2 text-sm bg-codex-surface hover:bg-codex-accent/20 px-3 py-2 rounded-xl transition"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
            Login
          </button>
        )}

        <div className="relative">
          <div className="w-10 h-10 bg-codex-accent rounded-full flex items-center justify-center font-bold text-white">
            {cartCount}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;