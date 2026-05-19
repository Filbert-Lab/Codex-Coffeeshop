import { useState, useEffect } from "react";

/**
 * useDebounce — delays updating a value until N ms after the last change.
 * Prevents API spam on every keystroke.
 *
 * @param {*} value - the input value to debounce
 * @param {number} delay - milliseconds to wait (default 300)
 * @returns the debounced value
 */
export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
