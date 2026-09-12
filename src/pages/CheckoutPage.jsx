import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Truck, Wallet } from "lucide-react";
import SEO from "../components/common/SEO.jsx";
import PageHeader from "../components/layout/PageHeader.jsx";
import Button from "../components/ui/Button.jsx";
import { Input, Select, Textarea } from "../components/ui/Field.jsx";
import { EmptyState } from "../components/ui/Feedback.jsx";
import LazyImage from "../components/common/LazyImage.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useUI } from "../context/UIContext.jsx";
import orderService from "../services/orderService.js";
import { formatINR } from "../lib/money.js";
import { cn } from "../lib/cn.js";
import s from "./CheckoutPage.module.css";

const STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Odisha", "Punjab", "Rajasthan", "Tamil Nadu",
  "Telangana", "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

const PAYMENT_METHODS = [
  { id: "card", label: "Card", detail: "Visa, Mastercard, RuPay", icon: CreditCard },
  { id: "upi", label: "UPI", detail: "GPay, PhonePe, Paytm", icon: Wallet },
  { id: "cod", label: "Cash on delivery", detail: "Pay when it arrives", icon: Truck },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, lines } = useCart();
  const { user } = useAuth();
  const { toast } = useUI();

  const [address, setAddress] = useState({
    fullName: user?.name ?? "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "Rajasthan",
    pincode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const setField = (key) => (e) => {
    setAddress((a) => ({ ...a, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);

    try {
      const order = await orderService.createOrder({ shippingAddress: address, paymentMethod, notes });
      toast("Order placed — thank you", { type: "success" });
      navigate(`/order/${order.id}`, { replace: true });
    } catch (err) {
      if (err?.details) setErrors(err.details);
      else toast(err?.message ?? "We could not place that order.", { type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  if (!lines.length) {
    return (
      <>
        <SEO title="Checkout" noIndex />
        <div className="container" style={{ paddingBlock: "var(--sp-12)" }}>
          <EmptyState
            title="Nothing to check out"
            message="Your bag is empty, so there is nothing to pay for yet."
            action={<Button to="/shop">Browse the shop</Button>}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <SEO title="Checkout" noIndex />

      <PageHeader
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Bag", to: "/cart" }, { label: "Checkout" }]}
        eyebrow="Almost there"
        title="Checkout"
      />

      <form className={`container ${s.layout}`} onSubmit={submit} noValidate>
        <div className={s.main}>
          {/* ---- delivery address ---- */}
          <section className={s.section}>
            <h2 className={s.sectionTitle}>
              <span className={s.step}>1</span> Delivery address
            </h2>

            <div className={s.grid}>
              <Input
                label="Full name"
                value={address.fullName}
                onChange={setField("fullName")}
                error={errors.fullName}
                autoComplete="name"
                required
              />
              <Input
                label="Phone"
                type="tel"
                value={address.phone}
                onChange={setField("phone")}
                error={errors.phone}
                hint="10-digit mobile number"
                autoComplete="tel"
                required
              />
              <Input
                label="Address"
                value={address.line1}
                onChange={setField("line1")}
                error={errors.line1}
                autoComplete="address-line1"
                className={s.full}
                required
              />
              <Input
                label="Apartment, landmark (optional)"
                value={address.line2}
                onChange={setField("line2")}
                autoComplete="address-line2"
                className={s.full}
              />
              <Input
                label="City"
                value={address.city}
                onChange={setField("city")}
                error={errors.city}
                autoComplete="address-level2"
                required
              />
              <Select
                label="State"
                value={address.state}
                onChange={setField("state")}
                error={errors.state}
                options={STATES.map((st) => ({ value: st, label: st }))}
                required
              />
              <Input
                label="PIN code"
                inputMode="numeric"
                value={address.pincode}
                onChange={setField("pincode")}
                error={errors.pincode}
                autoComplete="postal-code"
                required
              />
            </div>
          </section>

          {/* ---- payment ---- */}
          <section className={s.section}>
            <h2 className={s.sectionTitle}>
              <span className={s.step}>2</span> Payment
            </h2>

            <div className={s.methods}>
              {PAYMENT_METHODS.map((method) => {
                const Icon = method.icon;
                const active = paymentMethod === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                    aria-pressed={active}
                    className={cn(s.method, active && s.methodActive)}
                  >
                    <Icon aria-hidden="true" />
                    <span className={s.methodLabel}>{method.label}</span>
                    <span className={s.methodDetail}>{method.detail}</span>
                  </button>
                );
              })}
            </div>

            <p className={s.paymentNote}>
              This is a demo checkout — no payment is taken and no card details
              are collected. A real gateway plugs in at this step.
            </p>
          </section>

          {/* ---- gift note ---- */}
          <section className={s.section}>
            <h2 className={s.sectionTitle}>
              <span className={s.step}>3</span> Gift note
            </h2>
            <Textarea
              label="Add a handwritten note (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Happy birthday, Meera — hope this brightens the shelf."
              maxLength={240}
              hint={`${notes.length}/240 characters`}
            />
          </section>
        </div>

        {/* ---- summary ---- */}
        <aside className={s.summary}>
          <h2 className={s.summaryTitle}>Your order</h2>

          <ul className={s.items}>
            {lines.map((line) => (
              <li key={line.lineId} className={s.item}>
                <span className={s.itemThumb}>
                  <LazyImage src={line.image} alt="" />
                  <span className={s.itemQty}>{line.qty}</span>
                </span>
                <span className={s.itemBody}>
                  <span className={s.itemTitle}>{line.title}</span>
                  {line.variantName && (
                    <span className={s.itemVariant}>{line.variantName}</span>
                  )}
                </span>
                <span className={s.itemPrice}>{formatINR(line.lineTotalMinor)}</span>
              </li>
            ))}
          </ul>

          <dl className={s.totals}>
            <div>
              <dt>Subtotal</dt>
              <dd>{formatINR(cart.subtotalMinor)}</dd>
            </div>
            {cart.discountMinor > 0 && (
              <div className={s.discount}>
                <dt>Discount</dt>
                <dd>−{formatINR(cart.discountMinor)}</dd>
              </div>
            )}
            <div>
              <dt>Shipping</dt>
              <dd>{cart.shippingMinor === 0 ? "Free" : formatINR(cart.shippingMinor)}</dd>
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

          <Button type="submit" size="lg" fullWidth loading={submitting}>
            {paymentMethod === "cod" ? "Place order" : `Pay ${formatINR(cart.totalMinor)}`}
          </Button>

          <p className={s.secure}>Your details are only used to deliver this order.</p>
        </aside>
      </form>
    </>
  );
}
