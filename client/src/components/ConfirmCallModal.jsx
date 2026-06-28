/**
 * ConfirmCallModal — asks the customer to confirm before starting a video
 * support call. Shown after they tap the Live Support button (and after
 * signing in, if needed). On confirm the caller flow begins.
 */
export default function ConfirmCallModal({ onConfirm, onCancel }) {
  return (
    <div
      onClick={onCancel}
      className="fixed inset-0 backdrop-blur-sm z-[2000] flex justify-center items-center animate-fade-in"
      style={{ background: "rgba(0,0,0,0.75)" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[380px] max-w-[92vw] p-7 rounded-2xl text-codex-text relative animate-slide-up overflow-hidden"
        style={{
          background: "#FFFFFF",
          border: "1px solid #E8DCC4",
          boxShadow: "0 24px 64px rgba(42,27,14,0.5)",
        }}
      >
        {/* Decorative top accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-codex-accent/70 to-transparent" />

        <div className="text-center mb-6 relative z-10">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-codex-accent to-codex-accent-deep flex items-center justify-center shadow-lg shadow-codex-accent/20 mb-3">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FAF6EF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M23 7l-7 5 7 5V7z" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
          </div>
          <h3 className="text-lg font-bold font-display">
            Start a voice call?
          </h3>
          <p className="text-sm text-codex-muted mt-1.5 leading-relaxed">
            You&apos;ll be connected with our support team. Your microphone will
            be used during the call.
          </p>
        </div>

        <div className="flex gap-3 relative z-10">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95"
            style={{
              background: "#F4ECDF",
              border: "1px solid #E8DCC4",
              color: "#5C4530",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95 flex items-center justify-center gap-1.5"
            style={{
              background: "linear-gradient(135deg, #9C6B3F, #7A5230)",
              color: "#FAF6EF",
              boxShadow: "0 4px 14px rgba(156,107,63,0.3)",
            }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ transform: "rotate(135deg)" }}
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            Call Now
          </button>
        </div>
      </div>
    </div>
  );
}
