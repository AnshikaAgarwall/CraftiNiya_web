import { useState, useEffect } from "react";
import { History, Eye, ArrowRight } from "lucide-react";
import { SectionHeading } from "../../components/ui/Bits.jsx";
import ProductGrid from "../../components/product/ProductGrid.jsx";
import { recentlyViewedStore } from "../../storage/stores.js";
import productService from "../../services/productService.js";
import { Skeleton } from "../../components/ui/Feedback.jsx";
import s from "./RecentlyViewedSection.module.css";

export default function RecentlyViewedSection() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadRecentlyViewed() {
      setLoading(true);
      try {
        const ids = recentlyViewedStore.read();

        if (ids && ids.length > 0) {
          const products = await productService.getProductsByIds(ids.slice(0, 4));
          if (isMounted) {
            setItems(products.filter(Boolean));
          }
        } else {
          // If fresh visitor has not explored anything yet, showcase top 4 trending pieces
          const fallback = await productService.getProducts({ sort: "popular", pageSize: 4 });
          if (isMounted) {
            setItems(fallback.items || []);
          }
        }
      } catch (err) {
        console.error("Failed to load recently viewed:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadRecentlyViewed();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!loading && items.length === 0) return null;

  return (
    <section className={s.section} aria-label="Recently Viewed Products">
      <div className="container">
        <div className={s.headingBlock}>
          <div className={s.badgePill}>
            <Eye size={12} aria-hidden="true" />
            <span>Browsing History</span>
          </div>
          <h2 className={s.sectionTitle}>Recently Explored by You</h2>
          <p className={s.sectionSubtitle}>
            Pick up right where you left off with these artisanal pieces.
          </p>
        </div>

        {loading ? (
          <div className={s.skeletonGrid}>
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className={s.skeletonCard} />
            ))}
          </div>
        ) : (
          <ProductGrid
            products={items}
            columns={4}
            skeletonCount={4}
          />
        )}
      </div>
    </section>
  );
}
