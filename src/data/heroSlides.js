import saleBanner from "../assets/SALE.png";
import creatorBanner from "../assets/LOCALSHOPS.png";
import collabBanner from "../assets/COLLABBRAND.png";
import bundleBanner from "../assets/BRANDPROMOTION.png";

export const heroSlides = [
  {
    id: "sale-banner",
    image: saleBanner,
    alt: "Handcrafted Festive Studio Sale — Up to 40% Off",
    eyebrow: "Limited Time Offer",
    heading: "Festive Studio Sale",
    subheading:
      "Enjoy up to 40% off handcrafted soy candles, resin botanical art, and thoughtful gift boxes.",
    cta: "Shop The Sale",
    href: "/sale",
  },
  {
    id: "creator-spotlight",
    image: creatorBanner,
    alt: "Creator Spotlight — Independent Artisan Works",
    eyebrow: "Artisan Showcase",
    heading: "Creator Spotlight",
    subheading:
      "Celebrating local independent makers crafting small-batch pieces with heartfelt care.",
    cta: "Discover Makers",
    href: "/creator/local-artisans",
  },
  {
    id: "collab-brand",
    image: collabBanner,
    alt: "CraftiNiya x RangSajja Collaboration",
    eyebrow: "Exclusive Edition",
    heading: "CraftiNiya x RangSajja",
    subheading:
      "A limited-edition fusion of natural textures and festive handicraft gifting.",
    cta: "Explore Collaboration",
    href: "/collaboration/rangsajja",
  },
  {
    id: "brand-bundle",
    image: bundleBanner,
    alt: "CraftiNiya x CrochetKari Collaboration",
    eyebrow: "Curated Sets",
    heading: "CraftiNiya x CrochetKari",
    subheading:
      "Handcrafted crochet florals and thoughtful keepsakes bundled for memorable gifting.",
    cta: "Explore Collection",
    href: "/collaboration/crochetkari",
  },
];

export default heroSlides;
