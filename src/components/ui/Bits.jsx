import { Star } from "lucide-react";
import { cn } from "../../lib/cn.js";
import { formatINR } from "../../lib/money.js";
import s from "./Bits.module.css";

/** Small presentational primitives shared across pages. */

export function Badge({ tone = "neutral", size = "md", className, children }) {
  return (
    <span className={cn(s.badge, s[`tone_${tone}`], s[`badge_${size}`], className)}>
      {children}
    </span>
  );
}

/**
 * Price display.
 *
 * All arithmetic happened in the service; this only formats. Sale prices show
 * the discounted figure first with the original struck through, and the struck
 * value is labelled for screen readers so it is not read as the price to pay.
 */
export function Price({
  listMinor,
  effectiveMinor,
  discountPct,
  size = "md",
  showDiscount = true,
  className,
}) {
  const onSale = effectiveMinor != null && listMinor != null && effectiveMinor < listMinor;

  return (
    <span className={cn(s.price, s[`price_${size}`], className)}>
      <span className={s.priceCurrent}>{formatINR(effectiveMinor ?? listMinor)}</span>
      {onSale && (
        <>
          <span className={s.priceWas}>
            <span className="sr-only">Was </span>
            {formatINR(listMinor)}
          </span>
          {showDiscount && discountPct ? (
            <span className={s.priceOff}>{discountPct}% off</span>
          ) : null}
        </>
      )}
    </span>
  );
}

/**
 * Star rating. Terracotta is used as a FILL here, never as text — at 2.76:1 on white
 * it would fail contrast as type, but a filled shape is exempt and reads well.
 */
export function Rating({ value = 0, count, size = 14, showValue = true, className }) {
  const rounded = Math.round(value * 2) / 2;

  return (
    <span className={cn(s.rating, className)}>
      <span className={s.stars} aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            width={size}
            height={size}
            className={cn(
              s.star,
              rounded >= i && s.starFull,
              rounded === i - 0.5 && s.starHalf,
            )}
          />
        ))}
      </span>
      {showValue && <span className={s.ratingValue}>{value.toFixed(1)}</span>}
      {count != null && <span className={s.ratingCount}>({count})</span>}
      <span className="sr-only">
        Rated {value.toFixed(1)} out of 5{count != null ? ` from ${count} reviews` : ""}
      </span>
    </span>
  );
}

/** Removable filter chip. */
export function Chip({ children, onRemove, active = false, className, ...rest }) {
  const Tag = onRemove || rest.onClick ? "button" : "span";
  return (
    <Tag
      type={Tag === "button" ? "button" : undefined}
      className={cn(s.chip, active && s.chipActive, className)}
      onClick={onRemove ?? rest.onClick}
      {...rest}
    >
      {children}
      {onRemove && (
        <span className={s.chipX} aria-hidden="true">
          ×
        </span>
      )}
    </Tag>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  action,
  className,
  id,
}) {
  return (
    <div className={cn(s.heading, s[`heading_${align}`], className)}>
      <div>
        {eyebrow && <p className={s.eyebrow}>{eyebrow}</p>}
        {/* id is forwarded to the heading itself so aria-labelledby on the
            surrounding section resolves to real text. */}
        <h2 id={id} className={s.headingTitle}>
          {title}
        </h2>
        {subtitle && <p className={s.headingSub}>{subtitle}</p>}
      </div>
      {action && <div className={s.headingAction}>{action}</div>}
    </div>
  );
}

export default { Badge, Price, Rating, Chip, SectionHeading };
