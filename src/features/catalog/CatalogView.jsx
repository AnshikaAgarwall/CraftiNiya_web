import { useState, useMemo, useRef, useEffect } from "react";
import { ArrowUpDown, SlidersHorizontal, X, Check } from "lucide-react";
import Button from "../../components/ui/Button.jsx";
import { Chip } from "../../components/ui/Bits.jsx";
import ProductGrid from "../../components/product/ProductGrid.jsx";
import FilterSidebar from "./FilterSidebar.jsx";
import SortDrawer from "./SortDrawer.jsx";
import { useCatalogQuery } from "./useCatalogQuery.js";
import { useAsync } from "../../hooks/useAsync.js";
import productService from "../../services/productService.js";
import { pluralize } from "../../lib/format.js";
import { cn } from "../../lib/cn.js";
import { SORT_OPTIONS } from "../../config/site.js";
import s from "./CatalogView.module.css";

export default function CatalogView({
  scope = {},
  hideSubcategoryFilter = false,
  drawerFilter = true,
  emptyTitle,
  emptyMessage,
  children,
}) {
  const { query, update, clear, hasFilters } = useCatalogQuery();

  const effective = useMemo(
    () => ({
      ...query,
      ...scope,
      subcategoryIds: scope.subcategoryId ? [] : query.subcategoryIds,
    }),
    [query, scope],
  );

  const key = JSON.stringify(effective);

  const { data, loading, error, refetch } = useAsync(
    (opts) => productService.getProducts(effective, opts),
    [key],
  );

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

  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const activeCount =
    (query.subcategoryIds?.length ?? 0) +
    (query.onSale ? 1 : 0) +
    (query.inStock ? 1 : 0) +
    (query.minRating ? 1 : 0);

  const sortRef = useRef(null);
  const drawerRef = useRef(null);
  const filterToggleRef = useRef(null);

  // Close popover/drawer on outside click
  useEffect(() => {
    if (!drawerFilter) return;

    function handleOutsideClick(e) {
      if (sortOpen && sortRef.current && !sortRef.current.contains(e.target)) {
        setSortOpen(false);
      }
      if (
        filterOpen &&
        window.innerWidth <= 900 &&
        drawerRef.current &&
        !drawerRef.current.contains(e.target) &&
        filterToggleRef.current &&
        !filterToggleRef.current.contains(e.target)
      ) {
        setFilterOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [drawerFilter, sortOpen, filterOpen]);

  const activeChips = [];
  if (query.minRating) {
    activeChips.push({
      key: "rating",
      label: `${query.minRating} stars & up`,
      onRemove: () => update({ minRating: null }),
    });
  }
  if (query.onSale) {
    activeChips.push({
      key: "sale",
      label: "On sale",
      onRemove: () => update({ onSale: null }),
    });
  }
  if (query.inStock) {
    activeChips.push({
      key: "stock",
      label: "In stock",
      onRemove: () => update({ inStock: null }),
    });
  }
  if (query.partnerPicks) {
    activeChips.push({
      key: "partner",
      label: "Partner picks",
      onRemove: () => update({ partnerPicks: null }),
    });
  }
  (facets?.subcategories ?? [])
    .filter((sub) => query.subcategoryIds.includes(sub.id))
    .forEach((sub) =>
      activeChips.push({
        key: sub.id,
        label: sub.title,
        onRemove: () =>
          update({
            subcategoryIds: query.subcategoryIds.filter((x) => x !== sub.id),
          }),
      }),
    );

  const subcategories =
    hideSubcategoryFilter || Boolean(scope.subcategoryId)
      ? []
      : facets?.subcategories ?? [];

  const toggleSub = (id) => {
    const current = query.subcategoryIds ?? [];
    update({
      subcategoryIds: current.includes(id)
        ? current.filter((x) => x !== id)
        : [...current, id],
    });
  };

  const toggleOnSale = () => {
    update({ onSale: query.onSale ? null : true });
  };

  const toggleInStock = () => {
    update({ inStock: query.inStock ? null : true });
  };

  const setRating = (r) => {
    update({ minRating: query.minRating === r ? null : r });
  };

  return (
    <div className={cn("container", s.layout, drawerFilter && s.drawerLayout)}>
      {/* Traditional Sidebar + Bottom Drawer for standard catalog pages */}
      {!drawerFilter && (
        <>
          <FilterSidebar
            facets={facets}
            loading={facetsLoading && !facets}
            value={query}
            onChange={update}
            onClear={clear}
            hideSubcategories={hideSubcategoryFilter || Boolean(scope.subcategoryId)}
            hideSort={true}
            isOpen={filterOpen}
            onToggleOpen={setFilterOpen}
            className={s.sidebar}
          />
          <SortDrawer
            isOpen={sortOpen}
            onClose={() => setSortOpen(false)}
            value={query}
            onChange={update}
          />
        </>
      )}

      <div className={s.main}>
        {children}

        {/* Toolbar */}
        <div className={s.toolbar}>
          {drawerFilter ? (
            <div className={s.toolbarLeft}>
              <button
                ref={filterToggleRef}
                type="button"
                className={cn(s.actionTrigger, filterOpen && s.actionTriggerActive)}
                onClick={() => setFilterOpen((prev) => !prev)}
                aria-expanded={filterOpen}
                aria-label={filterOpen ? "Hide filters" : "Show filters"}
                title={filterOpen ? "Hide filters" : "Filters"}
              >
                <SlidersHorizontal size={15} />
                <span className={s.actionText}>
                  {filterOpen ? "Hide Filters" : "Filters"}
                </span>
                {activeCount > 0 && (
                  <span className={s.activeBadge}>{activeCount}</span>
                )}
              </button>

              <p className={s.count} aria-live="polite">
                {loading ? "Loading…" : pluralize(total, "piece")}
              </p>
            </div>
          ) : (
            <p className={s.count} aria-live="polite">
              {loading ? "Loading…" : pluralize(total, "piece")}
            </p>
          )}

          <div className={s.toolbarActions}>
            {/* Sort Button + Inline Screen Dropdown */}
            <div className={s.popoverContainer} ref={sortRef}>
              <button
                type="button"
                className={cn(s.actionTrigger, sortOpen && s.actionTriggerActive)}
                onClick={() => {
                  setSortOpen((prev) => !prev);
                }}
                aria-expanded={sortOpen}
                aria-label="Sort products"
                title="Sort"
              >
                <ArrowUpDown size={15} />
                <span className={s.actionText}>
                  {SORT_OPTIONS.find(
                    (o) => o.value === (query.sort || "relevance"),
                  )?.label || "Relevance"}
                </span>
              </button>

              {/* Screen Dropdown for Sort */}
              {sortOpen && (
                <div className={s.sortDropdown} role="menu" aria-label="Sort options">
                  <div className={s.dropdownHead}>
                    <span className={s.dropdownTitle}>Sort By</span>
                  </div>
                  <div className={s.dropdownList}>
                    {SORT_OPTIONS.map((opt) => {
                      const isSelected =
                        query.sort === opt.value ||
                        (!query.sort && opt.value === "relevance");
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          className={cn(
                            s.dropdownItem,
                            isSelected && s.dropdownItemActive,
                          )}
                          onClick={() => {
                            update({ sort: opt.value });
                            setSortOpen(false);
                          }}
                        >
                          <span>{opt.label}</span>
                          {isSelected && (
                            <Check size={14} className={s.checkIcon} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Standard Filter button for mobile when not drawerFilter */}
            {!drawerFilter && (
              <button
                type="button"
                className={cn(s.actionTrigger, filterOpen && s.actionTriggerActive)}
                onClick={() => setFilterOpen((prev) => !prev)}
                aria-expanded={filterOpen}
                aria-label="Filter products"
                title="Filters"
              >
                <SlidersHorizontal size={15} />
                <span className={s.actionText}>Filters</span>
                {hasFilters && <span className={s.filterDot} aria-hidden="true" />}
              </button>
            )}
          </div>
        </div>

        {/* Section Content Area with In-Section Left Drawer */}
        <div className={cn(s.contentArea, drawerFilter && s.inSectionLayout)}>
          {/* In-Section Left Drawer (Only within this section!) */}
          {drawerFilter && (
            <>
              {/* Mobile in-section backdrop */}
              {filterOpen && (
                <div
                  className={s.inSectionBackdrop}
                  onClick={() => setFilterOpen(false)}
                  aria-hidden="true"
                />
              )}

              <aside
                ref={drawerRef}
                className={cn(
                  s.inSectionDrawer,
                  filterOpen ? s.inSectionDrawerOpen : s.inSectionDrawerClosed,
                )}
                aria-label="Filters"
                aria-hidden={!filterOpen}
              >
                <div className={s.drawerInner}>
                  {/* Drawer Header */}
                  <div className={s.drawerHeader}>
                    <div className={s.drawerTitleGroup}>
                      <SlidersHorizontal size={16} className={s.drawerHeaderIcon} />
                      <h3 className={s.drawerTitle}>Filters</h3>
                      {activeCount > 0 && (
                        <span className={s.drawerCountBadge}>{activeCount}</span>
                      )}
                    </div>
                    <div className={s.drawerHeaderActions}>
                      {hasFilters && (
                        <button type="button" className={s.clearBtn} onClick={clear}>
                          Clear all
                        </button>
                      )}
                      <button
                        type="button"
                        className={s.drawerCloseBtn}
                        onClick={() => setFilterOpen(false)}
                        aria-label="Close filters"
                        title="Close filters"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Drawer Body - Scrollable */}
                  <div className={s.drawerBody}>
                    {/* Categories / Subcategories */}
                    {subcategories.length > 0 && (
                      <div className={s.filterGroup}>
                        <h4 className={s.groupLabel}>Categories</h4>
                        <div className={s.groupStack}>
                          {subcategories.map((sub) => {
                            const isChecked = (query.subcategoryIds ?? []).includes(
                              sub.id,
                            );
                            return (
                              <label key={sub.id} className={s.checkboxRow}>
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => toggleSub(sub.id)}
                                  className={s.checkboxInput}
                                />
                                <span className={s.checkboxLabel}>{sub.title}</span>
                                <span className={s.facetBadge}>{sub.count}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Availability */}
                    <div className={s.filterGroup}>
                      <h4 className={s.groupLabel}>Availability</h4>
                      <div className={s.groupStack}>
                        {!scope.onSale && (
                          <label className={s.checkboxRow}>
                            <input
                              type="checkbox"
                              checked={Boolean(query.onSale)}
                              onChange={toggleOnSale}
                              className={s.checkboxInput}
                            />
                            <span className={s.checkboxLabel}>On sale</span>
                            {facets?.onSale !== undefined && (
                              <span className={s.facetBadge}>{facets.onSale}</span>
                            )}
                          </label>
                        )}
                        <label className={s.checkboxRow}>
                          <input
                            type="checkbox"
                            checked={Boolean(query.inStock)}
                            onChange={toggleInStock}
                            className={s.checkboxInput}
                          />
                          <span className={s.checkboxLabel}>In stock only</span>
                          {facets?.inStock !== undefined && (
                            <span className={s.facetBadge}>{facets.inStock}</span>
                          )}
                        </label>
                      </div>
                    </div>

                    {/* Customer Rating */}
                    <div className={s.filterGroup}>
                      <h4 className={s.groupLabel}>Customer Rating</h4>
                      <div className={s.groupStack}>
                        {[4, 3].map((r) => {
                          const rFacet = facets?.ratings?.find((f) => f.min === r);
                          return (
                            <label key={r} className={s.checkboxRow}>
                              <input
                                type="radio"
                                name="in-section-rating"
                                checked={Number(query.minRating) === r}
                                onChange={() => setRating(r)}
                                className={s.checkboxInput}
                              />
                              <span className={s.checkboxLabel}>
                                {r} stars & above
                              </span>
                              {rFacet?.count !== undefined && (
                                <span className={s.facetBadge}>{rFacet.count}</span>
                              )}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Drawer Footer */}
                  <div className={s.drawerFooter}>
                    <Button
                      fullWidth
                      size="sm"
                      onClick={() => setFilterOpen(false)}
                    >
                      Show {pluralize(total, "piece")}
                    </Button>
                  </div>
                </div>
              </aside>
            </>
          )}

          {/* Grid Area with Chips & Products */}
          <div className={s.gridArea}>
            {/* Active Filter Chips */}
            {activeChips.length > 0 && (
              <div className={s.chips} role="region" aria-label="Active filters">
                <span className={s.chipsLabel}>Active:</span>
                {activeChips.map((chip) => (
                  <Chip key={chip.key} onRemove={chip.onRemove}>
                    {chip.label}
                  </Chip>
                ))}
                {hasFilters && (
                  <button type="button" className={s.clearAll} onClick={clear}>
                    Clear all
                  </button>
                )}
              </div>
            )}

            {/* Products Grid */}
            <ProductGrid
              products={products}
              loading={loading}
              error={error}
              onRetry={refetch}
              columns={drawerFilter && !filterOpen ? 4 : 3}
              skeletonCount={drawerFilter && !filterOpen ? 12 : 9}
              className={
                drawerFilter
                  ? filterOpen
                    ? s.threeColGrid
                    : s.fourColGrid
                  : undefined
              }
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
          </div>
        </div>
      </div>
    </div>
  );
}
