import { useMediaQuery } from "./useMediaQuery.js";

/**
 * Whether the viewer has asked their OS to reduce motion.
 *
 * The CSS media query in base.css freezes animations, but freezing is not the
 * same as designing for stillness. Three parts of this site auto-animate — the
 * hero carousel, the reels rail and the auth filmstrip — and each needs to swap
 * to a genuinely static presentation rather than a stalled one. That decision
 * has to happen in JS, which is what this hook is for.
 */
export function useReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

export default useReducedMotion;
