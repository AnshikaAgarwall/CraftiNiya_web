/**
 * Site-level constants: brand identity, navigation, and UI defaults.
 *
 * This is chrome and copy, not content. Products, categories, reviews, reels,
 * promotions and budget tiers are all fetched through `services/` — none of
 * them belong here.
 */

export const BRAND = {
  name: "CraftiNiya",
  tagline: "Handmade with love",
  strapline: "Handmade pieces, made to feel special.",
  email: "hello@craftiniya.in",
  instagram: "https://www.instagram.com/manmish_creations?igsi=am9xYjJkejJjOHho",
};

/** Secondary navigation bar — centred below the brand bar. */
export const PRIMARY_NAV = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Categories", to: "/categories" },
  { label: "Partners", to: "#partners", isTrigger: true },
  { label: "Sale", to: "/sale" },
];

export const FOOTER_NAV = [
  {
    heading: "Customer Care",
    links: [
      { label: "Track Your Order", to: "/track-order" },
      { label: "Shipping & Delivery Policy", to: "/shipping-policy" },
      { label: "Returns & Refunds", to: "/return-refund-policy" },
      { label: "Help & FAQs", to: "/faq" },
      { label: "Contact Us", to: "/contact" },
      { label: "Your Account", to: "/account" },
    ],
  },
  {
    heading: "About CraftiNiya",
    links: [
      { label: "Our Story & Studio", to: "/about" },
      { label: "Meet the Artisans", to: "/about#artisans" },
      { label: "Product Care Guide", to: "/faq#resin-care-guide" },
      { label: "Pop-ups & Exhibitions", to: "/about#exhibitions" },
      { label: "Bulk & Corporate Gifts", to: "/contact" },
    ],
  },
  {
    heading: "Policies & Legal",
    links: [
      { label: "Terms & Conditions", to: "/terms-and-conditions" },
      { label: "Privacy Policy", to: "/privacy-policy" },
      { label: "Return & Refund Policy", to: "/return-refund-policy" },
      { label: "Shipping & Delivery Policy", to: "/shipping-policy" },
      { label: "Secure Payment Policy", to: "/privacy-policy#secure-payments" },
    ],
  },
];

/** Sort options offered wherever a product list appears. */
export const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
  { value: "popular", label: "Most loved" },
];

export const DEFAULT_SORT = "relevance";
export const PAGE_SIZE = 24;

/** Value propositions — static brand copy, safe to keep in config. */
export const VALUE_PROPS = [
  {
    id: "handmade",
    title: "Genuinely handmade",
    body: "Every piece is made in small batches by a person, not a production line. Slight variation is the signature, not a defect.",
  },
  {
    id: "materials",
    title: "Materials we stand behind",
    body: "Food-safe resins, natural soy wax, responsibly sourced timber and cotton. We list what is in everything we sell.",
  },
  {
    id: "personal",
    title: "Made to your brief",
    body: "Names, dates, colours, dried flowers from an occasion that mattered. Most pieces can be personalised.",
  },
  {
    id: "packaging",
    title: "Gift-ready as standard",
    body: "Everything arrives wrapped, padded and sealed, with a handwritten note if you would like one.",
  },
];

export const FREE_SHIPPING_THRESHOLD_MINOR = 149900; // ₹1,499
export const FLAT_SHIPPING_MINOR = 9900; // ₹99
export const GST_RATE = 0.18;

export default {
  BRAND,
  PRIMARY_NAV,
  FOOTER_NAV,
  SORT_OPTIONS,
  DEFAULT_SORT,
  PAGE_SIZE,
  VALUE_PROPS,
  FREE_SHIPPING_THRESHOLD_MINOR,
  FLAT_SHIPPING_MINOR,
  GST_RATE,
};
