import { useState, useCallback, useRef, useEffect } from "react";

/**
 * useToast — manages a single toast notification with auto-dismiss.
 * Returns { toast, showToast } where showToast(msg, type, duration?).
 */
export function useToast() {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const showToast = useCallback((msg, type = "success", duration = 2500) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast({ msg, type, id: Date.now() });
    timerRef.current = setTimeout(() => setToast(null), duration);
  }, []);

  // Cleanup on unmount
  useEffect(() => () => timerRef.current && clearTimeout(timerRef.current), []);

  return { toast, showToast };
}
