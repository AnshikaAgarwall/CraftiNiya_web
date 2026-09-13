/**
 * Raw dataset records -> stable domain shapes.
 *
 * This is the seam. When a real API returns different field names, only this
 * file changes; every component keeps consuming the same properties.
 *
 * Prices arrive as rupees and leave as integer paise (`*Minor`). Nothing
 * downstream ever sees a rupee float.
 */

import { discountPercent, toMinor } from "../lib/money.js";
import { maskEmail } from "../lib/format.js";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&h=900&q=80";

export function mapProduct(raw) {
  if (!raw) return null;

  const listPriceMinor = toMinor(raw.price);
  const effectivePriceMinor =
    raw.isOnSale && raw.salePrice ? toMinor(raw.salePrice) : listPriceMinor;

  // Images are optional on the record. A missing one stays null so LazyImage
  // renders an empty frame instead of an unrelated stock photo.
  const variants = (raw.variants ?? []).map((v, i) => ({
    id: v.id ?? `${raw.id}-v${i + 1}`,
    name: v.name ?? "Default",
    images: v.images ?? [],
    stockCount: v.stockCount ?? raw.stockCount ?? 0,
  }));

  const images = variants[0]?.images ?? [];

  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title,
    description: raw.description ?? "",

    image: images[0] ?? null,
    images,

    listPriceMinor,
    effectivePriceMinor,
    isOnSale: Boolean(raw.isOnSale) && effectivePriceMinor < listPriceMinor,
    discountPct:
      raw.discountPercentage ??
      discountPercent(listPriceMinor, effectivePriceMinor),

    categoryId: raw.category,
    subcategoryId: raw.subcategory,

    rating: raw.rating ?? 0,
    reviewCount: raw.reviewCount ?? 0,
    orderCount: raw.orderCount ?? 0,

    inStock: raw.inStock ?? true,
    stockCount: raw.stockCount ?? null,
    lowStock: Boolean(raw.lowStock),

    isFeatured: Boolean(raw.isFeatured),
    isBestSeller: Boolean(raw.isBestSeller),

    createdAt: raw.createdAt ?? null,
    ageGroup: raw.ageGroup ?? null,
    specifications: raw.specifications ?? null,
    gifting: raw.gifting ?? null,

    variants,
  };
}

/**
 * Category and subcategory titles live in categories.json, not on the product.
 * Services call this after mapping so cards and breadcrumbs can show real
 * labels instead of raw slugs.
 */
export function withTaxonomy(product, taxonomy) {
  if (!product) return null;
  const cat = taxonomy?.byCategory?.get(product.categoryId);
  const sub = taxonomy?.bySubcategory?.get(product.subcategoryId);
  return {
    ...product,
    categoryTitle: cat?.title ?? "",
    subcategoryTitle: sub?.title ?? "",
  };
}

export function mapCategory(raw) {
  if (!raw) return null;
  return {
    id: raw.id,
    slug: raw.slug ?? raw.id,
    title: raw.title,
    description: raw.description ?? "",
    posterImage: raw.posterImage ?? null,
    productCount: raw.productCount ?? 0,
    subcategories: (raw.subcategories ?? []).map(mapSubcategory),
  };
}

export function mapSubcategory(raw) {
  if (!raw) return null;
  return {
    id: raw.id,
    slug: raw.slug ?? raw.id,
    title: raw.title,
    posterImage: raw.posterImage ?? null,
    productCount: raw.productCount ?? 0,
  };
}

export function mapReview(raw) {
  if (!raw) return null;
  return {
    id: raw.id,
    productId: raw.productId,
    productSlug: raw.productSlug,
    productTitle: raw.productTitle,
    productImage: raw.productImage ?? null,
    authorName: raw.authorName,
    authorEmail: maskEmail(raw.authorEmail),
    rating: raw.rating ?? 0,
    title: raw.title ?? "",
    body: raw.body ?? "",
    isVerifiedPurchase: Boolean(raw.isVerifiedPurchase),
    isFeatured: Boolean(raw.isFeatured),
    createdAt: raw.createdAt,
  };
}

export function mapReel(raw) {
  if (!raw) return null;
  const caption = raw.caption ?? raw.description ?? "";
  const product = raw.product
    ? {
        id: raw.product.id,
        title: raw.product.title,
        slug: raw.product.slug,
        price: raw.product.price,
        salePrice: raw.product.salePrice ?? null,
        category: raw.product.category ?? "",
        image: raw.product.image ?? raw.posterUrl,
        inStock: raw.product.inStock ?? true,
      }
    : null;

  return {
    id: String(raw.id),
    instagramId: raw.instagramId ?? null,
    instagramUrl:
      raw.instagramUrl ??
      raw.externalUrl ??
      "https://www.instagram.com/manmish_creations?igsi=am9xYjJkejJjOHho",
    title: raw.title ?? "Handmade Creation",
    caption,
    description: caption,
    posterUrl: raw.posterUrl ?? FALLBACK_IMAGE,
    videoUrl: raw.videoUrl ?? null,
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    views: Number(raw.views) || 0,
    likes: Number(raw.likes) || 0,
    commentsCount:
      Number(raw.commentsCount) ||
      Math.max(12, Math.round((Number(raw.likes) || 0) / 14)),
    isFeaturedOnHome: raw.isFeaturedOnHome !== false,
    order: Number(raw.order) || 99,
    author: {
      name: raw.author?.name ?? "Manmish Creations",
      handle: raw.author?.handle ?? "@manmish_creations",
      profileUrl:
        raw.author?.profileUrl ??
        "https://www.instagram.com/manmish_creations?igsi=am9xYjJkejJjOHho",
      avatarUrl: raw.author?.avatarUrl ?? FALLBACK_IMAGE,
      verified: raw.author?.verified ?? true,
    },
    taggedProductId: raw.taggedProductId ?? product?.id ?? null,
    product,
    visitUrl:
      raw.visitUrl ??
      (product?.slug ? `/product/${product.slug}` : "/shop"),
    visitLabel: raw.visitLabel ?? "Visit Product",
    publishedAt: raw.publishedAt ?? null,
  };
}

