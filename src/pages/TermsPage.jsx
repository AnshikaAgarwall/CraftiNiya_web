import { FileText, ShieldAlert, Sparkles, Scale, RefreshCw } from "lucide-react";
import SupportLayout from "../components/support/SupportLayout.jsx";
import { BRAND } from "../config/site.js";
import s from "./PolicyPages.module.css";

export default function TermsPage() {
  return (
    <SupportLayout
      title="Terms & Conditions"
      subtitle="The formal agreements and transparency details governing purchases and custom commissions on CraftiNiya."
      badge="Legal & Terms"
      seoTitle="Terms & Conditions — Craftiniya"
      seoDescription="Read the terms and conditions for placing orders, custom commissions, pricing, and handmade variation policies on Craftiniya."
    >
      <div className={s.policyContainer}>
        <div className={s.lastUpdatedBar}>
          <span className={s.lastUpdatedText}>
            Effective date: <strong>September 2026</strong>
          </span>
          <span>Governing Jurisdiction: <strong>Jaipur, Rajasthan, India</strong></span>
        </div>

        {/* 1. Introduction */}
        <div className={s.policyCard}>
          <div className={s.cardHeader}>
            <div className={s.cardIconWrap}><FileText size={22} /></div>
            <h2 className={s.cardTitle}>1. Acceptance of Terms</h2>
          </div>
          <div className={s.cardBody}>
            <p>
              Welcome to <strong>{BRAND.name}</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;). By visiting our website, browsing our catalog, or placing an order, you agree to be bound by these Terms and Conditions and our associated policies (including our Privacy Policy, Shipping Policy, and Return Policy).
            </p>
            <p>
              If you do not agree with any part of these terms, please do not use our services. We reserve the right to revise these terms from time to time; updates take effect upon posting to this page.
            </p>
          </div>
        </div>

        {/* 2. Nature of Handmade & Artisan Goods */}
        <div className={s.policyCard}>
          <div className={s.cardHeader}>
            <div className={s.cardIconWrap}><Sparkles size={22} /></div>
            <h2 className={s.cardTitle}>2. Handcrafted & Artisan Nature Disclaimer</h2>
          </div>
          <div className={s.cardBody}>
            <div className={s.callout}>
              <Sparkles size={20} className={s.calloutIcon} />
              <div className={s.calloutContent}>
                <p className={s.calloutTitle}>Handmade Signatures vs Factory Defects</p>
                <p>
                  Every product listed on CraftiNiya is created by hand or in small artisan batches. Because of the materials used (natural timber, real dried botanicals, hand-poured resin, soy wax, and clay), minor variations in wood grain, color gradients, resin flow swirls, and tiny micro-bubbles are natural artistic signatures and will not be deemed defects.
                </p>
              </div>
            </div>
            <p>
              Product photographs are taken in natural daylight. Slight hue differences may occur depending on screen calibration, lighting conditions, and ambient temperature during resin curing.
            </p>
          </div>
        </div>

        {/* 3. Pricing, Taxes & Orders */}
        <div className={s.policyCard}>
          <div className={s.cardHeader}>
            <div className={s.cardIconWrap}><Scale size={22} /></div>
            <h2 className={s.cardTitle}>3. Pricing, GST & Order Acceptance</h2>
          </div>
          <div className={s.cardBody}>
            <ul className={s.bulletList}>
              <li>
                <strong>Currency & Taxes:</strong> All prices are displayed in Indian National Rupees (INR / ₹) and are inclusive of Goods and Services Tax (GST) unless explicitly indicated otherwise.
              </li>
              <li>
                <strong>Order Confirmation:</strong> An order confirmation email and SMS signifies that your request has been logged. We reserve the right to cancel or limit orders if an item is out of stock, if pricing was misstated due to technical errors, or if custom specifications cannot be safely fulfilled.
              </li>
              <li>
                <strong>Personalized & Custom Commissions:</strong> Work begins on custom orders (e.g., custom nameplates, resin keepsakes) once full payment is verified.
              </li>
            </ul>
          </div>
        </div>

        {/* 4. Order Cancellations */}
        <div className={s.policyCard}>
          <div className={s.cardHeader}>
            <div className={s.cardIconWrap}><RefreshCw size={22} /></div>
            <h2 className={s.cardTitle}>4. Order Cancellations</h2>
          </div>
          <div className={s.cardBody}>
            <p>
              Standard orders may be cancelled within <strong>12 hours</strong> of placement by contacting customer support, provided crafting or dispatch has not commenced.
            </p>
            <div className={s.alert}>
              <ShieldAlert size={20} className={s.alertIcon} />
              <div>
                <strong>Custom Orders Cancellation:</strong> Once personalized pieces enter the preparation, cutting, or casting phase (after 12 hours), cancellations cannot be accepted as materials have been tailored irreversibly to your brief.
              </div>
            </div>
          </div>
        </div>

        {/* 5. Intellectual Property & Governing Law */}
        <div className={s.policyCard}>
          <div className={s.cardHeader}>
            <div className={s.cardIconWrap}><Scale size={22} /></div>
            <h2 className={s.cardTitle}>5. Intellectual Property & Governing Law</h2>
          </div>
          <div className={s.cardBody}>
            <p>
              All product designs, visual brand assets, studio photography, copy, and logo graphics are the proprietary intellectual property of CraftiNiya and its contributing partner artisans. Unauthorized reproduction, scraping, or commercial exploitation is strictly prohibited under the Copyright Act, 1957.
            </p>
            <p>
              Any disputes arising from transactions on this website shall be governed by the laws of India and subject to the exclusive jurisdiction of the courts in Jaipur, Rajasthan.
            </p>
          </div>
        </div>
      </div>
    </SupportLayout>
  );
}
