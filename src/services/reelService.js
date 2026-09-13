import { loadDataset } from "./http.js";
import { mapReel } from "./mappers.js";
import { notFound } from "./errors.js";

const DATASET = "reels";

export async function getReels({ limit = 6 } = {}, opts) {
  const raw = await loadDataset(DATASET, opts);
  return raw
    .map(mapReel)
    .filter((r) => r && r.isFeaturedOnHome)
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
    .slice(0, Math.min(limit, 6));
}

export async function getReelById(id, opts) {
  const found = (await getReels({ limit: Infinity }, opts)).find(
    (r) => String(r.id) === String(id),
  );
  if (!found) throw notFound("We could not find that reel.");
  return found;
}

export default { getReels, getReelById };
