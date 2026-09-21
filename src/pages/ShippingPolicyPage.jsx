import { Link } from "react-router-dom";
import { Truck, Clock, ShieldCheck, MapPin, PackageCheck, AlertCircle, ChevronRight } from "lucide-react";
import SupportLayout from "../components/support/SupportLayout.jsx";
import { formatINR } from "../lib/money.js";
import { FREE_SHIPPING_THRESHOLD_MINOR, FLAT_SHIPPING_MINOR } from "../config/site.js";
import s from "./PolicyPages.module.css";

export default function ShippingPolicyPage() {
  return (
    <SupportLayout
      title="Shipping & Delivery Policy"
      subtitle="Everything you need to know about how we handcraft, pack, and safely ship your treasures across India."
      badge="Shipping & Delivery"
      seoTitle="Shipping & Delivery Policy — Craftiniya"
      seoDescription="Learn about Craftiniya's dispatch timelines, delivery estimates, shipping charges, and packaging standards across India."
    >
      <div className={s.policyContainer}>
        {/* Last updated bar */}
        <div className={s.lastUpdatedBar}>
          <span className={s.lastUpdatedText}>
            Last updated: <strong>September 2026</strong>
          </span>
          <span>Coverage: <strong>Pan-India (26,000+ PIN codes)</strong></span>
        </div>

        {/* 1. Overview & Free Shipping */}
        <div className={s.policyCard}>
          <div className={s.cardHeader}>
            <div className={s.cardIconWrap}><Truck size={22} /></div>
            <h2 className={s.cardTitle}>Shipping Rates & Free Shipping</h2>
          </div>
          <div className={s.cardBody}>
            <p>
              We believe in transparent pricing without surprise charges. Our shipping rates are straightforward:
            </p>
            <div className={s.callout}>
              <Truck size={20} className={s.calloutIcon} />
              <div className={s.calloutContent}>
                <p className={s.calloutTitle}>Free Pan-India Delivery on Orders Above {formatINR(FREE_SHIPPING_THRESHOLD_MINOR)}</p>
                <p>
                  Orders below {formatINR(FREE_SHIPPING_THRESHOLD_MINOR)} are delivered at a nominal flat rate of {formatINR(FLAT_SHIPPING_MINOR)} across all serviceable pincodes in India.
                </p>
              </div>
            </div>
            <p>
              All prices displayed on CraftiNiya are inclusive of applicable GST. Shipping charges (if applicable) are calculated and itemized clearly at checkout.
            </p>
          </div>
        </div>

        {/* 2. Crafting vs Delivery Timelines */}
        <div className={s.policyCard}>
          <div className={s.cardHeader}>
            <div className={s.cardIconWrap}><Clock size={22} /></div>
            <h2 className={s.cardTitle}>Crafting & Delivery Timelines</h2>
          </div>
          <div className={s.cardBody}>
            <p>
              Because every piece at CraftiNiya is made by hand in small artisan batches or customized to your brief, your order undergoes two distinct stages:
            </p>

            <ul className={s.bulletList}>
              <li>
                <strong>Stage 1: Studio Crafting & Curing (2 to 4 Business Days)</strong> — Resin requires 48–72 hours to fully cure to a crystal-hard finish. Hand-poured candles require curing time to ensure optimal scent throw. Personalized nameplates and custom gift boxes are curated with attention to detail.
              </li>
              <li>
                <strong>Stage 2: Transit & Courier Delivery (3 to 6 Business Days)</strong> — Once dispatched from our studio, delivery takes 3–4 days for Metro cities and 5–7 days for other regions across India.
              </li>
            </ul>

            <div className={s.tableWrap}>
              <table className={s.table}>
                <thead>
                  <tr>
                    <th>Destination Region</th>
                    <th>Courier Transit Time</th>
                    <th>Total Estimated Turnaround</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Delhi NCR, Mumbai, Bengaluru</strong></td>
                    <td>2–4 Business Days</td>
                    <td>5–7 Business Days</td>
                  </tr>
                  <tr>
                    <td><strong>Tier 1 & Tier 2 Cities</strong></td>
                    <td>3–5 Business Days</td>
                    <td>6–8 Business Days</td>
                  </tr>
                  <tr>
                    <td><strong>Rest of India (North East & J&K)</strong></td>
                    <td>5–7 Business Days</td>
                    <td>8–11 Business Days</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 3. Courier Partners & Order Tracking */}
        <div className={s.policyCard}>
          <div className={s.cardHeader}>
            <div className={s.cardIconWrap}><MapPin size={22} /></div>
            <h2 className={s.cardTitle}>Courier Partners & Tracking</h2>
          </div>
          <div className={s.cardBody}>
            <p>
              We partner with India&apos;s leading logistics providers including <strong>Bluedart, Delhivery, DTDC, and Xpressbees</strong> to ensure your fragile handmade items are handled with extreme care.
            </p>
            <p>
              As soon as your package leaves our studio, you will receive an SMS and Email with your tracking ID and live tracking link. You can also track your order status directly anytime on our website.
            </p>

            <div className={s.quickNavStrip}>
              <span>Have an order ID handy?</span>
              <Link to="/track-order" className={s.actionBtn}>
                Track Your Order <ChevronRight size={15} />
              </Link>
            </div>
          </div>
        </div>

        {/* 4. Packaging & Fragile Handling Standards */}
        <div className={s.policyCard}>
          <div className={s.cardHeader}>
            <div className={s.cardIconWrap}><PackageCheck size={22} /></div>
            <h2 className={s.cardTitle}>Zero-Breakage Packaging Standards</h2>
          </div>
          <div className={s.cardBody}>
            <p>
              Handmade resin art, ceramics, and glassware require special protection. We adhere to rigorous 4-layer packaging:
            </p>
            <ol className={s.stepList}>
              <li className={s.stepItem}>
                <span className={s.stepNumber}>1</span>
                <span className={s.stepText}><strong>Butter Paper / Tissue Wrap:</strong> Shields the glossy surface from micro-abrasions.</span>
              </li>
              <li className={s.stepItem}>
                <span className={s.stepNumber}>2</span>
                <span className={s.stepText}><strong>Multi-layer Air Bubble Wrap:</strong> Cushions edges, corners, and glass elements.</span>
              </li>
              <li className={s.stepItem}>
                <span className={s.stepNumber}>3</span>
                <span className={s.stepText}><strong>Rigid 5-Ply Corrugated Box:</strong> Prevents any external crushing during transit.</span>
              </li>
              <li className={s.stepItem}>
                <span className={s.stepNumber}>4</span>
                <span className={s.stepText}><strong>Fragile & Handle With Care Taping:</strong> Alerts courier personnel for gentle sorting.</span>
              </li>
            </ol>
          </div>
        </div>

        {/* 5. Damaged in Transit Policy */}
        <div className={s.policyCard}>
          <div className={s.cardHeader}>
            <div className={s.cardIconWrap}><AlertCircle size={22} /></div>
            <h2 className={s.cardTitle}>Damaged in Transit Guarantee</h2>
          </div>
          <div className={s.cardBody}>
            <p>
              Despite our best efforts, transit mishaps can very rarely occur. Your satisfaction is 100% guaranteed.
            </p>
            <div className={s.alert}>
              <AlertCircle size={20} className={s.alertIcon} />
              <div>
                <strong>Unboxing Video Protocol:</strong> Please record a short, continuous 360-degree video while opening the outer parcel. In the rare event of transit damage, notify us within <strong>48 hours of delivery</strong> with the video at <a href="mailto:hello@craftiniya.in" style={{ textDecoration: "underline", color: "inherit", fontWeight: 700 }}>hello@craftiniya.in</a> or WhatsApp. We will immediately dispatch a free replacement or initiate a full refund.
              </div>
            </div>
          </div>
        </div>
      </div>
    </SupportLayout>
  );
}
