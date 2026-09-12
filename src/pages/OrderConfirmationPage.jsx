import { useParams } from "react-router-dom";
import { CheckCircle2, Package, Truck } from "lucide-react";
import SEO from "../components/common/SEO.jsx";
import Button from "../components/ui/Button.jsx";
import { ErrorState, LoadingBlock } from "../components/ui/Feedback.jsx";
import LazyImage from "../components/common/LazyImage.jsx";
import { useAsync } from "../hooks/useAsync.js";
import orderService from "../services/orderService.js";
import { formatINR } from "../lib/money.js";
import { formatDate } from "../lib/format.js";
import s from "./OrderConfirmationPage.module.css";

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const { data: order, loading, error, refetch } = useAsync(
    (opts) => orderService.getOrder(orderId, opts),
    [orderId],
  );

  if (loading) {
    return (
      <div className="container" style={{ paddingBlock: "var(--sp-12)" }}>
        <LoadingBlock label="Fetching your order…" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ paddingBlock: "var(--sp-12)" }}>
        <ErrorState error={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <>
      <SEO title="Order confirmed" noIndex />

      <div className={`container ${s.wrap}`}>
        <div className={s.hero}>
          <span className={s.tick} aria-hidden="true">
            <CheckCircle2 />
          </span>
          <h1 className={s.title}>Thank you — your order is in.</h1>
          <p className={s.subtitle}>
            We have emailed a confirmation. Everything is made to order, so give
            us a few days in the studio before it ships.
          </p>
          <p className={s.orderNumber}>
            Order <strong>{order.orderNumber}</strong>
          </p>
        </div>

        <div className={s.grid}>
          <section className={s.card}>
            <h2 className={s.cardTitle}>What happens next</h2>
            <ol className={s.timeline}>
              <li className={s.timelineDone}>
                <Package aria-hidden="true" />
                <div>
                  <strong>Order received</strong>
                  <span>{formatDate(order.placedAt)}</span>
                </div>
              </li>
              <li>
                <Package aria-hidden="true" />
                <div>
                  <strong>Being made</strong>
                  <span>Usually 2–4 days in the studio</span>
                </div>
              </li>
              <li>
                <Truck aria-hidden="true" />
                <div>
                  <strong>On its way</strong>
                  <span>Estimated {formatDate(order.estimatedDeliveryAt)}</span>
                </div>
              </li>
            </ol>
          </section>

          <section className={s.card}>
            <h2 className={s.cardTitle}>Delivering to</h2>
            <address className={s.address}>
              <strong>{order.shippingAddress.fullName}</strong>
              {order.shippingAddress.line1}
              {order.shippingAddress.line2 && <>{order.shippingAddress.line2}</>}
              {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
              {order.shippingAddress.pincode}
              <span>{order.shippingAddress.phone}</span>
            </address>

            <h2 className={`${s.cardTitle} ${s.cardTitleSpaced}`}>Payment</h2>
            <p className={s.payment}>
              {order.paymentMethod === "cod"
                ? "Cash on delivery"
                : order.paymentMethod === "upi"
                  ? "Paid by UPI"
                  : "Paid by card"}
            </p>
          </section>
        </div>

        <section className={s.card}>
          <h2 className={s.cardTitle}>Your order</h2>

          <ul className={s.items}>
            {order.lines.map((line) => (
              <li key={line.lineId} className={s.item}>
                <span className={s.itemThumb}>
                  <LazyImage src={line.image} alt="" />
                </span>
                <span className={s.itemBody}>
                  <span className={s.itemTitle}>{line.title}</span>
                  <span className={s.itemMeta}>
                    {line.variantName ? `${line.variantName} · ` : ""}
                    Qty {line.qty}
                  </span>
                </span>
                <span className={s.itemPrice}>{formatINR(line.lineTotalMinor)}</span>
              </li>
            ))}
          </ul>

          <dl className={s.totals}>
            <div>
              <dt>Subtotal</dt>
              <dd>{formatINR(order.totals.subtotalMinor)}</dd>
            </div>
            {order.totals.discountMinor > 0 && (
              <div>
                <dt>Discount</dt>
                <dd>−{formatINR(order.totals.discountMinor)}</dd>
              </div>
            )}
            <div>
              <dt>Shipping</dt>
              <dd>
                {order.totals.shippingMinor === 0
                  ? "Free"
                  : formatINR(order.totals.shippingMinor)}
              </dd>
            </div>
            <div>
              <dt>GST</dt>
              <dd>{formatINR(order.totals.taxMinor)}</dd>
            </div>
            <div className={s.grand}>
              <dt>Total</dt>
              <dd>{formatINR(order.totals.totalMinor)}</dd>
            </div>
          </dl>
        </section>

        <div className={s.actions}>
          <Button to="/account/orders" variant="secondary">
            View all orders
          </Button>
          <Button to="/shop">Keep shopping</Button>
        </div>
      </div>
    </>
  );
}
