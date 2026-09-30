import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sparkles, PackageCheck, ArrowRight, ExternalLink } from "lucide-react";
import { SectionHeading } from "../../components/ui/Bits.jsx";
import ProductGrid from "../../components/product/ProductGrid.jsx";
import { orderStore } from "../../storage/stores.js";
import productService from "../../services/productService.js";
import { Skeleton } from "../../components/ui/Feedback.jsx";
import { formatINR } from "../../lib/money.js";
import s from "./RecentOrderRecommendations.module.css";

// Realistic fallback sample order so the section is immediately visible for testing
const SAMPLE_MOCK_ORDER_ITEM = {
  productId: "prod-wall-decor-01",
  slug: "macrame-boho-wall-hanging",
  title: "Macramé Boho Wall Hanging",
  image: "https://okhai.org/cdn/shop/products/12_dbd02675-3567-4efe-89bb-f6693c9cd5d8.jpg?v=1754296513",
  unitPriceMinor: 129900,
  orderNumber: "CN-84921",
  status: "Delivered",
};

export default function RecentOrderRecommendations() {
  const [lastBoughtItem, setLastBoughtItem] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadOrderAndRecommendations() {
      setLoading(true);
      try {
        const orders = orderStore.read();

        // 1. Get last order item: from user's real store, or use sample mock order
        let primaryItem = null;
        let boughtIds = new Set();

        if (orders.length > 0 && orders[0]?.lines?.length > 0) {
          primaryItem = {
            ...orders[0].lines[0],
            orderNumber: orders[0].orderNumber || "CN-84920",
            status: orders[0].status || "Delivered",
          };
          boughtIds = new Set(
            orders.flatMap((o) => (o.lines || []).map((l) => l.productId))
          );
        } else {
          // As instructed by user, assume an order has happened if store is currently empty
          primaryItem = SAMPLE_MOCK_ORDER_ITEM;
          boughtIds.add(SAMPLE_MOCK_ORDER_ITEM.productId);
        }

        if (!primaryItem) {
          if (isMounted) setLoading(false);
          return;
        }

        // 2. Fetch complementary matching products (excluding what was already bought)
        let related = await productService.getRelatedProducts(primaryItem.productId, { limit: 8 });
        let filtered = related.filter((p) => !boughtIds.has(p.id));

        if (filtered.length < 4) {
          const popularRes = await productService.getProducts({ sort: "popular", pageSize: 8 });
          const additional = (popularRes.items || []).filter(
            (p) => p.id !== primaryItem.productId && !boughtIds.has(p.id) && !filtered.some((f) => f.id === p.id)
          );
          filtered = [...filtered, ...additional];
        }

        if (isMounted) {
          setLastBoughtItem(primaryItem);
          setRecommendations(filtered.slice(0, 4));
        }
      } catch (err) {
        console.error("Failed to load order recommendations:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadOrderAndRecommendations();

    return () => {
      isMounted = false;
    };
  }, []);

  // If user is truly new and no fallback is active, don't render
  if (!loading && (!lastBoughtItem || recommendations.length === 0)) {
    return null;
  }

  return (
    <section className={s.section} aria-label="Recommendations based on your last order">
      <div className="container">
        {/* Past Order Spotlight Banner */}
        {lastBoughtItem && (
          <div className={s.pastOrderBanner}>
            <div className={s.pastOrderLeft}>
              <div className={s.orderIconWrap}>
                <PackageCheck size={20} className={s.orderIcon} />
              </div>
              <div className={s.orderImgWrap}>
                <img
                  src={lastBoughtItem.image}
                  alt={lastBoughtItem.title}
                  className={s.orderThumb}
                />
              </div>
              <div className={s.orderInfo}>
                <div className={s.orderHeaderLine}>
                  <span className={s.orderBadge}>Your Last Order</span>
                  <span className={s.orderNumber}>#{lastBoughtItem.orderNumber}</span>
                  <span className={s.orderStatusPill}>{lastBoughtItem.status || "Delivered"}</span>
                </div>
                <h3 className={s.orderTitle}>{lastBoughtItem.title}</h3>
                {lastBoughtItem.unitPriceMinor && (
                  <span className={s.orderPrice}>
                    {formatINR(lastBoughtItem.unitPriceMinor)}
                  </span>
                )}
              </div>
            </div>

            <Link
              to={lastBoughtItem.slug ? `/product/${lastBoughtItem.slug}` : "/account/orders"}
              className={s.viewOrderLink}
            >
              <span>View Product</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        )}

        {/* Section Heading */}
        <div className={s.headingBlock}>
          <div className={s.badgePill}>
            <Sparkles size={12} aria-hidden="true" />
            <span>Paired With Your Purchase</span>
          </div>
          <h2 className={s.sectionTitle}>
            Because you bought &ldquo;{lastBoughtItem?.title || "Handcrafted Piece"}&rdquo;
          </h2>
          <p className={s.sectionSubtitle}>
            Thoughtfully matched creations designed to complement the aesthetics, materials, and styling of your piece.
          </p>
        </div>

        {/* 4-Item Product Grid */}
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
