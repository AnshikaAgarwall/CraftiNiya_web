import { useEffect, useRef, useState } from "react";

const SUPPORTED = typeof IntersectionObserver !== "undefined";

/**
 * IntersectionObserver as a hook.
 *
 * Used to play only the reel that is actually on screen, and to lazy-load
 * images. Playing six videos at once is the fastest way to make a phone hot
 * and a page janky.
 *
 * Where the observer is unavailable the initial state is `true`, so content
 * gated on visibility is shown rather than hidden — degrading to "always
 * visible" is the safe direction.
 */
export function useInView({ threshold = 0.5, rootMargin = "0px", once = false } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(!SUPPORTED);

  useEffect(() => {
    const node = ref.current;
    if (!node || !SUPPORTED) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting && once) observer.disconnect();
      },
      { threshold, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return [ref, inView];
}

export default useInView;