export function mapPromotion(raw) {
  if (!raw) return null;
  return {
    id: raw.id,
    active: Boolean(raw.active),
    label: raw.label ?? "",
    headline: raw.headline ?? "",
    subline: raw.subline ?? "",
    startsAt: raw.startsAt ?? null,
    endsAt: raw.endsAt ?? null, // ISO-8601 UTC; rendered in the viewer's zone
    ctaLabel: raw.ctaLabel ?? "Shop now",
    ctaHref: raw.ctaHref ?? "/sale",
    theme: raw.theme ?? "accent",
  };
}

export function mapBudgetTier(raw) {
  if (!raw) return null;
  return {
    id: raw.id,
    label: raw.label,
    tag: raw.tag ?? "",
    description: raw.description ?? "",
    minMinor: raw.min == null ? null : toMinor(raw.min),
    maxMinor: raw.max == null ? null : toMinor(raw.max),
    productCount: raw.productCount ?? 0,
    sortOrder: raw.sortOrder ?? 0,
  };
}

export function mapHeroSlide(raw) {
  if (!raw) return null;
  return {
    id: raw.id,
    eyebrow: raw.eyebrow ?? "",
    title: raw.title ?? "",
    body: raw.body ?? "",
    href: raw.href ?? "/shop",
    videoUrl: raw.videoUrl ?? null, // short looping clip
    // Two images on purpose. posterUrl is the clip's own first frame — low-res
    // is fine because it is on screen for a moment and matches what follows.
    // imageUrl is a sharp still for when video does not play at all (reduced
    // motion, no videoUrl), where a blurry frame would be the whole banner.
    posterUrl: raw.posterUrl ?? raw.imageUrl ?? FALLBACK_IMAGE,
    imageUrl: raw.imageUrl ?? raw.posterUrl ?? FALLBACK_IMAGE,
    active: raw.active !== false,
    sortOrder: raw.sortOrder ?? 0,
  };
}

/* ---------- editorial content ---------- */

const mapImage = (raw) => ({ url: raw?.url || null, alt: raw?.alt ?? "" });
const mapLink = (raw) => (raw?.label && raw?.href ? { label: raw.label, href: raw.href } : null);
const mapList = (items, map) => (Array.isArray(items) ? items.map(map).filter(Boolean) : []);
/** A section that is absent or switched off (`active: false`) maps to null. */
const mapSection = (raw, map) => (raw && raw.active !== false ? map(raw) : null);

/**
 * About page. Every section and list item is optional on the record, so the
 * page can drop whatever an admin leaves empty instead of rendering a shell.
 */
export function mapAboutPage(raw) {
  if (!raw) return null;
  return {
    seo: {
      title: raw.seo?.title ?? "About",
      description: raw.seo?.description ?? "",
    },
    hero: mapSection(raw.hero, (h) => ({
      title: h.title ?? "",
      body: h.body ?? "",
      cta: mapLink(h.cta),
      videoUrl: h.videoUrl || null,
      image: mapImage(h.image),
    })),
    welcome: mapSection(raw.welcome, (w) => ({
      title: w.title ?? "",
      body: w.body ?? "",
      image: mapImage(w.image),
      stats: mapList(w.stats, (st, i) =>
        st?.value != null && st.value !== ""
          ? { id: st.id ?? `stat-${i}`, value: String(st.value), label: st.label ?? "", icon: st.icon ?? null }
          : null,
      ),
    })),
    services: mapSection(raw.services, (sv) => ({
      eyebrow: sv.eyebrow ?? "",
      title: sv.title ?? "",
      items: mapList(sv.items, (it, i) =>
        it?.title
          ? { id: it.id ?? `service-${i}`, title: it.title, body: it.body ?? "", icon: it.icon ?? null, href: it.href || null }
          : null,
      ),
    })),
    stalls: mapSection(raw.stalls, (st) => ({
      eyebrow: st.eyebrow ?? "",
      title: st.title ?? "Our Stalls & Exhibitions",
      body: st.body ?? "",
      items: mapList(st.items, (it, i) => ({
        id: it?.id ?? `stall-${i}`,
        title: it?.title ?? null,
        event: it?.event ?? null,
        location: it?.location ?? null,
        date: it?.date ?? null,
        imageUrl: it?.imageUrl ?? null,
        caption: it?.caption ?? null,
      })),
    })),
    policies: mapSection(raw.policies, (p) => ({
      title: p.title ?? "",
      items: mapList(p.items, (it) =>
        it?.id && it?.title ? { id: it.id, title: it.title, body: it.body ?? "" } : null,
      ),
    })),
    contact: mapSection(raw.contact, (c) => ({ title: c.title ?? "" })),
  };
}

export { FALLBACK_IMAGE };
