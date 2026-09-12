import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Delay a rapidly-changing value. Used by the search field and the price
 * slider so a drag from ₹99 to ₹4,000 fires one request rather than forty.
 */
export function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

/** Debounce a callback, cancelling any pending run on unmount. */
export function useDebouncedCallback(callback, delay = 300) {
  const timerRef = useRef(null);
  const cbRef = useRef(callback);

  // Kept current in an effect rather than during render — a render can be
  // discarded, and mutating a ref on a throwaway render is what the
  // "no refs during render" rule exists to prevent.
  useEffect(() => {
    cbRef.current = callback;
  });

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return useCallback(
    (...args) => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => cbRef.current(...args), delay);
    },
    [delay],
  );
}

export default useDebouncedValue;
