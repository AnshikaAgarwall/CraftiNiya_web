import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import { cn } from "../../lib/cn.js";
import { Badge, Price, Rating } from "../ui/Bits.jsx";
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
export default function ProductCard({ product, eager = false, compact = false }) {
  const { addItem, pending } = useCart();
  const { isWishlisted, toggle } = useWishlist();
  const { toast } = useUI();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);

  if (!product) return null;

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

  const handleAdd = async () => {
    setAdding(true);
    try {
      await addItem({
        productId: product.id,
        variantId: product.variants?.[0]?.id,
        qty: 1,
      });
      toast(`${product.title} added to bag`, {
        type: "success",
        action: { label: "View bag", onClick: () => navigate("/cart") },
      });
    } catch (err) {
      toast(err?.message ?? "Could not add that to your bag", { type: "error" });
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
            {product.isOnSale && product.discountPct ? (
              <Badge tone="accent" size="sm">{product.discountPct}% off</Badge>
            ) : null}
            {product.isBestSeller && !product.isOnSale ? (
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
        {product.subcategoryTitle && (
          <p className={s.eyebrow}>{product.subcategoryTitle}</p>
        )}

        <h3 className={s.title}>
          <Link to={`/product/${product.slug}`} className={s.titleLink}>
            {product.title}
          </Link>
        </h3>

        {product.reviewCount > 0 && (
          <Rating
            value={product.rating}
            count={product.reviewCount}
            size={12}
            showValue={false}
            className={s.rating}
          />
        )}

        <div className={s.footer}>
          <Price
            listMinor={product.listPriceMinor}
            effectiveMinor={product.effectivePriceMinor}
            discountPct={product.discountPct}
            size="sm"
            showDiscount={false}
          />
        </div>

        {!compact && (
          <button
            type="button"
            className={s.add}
            onClick={handleAdd}
            disabled={outOfStock || adding || pending}
          >
            <ShoppingBag />
            <span>{outOfStock ? "Sold out" : adding ? "Adding…" : "Add to bag"}</span>
          </button>
        )}
      </div>
    </article>
  );
}
