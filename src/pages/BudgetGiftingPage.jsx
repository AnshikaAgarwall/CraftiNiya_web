import { useSearchParams } from "react-router-dom";
import { Gift, Heart, Package, Sparkles } from "lucide-react";
import SEO from "../components/common/SEO.jsx";
import PageHeader from "../components/layout/PageHeader.jsx";
import CatalogView from "../features/catalog/CatalogView.jsx";
import { Skeleton } from "../components/ui/Feedback.jsx";
import { useAsync } from "../hooks/useAsync.js";
import promoService from "../services/promoService.js";
import { cn } from "../lib/cn.js";
import { pluralize } from "../lib/format.js";
import s from "./BudgetGiftingPage.module.css";

/**
 * Budget gifting.
 *
 * The selected tier stays highlighted while the others dim, per the brief.
 * Selection lives in the URL (?tier=), so a tier is shareable and the back
 * button steps between them.
 *
 * Tiers with no stock behind them are not rendered at all — a card that leads
 * to an empty grid is worse than one fewer option.
 */

const ICONS = [Heart, Gift, Package, Sparkles];

export default function BudgetGiftingPage() {
  const [params, setParams] = useSearchParams();
  const { data: tiers, loading } = useAsync((opts) => promoService.getBudgetTiers(opts), []);

  const visible = (tiers ?? []).filter((t) => t.productCount > 0);
  const requested = params.get("tier");
  const active = visible.find((t) => t.id === requested) ?? visible[0] ?? null;

  const selectTier = (id) => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("tier", id);
        // Changing the ceiling invalidates any price filter set under the old one.
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
        <div className={s.tiers} role="tablist" aria-label="Budget range">
          {loading
            ? Array.from({ length: 4 }, (_, i) => (
                <Skeleton key={i} className={s.tierSkeleton} />
              ))
            : visible.map((tier, i) => {
                const Icon = ICONS[i % ICONS.length];
                const isActive = active?.id === tier.id;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => selectTier(tier.id)}
                    className={cn(s.tier, isActive ? s.tierActive : s.tierDim)}
                  >
                    <span className={s.tierIcon} aria-hidden="true">
                      <Icon />
                    </span>
                    <span className={s.tierTag}>{tier.tag}</span>
                    <span className={s.tierLabel}>{tier.label}</span>
                    <span className={s.tierCount}>
                      {pluralize(tier.productCount, "piece")}
                    </span>
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
