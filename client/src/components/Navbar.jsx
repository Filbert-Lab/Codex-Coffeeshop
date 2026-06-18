import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Navbar({
  searchQuery,
  setSearchQuery,
  cartCount,
  openAuth,
  openCart,
}) {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="rounded-2xl px-3 sm:px-5 py-3 flex justify-between items-center gap-3 shrink-0 relative overflow-hidden surface-1">
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(156,107,63,0.4), transparent)",
        }}
      />

      {/* Left */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2.5 group shrink-0"
          aria-label="Home"
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:rotate-3"
            style={{
              background:
                "linear-gradient(135deg, #B88B5A 0%, #9C6B3F 50%, #5A3920 100%)",
              boxShadow:
                "0 4px 14px rgba(156,107,63,0.35), 0 1px 0 rgba(255,255,255,0.2) inset",
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              style={{ color: "#FAF6EF" }}
            >
              <path
                d="M17 8h1a4 4 0 0 1 0 8h-1"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M6 2v3M10 2v3M14 2v3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="hidden sm:block">
            <span className="font-display text-lg font-bold text-codex-text tracking-tight group-hover:text-codex-accent transition-colors duration-300">
              Codex
            </span>
            <span className="text-codex-muted text-[9px] block -mt-0.5 tracking-widest uppercase font-semibold">
              Coffee
            </span>
          </div>
        </button>

        <div className="relative flex-1 min-w-0 max-w-xs">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-codex-subtle"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="Cari menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10 pr-9 text-sm py-2.5"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-codex-muted hover:text-codex-text text-xs transition-colors w-5 h-5 flex items-center justify-center rounded-full hover:bg-codex-border/50"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 shrink-0">
        {isAdmin && (
          <button
            onClick={() => navigate("/admin")}
            className="text-[11px] font-semibold px-3 py-2 rounded-lg transition-all duration-300 hidden sm:flex items-center gap-1.5"
            style={{
              background:
                "linear-gradient(180deg, rgba(156,107,63,0.08), rgba(156,107,63,0.03))",
              border: "1px solid rgba(156,107,63,0.25)",
              color: "#9C6B3F",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(180deg, rgba(156,107,63,0.15), rgba(156,107,63,0.08))";
              e.currentTarget.style.borderColor = "rgba(156,107,63,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(180deg, rgba(156,107,63,0.08), rgba(156,107,63,0.03))";
              e.currentTarget.style.borderColor = "rgba(156,107,63,0.25)";
            }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
            </svg>
            Admin
          </button>
        )}

        {user ? (
          <UserChip user={user} onLogout={logout} />
        ) : (
          <button
            onClick={openAuth}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span className="hidden sm:inline">Sign In</span>
          </button>
        )}

        <CartButton onClick={openCart} count={cartCount} />
      </div>
    </nav>
  );
}

function CartButton({ onClick, count }) {
  return (
    <button
      onClick={onClick}
      className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 active:scale-95 lg:cursor-pointer"
      style={{
        background:
          "linear-gradient(135deg, #B88B5A 0%, #9C6B3F 50%, #5A3920 100%)",
        color: "#FAF6EF",
        boxShadow:
          "0 4px 14px rgba(156,107,63,0.35), 0 1px 0 rgba(255,255,255,0.2) inset",
      }}
      aria-label="Open cart"
    >
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      >
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" x2="21" y1="6" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
      {count > 0 && (
        <span
          className="absolute -top-1.5 -right-1.5 w-5 h-5 text-[10px] font-bold rounded-full flex items-center justify-center animate-scale-in"
          style={{
            background: "#B85450",
            color: "#FFFFFF",
            boxShadow: "0 0 0 2px #FFFBF3",
          }}
        >
          {count > 9 ? "9+" : count}
        </span>
      )}
    </button>
  );
}

function UserChip({ user, onLogout }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl"
        style={{ background: "#FFFBF3", border: "1px solid #E8DCC4" }}
      >
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold"
          style={{
            background: "linear-gradient(135deg, #B88B5A, #5A3920)",
            color: "#FAF6EF",
            boxShadow:
              "0 2px 6px rgba(156,107,63,0.3), 0 1px 0 rgba(255,255,255,0.2) inset",
          }}
        >
          {user.name?.[0]?.toUpperCase()}
        </div>
        <span className="text-sm text-codex-text hidden md:block font-medium">
          {user.name.split(" ")[0]}
        </span>
      </div>
      <button
        onClick={onLogout}
        className="text-codex-muted hover:text-codex-danger p-2 rounded-lg hover:bg-red-50 transition-all duration-300"
        title="Logout"
        aria-label="Logout"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16,17 21,12 16,7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      </button>
    </div>
  );
}

export default Navbar;
