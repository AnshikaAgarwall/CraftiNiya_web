import { useState } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingBag, Tag, Trash2 } from "lucide-react";
import SEO from "../components/common/SEO.jsx";
import PageHeader from "../components/layout/PageHeader.jsx";
import Button from "../components/ui/Button.jsx";
import { Input } from "../components/ui/Field.jsx";
import { Badge } from "../components/ui/Bits.jsx";
import { EmptyState, LoadingBlock } from "../components/ui/Feedback.jsx";
import LazyImage from "../components/common/LazyImage.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useUI } from "../context/UIContext.jsx";
import { formatINR } from "../lib/money.js";
import { pluralize } from "../lib/format.js";
import s from "./CartPage.module.css";

export default function CartPage() {
  const {
    cart,
    lines,
    itemCount,
    loading,
    pending,
    updateQty,
    removeItem,
    applyCoupon,
    removeCoupon,
  } = useCart();
  const { toast } = useUI();

  const [code, setCode] = useState("");
  const [couponError, setCouponError] = useState(null);

  const handleCoupon = async (e) => {
    e.preventDefault();
    setCouponError(null);
    try {
      await applyCoupon(code);
      toast("Discount applied", { type: "success" });
      setCode("");
    } catch (err) {
      setCouponError(err?.details?.code ?? err?.message ?? "That code is not valid.");
    }
  };

  return (
    <>
      <SEO title="Your bag" noIndex />

      <PageHeader
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Bag" }]}
        eyebrow="Checkout"
        title="Your bag"
        description={itemCount ? pluralize(itemCount, "piece") + " ready to go." : undefined}
      />

      <div className={`container ${s.wrap}`}>
        {loading ? (
          <LoadingBlock label="Loading your bag…" />
        ) : !lines.length ? (
          <EmptyState
            icon={ShoppingBag}
            title="Your bag is empty"
            message="Nothing in here yet. Everything we make is small-batch, so it is worth a browse."
            action={<Button to="/shop">Start shopping</Button>}
          />
        ) : (
          <div className={s.layout}>
            {/* ---------- lines ---------- */}
            <div className={s.lines}>
              {lines.map((line) => (
                <article key={line.lineId} className={s.line}>
                  <Link to={`/product/${line.slug}`} className={s.thumb}>
                    <LazyImage src={line.image} alt={line.title} />
                  </Link>

                  <div className={s.body}>
                    <div className={s.head}>
                      <div>
                        <Link to={`/product/${line.slug}`} className={s.title}>
                          {line.title}
                        </Link>
                        {line.variantName && (
                          <p className={s.variant}>{line.variantName}</p>
                        )}
                      </div>

                      <button
                        type="button"
                        className={s.remove}
                        onClick={() => removeItem(line.lineId)}
                        disabled={pending}
                        aria-label={`Remove ${line.title}`}
                      >
                        <Trash2 />
                      </button>
                    </div>

                    {!line.inStock && (
                      <Badge tone="error" size="sm">
                        Out of stock
                      </Badge>
                    )}

                    <div className={s.foot}>
                      <div className={s.stepper}>
                        <button
                          type="button"
                          onClick={() => updateQty(line.lineId, line.qty - 1)}
                          disabled={pending}
                          aria-label="Decrease quantity"
                        >
                          <Minus />
                        </button>
                        <span aria-live="polite">{line.qty}</span>
                        <button
                          type="button"
                          onClick={() => updateQty(line.lineId, line.qty + 1)}
                          disabled={pending || line.qty >= line.maxQty}
                          aria-label="Increase quantity"
                        >
                          <Plus />
                        </button>
                      </div>

                      <div className={s.prices}>
                        <span className={s.unit}>
                          {formatINR(line.unitPriceMinor)} each
                        </span>
                        <strong className={s.lineTotal}>
                          {formatINR(line.lineTotalMinor)}
                        </strong>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* ---------- summary ---------- */}
            <aside className={s.summary}>
              <h2 className={s.summaryTitle}>Order summary</h2>

              <dl className={s.totals}>
                <div>
                  <dt>Subtotal</dt>
                  <dd>{formatINR(cart.subtotalMinor)}</dd>
                </div>

                {cart.discountMinor > 0 && (
                  <div className={s.discount}>
                    <dt>
                      Discount
                      {cart.couponCode && <span> ({cart.couponCode})</span>}
                    </dt>
                    <dd>−{formatINR(cart.discountMinor)}</dd>
                  </div>
                )}

                <div>
                  <dt>Shipping</dt>
                  <dd>
                    {cart.shippingMinor === 0 ? "Free" : formatINR(cart.shippingMinor)}
                  </dd>
                </div>

                <div>
                  <dt>GST (18%)</dt>
                  <dd>{formatINR(cart.taxMinor)}</dd>
                </div>

                <div className={s.grand}>
                  <dt>Total</dt>
                  <dd>{formatINR(cart.totalMinor)}</dd>
                </div>
              </dl>

              {cart.freeShippingRemainingMinor > 0 && (
                <p className={s.shippingHint}>
                  Add {formatINR(cart.freeShippingRemainingMinor)} more for free
                  shipping.
                </p>
              )}

              {cart.couponCode ? (
                <div className={s.couponApplied}>
                  <span>
                    <Tag aria-hidden="true" />
                    {cart.couponLabel}
                  </span>
                  <button type="button" onClick={removeCoupon}>
                    Remove
                  </button>
                </div>
              ) : (
                <form className={s.coupon} onSubmit={handleCoupon}>
                  <Input
                    label="Discount code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="CRAFT10"
                    error={couponError}
                    startIcon={<Tag />}
                  />
                  <Button type="submit" variant="secondary" disabled={!code.trim()}>
                    Apply
                  </Button>
                </form>
              )}

              <Button to="/checkout" size="lg" fullWidth className={s.checkout}>
                Proceed to checkout
              </Button>

              <Button to="/shop" variant="link" className={s.continue}>
                Continue shopping
              </Button>
            </aside>
          </div>
        )}
      </div>
    </>
  );
}
