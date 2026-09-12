import { Sparkles } from "lucide-react";
import Button from "../../components/ui/Button.jsx";
import { useAsync } from "../../hooks/useAsync.js";
import { useCountdown } from "../../hooks/useCountdown.js";
import promoService from "../../services/promoService.js";
import s from "./CountdownBanner.module.css";

/**
 * Festival countdown.
 *
 * Driven entirely by promoService, so switching a sale on or off is data, not
 * a deploy. Three details that matter:
 *
 *  - When no promotion is running the component renders NOTHING — not an empty
 *    shell. A banner that reserves height while invisible pushes the page down
 *    and shows up as layout shift.
 *  - The deadline is a UTC instant, formatted in the viewer's own zone. A bare
 *    "ends 11:59 PM" is wrong for every customer outside IST.
 *  - The clock runs off a server-time offset, because a device whose system
 *    clock is wrong would otherwise show a wrong timer, or a live sale as
 *    already expired.
 *
 * The one-second tick lives in this component alone, so the rest of the home
 * page is not re-rendered every second.
 */
export default function CountdownBanner() {
  const { data: promo } = useAsync((opts) => promoService.getActivePromotion(opts), []);
  const { data: serverTime } = useAsync((opts) => promoService.getServerTime(opts), []);

  const { days, hours, minutes, seconds, isExpired } = useCountdown(
    promo?.endsAt,
    serverTime?.nowIso,
  );

  if (!promo || isExpired) return null;

  const endsLocal = promo.endsAt
    ? new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(promo.endsAt))
    : null;

  const units = [
    { value: days, label: days === 1 ? "Day" : "Days" },
    { value: hours, label: "Hours" },
    { value: minutes, label: "Mins" },
    { value: seconds, label: "Secs" },
  ];

  return (
    <section className={s.banner} aria-labelledby="countdown-heading">
      <div className={`container ${s.inner}`}>
        <div className={s.copy}>
          <p className={s.label}>
            <Sparkles aria-hidden="true" />
            {promo.label}
          </p>
          <h2 id="countdown-heading" className={s.headline}>
            {promo.headline}
          </h2>
          {promo.subline && <p className={s.subline}>{promo.subline}</p>}
        </div>

        <div className={s.timerBlock}>
          {/* The live region is polite and coarse: announcing every second
              would make a screen reader unusable. */}
          <p className="sr-only" aria-live="polite">
            {days} days and {hours} hours left in this sale.
          </p>

          <ul className={s.timer} aria-hidden="true">
            {units.map((unit) => (
              <li key={unit.label} className={s.unit}>
                <span className={s.unitValue}>
                  {String(unit.value).padStart(2, "0")}
                </span>
                <span className={s.unitLabel}>{unit.label}</span>
              </li>
            ))}
          </ul>

          {endsLocal && <p className={s.ends}>Ends {endsLocal}</p>}

          <Button to={promo.ctaHref} variant="accent" size="lg" className={s.cta}>
            {promo.ctaLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}
