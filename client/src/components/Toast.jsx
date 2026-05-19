/**
 * Toast notification — bottom-center, animated slide-up.
 * Variants: success | error | info | added
 */
const VARIANTS = {
  success: {
    bg: "linear-gradient(180deg, #1F3A2A 0%, #15281D 100%)",
    border: "1px solid rgba(93,212,166,0.35)",
    iconBg: "linear-gradient(135deg, #5DD4A6, #3DB37E)",
    iconColor: "#0F1F18",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
  error: {
    bg: "linear-gradient(180deg, #3A1818 0%, #281010 100%)",
    border: "1px solid rgba(242,107,107,0.4)",
    iconBg: "linear-gradient(135deg, #F26B6B, #D44545)",
    iconColor: "#fff",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
  added: {
    bg: "linear-gradient(180deg, #36281D 0%, #2D2118 100%)",
    border: "1px solid rgba(232,155,61,0.4)",
    iconBg: "linear-gradient(135deg, #F4B96A, #C8832A)",
    iconColor: "#1B1410",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" x2="21" y1="6" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
  info: {
    bg: "linear-gradient(180deg, #1E2542 0%, #161B33 100%)",
    border: "1px solid rgba(123,143,245,0.4)",
    iconBg: "linear-gradient(135deg, #7B8FF5, #5563D4)",
    iconColor: "#fff",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
  },
};

function Toast({ toast }) {
  if (!toast) return null;
  const v = VARIANTS[toast.type] || VARIANTS.info;
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[2000] animate-slide-up flex items-center gap-3 py-3 px-4 rounded-2xl max-w-[90vw]"
      style={{
        background: v.bg,
        border: v.border,
        boxShadow: "0 1px 0 rgba(255,255,255,0.04) inset, 0 12px 36px rgba(0,0,0,0.5)",
      }}
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
        style={{
          background: v.iconBg,
          color: v.iconColor,
          boxShadow: "0 1px 0 rgba(255,255,255,0.2) inset",
        }}
      >
        {v.icon}
      </div>
      <span className="text-sm font-medium text-codex-text pr-1">{toast.msg}</span>
    </div>
  );
}

export default Toast;
