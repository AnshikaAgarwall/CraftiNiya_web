import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { cn } from "../../lib/cn.js";
import Button from "../../components/ui/Button.jsx";
import { Checkbox, Radio } from "../../components/ui/Field.jsx";
import { Skeleton } from "../../components/ui/Feedback.jsx";
import { SORT_OPTIONS } from "../../config/site.js";
import s from "./FilterSidebar.module.css";

/**
 * Catalog filters.
 *
 * Facet counts are supplied by the service, never hardcoded.
 *
 * Any group with fewer than two options is hidden: a "filter" with one choice
 * is decoration, and this catalog has subcategories with a handful of pieces.
 */
export default function FilterSidebar({
  facets,
  loading,
  value,
  onChange,
  onClear,
  hideSubcategories = false,
  hideSort = false,
  isOpen: controlledOpen,
  onToggleOpen,
  isDrawerMode = false,
  className,
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const setOpen = isControlled ? onToggleOpen : setUncontrolledOpen;

  const subcategories = hideSubcategories ? [] : (facets?.subcategories ?? []);
  const showSubcategories = subcategories.length > 1;

  const activeCount =
    (value.subcategoryIds?.length ?? 0) +
    (value.onSale ? 1 : 0) +
    (value.inStock ? 1 : 0) +
    (value.minRating ? 1 : 0);

  const toggleSub = (id) => {
    const current = value.subcategoryIds ?? [];
    onChange({
      subcategoryIds: current.includes(id)
        ? current.filter((x) => x !== id)
        : [...current, id],
    });
  };

  if (loading) {
    return (
      <aside className={cn(s.sidebar, className)}>
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} height={120} className={s.skeleton} />
        ))}
      </aside>
    );
  }

  return (
    <>
      <aside
        className={cn(
          s.sidebar,
          isDrawerMode && s.drawerMode,
          open && s.sidebarOpen,
          className,
        )}
      >
        <div className={s.head}>
          <h2 className={s.heading}>Filters</h2>
          {activeCount > 0 && (
            <button type="button" className={s.clear} onClick={onClear}>
              Clear all
            </button>
          )}
          <button
            type="button"
            className={s.mobileClose}
            onClick={() => setOpen(false)}
            aria-label="Close filters"
          >
            <X />
          </button>
        </div>

        <div className={s.scroll}>
          {/* ---- sort ---- */}
          {!hideSort && (
            <section className={s.group}>
              <h3 className={s.groupTitle}>Sort by</h3>
              <div className={s.stack}>
                {SORT_OPTIONS.map((option) => (
                  <Radio
                    key={option.value}
                    name="sort"
                    label={option.label}
                    checked={value.sort === option.value}
                    onChange={() => onChange({ sort: option.value })}
                  />
                ))}
              </div>
            </section>
          )}

          {/* ---- subcategories ---- */}
          {showSubcategories && (
            <section className={s.group}>
              <h3 className={s.groupTitle}>Category</h3>
              <div className={s.stack}>
                {subcategories.map((sub) => (
                  <Checkbox
                    key={sub.id}
                    label={`${sub.title} (${sub.count})`}
                    checked={(value.subcategoryIds ?? []).includes(sub.id)}
                    onChange={() => toggleSub(sub.id)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* ---- rating ---- */}
          {facets?.ratings?.some((r) => r.count > 0) && (
            <section className={s.group}>
              <h3 className={s.groupTitle}>Rating</h3>
              <div className={s.stack}>
                {facets.ratings
                  .filter((r) => r.count > 0)
                  .map((r) => (
                    <Radio
                      key={r.min}
                      name="rating"
                      label={`${r.min} stars & up (${r.count})`}
                      checked={value.minRating === r.min}
                      onChange={() => onChange({ minRating: r.min })}
                    />
                  ))}
                <Radio
                  name="rating"
                  label="Any rating"
                  checked={!value.minRating}
                  onChange={() => onChange({ minRating: null })}
                />
              </div>
            </section>
          )}

          {/* ---- availability ---- */}
          <section className={s.group}>
            <h3 className={s.groupTitle}>Availability</h3>
            <div className={s.stack}>
              <Checkbox
                label={`On sale${facets?.onSale ? ` (${facets.onSale})` : ""}`}
                checked={Boolean(value.onSale)}
                onChange={(e) => onChange({ onSale: e.target.checked || null })}
              />
              <Checkbox
                label={`In stock${facets?.inStock ? ` (${facets.inStock})` : ""}`}
                checked={Boolean(value.inStock)}
                onChange={(e) => onChange({ inStock: e.target.checked || null })}
              />
              <Checkbox
                label="Partner picks"
                checked={Boolean(value.partnerPicks)}
                onChange={(e) => onChange({ partnerPicks: e.target.checked || null })}
              />
            </div>
          </section>
        </div>

        <div className={s.mobileFoot}>
          <Button fullWidth onClick={() => setOpen(false)}>
            Show results
          </Button>
        </div>
      </aside>

      {open && (
        <button
          type="button"
          className={cn(s.scrim, isDrawerMode && s.scrimVisible)}
          onClick={() => setOpen(false)}
          aria-label="Close filters"
          tabIndex={-1}
        />
      )}
    </>
  );
}
