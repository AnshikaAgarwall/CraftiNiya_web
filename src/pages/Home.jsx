import SEO from "../components/common/SEO.jsx";
import { SectionHeading } from "../components/ui/Bits.jsx";
import ProductGrid from "../components/product/ProductGrid.jsx";
import HeroCarousel from "../features/home/HeroCarousel.jsx";
import AnnouncementTicker from "../features/home/AnnouncementTicker.jsx";
import FeaturedCategories from "../features/home/FeaturedCategories.jsx";
import CountdownBanner from "../features/home/CountdownBanner.jsx";
import FeaturedCollaborations from "../features/home/FeaturedCollaborations.jsx";
import ReelsShowcase from "../features/home/ReelsShowcase.jsx";
import BudgetTiers from "../features/home/BudgetTiers.jsx";
import ReviewPills from "../features/home/ReviewPills.jsx";

import { useAsync } from "../hooks/useAsync.js";
import productService from "../services/productService.js";
import { BRAND } from "../config/site.js";
import s from "./Home.module.css";

export default function Home() {
  const {
    data: bestSellers,
    loading,
    error,
    refetch,
  } = useAsync((opts) => productService.getBestSellers({ limit: 8 }, opts), []);

  return (
    <>
      <SEO
        title={null}
        description={`${BRAND.name} — handcrafted resin art, soy candles, home decor and thoughtful gifting, made in small batches.`}
      />

      {/* Announcement Ticker — continuous marquee scroll, non-clickable */}
      <AnnouncementTicker />

      <HeroCarousel />
      <FeaturedCategories />
      <CountdownBanner />
      <FeaturedCollaborations />

      <section className={s.bestSellersSection}>
        <div className="container">
          <SectionHeading
            eyebrow="Most loved"
            title="Our Best Sellers"
          />

          <ProductGrid
            products={(bestSellers ?? []).slice(0, 8)}
            loading={loading}
            error={error}
            onRetry={refetch}
            columns={4}
            skeletonCount={8}
          />
        </div>
      </section>

      <ReelsShowcase />
      <BudgetTiers />

      <ReviewPills />
    </>
  );
}
