import { loadDataset } from "./http.js";
import { mapReel } from "./mappers.js";
import { notFound } from "./errors.js";

const DATASET = "reels";

export async function getReels({ limit = 8 } = {}, opts) {
  const raw = await loadDataset(DATASET, opts);
  return raw
    .map(mapReel)
    .sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)))
    .slice(0, limit);
}

export async function getReelById(id, opts) {
  const found = (await getReels({ limit: Infinity }, opts)).find(
    (r) => String(r.id) === String(id),
  );
  if (!found) throw notFound("We could not find that reel.");
  return found;
}

export default { getReels, getReelById };
