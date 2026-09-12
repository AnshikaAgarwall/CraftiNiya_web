import { useState } from "react";
import { cn } from "../../lib/cn.js";
import { FALLBACK_IMAGE } from "../../services/mappers.js";
import s from "./LazyImage.module.css";

/**
 * Image with a reserved aspect box, native lazy loading, a shimmer placeholder
 * and a fallback on error.
 *
 * The wrapper carries the aspect ratio so the space is reserved before the
 * image arrives — without it a grid of 24 products reflows as each one loads,
 * which is both ugly and a Core Web Vitals failure.
 *
 * Every image in this catalog is a remote Unsplash URL, so failure is a real
 * runtime state, not a theoretical one.
 */
export default function LazyImage({
  src,
  alt = "",
  ratio = "1 / 1",
  className,
  imgClassName,
  eager = false,
  sizes,
  ...rest
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  // No image on the record yet: keep the reserved box, but don't request a
  // stock photo that has nothing to do with the item.
  if (!src) {
    return (
      <span
        className={cn(s.wrap, className)}
        style={{ aspectRatio: ratio }}
        aria-hidden="true"
      />
    );
  }

  return (
    <span className={cn(s.wrap, className)} style={{ aspectRatio: ratio }}>
      {!loaded && <span className={s.placeholder} aria-hidden="true" />}
      <img
        src={failed ? FALLBACK_IMAGE : src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={eager ? "high" : "auto"}
        sizes={sizes}
        onLoad={() => setLoaded(true)}
        onError={() => {
          setFailed(true);
          setLoaded(true);
        }}
        className={cn(s.img, loaded && s.loaded, imgClassName)}
        {...rest}
      />
    </span>
  );
}
