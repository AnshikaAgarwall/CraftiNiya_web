/**
 * Cart.
 *
 * Every mutation resolves the FULL recomputed cart, never a partial patch — so
 * the reducer replaces state wholesale and a real API can behave identically.
 * Totals are computed here; no component performs price arithmetic.
 *
 * Persisted lines hold ids and quantities only. Titles, images and prices are
 * re-read from productService on every load, so a cart can never display a
 * price that has since changed.
 */

import { simulate } from "./http.js";
import { ApiError, ERROR_CODES, notFound } from "./errors.js";
import { getProductsByIds } from "./productService.js";
import { cartStore } from "../storage/stores.js";
import { addMinor, multiplyMinor } from "../lib/money.js";
import {
  FLAT_SHIPPING_MINOR,
  FREE_SHIPPING_THRESHOLD_MINOR,
  GST_RATE,
} from "../config/site.js";

export const lineIdFor = (productId, variantId) => `${productId}::${variantId}`;

const COUPONS = {
  CRAFT10: { code: "CRAFT10", percentOff: 10, label: "10% off your order" },
  FESTIVE20: { code: "FESTIVE20", percentOff: 20, label: "Festive 20% off" },
  WELCOME15: { code: "WELCOME15", percentOff: 15, label: "15% off your first order" },
};

let couponCode = null;

/* ---------------------------------------------------------------
   Assembly
   --------------------------------------------------------------- */

function emptyCart() {
  return {
    id: "local-cart",
    lines: [],
    itemCount: 0,
    subtotalMinor: 0,
    discountMinor: 0,
    shippingMinor: 0,
    taxMinor: 0,
    totalMinor: 0,
    couponCode: null,
    couponLabel: null,
    freeShippingRemainingMinor: FREE_SHIPPING_THRESHOLD_MINOR,
    updatedAt: new Date().toISOString(),
  };
}

async function build(opts) {
  const stored = cartStore.read();
  if (!stored.length) return emptyCart();

  const products = await getProductsByIds(
    [...new Set(stored.map((l) => l.productId))],
    opts,
  );
  const byId = new Map(products.map((p) => [p.id, p]));

  // Lines whose product no longer exists are dropped rather than rendered as
  // a broken row.
  const lines = stored
    .map((line) => {
      const product = byId.get(line.productId);
      if (!product) return null;

      const variant =
        product.variants.find((v) => v.id === line.variantId) ?? product.variants[0];
      const maxQty = Math.max(variant?.stockCount ?? product.stockCount ?? 0, 0);
      const qty = Math.max(1, Math.min(line.qty, maxQty || line.qty));

      return {
        lineId: line.lineId,
        productId: product.id,
        variantId: variant?.id ?? null,
        slug: product.slug,
        title: product.title,
        variantName: variant?.name ?? null,
        image: variant?.images?.[0] ?? product.image,
        unitPriceMinor: product.effectivePriceMinor,
        listPriceMinor: product.listPriceMinor,
        qty,
        lineTotalMinor: multiplyMinor(product.effectivePriceMinor, qty),
        inStock: product.inStock && maxQty > 0,
        maxQty,
        addedAt: line.addedAt,
      };
    })
    .filter(Boolean);

  const subtotalMinor = addMinor(...lines.map((l) => l.lineTotalMinor));
  const coupon = couponCode ? COUPONS[couponCode] : null;
  const discountMinor = coupon
    ? Math.round((subtotalMinor * coupon.percentOff) / 100)
    : 0;

  const afterDiscount = subtotalMinor - discountMinor;
  const shippingMinor =
    afterDiscount === 0 || afterDiscount >= FREE_SHIPPING_THRESHOLD_MINOR
      ? 0
      : FLAT_SHIPPING_MINOR;
  const taxMinor = Math.round(afterDiscount * GST_RATE);

  return {
    id: "local-cart",
    lines,
    itemCount: lines.reduce((n, l) => n + l.qty, 0),
    subtotalMinor,
    discountMinor,
    shippingMinor,
    taxMinor,
    totalMinor: afterDiscount + shippingMinor + taxMinor,
    couponCode: coupon?.code ?? null,
    couponLabel: coupon?.label ?? null,
    freeShippingRemainingMinor: Math.max(
      FREE_SHIPPING_THRESHOLD_MINOR - afterDiscount,
      0,
    ),
    updatedAt: new Date().toISOString(),
  };
}

