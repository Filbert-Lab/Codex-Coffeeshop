/**
 * Toast notification — shows a transient message at the bottom of the screen.
 * Supports types: success | error | info | added
 */
function Toast({ toast }) {
  if (!toast) return null;

  const config = {
    success: {
      bg: "linear-gradient(135deg, #1A1208, #251C16)",
      border: "1px solid rgba(16,185,129,0.3)",
      iconBg: "rgba(16,185,129,0.15)",
      iconColor: "#6EE7B7",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ),
    },
    error: {
      bg: "linear-gradient(135deg, #2D0F0F, #1F0808)",
      border: "1px solid rgba(239,68,68,0.4)",
      iconBg: "rgba(239,68,68,0.2)",
      iconColor: "#FCA5A5",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
    },
    added: {
      bg: "linear-gradient(135deg, #1A1208, #251C16)",
      border: "1px solid rgba(232,160,69,0.4)",
      iconBg: "linear-gradient(135deg, #E8A045, #C8832A)",
      iconColor: "#1C1410",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" x2="21" y1="6" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      ),
    },
    info: {
      bg: "linear-gradient(135deg, #1A1208, #251C16)",
      border: "1px solid rgba(99,102,241,0.3)",
      iconBg: "rgba(99,102,241,0.15)",
      iconColor: "#818CF8",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      ),
    },
  };

  const c = config[toast.type] || config.info;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[2000] animate-slide-up flex items-center gap-3 py-3 px-4 rounded-2xl backdrop-blur-md max-w-[90vw]"
      style={{
        background: c.bg,
        border: c.border,
        boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
      }}
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
        style={{ background: c.iconBg, color: c.iconColor }}
      >
        {c.icon}
      </div>
      <span className="text-sm font-medium text-codex-text pr-1">{toast.msg}</span>
    </div>
  );
}

export default Toast;
