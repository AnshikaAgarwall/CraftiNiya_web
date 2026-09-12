import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "../../components/ui/Bits.jsx";
import { ErrorState, Skeleton } from "../../components/ui/Feedback.jsx";
import LazyImage from "../../components/common/LazyImage.jsx";
import Button from "../../components/ui/Button.jsx";
import { useAsync } from "../../hooks/useAsync.js";
import categoryService from "../../services/categoryService.js";
import { pluralize } from "../../lib/format.js";
import s from "./FeaturedCategories.module.css";

/**
 * The feature tile fills four cells of the four-column grid, so any other
 * category count leaves the last row ragged. Widening the trailing tiles closes
 * it flush — and the same spans also come out even on the two-column layout.
 */
function tileSpan(index, count) {
  const used = (count + 3) % 4; // cells occupied on the last row
  const fromEnd = count - index; // 1 = last tile
  if (index === 0 || used === 0) return undefined;
  if (used === 1) return fromEnd === 1 ? "full" : undefined;
  if (used === 2) return fromEnd <= 2 ? "2" : undefined;
  return fromEnd === 1 ? "2" : undefined;
}

const SPAN_RATIO = { 2: "3 / 2", full: "3 / 1" };

export default function FeaturedCategories() {
  const { data: categories, loading, error, refetch } = useAsync(
    (opts) => categoryService.getCategories(opts),
    [],
  );

  return (
    <section className={s.section}>
      <div className="container">
        <SectionHeading
          eyebrow="Shop by category"
          title="Find your corner of the studio"
          subtitle="Every family of handmade goods we make, each with its own makers, materials and quirks."
          action={
            <Button to="/categories" variant="ghost" endIcon={<ArrowRight size={16} />}>
              All categories
            </Button>
          }
          align="split"
        />

        {error ? (
          <ErrorState error={error} onRetry={refetch} />
        ) : (
          <div className={s.grid}>
            {loading
              ? Array.from({ length: 5 }, (_, i) => (
                  <Skeleton key={i} className={s.skeleton} />
                ))
              : categories?.map((category, i) => {
                  const span = tileSpan(i, categories.length);
                  return (
                    <Link
                      key={category.id}
                      to={`/category/${category.id}`}
                      className={s.card}
                      /* First card spans two columns on wide screens — a plain
                         row of equal tiles reads as a nav bar, not a
                         showcase. */
                      data-feature={i === 0 ? "true" : undefined}
                      data-span={span}
                    >
                      <LazyImage
                        src={category.posterImage}
                        alt=""
                        ratio={i === 0 ? "4 / 3" : (SPAN_RATIO[span] ?? "3 / 4")}
                        className={s.cardImage}
                        eager={i < 2}
                      />
                      <span className={s.cardOverlay} aria-hidden="true" />
                      <span className={s.cardBody}>
                        <span className={s.cardTitle}>{category.title}</span>
                        <span className={s.cardMeta}>
                          {pluralize(category.productCount, "piece")}
                        </span>
                      </span>
                    </Link>
                  );
                })}
          </div>
        )}
      </div>
    </section>
  );
}