const persist = (lines) =>
  cartStore.write(
    lines.map(({ lineId, productId, variantId, qty, addedAt }) => ({
      lineId,
      productId,
      variantId,
      qty,
      addedAt,
    })),
  );

/* ---------------------------------------------------------------
   Public API
   --------------------------------------------------------------- */

export async function getCart(opts) {
  await simulate(() => null, opts);
  return build(opts);
}

export async function addItem({ productId, variantId, qty = 1 }, opts) {
  await simulate(() => null, opts);

  const [product] = await getProductsByIds([productId], opts);
  if (!product) throw notFound("That product is no longer available.");

  const variant =
    product.variants.find((v) => v.id === variantId) ?? product.variants[0];
  const maxQty = Math.max(variant?.stockCount ?? product.stockCount ?? 0, 0);

  const lineId = lineIdFor(productId, variant?.id ?? "default");
  const lines = cartStore.read();
  const existing = lines.find((l) => l.lineId === lineId);
  const nextQty = (existing?.qty ?? 0) + qty;

  if (maxQty > 0 && nextQty > maxQty) {
    throw new ApiError({
      code: ERROR_CODES.OUT_OF_STOCK,
      status: 409,
      message:
        maxQty === (existing?.qty ?? 0)
          ? "That is all the stock we have left."
          : `Only ${maxQty} left in stock.`,
    });
  }

  if (existing) existing.qty = nextQty;
  else
    lines.push({
      lineId,
      productId,
      variantId: variant?.id ?? null,
      qty,
      addedAt: new Date().toISOString(),
    });

  persist(lines);
  return build(opts);
}

export async function updateItemQty(lineId, qty, opts) {
  await simulate(() => null, opts);
  const lines = cartStore.read();
  const line = lines.find((l) => l.lineId === lineId);
  if (!line) throw notFound("That item is no longer in your bag.");

  if (qty <= 0) return removeItem(lineId, opts);
  line.qty = qty;
  persist(lines);
  return build(opts);
}

export async function removeItem(lineId, opts) {
  await simulate(() => null, opts);
  persist(cartStore.read().filter((l) => l.lineId !== lineId));
  return build(opts);
}

export async function removeByProductId(productId, opts) {
  await simulate(() => null, opts);
  persist(cartStore.read().filter((l) => l.productId !== productId));
  return build(opts);
}

export async function clearCart(opts) {
  await simulate(() => null, opts);
  cartStore.clear();
  couponCode = null;
  return build(opts);
}

export async function applyCoupon(code, opts) {
  await simulate(() => null, opts);
  const normalised = String(code ?? "").trim().toUpperCase();
  if (!COUPONS[normalised]) {
    throw new ApiError({
      code: ERROR_CODES.VALIDATION,
      status: 422,
      message: "That code is not valid.",
      details: { code: "Check the code and try again." },
    });
  }
  couponCode = normalised;
  return build(opts);
}

export async function removeCoupon(opts) {
  await simulate(() => null, opts);
  couponCode = null;
  return build(opts);
}

/**
 * Called after sign-in. A guest builds a cart, signs in, and would otherwise
 * watch it vanish — this is the hook that is invariably forgotten until that
 * happens in production.
 */
export async function mergeGuestCart(opts) {
  await simulate(() => null, opts);
  return build(opts);
}

export default {
  getCart,
  addItem,
  updateItemQty,
  removeItem,
  removeByProductId,
  clearCart,
  applyCoupon,
  removeCoupon,
  mergeGuestCart,
  lineIdFor,
};
