import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, Heart, ShoppingBag } from "lucide-react";
import { cn } from "../../lib/cn.js";
import { Badge, Price } from "../ui/Bits.jsx";
import LazyImage from "../common/LazyImage.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { useWishlist } from "../../context/WishlistContext.jsx";
import { useUI } from "../../context/UIContext.jsx";
import s from "./ProductCard.module.css";

/**
 * The catalog's workhorse card.
 *
 * The whole card is a link to the product, with the wishlist and add-to-cart
 * controls as siblings rather than nested buttons — a <button> inside an <a>
 * is invalid HTML and behaves unpredictably with keyboard and assistive tech.
 */
/**
 * Central resolver for the 4 business models:
 * "own", "creator", "collab_bundle", "affiliate"
 */
function getProductBehavior(product) {
  const type = product.productType ?? "own";

  switch (type) {
    case "affiliate":
      return {
        badgeText: "Partner Pick",
        badgeTone: "neutral",
        isAffiliate: true,
        buttonText: product.affiliate?.buttonText || "Buy from Partner",
        targetUrl: `/partner/${product.slug}`,
      };
    case "collab_bundle":
      return {
        badgeText: "Curated Set",
        badgeTone: "brand",
        isAffiliate: false,
        buttonText: "Add to bag",
        targetUrl: null,
      };
    case "creator":
      return {
        badgeText: product.creator?.name ? `By ${product.creator.name}` : "Artisan Work",
        badgeTone: "brand",
        creatorSlug: product.creator?.slug || null,
        isAffiliate: false,
        buttonText: "Add to bag",
        targetUrl: null,
      };
    case "own":
    default:
      return {
        badgeText: null,
        badgeTone: null,
        isAffiliate: false,
        buttonText: "Add to bag",
        targetUrl: null,
      };
  }
}

export default function ProductCard({ product, eager = false, compact = false }) {
  const { addItem, removeProduct, pending, isInCart } = useCart();
  const { isWishlisted, toggle } = useWishlist();
  const { toast } = useUI();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);

  if (!product) return null;

  const inCart = isInCart(product.id);
  const behavior = getProductBehavior(product);
  const wishlisted = isWishlisted(product.id);
  const outOfStock = !product.inStock;

  const handleWishlist = async () => {
    try {
      await toggle(product.id);
      toast(
        wishlisted ? "Removed from wishlist" : "Saved to wishlist",
        { type: "success" },
      );
    } catch {
      toast("Could not update your wishlist", { type: "error" });
    }
  };

  const handleAction = async (e) => {
    e.stopPropagation();

    // Affiliate products redirect via /partner/:slug, never added to cart
    if (behavior.isAffiliate) {
      if (product.affiliate?.externalUrl) {
        window.open(product.affiliate.externalUrl, "_blank", "noopener,noreferrer");
      } else {
        navigate(behavior.targetUrl);
      }
      return;
    }

    setAdding(true);
    try {
      // Toggle logic: If already in cart, remove by productId; else add it
      if (inCart) {
        await removeProduct(product.id);
        toast(`${product.title} removed from bag`, {
          type: "success",
        });
      } else {
        await addItem({
          productId: product.id,
          variantId: product.variants?.[0]?.id,
          qty: 1,
        });
        toast(`${product.title} added to bag`, {
          type: "success",
          action: { label: "View bag", onClick: () => navigate("/cart") },
        });
      }
    } catch (err) {
      toast(err?.message ?? "Could not update your bag", { type: "error" });
    } finally {
      setAdding(false);
    }
  };

  return (
    <article className={cn(s.card, compact && s.compact, outOfStock && s.disabled)}>
      <Link
        to={`/product/${product.slug}`}
        className={s.media}
        aria-label={product.title}
        tabIndex={-1}
      >
        <LazyImage
          src={product.image}
          alt={product.title}
          ratio="1 / 1"
          eager={eager}
          className={s.image}
          sizes="(max-width: 640px) 45vw, (max-width: 1180px) 30vw, 280px"
        />
      </Link>

      <div className={s.flags}>
        {outOfStock ? (
          <Badge tone="neutral" size="sm">Sold out</Badge>
        ) : (
          <>
            {behavior.badgeText ? (
              <Badge tone={behavior.badgeTone} size="sm">{behavior.badgeText}</Badge>
            ) : null}
            {product.isOnSale && product.discountPct ? (
              <Badge tone="accent" size="sm">{product.discountPct}% off</Badge>
            ) : null}
            {product.isBestSeller && !product.isOnSale && !behavior.badgeText ? (
              <Badge tone="brand" size="sm">Best seller</Badge>
            ) : null}
            {product.lowStock ? (
              <Badge tone="error" size="sm">Only {product.stockCount} left</Badge>
            ) : null}
          </>
        )}
      </div>

      <button
        type="button"
        onClick={handleWishlist}
        className={cn(s.wishlist, wishlisted && s.wishlistOn)}
        aria-pressed={wishlisted}
        aria-label={wishlisted ? `Remove ${product.title} from wishlist` : `Save ${product.title} to wishlist`}
      >
        <Heart />
      </button>

      <div className={s.body}>
        <h3 className={s.title}>
          <Link to={`/product/${product.slug}`} className={s.titleLink}>
            {product.title}
          </Link>
        </h3>

        <div className={s.footer}>
          <Price
            listMinor={product.listPriceMinor}
            effectiveMinor={product.effectivePriceMinor}
            discountPct={product.discountPct}
            size="card"
            showDiscount={true}
            className={s.price}
          />

          <button
            type="button"
            className={cn(
              s.add,
              inCart && s.inCart,
              behavior.isAffiliate && s.affiliateBtn,
            )}
            onClick={handleAction}
            disabled={outOfStock || adding || pending}
            title={
              outOfStock
                ? "Sold out"
                : inCart
                  ? "In your bag (Click to remove)"
                  : adding
                    ? "Adding…"
                    : behavior.buttonText
            }
            aria-label={
              outOfStock
                ? "Sold out"
                : inCart
                  ? `In your bag (Click to remove) - ${product.title}`
                  : `${behavior.buttonText} - ${product.title}`
            }
          >
            {inCart ? (
              <Check size={16} strokeWidth={2.5} aria-hidden="true" />
            ) : (
              <ShoppingBag size={16} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
