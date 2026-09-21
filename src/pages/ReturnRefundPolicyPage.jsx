import { Link } from "react-router-dom";
import { RotateCcw, CheckCircle2, XCircle, AlertTriangle, ArrowRight, ShieldCheck, Mail, MessageCircle } from "lucide-react";
import SupportLayout from "../components/support/SupportLayout.jsx";
import { BRAND } from "../config/site.js";
import s from "./PolicyPages.module.css";

export default function ReturnRefundPolicyPage() {
  return (
    <SupportLayout
      title="Return & Refund Policy"
      subtitle="Simple, hassle-free returns. We want you to love everything you receive from CraftiNiya."
      badge="Returns & Refunds"
      seoTitle="Return & Refund Policy — Craftiniya"
      seoDescription="Understand Craftiniya's 7-day return policy, custom order exceptions, damaged item replacements, and refund processing times."
    >
      <div className={s.policyContainer}>
        {/* Last updated bar */}
        <div className={s.lastUpdatedBar}>
          <span className={s.lastUpdatedText}>
            Last updated: <strong>September 2026</strong>
          </span>
          <span>Window: <strong>7 Days From Delivery</strong></span>
        </div>

        {/* 1. Policy Overview */}
        <div className={s.policyCard}>
          <div className={s.cardHeader}>
            <div className={s.cardIconWrap}><RotateCcw size={22} /></div>
            <h2 className={s.cardTitle}>7-Day Easy Returns Window</h2>
          </div>
          <div className={s.cardBody}>
            <p>
              We want you to be completely delighted with your purchase. If a standard non-custom piece is not quite what you expected, you may initiate a return within <strong>7 calendar days</strong> of parcel delivery.
            </p>
            <div className={s.callout}>
              <ShieldCheck size={20} className={s.calloutIcon} />
              <div className={s.calloutContent}>
                <p className={s.calloutTitle}>Conditions for Eligible Returns</p>
                <p>
                  Items must be unused, unwashed, and in their original packaging with tags intact. Because handmade items are delicate, pieces must be safely packed in their original protective box for the return journey.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Eligible vs Non-Eligible Items */}
        <div className={s.policyCard}>
          <div className={s.cardHeader}>
            <div className={s.cardIconWrap}><CheckCircle2 size={22} /></div>
            <h2 className={s.cardTitle}>What Can and Cannot Be Returned</h2>
          </div>
          <div className={s.cardBody}>
            <div className={s.tableWrap}>
              <table className={s.table}>
                <thead>
                  <tr>
                    <th>Item Category</th>
                    <th>Returnable?</th>
                    <th>Terms & Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Standard Studio Catalog</strong> (Wall art, clocks, ready trays, candle sets)</td>
                    <td><span style={{ color: "var(--c-success)", fontWeight: 700 }}>✓ Eligible</span></td>
                    <td>Returnable within 7 days in original, undamaged condition.</td>
                  </tr>
                  <tr>
                    <td><strong>Personalized & Custom Orders</strong> (Custom names, dates, resin wedding preservation)</td>
                    <td><span style={{ color: "var(--c-error)", fontWeight: 700 }}>✗ Non-Returnable</span></td>
                    <td>Crafted exclusively for you. Eligible for replacement only if transit-damaged.</td>
                  </tr>
                  <tr>
                    <td><strong>Curated Gift Boxes</strong> (Custom note or sealed edible items)</td>
                    <td><span style={{ color: "var(--c-error)", fontWeight: 700 }}>✗ Non-Returnable</span></td>
                    <td>Due to custom gift packaging & personalized greeting cards.</td>
                  </tr>
                  <tr>
                    <td><strong>Clearance & Final Sale Items</strong></td>
                    <td><span style={{ color: "var(--c-error)", fontWeight: 700 }}>✗ Non-Returnable</span></td>
                    <td>Marked as final sale on the product page.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 3. Step-by-Step Return Process */}
        <div className={s.policyCard}>
          <div className={s.cardHeader}>
            <div className={s.cardIconWrap}><ArrowRight size={22} /></div>
            <h2 className={s.cardTitle}>How to Initiate a Return</h2>
          </div>
          <div className={s.cardBody}>
            <ol className={s.stepList}>
              <li className={s.stepItem}>
                <span className={s.stepNumber}>1</span>
                <span className={s.stepText}>
                  <strong>Contact Customer Care:</strong> Email <a href={`mailto:${BRAND.email}`} style={{ textDecoration: "underline", color: "inherit", fontWeight: 700 }}>{BRAND.email}</a> or WhatsApp us with your Order ID (e.g. <code>CRF-1049</code>) and reason for return.
                </span>
              </li>
              <li className={s.stepItem}>
                <span className={s.stepNumber}>2</span>
                <span className={s.stepText}>
                  <strong>Reverse Pickup Scheduled:</strong> We will arrange a door pickup with our courier partner within 24–48 hours in serviceable areas.
                </span>
              </li>
              <li className={s.stepItem}>
                <span className={s.stepNumber}>3</span>
                <span className={s.stepText}>
                  <strong>Studio Inspection:</strong> Once your return arrives at our Jaipur studio, our team verifies that the piece is intact and unused.
                </span>
              </li>
              <li className={s.stepItem}>
                <span className={s.stepNumber}>4</span>
                <span className={s.stepText}>
                  <strong>Instant Refund Disbursement:</strong> Approved refunds are credited directly back to your original payment mode (UPI, card, or bank account).
                </span>
              </li>
            </ol>
          </div>
        </div>

        {/* 4. Refund Processing Time */}
        <div className={s.policyCard}>
          <div className={s.cardHeader}>
            <div className={s.cardIconWrap}><ShieldCheck size={22} /></div>
            <h2 className={s.cardTitle}>Refund Processing & Timelines</h2>
          </div>
          <div className={s.cardBody}>
            <p>
              Once approved at our studio, refunds are processed as follows:
            </p>
            <ul className={s.bulletList}>
              <li><strong>Prepaid Orders (UPI, GPay, PhonePe, Paytm):</strong> Reflected in your bank account within 24 to 48 business hours.</li>
              <li><strong>Credit / Debit Cards & Net Banking:</strong> 4 to 7 working days depending on your issuing bank.</li>
              <li><strong>Cash on Delivery (COD) Orders:</strong> We will request your UPI ID or Bank account details (Account number + IFSC) via email to transfer the funds directly.</li>
            </ul>
          </div>
        </div>

        {/* 5. Direct Help / Questions */}
        <div className={s.policyCard}>
          <div className={s.cardHeader}>
            <div className={s.cardIconWrap}><Mail size={22} /></div>
            <h2 className={s.cardTitle}>Need Help with an Order?</h2>
          </div>
          <div className={s.cardBody}>
            <p>
              Reach out directly to our dedicated customer support team. We promise fair, human resolution to any concern:
            </p>
            <div className={s.quickNavStrip}>
              <a
                href="https://wa.me/919876543210?text=Hi%20CraftiNiya,%20I%20want%20to%20request%20a%20return"
                target="_blank"
                rel="noreferrer noopener"
                className={s.actionBtn}
              >
                <MessageCircle size={16} /> Request Return on WhatsApp
              </a>
              <Link to="/contact" className={s.actionBtnSecondary}>
                Contact Support Team
              </Link>
            </div>
          </div>
        </div>
      </div>
    </SupportLayout>
  );
}
