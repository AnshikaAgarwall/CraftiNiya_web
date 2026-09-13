/* eslint-disable react-refresh/only-export-components --
   Provider and its consumer hook belong together: splitting them into two
   files to satisfy Fast Refresh would add four files that exist only to
   hold a one-line export. Fast Refresh falls back to a full reload for
   this file, which is an acceptable trade for a provider that rarely changes. */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

/**
 * Transient UI state: the search overlay, the mobile menu, and toasts. Kept
 * out of the domain contexts so opening an overlay does not re-render every
 * product card.
 */

const UIContext = createContext(null);
const TOAST_TTL = 4000;

export function UIProvider({ children }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef(new Map());

  const dismissToast = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const toast = useCallback(
    (message, { type = "info", action = null, ttl = TOAST_TTL } = {}) => {
      const id = `t-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((list) => [...list, { id, message, type, action }]);
      timersRef.current.set(
        id,
        setTimeout(() => dismissToast(id), ttl),
      );
      return id;
    },
    [dismissToast],
  );

  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach(clearTimeout);
  }, []);

  /**
   * Lock the page behind any open overlay. Padding compensates for the
   * scrollbar's width so the layout does not jump sideways as it disappears.
   */
  const anyOverlayOpen = searchOpen || menuOpen;
  useEffect(() => {
    if (!anyOverlayOpen) return undefined;
    const { body } = document;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = body.style.overflow;
    const prevPadding = body.style.paddingRight;

    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPadding;
    };
  }, [anyOverlayOpen]);

  // Escape closes whatever is on top.
  useEffect(() => {
    if (!anyOverlayOpen) return undefined;
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      if (searchOpen) setSearchOpen(false);
      else if (menuOpen) setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [anyOverlayOpen, searchOpen, menuOpen]);

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const toggleMenu = useCallback(() => setMenuOpen((v) => !v), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const closeAll = useCallback(() => {
    setSearchOpen(false);
    setMenuOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      searchOpen,
      openSearch,
      closeSearch,

      menuOpen,
      toggleMenu,
      closeMenu,

      closeAll,

      toasts,
      toast,
      dismissToast,
    }),
    [searchOpen, openSearch, closeSearch, menuOpen, toggleMenu, closeMenu, closeAll, toasts, toast, dismissToast],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used inside <UIProvider>");
  return ctx;
}

export default UIContext;
