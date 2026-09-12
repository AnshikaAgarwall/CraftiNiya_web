/**
 * Money — integer minor units (paise).
 *
 * Every monetary value in the app is an integer number of paise and carries a
 * `Minor` suffix (`listPriceMinor`, `totalMinor`). Nothing multiplies, divides
 * or sums a rupee float anywhere else in the codebase.
 *
 * Why: summing line items, applying a percentage discount and adding tax on
 * floats produces sub-paise drift that surfaces as a total which disagrees
 * with the sum of its rows. Razorpay also takes amounts in paise, so the
 * conversion has to happen regardless — doing it at the edge keeps the middle
 * exact.
 */

export const CURRENCY = "INR";
const MINOR_PER_MAJOR = 100;

/** Rupees (possibly fractional) -> integer paise. */
export function toMinor(major) {
  const n = Number(major);
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * MINOR_PER_MAJOR);
}

/** Integer paise -> rupees as a Number. Display only — never arithmetic. */
export function toMajor(minor) {
  return (Number(minor) || 0) / MINOR_PER_MAJOR;
}

/** Sum any number of minor amounts. */
export function addMinor(...amounts) {
  return amounts.reduce((sum, a) => sum + (Number(a) || 0), 0);
}

/** Multiply a minor amount by a whole quantity. */
export function multiplyMinor(minor, qty) {
  return Math.round((Number(minor) || 0) * (Number(qty) || 0));
}

/**
 * Apply a percentage discount, rounding half-up to the nearest paisa.
 * `percentOff` is 0-100.
 */
export function applyPercent(minor, percentOff) {
  const base = Number(minor) || 0;
  const pct = Math.min(Math.max(Number(percentOff) || 0, 0), 100);
  return Math.round((base * (100 - pct)) / 100);
}

/** Discount percentage between a list and an effective price, floored. */
export function discountPercent(listMinor, effectiveMinor) {
  const list = Number(listMinor) || 0;
  const eff = Number(effectiveMinor) || 0;
  if (list <= 0 || eff >= list) return null;
  return Math.floor(((list - eff) / list) * 100);
}

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: CURRENCY,
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const inrFormatterPaise = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: CURRENCY,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Format a minor amount for display: ₹1,499
 * Paise are hidden unless the amount actually has them, which keeps prices
 * clean while never lying about a total that carries a remainder.
 */
export function formatINR(minor, { forcePaise = false } = {}) {
  const value = Number(minor) || 0;
  const hasPaise = value % MINOR_PER_MAJOR !== 0;
  const fmt = forcePaise || hasPaise ? inrFormatterPaise : inrFormatter;
  return fmt.format(toMajor(value));
}

/** Compact form for dense UI: ₹1.5K */
export function formatINRCompact(minor) {
  const major = toMajor(minor);
  if (major < 1000) return formatINR(minor);
  return `₹${(major / 1000).toFixed(major % 1000 === 0 ? 0 : 1)}K`;
}
