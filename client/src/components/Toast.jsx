/**
 * Toast notification — bottom-center, smooth slide-up animation.
 * Uses toast-in keyframe that respects translate(-50%, ...) to prevent
 * horizontal jump when toast appears.
 */
const VARIANTS = {
  success: {
    bg: "linear-gradient(180deg, #FFFFFF 0%, #F4ECDF 100%)",
    border: "1px solid #BFE5CC",
    iconBg: "linear-gradient(135deg, #5A9070, #3F7A55)",
    iconColor: "#FFFFFF",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
  error: {
    bg: "linear-gradient(180deg, #FFFFFF 0%, #F4ECDF 100%)",
    border: "1px solid #E5A19E",
    iconBg: "linear-gradient(135deg, #B85450, #963A37)",
    iconColor: "#FFFFFF",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
  added: {
    bg: "linear-gradient(180deg, #FFFFFF 0%, #FBF4E6 100%)",
    border: "1px solid #D4C19D",
    iconBg: "linear-gradient(135deg, #B88B5A, #7A5230)",
    iconColor: "#FAF6EF",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" x2="21" y1="6" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
  info: {
    bg: "linear-gradient(180deg, #FFFFFF 0%, #F4ECDF 100%)",
    border: "1px solid #A8B5F0",
    iconBg: "linear-gradient(135deg, #5A6FB8, #3F4FA0)",
    iconColor: "#FFFFFF",
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
      key={toast.id}
      role="status"
      aria-live="polite"
      className="fixed bottom-6 z-[2000] flex items-center gap-3 py-3 px-4 rounded-2xl max-w-[90vw]"
      style={{
        // Position centered with translate, animation handles slide-in
        left: "50%",
        transform: "translateX(-50%)",
        animation: "toastIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards",
        background: v.bg,
        border: v.border,
        boxShadow: "0 8px 24px rgba(61,40,23,0.18), 0 1px 0 rgba(255,255,255,0.7) inset",
      }}
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
        style={{
          background: v.iconBg,
          color: v.iconColor,
          boxShadow: "0 2px 6px rgba(0,0,0,0.15), 0 1px 0 rgba(255,255,255,0.25) inset",
        }}
      >
        {v.icon}
      </div>
      <span className="text-sm font-medium text-codex-text pr-1">{toast.msg}</span>
    </div>
  );
}

export default Toast;
