import { loadDataset } from "./http.js";
import { mapAboutPage } from "./mappers.js";

/**
 * Editorial page content, delivered as data so an admin can change copy,
 * figures, links and pictures without a deploy. In live mode this becomes a
 * CMS/API read; pages only ever see the mapped shape.
 */

export async function getAboutPage(opts) {
  return mapAboutPage(await loadDataset("about", opts));
}

export default { getAboutPage };
