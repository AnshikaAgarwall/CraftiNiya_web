/**
 * Site-level constants: brand identity, navigation, and UI defaults.
 *
 * This is chrome and copy, not content. Products, categories, reviews, reels,
 * promotions and budget tiers are all fetched through `services/` — none of
 * them belong here.
 */

export const BRAND = {
  name: "Craftiniya",
  tagline: "Handmade with love",
  strapline: "Handmade pieces, made to feel special.",
  email: "hello@craftiniya.in",
  instagram: "https://instagram.com/craftiniya",
};

/** Secondary navigation bar — centred below the brand bar. */
export const PRIMARY_NAV = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Categories", to: "/categories" },
  { label: "Shop", to: "/shop" },
  { label: "Sale", to: "/sale" },
];

export const FOOTER_NAV = [
  {
    heading: "Explore",
    links: [
      { label: "Home", to: "/" },
      { label: "Shop all", to: "/shop" },
      { label: "Categories", to: "/categories" },
      { label: "Budget gifting", to: "/budget-gifting" },
      { label: "About us", to: "/about" },
    ],
  },
  {
    heading: "Your account",
    links: [
      { label: "Sign in", to: "/auth?mode=signin" },
      { label: "Create account", to: "/auth?mode=signup" },
      { label: "Your orders", to: "/account/orders" },
      { label: "Wishlist", to: "/wishlist" },
      { label: "Cart", to: "/cart" },
    ],
  },
  {
    heading: "Help",
    links: [
      { label: "Shipping", to: "/about#shipping" },
      { label: "Returns", to: "/about#returns" },
      { label: "Care guide", to: "/about#care" },
      { label: "Contact", to: "/about#contact" },
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
