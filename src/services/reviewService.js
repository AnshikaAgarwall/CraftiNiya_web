import { loadDataset, paginate, simulate } from "./http.js";
import { mapReview } from "./mappers.js";
import { validationError } from "./errors.js";

const DATASET = "reviews";

async function all(opts) {
  const raw = await loadDataset(DATASET, opts);
  return raw.map(mapReview);
}

const SORTERS = {
  newest: (a, b) => String(b.createdAt).localeCompare(String(a.createdAt)),
  highest: (a, b) => b.rating - a.rating,
  lowest: (a, b) => a.rating - b.rating,
};

export async function getReviewsForProduct(
  productId,
  { page = 1, pageSize = 6, sort = "newest" } = {},
  opts,
) {
  const list = (await all(opts)).filter((r) => r.productId === productId);
  list.sort(SORTERS[sort] ?? SORTERS.newest);
  return paginate(list, { page, pageSize });
}

/** Rating average plus a 1–5 histogram, for the product page summary. */
export async function getReviewSummary(productId, opts) {
  const list = (await all(opts)).filter((r) => r.productId === productId);
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  list.forEach((r) => {
    distribution[r.rating] = (distribution[r.rating] ?? 0) + 1;
  });
  const total = list.length;
  const average = total
    ? Number((list.reduce((s, r) => s + r.rating, 0) / total).toFixed(1))
    : 0;
  return { average, total, distribution };
}

/** Curated testimonials for the home page pill rail. */
export async function getFeaturedReviews({ limit = 8 } = {}, opts) {
  const list = await all(opts);
  const featured = list.filter((r) => r.isFeatured);
  const pool = featured.length >= limit
    ? featured
    : [...featured, ...list.filter((r) => !r.isFeatured && r.rating === 5)];
  return pool.slice(0, limit);
}

export async function createReview(payload, opts) {
  const details = {};
  if (!payload?.rating) details.rating = "Please choose a rating.";
  if (!payload?.body?.trim()) details.body = "Please write a few words.";
  if (Object.keys(details).length) throw validationError(details);

  return simulate(
    () =>
      mapReview({
        id: `rev-local-${Date.now()}`,
        ...payload,
        createdAt: new Date().toISOString(),
        isVerifiedPurchase: false,
      }),
    opts,
  );
}

export default {
  getReviewsForProduct,
  getReviewSummary,
  getFeaturedReviews,
  createReview,
};
