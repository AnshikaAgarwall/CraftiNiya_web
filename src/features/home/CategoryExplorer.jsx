import { useState } from "react";
import { Chip, SectionHeading } from "../../components/ui/Bits.jsx";
import { ErrorState, Skeleton } from "../../components/ui/Feedback.jsx";
import SubcategoryCircles from "../catalog/SubcategoryCircles.jsx";
import { useAsync } from "../../hooks/useAsync.js";
import categoryService from "../../services/categoryService.js";
import s from "./CategoryExplorer.module.css";

/**
 * Category -> subcategory browser.
 *
 * Picking a category only swaps the rail below it; every destination is still
 * a real category or subcategory route, so nothing here is a dead-end filter.
 * Reads the same cached dataset as FeaturedCategories — no extra request.
 */
export default function CategoryExplorer() {
  const { data: categories, loading, error, refetch } = useAsync(
    (opts) => categoryService.getCategories(opts),
    [],
  );
  const [selectedId, setSelectedId] = useState(null);

  // First category until one is picked, or if a refetch drops the picked id.
  const active = categories?.find((c) => c.id === selectedId) ?? categories?.[0];

  return (
    <section className={s.section} aria-labelledby="category-explorer-title">
      <div className="container">
        <SectionHeading
          id="category-explorer-title"
          eyebrow="Browse the collection"
          title="What are you looking for?"
        />

        {error ? (
          <ErrorState error={error} onRetry={refetch} />
        ) : (
          <>
            <div className={s.tabs} role="group" aria-label="Categories">
              {loading
                ? Array.from({ length: 7 }, (_, i) => (
                    <Skeleton key={i} width={112} height={34} radius="var(--r-pill)" />
                  ))
                : categories?.map((category) => (
                    <Chip
                      key={category.id}
                      active={category.id === active?.id}
                      aria-pressed={category.id === active?.id}
                      onClick={() => setSelectedId(category.id)}
                    >
                      {category.title}
                    </Chip>
                  ))}
            </div>

            <div className={s.rail}>
              <SubcategoryCircles
                categoryId={active?.id}
                subcategories={active?.subcategories ?? []}
                loading={loading}
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
}
