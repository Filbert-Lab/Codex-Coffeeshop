import { useState, useEffect, useRef } from "react";
import * as api from "../api";

const POLL_INTERVAL = 2000;

/**
 * IncomingCallNotification — polls /api/calls/incoming for ringing calls.
 * When found, shows a floating notification card with Accept / Decline.
 *
 * Uses recursive setTimeout (not setInterval) to avoid overlapping requests
 * on cold starts. Pauses polling when the tab is hidden.
 */
export default function IncomingCallNotification({ onAccept, disabled }) {
  const [incomingCall, setIncomingCall] = useState(null);
  const [dismissed, setDismissed] = useState(new Set());
  const timerRef = useRef(null);
  const abortRef = useRef(null);
  const visibleRef = useRef(true);

  useEffect(() => {
    const onVisibility = () => {
      visibleRef.current = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    if (disabled) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    let active = true;

    const poll = async () => {
      if (!active || !visibleRef.current) {
        if (active) {
          timerRef.current = setTimeout(poll, POLL_INTERVAL);
        }
        return;
      }

      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();

      try {
        const res = await api.getIncomingCall(abortRef.current.signal);
        const call = res?.data;
        if (call && !dismissed.has(call.id)) {
          setIncomingCall(call);
        } else if (!call) {
          setIncomingCall(null);
        }
      } catch {
        // ignore polling/abort errors
      }

      if (active) {
        timerRef.current = setTimeout(poll, POLL_INTERVAL);
      }
    };

    timerRef.current = setTimeout(poll, POLL_INTERVAL);

    return () => {
      active = false;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (abortRef.current) {
        abortRef.current.abort();
        abortRef.current = null;
      }
    };
  }, [disabled, dismissed]);

  const handleAccept = () => {
    if (!incomingCall) return;
    onAccept(incomingCall);
    setDismissed((prev) => new Set(prev).add(incomingCall.id));
    setIncomingCall(null);
  };

  const handleDecline = async () => {
    if (!incomingCall) return;
    await api.declineCall(incomingCall.id).catch(() => {});
    setDismissed((prev) => new Set(prev).add(incomingCall.id));
    setIncomingCall(null);
  };

  if (!incomingCall) return null;

  return (
    <div
      className="fixed top-4 right-4 z-[2500] w-[320px] max-w-[90vw] animate-slide-up"
      style={{
        background: "linear-gradient(180deg, #3D2817 0%, #2A1B0E 100%)",
        border: "1px solid #5C3D24",
        borderRadius: "20px",
        boxShadow: "0 12px 40px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.06) inset",
        overflow: "hidden",
      }}
    >
      {/* Top accent */}
      <div
        className="h-[3px]"
        style={{
          background: "linear-gradient(90deg, #B88B5A, #9C6B3F, #B88B5A)",
          animation: "shimmer 2s infinite linear",
          backgroundSize: "200% 100%",
        }}
      />
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          {/* Pulsing avatar */}
          <div className="relative">
            <div
              className="absolute inset-0 rounded-full animate-ping"
              style={{ background: "rgba(184,139,90,0.25)", animationDuration: "1.8s" }}
            />
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm relative"
              style={{
                background: "linear-gradient(135deg, #C9A876, #9C6B3F)",
                color: "#FAF6EF",
              }}
            >
              {incomingCall.caller_name?.[0]?.toUpperCase() || "C"}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate" style={{ color: "#FAF6EF" }}>
              {incomingCall.caller_name}
            </p>
            <p className="text-xs flex items-center gap-1" style={{ color: "#C9A876" }}>
              <span
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{ background: "#5A9070", animation: "pulseSoft 1.5s infinite" }}
              />
              Incoming video call…
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDecline}
            className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95"
            style={{
              background: "rgba(184,84,80,0.12)",
              border: "1px solid rgba(184,84,80,0.3)",
              color: "#E5A19E",
            }}
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95 flex items-center justify-center gap-1.5"
            style={{
              background: "linear-gradient(135deg, #5A9070, #3F7A55)",
              color: "#FAF6EF",
              boxShadow: "0 4px 14px rgba(90,144,112,0.3)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: "rotate(135deg)" }}>
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
