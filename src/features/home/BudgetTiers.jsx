import { Link } from "react-router-dom";
import { ArrowRight, Gift, Heart, Package, Sparkles } from "lucide-react";
import { SectionHeading } from "../../components/ui/Bits.jsx";
import { Skeleton } from "../../components/ui/Feedback.jsx";
import { useAsync } from "../../hooks/useAsync.js";
import promoService from "../../services/promoService.js";
import { pluralize } from "../../lib/format.js";
import s from "./BudgetTiers.module.css";

/**
 * Budget gifting entry points.
 *
 * Tiers come from the dataset, not constants, so their price points can change
 * without a deploy. Any tier with no stock behind it is hidden rather than
 * shown as a card that leads to an empty page — a dead end on a shop front is
 * worse than one fewer option.
 */

const ICONS = [Heart, Gift, Package, Sparkles];

export default function BudgetTiers() {
  const { data: tiers, loading } = useAsync((opts) => promoService.getBudgetTiers(opts), []);

  const visible = (tiers ?? []).filter((t) => t.productCount > 0);

  if (!loading && !visible.length) return null;

  return (
    <section className={s.section}>
      <div className="container">
        <SectionHeading
          eyebrow="Gifting by budget"
          title="Something lovely, whatever you had in mind"
          subtitle="Set a number and we will show you only what fits it."
        />

        <div className={s.grid}>
          {loading
            ? Array.from({ length: 4 }, (_, i) => (
                <Skeleton key={i} className={s.skeleton} />
              ))
            : visible.map((tier, i) => {
                const Icon = ICONS[i % ICONS.length];
                return (
                  <Link
                    key={tier.id}
                    to={`/budget-gifting?tier=${tier.id}`}
                    className={s.card}
                  >
                    <span className={s.icon} aria-hidden="true">
                      <Icon />
                    </span>

                    <span className={s.tag}>{tier.tag}</span>
                    <span className={s.label}>{tier.label}</span>
                    <span className={s.desc}>{tier.description}</span>

                    <span className={s.foot}>
                      <span className={s.count}>
                        {pluralize(tier.productCount, "piece")}
                      </span>
                      <ArrowRight className={s.arrow} aria-hidden="true" />
                    </span>
                  </Link>
                );
              })}
        </div>
      </div>
    </section>
  );
}
