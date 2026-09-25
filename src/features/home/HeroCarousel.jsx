import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/cn.js";
import { useReducedMotion } from "../../hooks/useReducedMotion.js";
import heroSlides from "../../data/heroSlides.js";
import s from "./HeroCarousel.module.css";

const SLIDE_DURATION_MS = 4000;
const SWIPE_THRESHOLD = 50; // px

export default function HeroCarousel() {
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(null);
  const [pageHidden, setPageHidden] = useState(
    () => typeof document !== "undefined" && document.visibilityState === "hidden",
  );
  const sectionRef = useRef(null);

  const handleImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    if (naturalWidth && naturalHeight) {
      setAspectRatio(`${naturalWidth} / ${naturalHeight}`);
    }
  };

  // Swipe / Drag state
  const startX = useRef(0);
  const isDragging = useRef(false);
  const didDrag = useRef(false);

  const slides = heroSlides;
  const count = slides.length;
  const current = index % count;
  const isPaused = hovered || keyboardFocus || pageHidden;

  const goTo = useCallback(
    (next) => {
      setIndex(((next % count) + count) % count);
    },
    [count],
  );

  const prev = useCallback(() => goTo(current - 1), [goTo, current]);
  const next = useCallback(() => goTo(current + 1), [goTo, current]);

  // Visibility tracking
  useEffect(() => {
    const onVisibility = () => setPageHidden(document.visibilityState === "hidden");
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // Soft auto-rotation, pauses on hover / focus / background
  useEffect(() => {
    if (isPaused || count <= 1 || reducedMotion) return;

    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % count);
    }, SLIDE_DURATION_MS);

    return () => clearInterval(timer);
  }, [isPaused, count, reducedMotion]);

  // ---------- Swipe / Drag handlers ----------
  const onPointerDown = (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    isDragging.current = true;
    didDrag.current = false;
    startX.current = e.clientX;
  };

  const onPointerMove = (e) => {
    if (!isDragging.current) return;
    const diff = Math.abs(e.clientX - startX.current);
    if (diff > 8) {
      didDrag.current = true;
    }
  };

  const onPointerUp = (e) => {
    if (!isDragging.current) return;
    isDragging.current = false;

    const diff = e.clientX - startX.current;
    if (Math.abs(diff) >= SWIPE_THRESHOLD) {
      if (diff < 0) {
        next();
      } else {
        prev();
      }
    }
  };

  const handleSlideClick = (e, href) => {
    if (didDrag.current) {
      e.preventDefault();
      didDrag.current = false;
      return;
    }
    navigate(href);
  };

  return (
    <section
      ref={sectionRef}
      className={cn(s.hero, isPaused && s.paused)}
      style={aspectRatio ? { aspectRatio } : undefined}
      aria-roledescription="carousel"
      aria-label="Featured visual announcements"
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={(e) => {
        e.pointerType === "mouse" && setHovered(false);
        if (isDragging.current) onPointerUp(e);
      }}
      onFocus={(e) => e.target.matches(":focus-visible") && setKeyboardFocus(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setKeyboardFocus(false);
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {/* Slide Items */}
      {slides.map((slide, i) => {
        const isActive = i === current;

        return (
          <article
            key={slide.id}
            className={cn(s.slide, isActive && s.slideActive)}
            aria-hidden={!isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={(e) => handleSlideClick(e, slide.href)}
            style={{ cursor: "pointer" }}
          >
            {/* Background Media with Ken Burns effect */}
            <div className={s.media}>
              <img
                src={slide.image}
                alt={slide.alt || "Promotional banner"}
                className={cn(s.image, isActive && !reducedMotion && s.kenBurns)}
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : "auto"}
                onLoad={i === 0 ? handleImageLoad : undefined}
              />
            </div>
          </article>
        );
      })}

      {/* Manual Left / Right Navigation Arrows */}
      <button
        type="button"
        className={cn(s.arrowBtn, s.prevBtn)}
        onClick={(e) => {
          e.stopPropagation();
          prev();
        }}
        aria-label="Previous slide"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        type="button"
        className={cn(s.arrowBtn, s.nextBtn)}
        onClick={(e) => {
          e.stopPropagation();
          next();
        }}
        aria-label="Next slide"
      >
        <ChevronRight size={22} />
      </button>

      {/* Dot Navigation */}
      {count > 1 && (
        <div className={s.dots}>
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              className={cn(s.dot, i === current && s.dotActive)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === current ? "true" : undefined}
              onClick={(e) => {
                e.stopPropagation();
                goTo(i);
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
