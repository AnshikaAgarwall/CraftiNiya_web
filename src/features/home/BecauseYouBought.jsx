import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ShoppingBag, ArrowRight } from "lucide-react";
import { SectionHeading } from "../../components/ui/Bits.jsx";
import ProductGrid from "../../components/product/ProductGrid.jsx";
import { orderStore, recentlyViewedStore } from "../../storage/stores.js";
import productService from "../../services/productService.js";
import { Skeleton } from "../../components/ui/Feedback.jsx";
import s from "./BecauseYouBought.module.css";

export default function BecauseYouBought() {
  const [anchorItem, setAnchorItem] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState("order"); // "order" | "viewed" | "curated"

  useEffect(() => {
    let isMounted = true;

    async function fetchPersonalizedRecommendations() {
      setLoading(true);
      try {
        const orders = orderStore.read();
        const recentlyViewed = recentlyViewedStore.read();

        // 1. Priority A: User has past orders -> Recommend based on most recent bought item
        if (orders.length > 0 && orders[0]?.lines?.length > 0) {
          const lastBought = orders[0].lines[0];
          const boughtIds = new Set(
            orders.flatMap((o) => (o.lines || []).map((l) => l.productId))
          );

          let related = await productService.getRelatedProducts(lastBought.productId, { limit: 8 });
          // Exclude products user already bought
          let filtered = related.filter((p) => !boughtIds.has(p.id));

          if (filtered.length < 4) {
            const more = await productService.getProducts({ sort: "popular", pageSize: 8 });
            const extra = (more.items || []).filter(
              (p) => p.id !== lastBought.productId && !boughtIds.has(p.id) && !filtered.some((f) => f.id === p.id)
            );
            filtered = [...filtered, ...extra];
          }

          if (isMounted) {
            setAnchorItem(lastBought);
            setReason("order");
            setRecommendations(filtered.slice(0, 4));
          }
          return;
        }

        // 2. Priority B: User has recently viewed products
        if (recentlyViewed.length > 0) {
          const lastViewedId = recentlyViewed[0];
          try {
            const viewedProduct = await productService.getProductById(lastViewedId);
            let related = await productService.getRelatedProducts(lastViewedId, { limit: 8 });
            let filtered = related.filter((p) => p.id !== lastViewedId);

            if (filtered.length < 4) {
              const more = await productService.getProducts({ sort: "popular", pageSize: 8 });
              const extra = (more.items || []).filter(
                (p) => p.id !== lastViewedId && !filtered.some((f) => f.id === p.id)
              );
              filtered = [...filtered, ...extra];
            }

            if (isMounted) {
              setAnchorItem(viewedProduct);
              setReason("viewed");
              setRecommendations(filtered.slice(0, 4));
            }
            return;
          } catch {
            // fallback to curated
          }
        }

        // 3. Priority C: Default curated for guests / first-time visitors
        const bestSellers = await productService.getProducts({ sort: "popular", pageSize: 5 });
        const items = bestSellers.items || [];
        if (items.length > 0 && isMounted) {
          setAnchorItem(items[0]);
          setReason("curated");
          setRecommendations(items.slice(1, 5));
        }
      } catch (err) {
        console.error("Failed to load recommendations:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchPersonalizedRecommendations();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!loading && recommendations.length === 0) return null;

  // Dynamic titles based on reason
  const eyebrowText =
    reason === "order"
      ? "Personalized For You"
      : reason === "viewed"
      ? "Inspired By Your Browsing"
      : "Handpicked Recommendations";

  const titleText =
    reason === "order" && anchorItem?.title
      ? `Because you bought "${anchorItem.title}"`
      : reason === "viewed" && anchorItem?.title
      ? `Because you explored "${anchorItem.title}"`
      : "Pieces You Might Love";

  const subtitleText =
    reason === "order"
      ? "Thoughtfully chosen handmade pieces designed to pair seamlessly with your collection."
      : reason === "viewed"
      ? "Artisanal creations that share the same aesthetic, craft and materials."
      : "Signature handcrafted resin, soy candles, and decor made with soulful attention to detail.";

  return (
    <section className={s.section} aria-label="Personalized Recommendations">
      <div className="container">
        {/* Header with pill context */}
        <div className={s.headerRow}>
          <div>
            <div className={s.badgePill}>
              <Sparkles size={13} aria-hidden="true" />
              <span>{eyebrowText}</span>
            </div>
            <h2 className={s.title}>{titleText}</h2>
            <p className={s.subtitle}>{subtitleText}</p>
          </div>

          {anchorItem && reason === "order" && (
            <div className={s.anchorCard}>
              <span className={s.anchorLabel}>Your past purchase:</span>
              <div className={s.anchorProduct}>
                {anchorItem.image && (
                  <img src={anchorItem.image} alt="" className={s.anchorImg} />
                )}
                <span className={s.anchorTitle}>{anchorItem.title}</span>
              </div>
            </div>
          )}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className={s.skeletonGrid}>
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className={s.skeletonCard} />
            ))}
          </div>
        ) : (
          <ProductGrid
            products={recommendations}
            columns={4}
            skeletonCount={4}
          />
        )}
      </div>
    </section>
  );
}
