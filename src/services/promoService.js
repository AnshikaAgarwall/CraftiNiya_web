import { loadDataset, simulate } from "./http.js";
import { mapBudgetTier, mapHeroSlide, mapPromotion } from "./mappers.js";

/**
 * Hero banners, promotions and budget tiers are configuration, delivered as
 * data so an admin can change them without a deploy. The UI renders whatever
 * it is handed.
 */

/** Home-page hero banners — one clickable slide each, in display order. */
export async function getHeroSlides(opts) {
  const raw = await loadDataset("hero-slides", opts);
  return raw
    .map(mapHeroSlide)
    .filter((slide) => slide.active)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getActivePromotion(opts) {
  const raw = await loadDataset("promotions", opts);
  const now = Date.now();

  const active = raw
    .map(mapPromotion)
    .filter((p) => {
      if (!p.active) return false;
      const starts = p.startsAt ? Date.parse(p.startsAt) : -Infinity;
      const ends = p.endsAt ? Date.parse(p.endsAt) : Infinity;
      return now >= starts && now < ends;
    })
    .sort((a, b) => Date.parse(a.endsAt ?? 0) - Date.parse(b.endsAt ?? 0));

  // null rather than a rejection: "no sale running" is a normal state, and the
  // banner must render nothing at all rather than an error or a reserved gap.
  return active[0] ?? null;
}

/**
 * Server clock. The countdown is driven from the offset between this and the
 * client clock, because a user with a wrong system time would otherwise see a
 * wrong timer — or a sale that has already expired.
 */
export async function getServerTime(opts) {
  return simulate(() => ({ nowIso: new Date().toISOString() }), opts);
}

export async function getBudgetTiers(opts) {
  const raw = await loadDataset("budget-tiers", opts);
  return raw
    .map(mapBudgetTier)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getBudgetTierById(id, opts) {
  const tiers = await getBudgetTiers(opts);
  return tiers.find((t) => t.id === id) ?? null;
}

export default {
  getHeroSlides,
  getActivePromotion,
  getServerTime,
  getBudgetTiers,
  getBudgetTierById,
};
