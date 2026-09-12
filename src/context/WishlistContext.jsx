/* eslint-disable react-refresh/only-export-components --
   Provider and its consumer hook belong together: splitting them into two
   files to satisfy Fast Refresh would add four files that exist only to
   hold a one-line export. Fast Refresh falls back to a full reload for
   this file, which is an acceptable trade for a provider that rarely changes. */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import wishlistService from "../services/wishlistService.js";
import { wishlistStore } from "../storage/stores.js";
import { isAborted } from "../services/errors.js";

/**
 * Wishlist state.
 *
 * Only ids live here — that is all a heart icon needs, and it keeps the
 * provider cheap for the hundreds of product cards that read it. Full product
 * records are fetched by the wishlist page itself.
 *
 * This replaces the abandoned prop-drilling in the old CategoryPage, whose
 * `wishlist`/`onToggleWishlist` props were never passed by the router.
 */

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [ids, setIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    wishlistService
      .getWishlistIds({ signal: controller.signal })
      .then(setIds)
      .catch((e) => !isAborted(e) && setError(e))
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  useEffect(
    () => wishlistStore.subscribe((next) => setIds(Array.isArray(next) ? next : [])),
    [],
  );

  const toggle = useCallback(async (productId) => {
    // Optimistic: a heart that lags 300ms behind the tap feels broken.
    const previous = wishlistStore.read();
    const next = previous.includes(productId)
      ? previous.filter((id) => id !== productId)
      : [...previous, productId];

    setIds(next);
    setPending(true);
    setError(null);

    try {
      await wishlistService.toggleItem(productId);
      setIds(wishlistStore.read());
    } catch (e) {
      setIds(previous); // roll back
      setError(e);
      throw e;
    } finally {
      setPending(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      ids,
      count: ids.length,
      loading,
      pending,
      error,
      clearError: () => setError(null),
      isWishlisted: (productId) => ids.includes(productId),
      toggle,
      clear: async () => {
        await wishlistService.clearWishlist();
        setIds([]);
      },
    }),
    [ids, loading, pending, error, toggle],
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside <WishlistProvider>");
  return ctx;
}

export default WishlistContext;
