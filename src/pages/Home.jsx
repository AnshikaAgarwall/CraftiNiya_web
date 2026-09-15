import { ArrowRight } from "lucide-react";
import SEO from "../components/common/SEO.jsx";
import Button from "../components/ui/Button.jsx";
import { SectionHeading } from "../components/ui/Bits.jsx";
import ProductGrid from "../components/product/ProductGrid.jsx";
import HeroCarousel from "../features/home/HeroCarousel.jsx";
import AnnouncementTicker from "../features/home/AnnouncementTicker.jsx";
import FeaturedCategories from "../features/home/FeaturedCategories.jsx";
import CountdownBanner from "../features/home/CountdownBanner.jsx";
import ReelsShowcase from "../features/home/ReelsShowcase.jsx";
import BudgetTiers from "../features/home/BudgetTiers.jsx";
import ReviewPills from "../features/home/ReviewPills.jsx";
import CategoryExplorer from "../features/home/CategoryExplorer.jsx";
import { useAsync } from "../hooks/useAsync.js";
import productService from "../services/productService.js";
import { BRAND } from "../config/site.js";

export default function Home() {
  const {
    data: bestSellers,
    loading,
    error,
    refetch,
  } = useAsync((opts) => productService.getBestSellers({ limit: 4 }, opts), []);

  return (
    <>
      <SEO
        title={null}
        description={`${BRAND.name} — handcrafted resin art, soy candles, home decor and thoughtful gifting, made in small batches.`}
      />

      <HeroCarousel />
      <AnnouncementTicker />
      <FeaturedCategories />
      <CountdownBanner />

      <section style={{ paddingBlock: "var(--section-y)" }}>
        <div className="container">
          <SectionHeading
            eyebrow="Most loved"
            title="OUR BEST SELLERS"
            subtitle="The pieces that leave the studio fastest."
            action={
              <Button to="/shop" variant="ghost" endIcon={<ArrowRight size={16} />}>
                Shop all
              </Button>
            }
            align="split"
          />

          <ProductGrid
            products={(bestSellers ?? []).slice(0, 4)}
            loading={loading}
            error={error}
            onRetry={refetch}
            columns={4}
            skeletonCount={4}
            compact={true}
          />
        </div>
      </section>

      <ReelsShowcase />
      <BudgetTiers />
      <CategoryExplorer />
      <ReviewPills />
    </>
  );
}
