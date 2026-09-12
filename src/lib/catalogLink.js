/**
 * One place that knows how a category selection is spelled in the URL.
 *
 * The catalog reads its filters from the query string (see useCatalogQuery),
 * so anything that wants to send a shopper to a pre-filtered listing — the
 * mega menu today, a promo tile tomorrow — builds the link here rather than
 * hand-rolling a slightly different one.
 */
export const CATALOG_PATH = "/shop";

export function catalogSearchFor({ categoryId, subcategoryId } = {}) {
  const params = new URLSearchParams();
  if (categoryId) params.set("category", categoryId);
  if (subcategoryId) params.append("sub", subcategoryId);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function catalogPathFor(selection) {
  return `${CATALOG_PATH}${catalogSearchFor(selection)}`;
}

export default catalogPathFor;
