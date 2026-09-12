/**
 * Join class names, dropping falsy values.
 *
 *   cn(s.card, isActive && s.active, className)
 *
 * Exists so conditional CSS-module classes never produce the stray
 * "undefined"/"false" strings that template literals leave behind.
 */
export function cn(...parts) {
  return parts.filter(Boolean).join(" ");
}

export default cn;
