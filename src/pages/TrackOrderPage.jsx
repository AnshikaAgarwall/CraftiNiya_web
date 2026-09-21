import { useState } from "react";
import { Search, CheckCircle2, Clock, Truck, Package, MapPin, Sparkles, MessageCircle } from "lucide-react";
import SupportLayout from "../components/support/SupportLayout.jsx";
import { useUI } from "../context/UIContext.jsx";
import s from "./TrackOrderPage.module.css";

export default function TrackOrderPage() {
  const { toast } = useUI();
  const [orderInput, setOrderInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [searching, setSearching] = useState(false);
  const [trackingData, setTrackingData] = useState(null);

  function handleTrack(e) {
    e.preventDefault();
    if (!orderInput.trim()) {
      toast("Please enter your Order ID", { type: "info" });
      return;
    }

    setSearching(true);
    setTimeout(() => {
      setSearching(false);
      // Generate clean simulated tracking result based on orderInput
      const orderClean = orderInput.trim().toUpperCase();
      setTrackingData({
        orderId: orderClean.startsWith("CRF-") ? orderClean : `CRF-${orderClean}`,
        date: "20 Sep 2026",
        estDelivery: "24–25 Sep 2026",
        status: "In Studio & Crafting",
        courier: "Bluedart Express",
        awb: "BLU-984729104",
        deliveryTo: "New Delhi, 110001, India",
        itemsCount: "2 handmade items (Gift Wrapped)",
        steps: [
          {
            title: "Order Placed & Payment Verified",
            desc: "Your order was confirmed and allocated to our Jaipur studio workbench.",
            date: "20 Sep 2026, 02:15 PM",
            completed: true,
          },
          {
            title: "In Studio: Artisan Crafting & Curing",
            desc: "Artisans are pouring resin layers and allowing 48-hr crystal curing.",
            date: "21 Sep 2026, 11:30 AM",
            completed: true,
            current: true,
          },
          {
            title: "Hand-Packed & Sealed",
            desc: "Wrapped in 4-layer shockproof box with complimentary handwritten note.",
            date: "Estimated: 22 Sep 2026",
            completed: false,
          },
          {
            title: "Dispatched with Courier Partner",
            desc: "Handed over to Bluedart logistics for safe air/express transit.",
            date: "Estimated: 23 Sep 2026",
            completed: false,
          },
          {
            title: "Out for Delivery & Doorstep Handover",
            desc: "Courier executive will arrive with your package.",
            date: "Estimated: 24–25 Sep 2026",
            completed: false,
          },
        ],
      });
      toast("Order status retrieved successfully!", { type: "success" });
    }, 500);
  }

  return (
    <SupportLayout
      title="Track Your Order"
      subtitle="Follow your handcrafted piece from our artisan workbench to your doorstep."
      badge="Live Tracking"
      seoTitle="Track Your Order — Craftiniya"
      seoDescription="Track your Craftiniya handmade order status, studio crafting progress, and Bluedart/Delhivery courier dispatch details."
    >
      <div className={s.trackContainer}>
        {/* Lookup Box */}
        <div className={s.lookupCard}>
          <div className={s.lookupHeader}>
            <h2 className={s.lookupTitle}>Enter Your Order Details</h2>
            <p className={s.lookupSubtitle}>
              Check your SMS or confirmation email for your 8-character Order ID (e.g. <code>CRF-1049</code>).
            </p>
          </div>

          <form className={s.lookupForm} onSubmit={handleTrack}>
            <div className={s.formGroup}>
              <label className={s.label} htmlFor="track-order-id">Order ID *</label>
              <input
                type="text"
                id="track-order-id"
                required
                placeholder="e.g. CRF-1049"
                value={orderInput}
                onChange={(e) => setOrderInput(e.target.value)}
                className={s.input}
              />
            </div>

            <div className={s.formGroup}>
              <label className={s.label} htmlFor="track-phone">Phone Number or Email</label>
              <input
                type="text"
                id="track-phone"
                placeholder="e.g. 9876543210 or your email"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                className={s.input}
              />
            </div>

            <button type="submit" className={s.trackBtn} disabled={searching}>
              <Search size={16} /> {searching ? "Locating Order…" : "Track Order"}
            </button>
          </form>
        </div>

        {/* Tracking Details Result */}
        {trackingData && (
          <div className={s.resultCard}>
            <div className={s.resultTop}>
              <div>
                <h3 className={s.resultOrderId}>{trackingData.orderId}</h3>
                <span style={{ fontSize: "0.82rem", color: "var(--c-text-2)" }}>
                  Placed on {trackingData.date} • {trackingData.itemsCount}
                </span>
              </div>
              <div className={s.statusBadge}>
                <Sparkles size={14} /> {trackingData.status}
              </div>
            </div>

            <div className={s.infoGrid}>
              <div className={s.infoCol}>
                <span className={s.infoLabel}>Estimated Delivery</span>
                <span className={s.infoValue}>{trackingData.estDelivery}</span>
              </div>
              <div className={s.infoCol}>
                <span className={s.infoLabel}>Courier Partner</span>
                <span className={s.infoValue}>{trackingData.courier}</span>
              </div>
              <div className={s.infoCol}>
                <span className={s.infoLabel}>Tracking AWB</span>
                <span className={s.infoValue}>{trackingData.awb}</span>
              </div>
              <div className={s.infoCol}>
                <span className={s.infoLabel}>Destination</span>
                <span className={s.infoValue}>{trackingData.deliveryTo}</span>
              </div>
            </div>

            {/* Timeline */}
            <div className={s.timeline}>
              {trackingData.steps.map((step, idx) => (
                <div key={idx} className={s.timelineStep}>
                  <div
                    className={`${s.stepDot} ${
                      step.completed ? s.stepDotCompleted : ""
                    } ${step.current ? s.stepDotCurrent : ""}`}
                  >
                    {step.completed && <CheckCircle2 size={12} />}
                  </div>
                  <h4 className={s.stepTitle}>{step.title}</h4>
                  <p className={s.stepDesc}>{step.desc}</p>
                  <span className={s.stepDate}>{step.date}</span>
                </div>
              ))}
            </div>

            {/* Direct Contact Footer */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", borderTop: "1px solid var(--c-border)", paddingTop: "16px" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--c-text-2)" }}>
                Need to change your shipping address or add special instructions?
              </span>
              <a
                href={`https://wa.me/919876543210?text=Hi%20CraftiNiya,%20I%20need%20help%20with%20order%20${trackingData.orderId}`}
                target="_blank"
                rel="noreferrer noopener"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "var(--c-brand)",
                  textDecoration: "none",
                }}
              >
                <MessageCircle size={15} /> Chat with Studio Dispatch
              </a>
            </div>
          </div>
        )}
      </div>
    </SupportLayout>
  );
}
