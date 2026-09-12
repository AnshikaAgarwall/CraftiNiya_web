import { useCallback, useSyncExternalStore } from "react";

/**
 * Subscribe to a CSS media query from JS.
 *
 * Uses useSyncExternalStore rather than useState + useEffect: matchMedia is an
 * external store, and this is the API built for that. It also removes the
 * tearing window where a render could show a stale match before the effect
 * catches up.
 */
export function useMediaQuery(query) {
  const subscribe = useCallback(
    (onChange) => {
      if (typeof window === "undefined" || !window.matchMedia) return () => {};
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );

  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia(query).matches;
  }, [query]);

  // Server/prerender snapshot: assume the desktop case rather than flashing
  // a mobile layout into the static HTML.
  const getServerSnapshot = () => false;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export const BREAKPOINTS = {
  sm: "(max-width: 640px)",
  md: "(max-width: 900px)",
  lg: "(max-width: 1180px)",
};

export const useIsMobile = () => useMediaQuery(BREAKPOINTS.sm);
export const useIsTablet = () => useMediaQuery(BREAKPOINTS.md);

export default useMediaQuery;
