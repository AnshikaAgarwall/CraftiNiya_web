import { Gift } from "lucide-react";
import Button from "../../components/ui/Button.jsx";
import s from "./CountdownBanner.module.css";

/**
 * Build-your-own gift box banner.
 *
 * This slot used to hold the festival countdown; it now carries the gift box
 * entry point that previously lived in the primary navigation. The layout is
 * unchanged — copy on the left, a compact tile row plus CTA on the right — so
 * the four timer tiles simply became the four steps of the builder.
 *
 * It renders unconditionally: unlike a sale, the builder is always available,
 * so there is no empty-state to guard against.
 */
const STEPS = [
  { value: "01", label: "Pick Box" },
  { value: "02", label: "Add Gifts" },
  { value: "03", label: "Personalise" },
  { value: "04", label: "We Ship" },
];

export default function CountdownBanner() {
  return (
    <section className={s.banner} aria-labelledby="giftbox-banner-heading">
      <div className={`container ${s.inner}`}>
        <div className={s.copy}>
          <p className={s.label}>
            <Gift aria-hidden="true" />
            Build Your Own
          </p>
          <h2 id="giftbox-banner-heading" className={s.headline}>
            Curate a gift box, exactly the way you want it
          </h2>
          <p className={s.subline}>
            Choose a box, fill it with handpicked treats, add a note — we wrap
            and deliver.
          </p>
        </div>

        <div className={s.timerBlock}>
          <ul className={s.timer}>
            {STEPS.map((step) => (
              <li key={step.label} className={s.unit}>
                <span className={s.unitValue}>{step.value}</span>
                <span className={s.unitLabel}>{step.label}</span>
              </li>
            ))}
          </ul>

          <p className={s.ends}>Starting at ₹499 · Ready in 2 days</p>

          <Button to="/gift-box" variant="accent" size="sm" className={s.cta}>
            Start Building
          </Button>
        </div>
      </div>
    </section>
  );
}
