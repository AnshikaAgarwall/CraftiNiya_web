import { useMemo } from "react";
import Button from "../../components/ui/Button.jsx";
import { Chip } from "../../components/ui/Bits.jsx";
import ProductGrid from "../../components/product/ProductGrid.jsx";
import FilterSidebar from "./FilterSidebar.jsx";
import { useCatalogQuery } from "./useCatalogQuery.js";
import { useAsync } from "../../hooks/useAsync.js";
import productService from "../../services/productService.js";
import { pluralize } from "../../lib/format.js";
import s from "./CatalogView.module.css";

/**
 * Sidebar + toolbar + grid + pagination.
 *
 * Shared by Shop, Category, Subcategory, Search, Sale and Budget Gifting.
 * Every one of them needs the same four states and the same filter semantics;
 * writing it once is what stops five of them quietly disagreeing.
 *
 * `scope` pins filters that the page itself defines (a category, a search
 * term, a budget ceiling) so a shopper cannot filter their way out of the
 * page they are on.
 */
export default function CatalogView({
  scope = {},
  hideSubcategoryFilter = false,
  emptyTitle,
  emptyMessage,
  children,
}) {
  const { query, update, clear, hasFilters } = useCatalogQuery();

  const effective = useMemo(
    () => ({
      ...query,
      ...scope,
      // Page-level scope wins over anything in the URL.
      subcategoryIds: scope.subcategoryId ? [] : query.subcategoryIds,
    }),
    [query, scope],
  );

  const key = JSON.stringify(effective);

  const { data, loading, error, refetch } = useAsync(
    (opts) => productService.getProducts(effective, opts),
    [key],
  );

  // Facets follow the chosen category as well as the page's own scope, so a
  // shopper who arrived from the mega menu is offered that category's
  // subcategories rather than the whole taxonomy.
  const facetScope = useMemo(
    () => ({ categoryId: query.categoryId ?? undefined, ...scope }),
    [query.categoryId, scope],
  );

  const { data: facets, loading: facetsLoading } = useAsync(
    (opts) => productService.getFacets(facetScope, opts),
    [JSON.stringify(facetScope)],
  );

  const products = data?.items ?? [];
  const total = data?.total ?? 0;
  const pageCount = data?.pageCount ?? 1;

  const activeChips = [];
  if (query.minRating) {
    activeChips.push({
      key: "rating",
      label: `${query.minRating} stars & up`,
      onRemove: () => update({ minRating: null }),
    });
  }
  if (query.onSale) {
    activeChips.push({ key: "sale", label: "On sale", onRemove: () => update({ onSale: null }) });
  }
  if (query.inStock) {
    activeChips.push({ key: "stock", label: "In stock", onRemove: () => update({ inStock: null }) });
  }
  (facets?.subcategories ?? [])
    .filter((sub) => query.subcategoryIds.includes(sub.id))
    .forEach((sub) =>
      activeChips.push({
        key: sub.id,
        label: sub.title,
        onRemove: () =>
          update({ subcategoryIds: query.subcategoryIds.filter((x) => x !== sub.id) }),
      }),
    );

  return (
    <div className={`container ${s.layout}`}>
      <FilterSidebar
        facets={facets}
        loading={facetsLoading && !facets}
        value={query}
        onChange={update}
        onClear={clear}
        hideSubcategories={hideSubcategoryFilter || Boolean(scope.subcategoryId)}
        className={s.sidebar}
      />

      <div className={s.main}>
        {children}

        <div className={s.toolbar}>
          <p className={s.count} aria-live="polite">
            {loading ? "Loading…" : pluralize(total, "piece")}
          </p>
        </div>

        {activeChips.length > 0 && (
          <div className={s.chips}>
            {activeChips.map((chip) => (
              <Chip key={chip.key} onRemove={chip.onRemove}>
                {chip.label}
              </Chip>
            ))}
            <button type="button" className={s.clearAll} onClick={clear}>
              Clear all
            </button>
          </div>
        )}

        <ProductGrid
          products={products}
          loading={loading}
          error={error}
          onRetry={refetch}
          columns={3}
          skeletonCount={9}
          emptyTitle={emptyTitle}
          emptyMessage={emptyMessage}
          emptyAction={
            hasFilters ? (
              <Button variant="secondary" onClick={clear}>
                Clear filters
              </Button>
            ) : (
              <Button to="/shop">Browse everything</Button>
            )
          }
        />

        {pageCount > 1 && !loading && (
          <nav className={s.pagination} aria-label="Pagination">
            <Button
              variant="secondary"
              size="sm"
              disabled={query.page <= 1}
              onClick={() => update({ page: query.page - 1 })}
            >
              Previous
            </Button>

            <span className={s.pageInfo}>
              Page {query.page} of {pageCount}
            </span>

            <Button
              variant="secondary"
              size="sm"
              disabled={query.page >= pageCount}
              onClick={() => update({ page: query.page + 1 })}
            >
              Next
            </Button>
          </nav>
        )}
      </div>
    </div>
  );
}
