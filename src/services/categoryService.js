import { loadDataset } from "./http.js";
import { mapCategory } from "./mappers.js";
import { notFound } from "./errors.js";

const DATASET = "categories";

async function all(opts) {
  const raw = await loadDataset(DATASET, opts);
  return raw.map(mapCategory);
}

/** All top-level categories, each carrying its subcategories. */
export async function getCategories(opts) {
  return all(opts);
}

export async function getCategoryById(id, opts) {
  const found = (await all(opts)).find((c) => c.id === id || c.slug === id);
  if (!found) throw notFound(`We could not find the "${id}" category.`);
  return found;
}

export async function getSubcategories(categoryId, opts) {
  const category = await getCategoryById(categoryId, opts);
  return category.subcategories;
}

export async function getSubcategoryById(categoryId, subcategoryId, opts) {
  const subs = await getSubcategories(categoryId, opts);
  const found = subs.find((s) => s.id === subcategoryId || s.slug === subcategoryId);
  if (!found) throw notFound("We could not find that subcategory.");
  return found;
}

/**
 * Lookup maps used by the product mapper to attach human-readable category and
 * subcategory titles. Cached at the dataset layer, so this is cheap to call.
 */
export async function getTaxonomy(opts) {
  const categories = await all(opts);
  const byCategory = new Map();
  const bySubcategory = new Map();

  categories.forEach((c) => {
    byCategory.set(c.id, c);
    c.subcategories.forEach((s) => bySubcategory.set(s.id, { ...s, categoryId: c.id }));
  });

  return { categories, byCategory, bySubcategory };
}

export default {
  getCategories,
  getCategoryById,
  getSubcategories,
  getSubcategoryById,
  getTaxonomy,
};
