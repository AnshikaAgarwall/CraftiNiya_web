import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import SEO from "../components/common/SEO.jsx";
import PageHeader from "../components/layout/PageHeader.jsx";
import Button from "../components/ui/Button.jsx";
import { Badge } from "../components/ui/Bits.jsx";
import { EmptyState, ErrorState, LoadingBlock } from "../components/ui/Feedback.jsx";
import LazyImage from "../components/common/LazyImage.jsx";
import { useAsync } from "../hooks/useAsync.js";
import orderService, { ORDER_STATUS } from "../services/orderService.js";
import { formatINR } from "../lib/money.js";
import { formatDate, pluralize } from "../lib/format.js";
import s from "./OrderHistoryPage.module.css";

const STATUS_TONE = {
  [ORDER_STATUS.PLACED]: "accent",
  [ORDER_STATUS.CRAFTING]: "brand",
  [ORDER_STATUS.SHIPPED]: "brand",
  [ORDER_STATUS.DELIVERED]: "success",
  [ORDER_STATUS.CANCELLED]: "error",
};

export default function OrderHistoryPage() {
  const { data, loading, error, refetch } = useAsync(
    (opts) => orderService.getOrders({ pageSize: 20 }, opts),
    [],
  );

  const orders = data?.items ?? [];

  return (
    <>
      <SEO title="Your orders" noIndex />

      <PageHeader
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Account", to: "/account" },
          { label: "Orders" },
        ]}
        eyebrow="History"
        title="Your orders"
        description={data?.total ? pluralize(data.total, "order") : undefined}
      />

      <div className={`container ${s.wrap}`}>
        {loading ? (
          <LoadingBlock label="Loading your orders…" />
        ) : error ? (
          <ErrorState error={error} onRetry={refetch} />
        ) : !orders.length ? (
          <EmptyState
            icon={Package}
            title="No orders yet"
            message="Once you place an order it will appear here, with its progress through the studio."
            action={<Button to="/shop">Start shopping</Button>}
          />
        ) : (
          <ul className={s.list}>
            {orders.map((order) => (
              <li key={order.id}>
                <article className={s.order}>
                  <header className={s.head}>
                    <div>
                      <p className={s.number}>{order.orderNumber}</p>
                      <p className={s.date}>Placed {formatDate(order.placedAt)}</p>
                    </div>

                    <div className={s.headRight}>
                      <Badge tone={STATUS_TONE[order.status] ?? "neutral"}>
                        {order.status}
                      </Badge>
                      <span className={s.total}>
                        {formatINR(order.totals.totalMinor)}
                      </span>
                    </div>
                  </header>

                  <ul className={s.thumbs}>
                    {order.lines.slice(0, 5).map((line) => (
                      <li key={line.lineId}>
                        <Link to={`/product/${line.slug}`} className={s.thumb}>
                          <LazyImage src={line.image} alt={line.title} />
                        </Link>
                      </li>
                    ))}
                    {order.lines.length > 5 && (
                      <li className={s.more}>+{order.lines.length - 5}</li>
                    )}
                  </ul>

                  <footer className={s.foot}>
                    <span className={s.delivery}>
                      {order.status === ORDER_STATUS.CANCELLED
                        ? "Cancelled"
                        : `Estimated ${formatDate(order.estimatedDeliveryAt)}`}
                    </span>
                    <Button to={`/order/${order.id}`} variant="secondary" size="sm">
                      View order
                    </Button>
                  </footer>
                </article>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
