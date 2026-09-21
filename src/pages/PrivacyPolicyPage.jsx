import { ShieldCheck, Lock, Eye, Database, Bell } from "lucide-react";
import SupportLayout from "../components/support/SupportLayout.jsx";
import { BRAND } from "../config/site.js";
import s from "./PolicyPages.module.css";

export default function PrivacyPolicyPage() {
  return (
    <SupportLayout
      title="Privacy Policy"
      subtitle="How we respect, protect, and safeguard your personal data and privacy when you shop with us."
      badge="Security & Privacy"
      seoTitle="Privacy Policy — Craftiniya"
      seoDescription="Read Craftiniya's Privacy Policy regarding data collection, secure 256-bit payment gateways, cookies, and personal data protection in India."
    >
      <div className={s.policyContainer}>
        <div className={s.lastUpdatedBar}>
          <span className={s.lastUpdatedText}>
            Last updated: <strong>September 2026</strong>
          </span>
          <span>Compliance: <strong>Digital Personal Data Protection (DPDP) Act, India</strong></span>
        </div>

        {/* 1. Commitment to Privacy */}
        <div className={s.policyCard}>
          <div className={s.cardHeader}>
            <div className={s.cardIconWrap}><ShieldCheck size={22} /></div>
            <h2 className={s.cardTitle}>1. Our Commitment to Your Privacy</h2>
          </div>
          <div className={s.cardBody}>
            <p>
              At <strong>{BRAND.name}</strong>, we consider the privacy of our customers paramount. We will never sell, rent, or trade your personal information to any third party for marketing purposes.
            </p>
            <div className={s.callout}>
              <Lock size={20} className={s.calloutIcon} />
              <div className={s.calloutContent}>
                <p className={s.calloutTitle}>Strict 256-bit Bank-Grade Payment Security</p>
                <p>
                  We do not store your credit card numbers, debit card PINs, CVV, or UPI security pins on our servers. All transactions are securely routed through RBI-authorized, PCI-DSS Level 1 compliant payment gateways (such as Razorpay).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Information We Collect */}
        <div className={s.policyCard}>
          <div className={s.cardHeader}>
            <div className={s.cardIconWrap}><Database size={22} /></div>
            <h2 className={s.cardTitle}>2. Information We Collect</h2>
          </div>
          <div className={s.cardBody}>
            <p>
              When you purchase or interact with our website, we only collect information essential for fulfilling your orders and improving your artisan experience:
            </p>
            <ul className={s.bulletList}>
              <li>
                <strong>Contact & Delivery Details:</strong> Your full name, shipping and billing address, email address, and phone number (required for courier doorstep delivery and delivery OTPs).
              </li>
              <li>
                <strong>Order Specifications:</strong> Custom inscriptions, names, photos, or personalized text provided for hand-made commissions.
              </li>
              <li>
                <strong>Technical Information:</strong> IP address, device type, browser settings, and anonymous interaction analytics collected to ensure rapid page load speeds and prevent fraudulent transactions.
              </li>
            </ul>
          </div>
        </div>

        {/* 3. How We Use Your Data */}
        <div className={s.policyCard}>
          <div className={s.cardHeader}>
            <div className={s.cardIconWrap}><Eye size={22} /></div>
            <h2 className={s.cardTitle}>3. How We Use Your Information</h2>
          </div>
          <div className={s.cardBody}>
            <ul className={s.bulletList}>
              <li>To handcraft, pack, and ship your ordered products to your doorstep.</li>
              <li>To send order tracking alerts via SMS and email.</li>
              <li>To provide human customer support and resolve any queries regarding returns or custom briefs.</li>
              <li>To notify you of new artisan collection drops (only if you opted in to our newsletter). You can unsubscribe anytime with one click.</li>
            </ul>
          </div>
        </div>

        {/* 4. Cookies & Tracking */}
        <div className={s.policyCard}>
          <div className={s.cardHeader}>
            <div className={s.cardIconWrap}><Bell size={22} /></div>
            <h2 className={s.cardTitle}>4. Cookies & Session Storage</h2>
          </div>
          <div className={s.cardBody}>
            <p>
              We use functional cookies to remember items in your cart, maintain your wishlist, and keep you signed in smoothly. You can disable cookies through your browser settings, though doing so may limit your shopping experience on our website.
            </p>
          </div>
        </div>

        {/* 5. Contact the Privacy Officer */}
        <div className={s.policyCard}>
          <div className={s.cardHeader}>
            <div className={s.cardIconWrap}><Lock size={22} /></div>
            <h2 className={s.cardTitle}>5. Your Rights & Contact</h2>
          </div>
          <div className={s.cardBody}>
            <p>
              You have the right to request access to the personal data we hold about you, request corrections, or request deletion of your account. For any privacy-related requests, please contact our Data Protection Officer at:
            </p>
            <p>
              <strong>Email:</strong> <a href={`mailto:${BRAND.email}`} style={{ color: "var(--c-brand)", fontWeight: 600 }}>{BRAND.email}</a>
              <br />
              <strong>Address:</strong> Craftiniya Design Studio, Jaipur, Rajasthan, 302001, India.
            </p>
          </div>
        </div>
      </div>
    </SupportLayout>
  );
}
