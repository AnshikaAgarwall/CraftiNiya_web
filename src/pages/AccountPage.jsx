import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, LogOut, Package, ShoppingBag } from "lucide-react";
import SEO from "../components/common/SEO.jsx";
import PageHeader from "../components/layout/PageHeader.jsx";
import Button from "../components/ui/Button.jsx";
import { Input } from "../components/ui/Field.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useUI } from "../context/UIContext.jsx";
import { useAsync } from "../hooks/useAsync.js";
import orderService from "../services/orderService.js";
import { formatDate } from "../lib/format.js";
import s from "./AccountPage.module.css";

export default function AccountPage() {
  const { user, signOut, updateProfile, pending } = useAuth();
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { toast } = useUI();

  const [name, setName] = useState(user?.name ?? "");
  const [saving, setSaving] = useState(false);

  const { data: orders } = useAsync(
    (opts) => orderService.getOrders({ pageSize: 3 }, opts),
    [],
  );

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ name: name.trim() });
      toast("Profile updated", { type: "success" });
    } catch (err) {
      toast(err?.message ?? "Could not save that", { type: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <SEO title="Your account" noIndex />

      <PageHeader
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Account" }]}
        eyebrow="Your account"
        title={user?.name ? `Hello, ${user.name.split(" ")[0]}` : "Your account"}
        description={user?.email}
      />

      <div className={`container ${s.wrap}`}>
        <div className={s.stats}>
          <Link to="/account/orders" className={s.stat}>
            <Package aria-hidden="true" />
            <strong>{orders?.total ?? 0}</strong>
            <span>Orders</span>
          </Link>
          <Link to="/wishlist" className={s.stat}>
            <Heart aria-hidden="true" />
            <strong>{wishlistCount}</strong>
            <span>Saved</span>
          </Link>
          <Link to="/cart" className={s.stat}>
            <ShoppingBag aria-hidden="true" />
            <strong>{itemCount}</strong>
            <span>In bag</span>
          </Link>
        </div>

        <div className={s.grid}>
          <section className={s.card}>
            <h2 className={s.cardTitle}>Your details</h2>
            <form className={s.form} onSubmit={save}>
              <Input
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
              <Input
                label="Email"
                value={user?.email ?? ""}
                readOnly
                hint="Contact us to change the email on your account."
              />
              <div className={s.formActions}>
                <Button type="submit" loading={saving} disabled={!name.trim()}>
                  Save changes
                </Button>
              </div>
            </form>
          </section>

          <section className={s.card}>
            <div className={s.cardHead}>
              <h2 className={s.cardTitle}>Recent orders</h2>
              <Link to="/account/orders" className={s.cardLink}>
                View all
              </Link>
            </div>

            {orders?.items?.length ? (
              <ul className={s.orders}>
                {orders.items.map((order) => (
                  <li key={order.id}>
                    <Link to={`/order/${order.id}`} className={s.order}>
                      <span className={s.orderNumber}>{order.orderNumber}</span>
                      <span className={s.orderMeta}>
                        {formatDate(order.placedAt)} · {order.lines.length} item
                        {order.lines.length === 1 ? "" : "s"}
                      </span>
                      <span className={s.orderStatus}>{order.status}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={s.empty}>
                No orders yet. When you place one it will show up here.
              </p>
            )}
          </section>
        </div>

        <div className={s.signOut}>
          <Button
            variant="danger"
            onClick={signOut}
            loading={pending}
            startIcon={<LogOut size={16} />}
          >
            Sign out
          </Button>
        </div>
      </div>
    </>
  );
}
