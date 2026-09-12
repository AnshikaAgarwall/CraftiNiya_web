import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/**
 * Reset scroll on navigation.
 *
 * Two deliberate exceptions:
 *  - POP (back/forward) keeps the browser's restored position, so returning
 *    from a product lands you where you left the grid.
 *  - A changing query string does not scroll, because that is a filter or
 *    pagination change on the page you are already reading.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType === "POP") return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, navigationType]);

  return null;
}
