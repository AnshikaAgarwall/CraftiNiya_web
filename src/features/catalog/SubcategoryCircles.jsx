import { NavLink } from "react-router-dom";
import { cn } from "../../lib/cn.js";
import LazyImage from "../../components/common/LazyImage.jsx";
import { Skeleton } from "../../components/ui/Feedback.jsx";
import s from "./SubcategoryCircles.module.css";

/**
 * Circular subcategory rail across the top of a category page.
 *
 * These are real links, not local state toggles. A route change makes the
 * selection shareable, back-button correct, and prerenderable — an in-place
 * filter would be none of those.
 */
export default function SubcategoryCircles({
  categoryId,
  subcategories = [],
  loading = false,
  activeId = null,
}) {
  if (loading) {
    return (
      <div className={s.rail}>
        {Array.from({ length: 7 }, (_, i) => (
          <div key={i} className={s.item}>
            <Skeleton className={s.skeletonCircle} />
            <Skeleton height={10} width="70%" />
          </div>
        ))}
      </div>
    );
  }

  if (!subcategories.length) return null;

  return (
    <nav aria-label="Subcategories">
      <ul className={`${s.rail} no-scrollbar`}>
        <li>
          <NavLink
            to={`/category/${categoryId}`}
            end
            className={({ isActive }) =>
              cn(s.item, isActive && !activeId && s.itemActive)
            }
          >
            <span className={cn(s.circle, s.allCircle)}>All</span>
            <span className={s.label}>Everything</span>
          </NavLink>
        </li>

        {subcategories.map((sub) => (
          <li key={sub.id}>
            <NavLink
              to={`/category/${categoryId}/subcategory/${sub.id}`}
              className={({ isActive }) => cn(s.item, isActive && s.itemActive)}
            >
              <span className={cn(s.circle, !sub.posterImage && s.textCircle)}>
                {sub.posterImage ? (
                  <LazyImage src={sub.posterImage} alt="" />
                ) : (
                  <span aria-hidden="true">{sub.title.charAt(0)}</span>
                )}
              </span>
              <span className={s.label}>{sub.title}</span>
              <span className={s.count}>{sub.productCount}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
