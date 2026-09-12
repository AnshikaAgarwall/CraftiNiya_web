import { cn } from "../../lib/cn.js";
import LazyImage from "../../components/common/LazyImage.jsx";
import { useAsync } from "../../hooks/useAsync.js";
import { useReducedMotion } from "../../hooks/useReducedMotion.js";
import productService from "../../services/productService.js";
import s from "./FilmstripShowcase.module.css";

/**
 * Two vertical film strips scrolling in opposite directions, endlessly.
 *
 * Imagery only — no titles, prices or badges. This sits beside a sign-in form
 * as texture, and product copy here would compete with the thing the page is
 * actually asking you to do.
 *
 * The loop is seamless because each track renders its images twice and
 * translates by exactly -50%. Spacing is applied as margin on each frame
 * rather than flex `gap`, so half the track height is exactly one full set —
 * with `gap`, the halfway point lands mid-gap and the loop visibly jumps.
 *
 * The whole panel is aria-hidden: it is decoration, and announcing two dozen
 * product images before the email field would be hostile.
 */
export default function FilmstripShowcase() {
  const reducedMotion = useReducedMotion();
  const { data: products } = useAsync(
    (opts) => productService.getBestSellers({ limit: 14 }, opts),
    [],
  );

  const items = products ?? [];
  if (!items.length) return <div className={s.showcase} aria-hidden="true" />;

  const half = Math.ceil(items.length / 2);
  const columns = [items.slice(0, half), items.slice(half)];

  return (
    <aside className={s.showcase} aria-hidden="true">
      <div className={s.fadeTop} />
      <div className={s.fadeBottom} />

      <div className={s.columns}>
        {columns.map((column, colIndex) => (
          <div key={colIndex} className={s.strip}>
            <div
              className={cn(
                s.track,
                !reducedMotion && (colIndex === 0 ? s.trackUp : s.trackDown),
              )}
            >
              {/* Rendered twice so the loop has no seam. */}
              {(reducedMotion ? column : [...column, ...column]).map((product, i) => (
                <div key={`${product.id}-${i}`} className={s.frame}>
                  <LazyImage
                    src={product.image}
                    alt=""
                    ratio="4 / 5"
                    className={s.frameImage}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
