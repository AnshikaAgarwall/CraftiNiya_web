import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Heart, Minus, Plus, RotateCcw, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import SEO from "../components/common/SEO.jsx";
import PageHeader from "../components/layout/PageHeader.jsx";
import Button from "../components/ui/Button.jsx";
import { Badge, Price, Rating, SectionHeading } from "../components/ui/Bits.jsx";
import { ErrorState, LoadingBlock } from "../components/ui/Feedback.jsx";
import LazyImage from "../components/common/LazyImage.jsx";
import ProductGrid from "../components/product/ProductGrid.jsx";
import { useAsync } from "../hooks/useAsync.js";
import productService from "../services/productService.js";
import reviewService from "../services/reviewService.js";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useUI } from "../context/UIContext.jsx";
import { recentlyViewedStore } from "../storage/stores.js";
import { ERROR_CODES } from "../services/errors.js";
import { cn } from "../lib/cn.js";
import { formatDate, pluralize } from "../lib/format.js";
import NotFoundPage from "./NotFoundPage.jsx";
import s from "./ProductDetailPage.module.css";

const TABS = [
  { id: "details", label: "Details" },
  { id: "specs", label: "Specifications" },
  { id: "gifting", label: "Gifting" },
  { id: "reviews", label: "Reviews" },
];

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { addItem, pending } = useCart();
  const { isWishlisted, toggle } = useWishlist();
  const { toast } = useUI();
  const navigate = useNavigate();

  const [variantIndex, setVariantIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("details");

  const { data: product, loading, error, refetch } = useAsync(
    (opts) => productService.getProductBySlug(slug, opts),
    [slug],
  );

  const { data: related } = useAsync(
    (opts) =>
      product
        ? productService.getRelatedProducts(product.id, { limit: 4 }, opts)
        : Promise.resolve([]),
    [product?.id],
  );

  const { data: reviews } = useAsync(
    (opts) =>
      product
        ? reviewService.getReviewsForProduct(product.id, { pageSize: 6 }, opts)
        : Promise.resolve(null),
    [product?.id],
  );

  const { data: summary } = useAsync(
    (opts) =>
      product ? reviewService.getReviewSummary(product.id, opts) : Promise.resolve(null),
    [product?.id],
  );

  // Reset per-product view state, or a variant index from the last product
  // leaks into this one. Adjusted during render rather than in an effect —
  // an effect would paint one frame with the previous product's selection.
  const [renderedSlug, setRenderedSlug] = useState(slug);
  if (renderedSlug !== slug) {
    setRenderedSlug(slug);
    setVariantIndex(0);
    setImageIndex(0);
    setQty(1);
    setTab("details");
  }

  useEffect(() => {
    if (product?.id) recentlyViewedStore.push(product.id);
  }, [product?.id]);

  if (error?.code === ERROR_CODES.NOT_FOUND) {
    return <NotFoundPage title="We could not find that piece" />;
  }

  if (error) {
    return (
      <div className="container" style={{ paddingBlock: "var(--sp-11)" }}>
        <ErrorState error={error} onRetry={refetch} />
      </div>
    );
  }

  if (loading || !product) {
    return (
      <div className="container" style={{ paddingBlock: "var(--sp-12)" }}>
        <LoadingBlock label="Loading this piece…" />
      </div>
    );
  }

  const variant = product.variants[variantIndex] ?? product.variants[0];
  const images = variant?.images ?? product.images;
  const maxQty = Math.max(variant?.stockCount ?? product.stockCount ?? 0, 0);
  const wishlisted = isWishlisted(product.id);

  const handleAdd = async () => {
    try {
      await addItem({ productId: product.id, variantId: variant?.id, qty });
      toast(`${product.title} added to bag`, {
        type: "success",
        action: { label: "View bag", onClick: () => navigate("/cart") },
      });
    } catch (err) {
      toast(err?.message ?? "Could not add that to your bag", { type: "error" });
    }
  };

  return (
    <>
      <SEO
        title={product.title}
        description={product.description}
        image={product.image}
        type="product"
      />

      <PageHeader
        align="left"
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Categories", to: "/categories" },
          { label: product.categoryTitle, to: `/category/${product.categoryId}` },
          {
            label: product.subcategoryTitle,
            to: `/category/${product.categoryId}/subcategory/${product.subcategoryId}`,
          },
          { label: product.title },
        ]}
      />

      <div className={`container ${s.layout}`}>
        {/* ---------- gallery ---------- */}
        <div className={s.gallery}>
          <div className={s.mainImage}>
            <LazyImage
              src={images[imageIndex] ?? product.image}
              alt={product.title}
              eager
            />
            {product.isOnSale && product.discountPct ? (
              <span className={s.mainBadge}>
                <Badge tone="accent">{product.discountPct}% off</Badge>
              </span>
            ) : null}
          </div>

          {images.length > 1 && (
            <div className={`${s.thumbs} no-scrollbar`}>
              {images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setImageIndex(i)}
                  className={cn(s.thumb, i === imageIndex && s.thumbActive)}
                  aria-label={`View image ${i + 1} of ${images.length}`}
                  aria-current={i === imageIndex}
                >
                  <LazyImage src={src} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ---------- purchase panel ---------- */}
        <div className={s.info}>
          <p className={s.eyebrow}>{product.subcategoryTitle}</p>
          <h1 className={s.title}>{product.title}</h1>

          {product.reviewCount > 0 && (
            <Rating
              value={summary?.average ?? product.rating}
              count={summary?.total ?? product.reviewCount}
              size={15}
              className={s.rating}
            />
          )}

          <Price
            listMinor={product.listPriceMinor}
            effectiveMinor={product.effectivePriceMinor}
            discountPct={product.discountPct}
            size="lg"
            className={s.price}
          />

          <p className={s.description}>{product.description}</p>

          {product.variants.length > 1 && (
            <fieldset className={s.variants}>
              <legend className={s.variantLegend}>
                Colour: <strong>{variant?.name}</strong>
              </legend>
              <div className={s.variantList}>
                {product.variants.map((v, i) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => {
                      setVariantIndex(i);
                      setImageIndex(0);
                      setQty(1);
                    }}
                    className={cn(s.variant, i === variantIndex && s.variantActive)}
                    aria-pressed={i === variantIndex}
                    disabled={v.stockCount === 0}
                  >
                    <LazyImage src={v.images[0]} alt="" />
                    <span>{v.name}</span>
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          <div className={s.stock}>
            {!product.inStock || maxQty === 0 ? (
              <Badge tone="neutral">Sold out</Badge>
            ) : product.lowStock ? (
              <Badge tone="error">Only {maxQty} left</Badge>
            ) : (
              <Badge tone="success">In stock</Badge>
            )}
            {product.ageGroup && (
              <span className={s.stockMeta}>Suitable for {product.ageGroup}</span>
            )}
          </div>

          <div className={s.purchase}>
            <div className={s.stepper}>
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1}
                aria-label="Decrease quantity"
              >
                <Minus />
              </button>
              <span aria-live="polite">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(maxQty || q + 1, q + 1))}
                disabled={maxQty > 0 && qty >= maxQty}
                aria-label="Increase quantity"
              >
                <Plus />
              </button>
            </div>

            <Button
              size="lg"
              onClick={handleAdd}
              disabled={!product.inStock || maxQty === 0}
              loading={pending}
              startIcon={<ShoppingBag size={17} />}
              className={s.addButton}
            >
              {product.inStock && maxQty > 0 ? "Add to bag" : "Sold out"}
            </Button>

            <Button
              size="lg"
              variant="secondary"
              iconOnly
              onClick={() => toggle(product.id)}
              aria-pressed={wishlisted}
              aria-label={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
              className={cn(s.wishButton, wishlisted && s.wishButtonOn)}
            >
              <Heart size={19} />
            </Button>
          </div>

          <ul className={s.assurances}>
            <li>
              <Truck aria-hidden="true" />
              Free shipping over ₹1,499
            </li>
            <li>
              <RotateCcw aria-hidden="true" />7-day returns on unused pieces
            </li>
            <li>
              <ShieldCheck aria-hidden="true" />
              Made and checked by hand
            </li>
          </ul>
        </div>
      </div>

      {/* ---------- tabs ---------- */}
      <section className={`container ${s.tabsSection}`}>
        <div className={`${s.tabList} no-scrollbar`} role="tablist" aria-label="Product information">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={cn(s.tab, tab === t.id && s.tabActive)}
            >
              {t.label}
              {t.id === "reviews" && summary?.total ? ` (${summary.total})` : ""}
            </button>
          ))}
        </div>

        <div className={s.tabPanel} role="tabpanel">
          {tab === "details" && (
            <div className={s.prose}>
              <p>{product.description}</p>
              {product.specifications?.materials && (
                <p>
                  <strong>Made from:</strong> {product.specifications.materials}
                </p>
              )}
              <p>
                Because each piece is finished by hand, small differences in tone,
                grain and finish are normal — and are the reason no two are
                identical.
              </p>
            </div>
          )}

          {tab === "specs" && (
            <dl className={s.specs}>
              {product.specifications?.dimensions && (
                <div>
                  <dt>Dimensions</dt>
                  <dd>{product.specifications.dimensions}</dd>
                </div>
              )}
              {product.specifications?.materials && (
                <div>
                  <dt>Materials</dt>
                  <dd>{product.specifications.materials}</dd>
                </div>
              )}
              {product.ageGroup && (
                <div>
                  <dt>Suitable for</dt>
                  <dd>{product.ageGroup}</dd>
                </div>
              )}
              <div>
                <dt>Category</dt>
                <dd>
                  {product.categoryTitle} · {product.subcategoryTitle}
                </dd>
              </div>
              {product.createdAt && (
                <div>
                  <dt>Added</dt>
                  <dd>{formatDate(product.createdAt)}</dd>
                </div>
              )}
            </dl>
          )}

          {tab === "gifting" && (
            <div className={s.prose}>
              {product.gifting?.idealFor && (
                <p>
                  <strong>Ideal for:</strong> {product.gifting.idealFor}
                </p>
              )}
              {product.gifting?.targetAudience && (
                <p>
                  <strong>Who it suits:</strong> {product.gifting.targetAudience}
                </p>
              )}
              <p>
                Every order is wrapped in tissue, padded and sealed. Add a note at
                checkout and we will write it by hand.
              </p>
            </div>
          )}

          {tab === "reviews" && (
            <div className={s.reviews}>
              {summary?.total ? (
                <div className={s.reviewSummary}>
                  <div className={s.reviewAverage}>
                    <strong>{summary.average.toFixed(1)}</strong>
                    <Rating value={summary.average} size={15} showValue={false} />
                    <span>{pluralize(summary.total, "review")}</span>
                  </div>

                  <ul className={s.histogram}>
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = summary.distribution[star] ?? 0;
                      const pct = summary.total ? (count / summary.total) * 100 : 0;
                      return (
                        <li key={star}>
                          <span className={s.histLabel}>{star}★</span>
                          <span className={s.histTrack}>
                            <span className={s.histFill} style={{ width: `${pct}%` }} />
                          </span>
                          <span className={s.histCount}>{count}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}

              <ul className={s.reviewList}>
                {(reviews?.items ?? []).map((review) => (
                  <li key={review.id} className={s.review}>
                    <div className={s.reviewHead}>
                      <div>
                        <p className={s.reviewName}>{review.authorName}</p>
                        <p className={s.reviewMeta}>
                          {review.authorEmail}
                          {review.isVerifiedPurchase && " · Verified purchase"}
                        </p>
                      </div>
                      <Rating value={review.rating} size={13} showValue={false} />
                    </div>
                    {review.title && <p className={s.reviewTitle}>{review.title}</p>}
                    <p className={s.reviewBody}>{review.body}</p>
                    <p className={s.reviewDate}>{formatDate(review.createdAt)}</p>
                  </li>
                ))}
              </ul>

              {!reviews?.items?.length && (
                <p className={s.noReviews}>
                  No reviews for this piece yet. Yours would be the first.
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ---------- related ---------- */}
      {related?.length > 0 && (
        <section className={`container ${s.related}`}>
          <SectionHeading
            eyebrow="You might also like"
            title={`More from ${product.subcategoryTitle}`}
            align="split"
          />
          <ProductGrid products={related} columns={4} />
        </section>
      )}
    </>
  );
}
