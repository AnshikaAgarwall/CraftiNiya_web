import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ErrorState, Skeleton } from "../ui/Feedback.jsx";
import { useAsync } from "../../hooks/useAsync.js";
import categoryService from "../../services/categoryService.js";
import s from "./MegaMenu.module.css";

/**
 * Full-width category panel dropped under the nav row.
 *
 * Reads the same cached categories dataset as the home explorer, so opening
 * the menu costs no extra request after the first paint of either.
 *
 * Every link routes directly to the dedicated category and subcategory pages.
 */
export default function MegaMenu({ onNavigate }) {
  const { data: categories, loading, error, refetch } = useAsync(
    (opts) => categoryService.getCategories(opts),
    [],
  );

  return (
    <div className={s.panel} id="mega-menu">
      <div className={`container ${s.inner}`}>
        {error ? (
          <ErrorState error={error} onRetry={refetch} />
        ) : loading ? (
          <div className={s.columns}>
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className={s.column}>
                <Skeleton width={140} height={16} />
                <Skeleton width={110} height={12} />
                <Skeleton width={120} height={12} />
                <Skeleton width={96} height={12} />
              </div>
            ))}
          </div>
        ) : (
          <div className={s.columns}>
            {categories?.map((category) => (
              <div key={category.id} className={s.column}>
                <Link
                  to={`/category/${category.id}`}
                  className={s.columnTitle}
                  onClick={onNavigate}
                >
                  {category.title}
                </Link>

                <ul className={s.links}>
                  {category.subcategories.map((sub) => (
                    <li key={sub.id}>
                      <Link
                        to={`/category/${category.id}/subcategory/${sub.id}`}
                        className={s.link}
                        onClick={onNavigate}
                      >
                        {sub.title}
                      </Link>
                    </li>
                  ))}
                </ul>

                <Link
                  to={`/category/${category.id}`}
                  className={s.viewAll}
                  onClick={onNavigate}
                >
                  View all <ArrowRight aria-hidden="true" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
