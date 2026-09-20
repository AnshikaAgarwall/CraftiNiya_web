import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Check, Copy, Sparkles, Tag, X } from "lucide-react";
import { useAsync } from "../../hooks/useAsync.js";
import { useCountdown } from "../../hooks/useCountdown.js";
import promoService from "../../services/promoService.js";
import s from "./TopPromoBanner.module.css";

export default function TopPromoBanner() {
  const navigate = useNavigate();
  const location = useLocation();

  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem("craftiniya:sale_banner_dismissed") === "true";
    } catch {
      return false;
    }
  });

  const [copied, setCopied] = useState(false);

  const { data: promo } = useAsync((opts) => promoService.getActivePromotion(opts), []);
  const { data: serverTime } = useAsync((opts) => promoService.getServerTime(opts), []);

  const { days, hours, minutes, seconds, isExpired } = useCountdown(
    promo?.endsAt,
    serverTime?.nowIso,
  );

  // If dismissed, expired, no promo, or already on /sale page, don't show
  if (dismissed || !promo || isExpired || location.pathname === "/sale") {
    return null;
  }

  const handleDismiss = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDismissed(true);
    try {
      sessionStorage.setItem("craftiniya:sale_banner_dismissed", "true");
    } catch {
      // ignore
    }
  };

  const handleCopyCode = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const code = promo.couponCode || "FESTIVE40";
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBannerClick = () => {
    navigate(promo.ctaHref || "/sale");
  };

  return (
    <aside
      role="complementary"
      aria-label="Promotional announcement"
      onClick={handleBannerClick}
      className={s.banner}
    >
      <div className={s.inner}>
        {/* Headline / Offer text */}
        <span className={s.headline}>
          {promo.headline || "Festive Sale — Up to 40% Off Handmade Gifting"}
        </span>

        {/* Timer & Coupon grouped side-by-side on 2nd line */}
        <div className={s.group}>
          {/* Simple plain-text countdown */}
          <span className={s.timer}>
            <Sparkles size={11} color="#b45309" aria-hidden="true" />
            <span className={s.timerLabel}>Ends in:</span>
            <strong className={s.timerValues}>
              {String(days).padStart(2, "0")}d {String(hours).padStart(2, "0")}h{" "}
              {String(minutes).padStart(2, "0")}m {String(seconds).padStart(2, "0")}s
            </strong>
          </span>

          <span className={s.divider} aria-hidden="true">
            •
          </span>

          {/* Coupon Code Pill */}
          <button
            type="button"
            onClick={handleCopyCode}
            title="Click to copy coupon code"
            className={s.couponBtn}
          >
            <Tag size={11} color="#b45309" />
            <span className={s.couponCode}>
              {promo.couponCode || "FESTIVE40"}
            </span>
            {copied ? <Check size={11} color="#15803d" /> : <Copy size={11} color="#6b7280" />}
            <span className={copied ? s.copiedLabel : s.copyLabel}>
              {copied ? "Copied" : "Copy"}
            </span>
          </button>
        </div>
      </div>

      {/* Dismiss (X) button */}
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss sale banner"
        className={s.closeBtn}
      >
        <X size={14} />
      </button>
    </aside>
  );
}
