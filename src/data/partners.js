import rangsajjaImg from "../assets/rangsajja.png";
import sugandhitImg from "../assets/sugandhit.png";
import crochetkariImg from "../assets/crochetkari.png";
import mittiImg from "../assets/CraftiNiya x Mitti Se.png";
import collabBannerWide from "../assets/COLLABBRAND.png";
import bundleBannerWide from "../assets/BRANDPROMOTION.png";
import ananyaCreatorImg from "../assets/ananya creator.png";

/**
 * Three partner types supported by CraftiNiya:
 * 1. Brand Collaborations -> /collaborations
 * 2. Creators -> /creators
 * 3. Partner Picks -> /partner-picks
 */
export const PARTNER_TYPES = [
  {
    id: "collaborations",
    label: "Brand Collaborations",
    to: "/collaborations",
    badge: "Limited Editions",
    description:
      "Co-created seasonal collections with distinguished Indian artisan brands and craft houses.",
  },
  {
    id: "creators",
    label: "Creators",
    to: "/creators",
    badge: "Artisan Spotlight",
    description:
      "Dedicated creator storefronts celebrating independent studio makers and rural NGO collectives.",
  },
  {
    id: "partner-picks",
    label: "Partner Picks",
    to: "/partner-picks",
    badge: "Curated Affiliate",
    description:
      "Special edition pieces and handcrafted heritage designs fulfilled directly with affiliate partner workshops.",
  },
];

/**
 * Single source of truth for Brand Collaborations (4 current collaborations).
 */
export const BRAND_COLLABORATIONS = [
  {
    id: "rangsajja",
    slug: "rangsajja",
    brandName: "RangSajja",
    title: "CraftiNiya x RangSajja",
    eyebrow: "Festive Gifting Edition",
    tagline:
      "A limited-edition fusion of natural textures, hand-painted festive trays, and celebratory gifts.",
    description:
      "A limited-edition fusion of natural textures, hand-painted festive trays, and celebratory gifts crafted for joyful celebrations.",
    bannerImage: rangsajjaImg,
    heroImage: collabBannerWide,
    badge: "Festive Edition",
    categoryQuery: "festive-pooja",
    searchFallback: "festive",
    founded: "Jaipur, India",
    specialty: "Hand-painted wood & festive décor",
  },
  {
    id: "sugandhit",
    slug: "sugandhit",
    brandName: "Sugandhit",
    title: "CraftiNiya x Sugandhit",
    eyebrow: "Sacred Scents Festive Box",
    tagline:
      "Curated home fragrance rituals with artisanal soy candles, premium agarbatti, and aroma diffusers.",
    description:
      "Curated home fragrance rituals with artisanal soy candles, premium agarbatti, and aroma diffusers crafted with pure botanical extracts.",
    bannerImage: sugandhitImg,
    heroImage: collabBannerWide,
    badge: "Fragrance Rituals",
    categoryQuery: "candles-fragrance",
    searchFallback: "candle",
    founded: "Kannauj & Delhi",
    specialty: "Pure soy aromatherapy & natural attars",
  },
  {
    id: "crochetkari",
    slug: "crochetkari",
    brandName: "CrochetKari",
    title: "CraftiNiya x CrochetKari",
    eyebrow: "Handmade Floral Keepsakes",
    tagline:
      "Exclusive handmade crochet flower bouquets, handcrafted plushies, and forever-blooming gifting sets.",
    description:
      "Exclusive handmade crochet flower bouquets, handcrafted plushies, and forever-blooming gifting sets knitted with organic cotton yarn.",
    bannerImage: crochetkariImg,
    heroImage: bundleBannerWide,
    badge: "Handmade Florals",
    categoryQuery: "handmade-crochet",
    searchFallback: "crochet",
    founded: "Shimla, Himachal Pradesh",
    specialty: "Forever crochet florals & soft plushies",
  },
  {
    id: "mitti-se",
    slug: "mitti-se",
    brandName: "Mitti Se",
    title: "CraftiNiya x Mitti Se",
    eyebrow: "Artisan Hamper Collection",
    tagline:
      "Chai ritual sets, glazed ceramic kulhads, and heartfelt small-batch artisan tableware.",
    description:
      "Chai ritual sets, glazed ceramic kulhads, and heartfelt small-batch artisan tableware hand-thrown on potters' wheels in Khurja.",
    bannerImage: mittiImg,
    heroImage: collabBannerWide,
    badge: "Artisan Ceramics",
    categoryQuery: "home-decor",
    searchFallback: "table",
    founded: "Khurja, Uttar Pradesh",
    specialty: "Studio pottery & glazed earthenware",
  },
];

/**
 * Single source of truth for Creators (1–2 creators currently, more will be added later).
 */
