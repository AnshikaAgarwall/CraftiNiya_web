/**
 * Wishlist. Stores product ids only; product detail is re-read on load so a
 * saved item never shows a stale price.
 *
 * Reads resolve an envelope like every other list endpoint, so the wishlist
 * page can paginate later without a component change.
 */

import { paginate, simulate } from "./http.js";
import { getProductsByIds } from "./productService.js";
import { wishlistStore } from "../storage/stores.js";

async function build({ page = 1, pageSize = 24 } = {}, opts) {
  const ids = wishlistStore.read();
  if (!ids.length) return { ...paginate([], { page, pageSize }), ids: [] };

  const products = await getProductsByIds(ids, opts);
  return { ...paginate(products, { page, pageSize }), ids };
}

export async function getWishlist(query, opts) {
  await simulate(() => null, opts);
  return build(query, opts);
}

/** Ids only — cheap enough for the header badge and card heart states. */
export async function getWishlistIds(opts) {
  return simulate(() => wishlistStore.read(), opts);
}

export async function addItem(productId, opts) {
  await simulate(() => null, opts);
  wishlistStore.write([...wishlistStore.read(), productId]);
  return build({}, opts);
}

export async function removeItem(productId, opts) {
  await simulate(() => null, opts);
  wishlistStore.write(wishlistStore.read().filter((id) => id !== productId));
  return build({}, opts);
}

export async function toggleItem(productId, opts) {
  const ids = wishlistStore.read();
  return ids.includes(productId)
    ? removeItem(productId, opts)
    : addItem(productId, opts);
}

export async function clearWishlist(opts) {
  await simulate(() => null, opts);
  wishlistStore.clear();
  return build({}, opts);
}

/** Counterpart to mergeGuestCart — runs after sign-in. */
export async function mergeGuestWishlist(opts) {
  await simulate(() => null, opts);
  return build({}, opts);
}

export default {
  getWishlist,
  getWishlistIds,
  addItem,
  removeItem,
  toggleItem,
  clearWishlist,
  mergeGuestWishlist,
};
