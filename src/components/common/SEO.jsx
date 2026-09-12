import { useEffect } from "react";
import { BRAND } from "../../config/site.js";

/**
 * Per-route document metadata.
 *
 * Written against the DOM rather than react-helmet to avoid a dependency for
 * something this small. It sets the tags a prerender step and a social link
 * preview both need — without these, a product URL pasted into WhatsApp or
 * Instagram shows no title and no image.
 */

function setMeta(attr, key, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export default function SEO({
  title,
  description,
  image,
  type = "website",
  noIndex = false,
}) {
  const fullTitle = title ? `${title} — ${BRAND.name}` : `${BRAND.name} — ${BRAND.strapline}`;

  useEffect(() => {
    document.title = fullTitle;

    setMeta("name", "description", description);
    setMeta("name", "robots", noIndex ? "noindex, nofollow" : "index, follow");

    setMeta("property", "og:site_name", BRAND.name);
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", type);
    setMeta("property", "og:image", image);
    setMeta("property", "og:url", window.location.href);

    setMeta("name", "twitter:card", image ? "summary_large_image" : "summary");
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", image);

    setCanonical(window.location.origin + window.location.pathname);
  }, [fullTitle, description, image, type, noIndex]);

  return null;
}
