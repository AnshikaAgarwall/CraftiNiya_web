import { useSearchParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SEO from "../components/common/SEO.jsx";
import PageHeader from "../components/layout/PageHeader.jsx";
import CatalogView from "../features/catalog/CatalogView.jsx";
import { Skeleton } from "../components/ui/Feedback.jsx";
import { useAsync } from "../hooks/useAsync.js";
import promoService from "../services/promoService.js";
import { cn } from "../lib/cn.js";
import s from "./BudgetGiftingPage.module.css";

/**
 * Budget gifting page.
 *
 * Displays the same artisan market cart / stall design as the homepage.
 * Clicking a stall filters the catalog below to that budget tier.
 * Selected stall stays highlighted with active canopy & brand glow.
 */
export default function BudgetGiftingPage() {
  const [params, setParams] = useSearchParams();
  const { data: tiers, loading } = useAsync((opts) => promoService.getBudgetTiers(opts), []);

  const visible = (tiers ?? []).filter((t) => t.productCount > 0).slice(0, 4);
  const requested = params.get("tier");
  const active = visible.find((t) => t.id === requested) ?? visible[0] ?? null;

  const selectTier = (id) => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("tier", id);
        next.delete("max");
        next.delete("page");
        return next;
      },
      { replace: true },
    );
  };

  return (
    <>
      <SEO
        title="Budget gifting"
        description="Handmade gifts by price — pick a budget and see only what fits it."
      />

      <PageHeader
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Budget gifting" }]}
        eyebrow="Gifting by budget"
        title="Set a number, we will do the rest"
        description="Every piece below is handmade and gift-wrapped as standard."
      >
        <div className={s.cartsRow} role="tablist" aria-label="Budget range">
          {loading
            ? Array.from({ length: 4 }, (_, i) => (
                <Skeleton key={i} className={s.cartSkeleton} />
              ))
            : visible.map((tier) => {
                const isActive = active?.id === tier.id;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => selectTier(tier.id)}
                    className={cn(s.cart, isActive ? s.cartActive : s.cartDim)}
                    title={`Filter by ${tier.label}`}
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
                      {/* Scalloped valance hem */}
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
                        <ArrowRight size={13} className={s.ctaArrow} />
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
                  </button>
                );
              })}
        </div>
      </PageHeader>

      {active && (
        <CatalogView
          key={active.id}
          scope={{
            priceMinMinor: active.minMinor ?? undefined,
            priceMaxMinor: active.maxMinor ?? undefined,
          }}
          emptyTitle={`Nothing under ${active.label.replace(/^Under /, "")} matches`}
          emptyMessage="Try another budget, or clear the extra filters."
        />
      )}
    </>
  );
}
