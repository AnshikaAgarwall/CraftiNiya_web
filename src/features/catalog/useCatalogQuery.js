import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { DEFAULT_SORT, PAGE_SIZE } from "../../config/site.js";

/**
 * Catalog filter state, held in the URL rather than useState.
 *
 * This is the whole reason filters are shareable, survive a refresh, and step
 * correctly through browser history. It also means the circular subcategory
 * rail and the sidebar read from one source and cannot drift apart.
 *
 * Only non-default values are written, so a clean listing has a clean URL, and
 * a clean URL shows every product. Only filters the shopper can see and undo
 * in the sidebar are read back — price is page scope (Budget Gifting), not a
 * URL filter, so a stale `?min=`/`?max=` can never silently hide products.
 */

const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

export function useCatalogQuery({ pageSize = PAGE_SIZE } = {}) {
  const [params, setParams] = useSearchParams();

  const query = useMemo(
    () => ({
      q: params.get("q") ?? undefined,
      categoryId: params.get("category") ?? null,
      sort: params.get("sort") ?? DEFAULT_SORT,
      minRating: num(params.get("rating")),
      onSale: params.get("sale") === "1" ? true : null,
      inStock: params.get("stock") === "1" ? true : null,
      subcategoryIds: params.getAll("sub"),
      tier: params.get("tier") ?? null,
      page: num(params.get("page")) ?? 1,
      pageSize,
    }),
    [params, pageSize],
  );

  const update = useCallback(
    (patch, { resetPage = true } = {}) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);

          const setOrDelete = (key, value, isDefault = false) => {
            if (value === null || value === undefined || value === "" || isDefault) {
              next.delete(key);
            } else {
              next.set(key, String(value));
            }
          };

          if ("q" in patch) setOrDelete("q", patch.q);
          if ("sort" in patch) setOrDelete("sort", patch.sort, patch.sort === DEFAULT_SORT);
          if ("minRating" in patch) setOrDelete("rating", patch.minRating);
          if ("onSale" in patch) setOrDelete("sale", patch.onSale ? "1" : null);
          if ("inStock" in patch) setOrDelete("stock", patch.inStock ? "1" : null);
          if ("tier" in patch) setOrDelete("tier", patch.tier);
          if ("categoryId" in patch) setOrDelete("category", patch.categoryId);
          if ("page" in patch) setOrDelete("page", patch.page, patch.page === 1);

          if ("subcategoryIds" in patch) {
            next.delete("sub");
            (patch.subcategoryIds ?? []).forEach((id) => next.append("sub", id));
          }

          // Any filter change invalidates the current page number.
          if (resetPage && !("page" in patch)) next.delete("page");

          return next;
        },
        { replace: true },
      );
    },
    [setParams],
  );

  const clear = useCallback(() => {
    setParams(
      (prev) => {
        const next = new URLSearchParams();
        // A search term, a budget tier or a chosen category is the context,
        // not a filter — all three survive "clear all".
        const q = prev.get("q");
        const tier = prev.get("tier");
        const category = prev.get("category");
        if (q) next.set("q", q);
        if (tier) next.set("tier", tier);
        if (category) next.set("category", category);
        return next;
      },
      { replace: true },
    );
  }, [setParams]);

  const hasFilters =
    query.subcategoryIds.length > 0 ||
    query.minRating != null ||
    Boolean(query.onSale) ||
    Boolean(query.inStock);

  return { query, update, clear, hasFilters };
}

export default useCatalogQuery;
