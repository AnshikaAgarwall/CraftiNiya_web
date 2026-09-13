/**
 * Orders and addresses.
 *
 * Payment is deliberately a stub: it records a method and marks the order paid.
 * When Razorpay is wired up, `createOrder` becomes a two-step flow (create
 * intent -> confirm) behind this same signature.
 */

import { paginate, simulate } from "./http.js";
import { notFound, validationError } from "./errors.js";
import { addressStore, orderStore } from "../storage/stores.js";
import { clearCart, getCart } from "./cartService.js";

export const ORDER_STATUS = {
  PLACED: "placed",
  CRAFTING: "crafting",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};

const PIN_RE = /^[1-9][0-9]{5}$/;
const PHONE_RE = /^[6-9][0-9]{9}$/;

export function validateAddress(address) {
  const details = {};
  if (!address?.fullName?.trim()) details.fullName = "Please enter a name.";
  if (!address?.phone?.trim()) details.phone = "Please enter a phone number.";
  else if (!PHONE_RE.test(address.phone.replace(/\D/g, "").slice(-10)))
    details.phone = "Enter a valid 10-digit Indian mobile number.";
  if (!address?.line1?.trim()) details.line1 = "Please enter an address.";
  if (!address?.city?.trim()) details.city = "Please enter a city.";
  if (!address?.state?.trim()) details.state = "Please choose a state.";
  if (!address?.pincode?.trim()) details.pincode = "Please enter a PIN code.";
  else if (!PIN_RE.test(address.pincode.trim()))
    details.pincode = "Enter a valid 6-digit PIN code.";
  return details;
}

const orderNumber = () =>
  `CRF-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

/* ---------------------------------------------------------------
   Orders
   --------------------------------------------------------------- */

export async function createOrder({ shippingAddress, paymentMethod = "card", notes }, opts) {
  const details = validateAddress(shippingAddress);
  if (Object.keys(details).length) throw validationError(details);

  const cart = await getCart(opts);
  if (!cart.lines.length) {
    throw validationError({}, "Your bag is empty.");
  }

  await simulate(() => null, opts);

  const now = new Date();
  const order = {
    id: `order-${Date.now()}`,
    orderNumber: orderNumber(),
    status: ORDER_STATUS.PLACED,
    lines: cart.lines.map((l) => ({
      lineId: l.lineId,
      productId: l.productId,
      slug: l.slug,
      title: l.title,
      variantName: l.variantName,
      image: l.image,
      unitPriceMinor: l.unitPriceMinor,
      qty: l.qty,
      lineTotalMinor: l.lineTotalMinor,
    })),
    totals: {
      subtotalMinor: cart.subtotalMinor,
      discountMinor: cart.discountMinor,
      shippingMinor: cart.shippingMinor,
      taxMinor: cart.taxMinor,
      totalMinor: cart.totalMinor,
    },
    couponCode: cart.couponCode,
    shippingAddress,
    paymentMethod,
    paymentStatus: paymentMethod === "cod" ? "pending" : "paid",
    notes: notes ?? "",
    placedAt: now.toISOString(),
    estimatedDeliveryAt: new Date(now.getTime() + 6 * 864e5).toISOString(),
  };

  orderStore.write([order, ...orderStore.read()]);
  await clearCart(opts);
  return order;
}

export async function getOrder(orderId, opts) {
  await simulate(() => null, opts);
  const found = orderStore
    .read()
    .find((o) => o.id === orderId || o.orderNumber === orderId);
  if (!found) throw notFound("We could not find that order.");
  return found;
}

export async function getOrders({ page = 1, pageSize = 10 } = {}, opts) {
  await simulate(() => null, opts);
  const list = [...orderStore.read()].sort((a, b) =>
    String(b.placedAt).localeCompare(String(a.placedAt)),
  );
  return paginate(list, { page, pageSize });
}

export async function cancelOrder(orderId, opts) {
  await simulate(() => null, opts);
  const orders = orderStore.read();
  const order = orders.find((o) => o.id === orderId);
  if (!order) throw notFound("We could not find that order.");
  if (order.status !== ORDER_STATUS.PLACED) {
    throw validationError({}, "This order has already been dispatched.");
  }
  order.status = ORDER_STATUS.CANCELLED;
  orderStore.write(orders);
  return order;
}

/* ---------------------------------------------------------------
   Addresses
   --------------------------------------------------------------- */

export async function getAddresses(opts) {
  return simulate(() => {
    const list = addressStore.read();
    if (!list || !list.length) {
      const initial = [
        {
          id: "addr-1",
          title: "Address 1",
          fullName: "Anshika Agarwal",
          phone: "+91 98765 43210",
          line1: "House No. 12, Street Name",
          line2: "Near Civil Lines",
          city: "Jaipur",
          state: "Rajasthan",
          pincode: "302001",
          country: "India",
          isDefault: true,
        },
        {
          id: "addr-2",
          title: "Address 2",
          fullName: "Anshika Agarwal",
          phone: "+91 98765 43210",
          line1: "Flat 4B, Another Street",
          line2: "Opposite High Street",
          city: "Mumbai",
          state: "Maharashtra",
          pincode: "400001",
          country: "India",
          isDefault: false,
        },
      ];
      addressStore.write(initial);
      return initial;
    }
    return list;
  }, opts);
}

export async function saveAddress(address, opts) {
  const details = validateAddress(address);
  if (Object.keys(details).length) throw validationError(details);

  await simulate(() => null, opts);

  const list = addressStore.read();
  const id = address.id ?? `addr-${Date.now()}`;
  const next = { ...address, id };

  const merged = address.id
    ? list.map((a) => (a.id === address.id ? next : a))
    : [...list, next];

  // Exactly one default, always.
  const withDefault = merged.map((a) => ({
    ...a,
    isDefault: next.isDefault ? a.id === id : Boolean(a.isDefault),
  }));
  if (!withDefault.some((a) => a.isDefault) && withDefault.length) {
    withDefault[0].isDefault = true;
  }

  addressStore.write(withDefault);
  return next;
}

export async function deleteAddress(id, opts) {
  await simulate(() => null, opts);
  addressStore.write(addressStore.read().filter((a) => a.id !== id));
  return addressStore.read();
}

export default {
  ORDER_STATUS,
  validateAddress,
  createOrder,
  getOrder,
  getOrders,
  cancelOrder,
  getAddresses,
  saveAddress,
  deleteAddress,
};
