import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "../../components/ui/Bits.jsx";
import { Skeleton } from "../../components/ui/Feedback.jsx";
import { useAsync } from "../../hooks/useAsync.js";
import promoService from "../../services/promoService.js";
import s from "./BudgetTiers.module.css";

/**
 * Budget Gifting Carts / Stalls
 *
 * Designed like artisan market carts with striped canopy, sign board,
 * wheels, and direct filter links into the shop catalog.
 * Desktop: Clean 4-column grid.
 * Mobile & Tablet: Auto-scrolling train rail.
 */
export default function BudgetTiers() {
  const { data: tiers, loading } = useAsync((opts) => promoService.getBudgetTiers(opts), []);

  const visible = (tiers ?? []).filter((t) => t.productCount > 0).slice(0, 4);

  if (!loading && !visible.length) return null;

  return (
    <section className={s.section}>
      <div className="container">
        <SectionHeading
          eyebrow="Gifting by budget"
          title="Find the perfect gift for every price point !"
        />

        {/* Desktop View: Clean 4-Column Grid */}
        <div className={s.desktopGrid}>
          {loading
            ? Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className={s.skeleton} />
            ))
            : visible.map((tier) => (
              <CartItem key={tier.id} tier={tier} />
            ))}
        </div>

        {/* Mobile & Tablet View: Smooth Auto-Scrolling Train Marquee */}
        {!loading && visible.length > 0 && (
          <div className={s.mobileMarqueeWrapper} role="region" aria-label="Budget gifting stalls">
            <div className={s.mobileTrack}>
              {[...visible, ...visible, ...visible].map((tier, idx) => (
                <div key={`${tier.id}-${idx}`} className={s.mobileCartSlide}>
                  <CartItem tier={tier} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function CartItem({ tier }) {
  return (
    <Link
      to={`/budget-gifting?tier=${tier.id}`}
      className={s.cart}
      title={`Shop gifts ${tier.label}`}
    >
      {/* Top: Striped Market Stall Awning / Canopy */}
      <div className={s.awning}>
        <div className={s.stripes}>
          <span className={s.stripe} />
          <span className={s.stripe} />
          <span className={s.stripe} />
          <span className={s.stripe} />
          <span className={s.stripe} />
          <span className={s.stripe} />
          <span className={s.stripe} />
        </div>
        {/* Wavy scalloped hem */}
        <div className={s.valance}>
          <span className={s.scallop} />
          <span className={s.scallop} />
          <span className={s.scallop} />
          <span className={s.scallop} />
          <span className={s.scallop} />
          <span className={s.scallop} />
          <span className={s.scallop} />
        </div>
      </div>

      {/* Middle: Signboard Frame with Category & Price */}
      <div className={s.board}>
        <span className={s.tag}>{tier.tag}</span>
        <h3 className={s.label}>{tier.label}</h3>
      </div>

      {/* Counter Table Shelf */}
      <div className={s.counterShelf} />

      {/* Bottom: Cart Chassis with Wheel Axle & Arrow Pill */}
      <div className={s.cartChassis}>
        {/* Left Wheel */}
        <div className={s.wheel} aria-hidden="true">
          <div className={s.wheelRim}>
            <span className={s.spoke} />
            <span className={s.spoke} />
            <span className={s.spoke} />
            <span className={s.spoke} />
            <span className={s.wheelHub} />
          </div>
        </div>

        {/* Center Action Button */}
        <div className={s.ctaPill} aria-hidden="true">
          <ArrowRight size={14} className={s.ctaArrow} />
        </div>

        {/* Right Wheel */}
        <div className={s.wheel} aria-hidden="true">
          <div className={s.wheelRim}>
            <span className={s.spoke} />
            <span className={s.spoke} />
            <span className={s.spoke} />
            <span className={s.spoke} />
            <span className={s.wheelHub} />
          </div>
        </div>
      </div>

      {/* Ground Shadow */}
      <div className={s.groundShadow} aria-hidden="true" />
    </Link>
  );
}
