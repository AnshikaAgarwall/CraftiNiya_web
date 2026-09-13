import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/cn.js";
import { BRAND } from "../../config/site.js";
import { useAsync } from "../../hooks/useAsync.js";
import { useInView } from "../../hooks/useInView.js";
import { useReducedMotion } from "../../hooks/useReducedMotion.js";
import promoService from "../../services/promoService.js";
import s from "./HeroCarousel.module.css";

/**
 * Home-page hero: full-bleed banners that advance on their own.
 *
 * - Each banner is a single link — no buttons; the whole slide is the target.
 * - Each slide plays a short looping clip that slowly zooms out. The zoom runs
 *   for exactly SLIDE_MS and its `animationend` moves to the next slide, so
 *   pausing the animation pauses the carousel with no timer to drift.
 * - There is no visible pause control, by request. Motion still stops on mouse
 *   hover and keyboard focus, while the hero is off screen or the tab is
 *   hidden, and entirely under prefers-reduced-motion (posters replace video;
 *   only the dots change slides). WCAG 2.2.2 asks for an explicit control, so
 *   this is a known shortfall rather than full conformance.
 * - Clips are muted + playsInline: without both, iOS Safari will not play them.
 */

const SLIDE_MS = 5000;

export default function HeroCarousel() {
  const reducedMotion = useReducedMotion();
  const { data: slides, error } = useAsync((opts) => promoService.getHeroSlides(opts), []);

  const [index, setIndex] = useState(0);
  // Incremented whenever a slide becomes active and folded into its media key,
  // so a returning slide remounts — restarting its clip and zoom from the top —
  // while the outgoing slide keeps its key and simply freezes as it fades.
  const [activations, setActivations] = useState({});
  const [hovered, setHovered] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const [pageHidden, setPageHidden] = useState(
    () => typeof document !== "undefined" && document.visibilityState === "hidden",
  );
  const [sectionRef, inView] = useInView({ threshold: 0.2 });
  const videoRefs = useRef(new Map());

  const count = slides?.length ?? 0;
  const current = count ? index % count : 0;
  const paused = hovered || keyboardFocus || pageHidden || !inView;

  const goTo = useCallback(
    (next) => {
      if (!count) return;
      const target = ((next % count) + count) % count;
      if (target === current) return;
      const id = slides[target].id;
      setIndex(target);
      setActivations((a) => ({ ...a, [id]: (a[id] ?? 0) + 1 }));
    },
    [count, current, slides],
  );

  useEffect(() => {
    const onVisibility = () => setPageHidden(document.visibilityState === "hidden");
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // Only the visible slide's clip plays, and only while the hero can be seen.
  useEffect(() => {
    const currentId = slides?.[current]?.id;
    videoRefs.current.forEach((video, id) => {
      if (id === currentId && inView && !pageHidden && !reducedMotion) {
        video.play().catch(() => {
          /* Autoplay refused (e.g. data saver) — the poster stays up. */
        });
      } else {
        video.pause();
      }
    });
  }, [slides, current, activations, inView, pageHidden, reducedMotion]);

  const handleZoomEnd = (event) => {
    if (event.target !== event.currentTarget) return; // ignore bubbled child animations
    goTo(current + 1);
  };

  // A hero that failed to load collapses rather than opening the home page
  // with an error card.
  if (error) return null;

  return (
    <section
      ref={sectionRef}
      className={cn(s.hero, paused && s.paused)}
      style={{ "--hero-slide-ms": `${SLIDE_MS}ms` }}
      aria-roledescription="carousel"
      aria-label="Featured collections"
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setHovered(false)}
      // Keyboard focus pauses; a mouse click on a dot must not freeze the carousel.
      onFocus={(e) => e.target.matches(":focus-visible") && setKeyboardFocus(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setKeyboardFocus(false);
      }}
    >
      {/* Slide titles live inside links, so the page heading is provided here. */}
      <h1 className="sr-only">
        {BRAND.name} — {BRAND.strapline}
      </h1>

      {slides?.map((slide, i) => {
        const isActive = i === current;

        return (
          <Link
            key={slide.id}
            to={slide.href}
            className={cn(s.slide, isActive && s.slideActive)}
            aria-label={slide.title}
            aria-hidden={!isActive}
            tabIndex={isActive ? undefined : -1}
            inert={!isActive}
          >
            <div
              key={`${slide.id}-${activations[slide.id] ?? 0}`}
              className={cn(s.media, !reducedMotion && s.zoom)}
              onAnimationEnd={isActive && count > 1 ? handleZoomEnd : undefined}
            >
              {slide.videoUrl && !reducedMotion ? (
                <video
                  ref={(el) => {
                    if (el) {
                      el.muted = true; // set the property too — the attribute alone is not always honoured
                      videoRefs.current.set(slide.id, el);
                    } else {
                      videoRefs.current.delete(slide.id);
                    }
                  }}
                  className={s.video}
                  src={slide.videoUrl}
                  poster={slide.posterUrl}
                  muted
                  loop
                  playsInline
                  // The visible clip and the next one load; the rest wait.
                  preload={isActive || i === (current + 1) % count ? "auto" : "none"}
                  aria-hidden="true"
                />
              ) : (
                <img
                  className={s.video}
                  src={slide.imageUrl}
                  alt=""
                  loading={i === 0 ? "eager" : "lazy"}
                  fetchPriority={i === 0 ? "high" : "auto"}
                />
              )}
            </div>
          </Link>
        );
      })}

      {count > 1 && (
        <div className={s.dots}>
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              className={cn(s.dot, i === current && s.dotActive)}
              aria-label={`Show banner ${i + 1} of ${count}: ${slide.title}`}
              aria-current={i === current ? "true" : undefined}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
