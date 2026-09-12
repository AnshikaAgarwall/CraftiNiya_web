/* eslint-disable react-refresh/only-export-components --
   Provider and its consumer hook belong together: splitting them into two
   files to satisfy Fast Refresh would add four files that exist only to
   hold a one-line export. Fast Refresh falls back to a full reload for
   this file, which is an acceptable trade for a provider that rarely changes. */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import cartService from "../services/cartService.js";
import { cartStore } from "../storage/stores.js";
import { isAborted } from "../services/errors.js";

/**
 * Cart state.
 *
 * Every mutation resolves the full recomputed cart from the service, so state
 * is replaced wholesale rather than patched. No total is ever calculated here —
 * that arithmetic belongs to cartService and, later, to the backend.
 */

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    cartService
      .getCart({ signal: controller.signal })
      .then(setCart)
      .catch((e) => !isAborted(e) && setError(e))
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  // Another tab changed the cart — resync rather than drift out of step.
  useEffect(
    () =>
      cartStore.subscribe(() => {
        cartService.getCart().then(setCart).catch(() => {});
      }),
    [],
  );

  const run = useCallback(async (operation) => {
    setPending(true);
    setError(null);
    try {
      const next = await operation();
      setCart(next);
      return next;
    } catch (e) {
      setError(e);
      throw e;
    } finally {
      setPending(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      cart,
      lines: cart?.lines ?? [],
      itemCount: cart?.itemCount ?? 0,
      loading,
      pending,
      error,
      clearError: () => setError(null),

      addItem: (payload) => run(() => cartService.addItem(payload)),
      updateQty: (lineId, qty) => run(() => cartService.updateItemQty(lineId, qty)),
      removeItem: (lineId) => run(() => cartService.removeItem(lineId)),
      clearCart: () => run(() => cartService.clearCart()),
      applyCoupon: (code) => run(() => cartService.applyCoupon(code)),
      removeCoupon: () => run(() => cartService.removeCoupon()),
      mergeGuestCart: () => run(() => cartService.mergeGuestCart()),

      isInCart: (productId) =>
        Boolean(cart?.lines?.some((l) => l.productId === productId)),
    }),
    [cart, loading, pending, error, run],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

export default CartContext;
