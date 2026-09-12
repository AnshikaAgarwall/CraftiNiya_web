/**
 * Typed accessors over localStore. Services compose on top of these; no
 * component imports this file.
 *
 * Persisted shapes are deliberately minimal — ids and quantities only. Product
 * details are re-fetched through productService so a cart never shows a stale
 * price or a title that changed after it was added.
 */

import store, { KEYS } from "./localStore.js";

/* ---------------------------------------------------------------
   Cart — [{ lineId, productId, variantId, qty, addedAt }]
   --------------------------------------------------------------- */

export const cartStore = {
  read: () => {
    const lines = store.get(KEYS.cart, []);
    return Array.isArray(lines) ? lines : [];
  },
  write: (lines) => store.set(KEYS.cart, lines),
  clear: () => store.remove(KEYS.cart),
  subscribe: (cb) => store.subscribe(KEYS.cart, cb),
};

/* ---------------------------------------------------------------
   Wishlist — [productId]
   --------------------------------------------------------------- */

export const wishlistStore = {
  read: () => {
    const ids = store.get(KEYS.wishlist, []);
    return Array.isArray(ids) ? ids : [];
  },
  write: (ids) => store.set(KEYS.wishlist, [...new Set(ids)]),
  clear: () => store.remove(KEYS.wishlist),
  subscribe: (cb) => store.subscribe(KEYS.wishlist, cb),
};

/* ---------------------------------------------------------------
   Session
   Holds a user object and an expiry — never a token. Keeping tokens out of
   here is what lets the real backend move to an httpOnly cookie without a
   single component changing.
   --------------------------------------------------------------- */

export const sessionStore = {
  read: () => store.get(KEYS.session, null),
  write: (session) => store.set(KEYS.session, session),
  clear: () => store.remove(KEYS.session),
  subscribe: (cb) => store.subscribe(KEYS.session, cb),
};

/** Mock credential vault. Exists only so sign-up -> sign-in works offline. */
export const credentialStore = {
  read: () => store.get("credentials", []),
  write: (list) => store.set("credentials", list),
};

/* ---------------------------------------------------------------
   Recently viewed — [productId], newest first, capped
   --------------------------------------------------------------- */

const RECENT_MAX = 12;

export const recentlyViewedStore = {
  read: () => {
    const ids = store.get(KEYS.recentlyViewed, []);
    return Array.isArray(ids) ? ids : [];
  },
  push: (productId) => {
    const next = [productId, ...recentlyViewedStore.read().filter((id) => id !== productId)];
    return store.set(KEYS.recentlyViewed, next.slice(0, RECENT_MAX));
  },
  clear: () => store.remove(KEYS.recentlyViewed),
};

/* ---------------------------------------------------------------
   Addresses & orders — stand-ins for server resources
   --------------------------------------------------------------- */

export const addressStore = {
  read: () => store.get(KEYS.addresses, []),
  write: (list) => store.set(KEYS.addresses, list),
};

export const orderStore = {
  read: () => store.get(KEYS.orders, []),
  write: (list) => store.set(KEYS.orders, list),
};

export default {
  cartStore,
  wishlistStore,
  sessionStore,
  credentialStore,
  recentlyViewedStore,
  addressStore,
  orderStore,
};
