/**
 * Product reads.
 *
 * Filtering, sorting and pagination all happen HERE, never in a component.
 * That is deliberate: when a real paginated endpoint replaces the mock, a
 * component that filtered its own results would silently be filtering a single
 * page as though it were the whole catalog.
 */

import { loadDataset, paginate } from "./http.js";
import { mapProduct, withTaxonomy } from "./mappers.js";
import { getTaxonomy } from "./categoryService.js";
import { notFound } from "./errors.js";
import { PAGE_SIZE } from "../config/site.js";

const DATASET = "products";

async function allProducts(opts) {
  const [raw, taxonomy] = await Promise.all([
    loadDataset(DATASET, opts),
    getTaxonomy(opts),
  ]);
  return raw.map((r) => withTaxonomy(mapProduct(r), taxonomy));
}

/* ---------------------------------------------------------------
   Filtering
   --------------------------------------------------------------- */

function matches(p, q) {
  if (q.categoryId && p.categoryId !== q.categoryId) return false;
  if (q.subcategoryId && p.subcategoryId !== q.subcategoryId) return false;
  if (q.collaborationSlug && p.collaborationSlug !== q.collaborationSlug) return false;
  if (
    q.creatorSlug &&
    p.creator?.slug?.toLowerCase() !== q.creatorSlug.toLowerCase()
  )
    return false;

  // Price comparisons always use the effective (sale-aware) price, so a
  // discounted item lands in exactly one budget tier everywhere in the app.
  if (q.priceMinMinor != null && p.effectivePriceMinor < q.priceMinMinor) return false;
  if (q.priceMaxMinor != null && p.effectivePriceMinor > q.priceMaxMinor) return false;

  if (q.onSale && !p.isOnSale) return false;
  if (q.inStock && !p.inStock) return false;
  if (q.featured && !p.isFeatured) return false;
  if (q.bestSeller && !p.isBestSeller) return false;
  if (q.partnerPicks && p.productType !== "affiliate") return false;
  if (q.minRating != null && p.rating < q.minRating) return false;

  if (q.subcategoryIds?.length && !q.subcategoryIds.includes(p.subcategoryId))
    return false;

  if (q.q) {
    const needle = q.q.trim().toLowerCase();
    const hay = [
      p.title,
      p.description,
      p.categoryTitle,
      p.subcategoryTitle,
      p.specifications?.materials,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    if (!hay.includes(needle)) return false;
  }

  return true;
}

const SORTERS = {
  newest: (a, b) => String(b.createdAt ?? "").localeCompare(String(a.createdAt ?? "")),
  "price-asc": (a, b) => a.effectivePriceMinor - b.effectivePriceMinor,
  "price-desc": (a, b) => b.effectivePriceMinor - a.effectivePriceMinor,
  rating: (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount,
  popular: (a, b) => b.orderCount - a.orderCount,
  relevance: (a, b) =>
    Number(b.isFeatured) - Number(a.isFeatured) ||
    b.orderCount - a.orderCount ||
    b.rating - a.rating,
};

function sortProducts(list, sort) {
  const fn = SORTERS[sort] ?? SORTERS.relevance;
  // Out-of-stock items always sink, whatever the sort.
  return [...list].sort(
    (a, b) => Number(b.inStock) - Number(a.inStock) || fn(a, b),
  );
}

/* ---------------------------------------------------------------
   Public API
   --------------------------------------------------------------- */

/** Paginated, filtered, sorted product list. Always returns an envelope. */
export async function getProducts(query = {}, opts) {
  const list = await allProducts(opts);
  const filtered = list.filter((p) => matches(p, query));
  const sorted = sortProducts(filtered, query.sort);
  return paginate(sorted, {
    page: query.page ?? 1,
    pageSize: query.pageSize ?? PAGE_SIZE,
  });
}

export async function getProductBySlug(slug, opts) {
  const found = (await allProducts(opts)).find((p) => p.slug === slug);
  if (!found) throw notFound("We could not find that product.");
  return found;
}

export async function getProductById(id, opts) {
  const found = (await allProducts(opts)).find((p) => p.id === id);
  if (!found) throw notFound("We could not find that product.");
  return found;
}

/** Resolve many ids at once — used by the cart and wishlist. */
export async function getProductsByIds(ids = [], opts) {
  if (!ids.length) return [];
  const wanted = new Set(ids);
  const list = await allProducts(opts);
  return ids
    .map((id) => list.find((p) => p.id === id))
    .filter((p) => p && wanted.has(p.id));
}

/**
 * Partner-aware product recommendations.
 * - Affiliate products ONLY suggest other affiliate products.
 * - Creator/artisan products ONLY suggest products from that creator.
 * - Collaboration products ONLY suggest products from that collaboration.
 * - Standard catalog products suggest from the same subcategory/category.
 */
export async function getRelatedProducts(productId, { limit = 8 } = {}, opts) {
  const list = await allProducts(opts);
  const product = list.find((p) => p.id === productId);
  if (!product) return [];

  // 1. Affiliate / Partner Picks: ONLY suggest other affiliate products
  if (product.productType === "affiliate" || product.affiliate) {
    const affiliatePicks = list.filter(
      (p) =>
        p.id !== productId &&
        (p.productType === "affiliate" || Boolean(p.affiliate)),
    );
    return sortProducts(affiliatePicks, "popular").slice(0, limit);
  }

  // 2. Creator / Artisan Products: ONLY suggest products from that creator
  if (product.creator?.slug || product.productType === "creator") {
    const creatorSlug = product.creator?.slug?.toLowerCase();
    const creatorProducts = list.filter(
      (p) =>
        p.id !== productId &&
        p.creator?.slug &&
        p.creator.slug.toLowerCase() === creatorSlug,
    );
    return sortProducts(creatorProducts, "popular").slice(0, limit);
  }

  // 3. Collaboration Products: ONLY suggest products from that collaboration
  if (product.collaborationSlug) {
    const collabSlug = product.collaborationSlug.toLowerCase();
    const collabProducts = list.filter(
      (p) =>
        p.id !== productId &&
        p.collaborationSlug &&
        p.collaborationSlug.toLowerCase() === collabSlug,
    );
    return sortProducts(collabProducts, "popular").slice(0, limit);
  }

  // 4. Default: Standard craft products (exclude partner items from general suggestions)
  const sameSub = list.filter(
    (p) =>
      p.id !== productId &&
      p.productType !== "affiliate" &&
      !p.creator?.slug &&
      !p.collaborationSlug &&
      p.subcategoryId === product.subcategoryId,
  );
  const sameCat = list.filter(
    (p) =>
      p.id !== productId &&
      p.productType !== "affiliate" &&
      !p.creator?.slug &&
      !p.collaborationSlug &&
      p.categoryId === product.categoryId &&
      p.subcategoryId !== product.subcategoryId,
  );

  return [...sortProducts(sameSub, "popular"), ...sortProducts(sameCat, "popular")]
    .slice(0, limit);
}

export async function getBestSellers({ limit = 12 } = {}, opts) {
  const list = await allProducts(opts);
  return sortProducts(list.filter((p) => p.isBestSeller), "popular").slice(0, limit);
}

export async function getFeatured({ limit = 8 } = {}, opts) {
  const list = await allProducts(opts);
  return sortProducts(list.filter((p) => p.isFeatured), "relevance").slice(0, limit);
}

export async function getNewArrivals({ limit = 8 } = {}, opts) {
  const list = await allProducts(opts);
  return sortProducts(list, "newest").slice(0, limit);
}

export async function getOnSale({ limit = 12 } = {}, opts) {
  const list = await allProducts(opts);
  return sortProducts(list.filter((p) => p.isOnSale), "relevance").slice(0, limit);
}

/**
 * Real min/max for the current filter context. This is what lets the price
 * slider bound itself to the catalog instead of a hardcoded range that can
 * exclude the cheapest items outright.
 */
export async function getPriceBounds(query = {}, opts) {
  const list = await allProducts(opts);
  const scoped = list.filter((p) =>
    matches(p, { ...query, priceMinMinor: null, priceMaxMinor: null }),
  );
  if (!scoped.length) return { minMinor: 0, maxMinor: 0 };
  const prices = scoped.map((p) => p.effectivePriceMinor);
  return { minMinor: Math.min(...prices), maxMinor: Math.max(...prices) };
}

/**
 * Counts per facet for the current context — drives sidebar "(12)" labels and
 * lets the UI hide filters that would return nothing.
 */
export async function getFacets(query = {}, opts) {
  const list = await allProducts(opts);
  const base = { ...query, subcategoryId: null, subcategoryIds: null, minRating: null };
  const scoped = list.filter((p) => matches(p, base));

  const subcategories = new Map();
  scoped.forEach((p) => {
    const entry = subcategories.get(p.subcategoryId) ?? {
      id: p.subcategoryId,
      title: p.subcategoryTitle,
      count: 0,
    };
    entry.count += 1;
    subcategories.set(p.subcategoryId, entry);
  });

  return {
    total: scoped.length,
    subcategories: [...subcategories.values()].sort((a, b) =>
      a.title.localeCompare(b.title),
    ),
    ratings: [4, 3].map((min) => ({
      min,
      count: scoped.filter((p) => p.rating >= min).length,
    })),
    onSale: scoped.filter((p) => p.isOnSale).length,
    inStock: scoped.filter((p) => p.inStock).length,
  };
}

export async function searchProducts(q, query = {}, opts) {
  return getProducts({ ...query, q, sort: query.sort ?? "relevance" }, opts);
}

export default {
  getProducts,
  getProductBySlug,
  getProductById,
  getProductsByIds,
  getRelatedProducts,
  getBestSellers,
  getFeatured,
  getNewArrivals,
  getOnSale,
  getPriceBounds,
  getFacets,
  searchProducts,
};
