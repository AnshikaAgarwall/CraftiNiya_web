/**
 * The only module in the app that touches localStorage.
 *
 * Keys are namespaced and versioned so a shape change can be migrated rather
 * than crashing on stale data. Every access is guarded: Safari private mode
 * throws on write, storage can be disabled entirely, and a value can be
 * corrupt — none of which may take the app down.
 */

const NS = "craftiniya";
const VERSION = "v1";

export const KEYS = {
  cart: "cart",
  wishlist: "wishlist",
  session: "session",
  recentlyViewed: "recentlyViewed",
  addresses: "addresses",
  orders: "orders",
};

const fullKey = (key) => `${NS}:${VERSION}:${key}`;

/** In-memory fallback so the app still works when storage is unavailable. */
const memory = new Map();
let available = null;

function isAvailable() {
  if (available !== null) return available;
  try {
    const probe = `${NS}:probe`;
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
    available = true;
  } catch {
    available = false;
  }
  return available;
}

export function get(key, fallback = null) {
  const k = fullKey(key);
  try {
    if (!isAvailable()) return memory.has(k) ? memory.get(k) : fallback;
    const raw = window.localStorage.getItem(k);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    // Corrupt JSON — drop it rather than letting it break every future read.
    try {
      window.localStorage.removeItem(k);
    } catch {
      /* nothing further we can do */
    }
    return fallback;
  }
}

export function set(key, value) {
  const k = fullKey(key);
  try {
    if (!isAvailable()) {
      memory.set(k, value);
      return value;
    }
    window.localStorage.setItem(k, JSON.stringify(value));
    return value;
  } catch {
    // Quota exceeded or private mode — keep the session working in memory.
    memory.set(k, value);
    return value;
  }
}

export function remove(key) {
  const k = fullKey(key);
  memory.delete(k);
  try {
    window.localStorage.removeItem(k);
  } catch {
    /* already gone */
  }
}

/**
 * Cross-tab updates. The `storage` event only fires in *other* tabs, which is
 * exactly what we want: add to cart in one tab, see the badge update in the
 * next without a refresh.
 */
export function subscribe(key, callback) {
  const k = fullKey(key);
  const handler = (event) => {
    if (event.key !== k) return;
    try {
      callback(event.newValue === null ? null : JSON.parse(event.newValue));
    } catch {
      callback(null);
    }
  };
  window.addEventListener("storage", handler);
  return () => window.removeEventListener("storage", handler);
}

export default { KEYS, get, set, remove, subscribe };