export const CREATORS = [
  {
    id: "local-artisans",
    slug: "local-artisans",
    name: "Ananya Sharma & Local Artisans",
    shortName: "Ananya Sharma",
    bio: "Empowering rural women artisans and preserving traditional macramé and mud-relief heritage craft across Rajasthan and Gujarat.",
    tagline: "Creator & Social Impact Champion for Rural Women Artisans",
    category: "ngo_artisan",
    categoryLabel: "Artisan Collective & NGO",
    mediaType: "banner",
    mediaUrl: ananyaCreatorImg,
    posterUrl: ananyaCreatorImg,
    location: "Jaipur, Rajasthan",
    founded: "Heritage Studio Collective",
    crafts: ["Macramé", "Mud Art", "Heritage Weaving"],
    instagramHandle: "@ananya_artisancraft",
    instagramUrl: "https://www.instagram.com",
    missionTitle: "Why Ananya Does This: A Mission of Social Service",
    missionSubtitle: "Transforming social media influence into direct livelihood & dignity for rural women",
    missionStory: [
      "As an Instagram creator passionate about Indian art and rural heritage, Ananya saw firsthand that hundreds of incredibly skilled women artisans in remote villages of Rajasthan and Gujarat were struggling to survive against cheap factory-made plastic replicas.",
      "Instead of using social media purely for entertainment, Ananya decided to dedicate her platform to social service. She formed this creator-artisan collective to eliminate middlemen and provide 45+ rural women with fair living wages, safe workspaces, and direct access to craft lovers across India.",
      "Every macramé wall hanging and Lippan mud-mirror panel in this collection is handcrafted with generational patience. When you purchase from this storefront, you are directly funding healthcare, children's schooling, and female financial independence in artisan villages."
    ],
    whySupportTitle: "Why You Should Support This Initiative",
    supportPoints: [
      {
        title: "100% Fair Living Wages",
        desc: "Zero exploitation or middlemen commissions. Earnings go directly into the bank accounts of rural women makers."
      },
      {
        title: "Keeping Ancient Heritage Alive",
        desc: "Preserving sacred Lippan mud art and intricate hand-knotting techniques passed down through generations."
      },
      {
        title: "Dignity & Child Education",
        desc: "Your support enables mothers to send their daughters to school and become respected breadwinners in their homes."
      }
    ],
    quote: "“When you buy from a rural woman artisan, you aren't just buying decor — you are educating a child and giving an entire family the dignity they deserve.”",
    quoteAuthor: "Ananya Sharma (Creator & Social Activist)"
  },
  {
    id: "priya-crafts",
    slug: "priya-crafts",
    name: "Priya Creations",
    shortName: "Priya Creations",
    bio: "Studio creator specializing in crystal-clear botanical resin pour, preserved floral keepsakes, and calming aromatherapy essentials.",
    tagline: "Independent Botanical Studio Maker & Slow Living Artisan",
    category: "influencer",
    categoryLabel: "Independent Maker",
    mediaType: "reel",
    mediaUrl:
      "https://videos.pexels.com/video-files/34428330/14585482_1280_720_50fps.mp4",
    posterUrl:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80",
    location: "Bengaluru, India",
    crafts: ["Botanical Resin", "Floral Keepsakes", "Aromatherapy"],
    instagramHandle: "@priyacrafts.studio",
    instagramUrl: "https://www.instagram.com",
    missionTitle: "The Creator Story: Slow Art in a Fast World",
    missionSubtitle: "Why Priya creates small-batch botanical keepsakes with human touch",
    missionStory: [
      "Priya started documenting her botanical resin experiments on Instagram as a creative outlet, but it quickly resonated with thousands of people who craved mindful, genuine art in a world flooded with cheap mass production.",
      "Every piece in Priya's studio is made through slow, deliberate craftsmanship. Real seasonal florals are hand-foraged, dried naturally for weeks, and cured in eco-friendly resin over 72 hours of multi-layered hand pouring and diamond polishing.",
      "Supporting independent creators like Priya keeps soulful studio arts alive. Every order directly funds independent women creators who pour their personal heart, patience, and love into everything they make."
    ],
    whySupportTitle: "Why You Should Support Independent Makers",
    supportPoints: [
      {
        title: "Slow, Conscious Creation",
        desc: "Never mass-produced. Each piece takes days of meticulous layering, curing, and hand-finishing."
      },
      {
        title: "Real Preserved Nature",
        desc: "Sustainably sourced real seasonal flowers and botanicals preserved to last for years."
      },
      {
        title: "Fueling Homegrown Creative Studios",
        desc: "Backing independent women artists who build ethical, creative small businesses with heart."
      }
    ],
    quote: "“In a world of conveyor belts and duplicates, handmade art is a quiet rebellion that celebrates human patience and soul.”",
    quoteAuthor: "Priya (Independent Studio Creator)"
  },
];

/**
 * Lookup helpers
 */

/**
 * Get a single collaboration metadata by slug (case-insensitive)
 * @param {string} slug
 * @returns {object|null}
 */
export function getCollaboration(slug) {
  if (!slug) return null;
  const normalized = String(slug).toLowerCase().trim();
  return (
    BRAND_COLLABORATIONS.find(
      (c) => c.slug.toLowerCase() === normalized || c.id.toLowerCase() === normalized
    ) || null
  );
}

/**
 * Get all brand collaborations
 * @returns {Array}
 */
export function getCollaborations() {
  return BRAND_COLLABORATIONS;
}

/**
 * Get a single creator metadata by slug (case-insensitive)
 * @param {string} slug
 * @returns {object|null}
 */
export function getCreator(slug) {
  if (!slug) return null;
  const normalized = String(slug).toLowerCase().trim();
  return (
    CREATORS.find(
      (c) => c.slug.toLowerCase() === normalized || c.id.toLowerCase() === normalized
    ) || null
  );
}

/**
 * Get all creators
 * @returns {Array}
 */
export function getCreators() {
  return CREATORS;
}

/**
 * Get partner types list
 * @returns {Array}
 */
export function getPartnerTypes() {
  return PARTNER_TYPES;
}

export default {
  PARTNER_TYPES,
  BRAND_COLLABORATIONS,
  CREATORS,
  getCollaboration,
  getCollaborations,
  getCreator,
  getCreators,
  getPartnerTypes,
};
