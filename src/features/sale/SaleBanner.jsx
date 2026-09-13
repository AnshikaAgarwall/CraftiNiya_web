import { useState } from "react";
import { Check, Copy, Flame, Gift, Sparkles, Tag, Timer } from "lucide-react";
import { useAsync } from "../../hooks/useAsync.js";
import { useCountdown } from "../../hooks/useCountdown.js";
import promoService from "../../services/promoService.js";
import s from "./SaleBanner.module.css";

const BANNER_IMAGE =
  "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1200&q=85";

export default function SaleBanner() {
  const [copied, setCopied] = useState(false);

  const { data: promo } = useAsync((opts) => promoService.getActivePromotion(opts), []);
  const { data: serverTime } = useAsync((opts) => promoService.getServerTime(opts), []);

  const { days, hours, minutes, seconds, isExpired } = useCountdown(
    promo?.endsAt,
    serverTime?.nowIso,
  );

  const handleCopy = () => {
    const code = promo?.couponCode || "FESTIVE40";
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <section className={s.banner} aria-label="Festive Sale Highlights">
      <div className={`container ${s.grid}`}>
        {/* Left Column: Promotion Details & Offer */}
        <div className={s.copyCol}>
          <div className={s.tagRow}>
            <span className={s.liveTag}>
              <Flame size={14} className={s.flame} />
              LIMITED TIME SALE
            </span>
            <span className={s.discountPill}>UP TO 40% OFF</span>
          </div>

          <h1 className={s.title}>
            {promo?.headline || "Festive Sale — Up to 40% Off Handmade Gifting"}
          </h1>

          <p className={s.subtitle}>
            {promo?.subline ||
              "Artisanal soy candles, floral resin art & keepsake gift boxes. Hand-poured in small studio batches — when they sell out, they're gone."}
          </p>

          {/* Action Row: Timer & Coupon */}
          <div className={s.actionRow}>
            {/* Live Countdown Box */}
            {!isExpired && (
              <div className={s.timerCard}>
                <div className={s.timerHead}>
                  <Timer size={14} className={s.timerIcon} />
                  <span>SALE ENDS IN:</span>
                </div>
                <div className={s.timerUnits}>
                  <div className={s.unit}>
                    <strong>{String(days).padStart(2, "0")}</strong>
                    <span>Days</span>
                  </div>
                  <span className={s.sep}>:</span>
                  <div className={s.unit}>
                    <strong>{String(hours).padStart(2, "0")}</strong>
                    <span>Hours</span>
                  </div>
                  <span className={s.sep}>:</span>
                  <div className={s.unit}>
                    <strong>{String(minutes).padStart(2, "0")}</strong>
                    <span>Mins</span>
                  </div>
                  <span className={s.sep}>:</span>
                  <div className={s.unit}>
                    <strong>{String(seconds).padStart(2, "0")}</strong>
                    <span>Secs</span>
                  </div>
                </div>
              </div>
            )}

            {/* Coupon Code Pill */}
            <div className={s.couponCard}>
              <div className={s.couponHead}>
                <Tag size={13} />
                <span>EXTRA FESTIVE DISCOUNT:</span>
              </div>
              <div className={s.couponAction} onClick={handleCopy}>
                <span className={s.codeText}>
                  {promo?.couponCode || "FESTIVE40"}
                </span>
                <button
                  type="button"
                  className={s.copyButton}
                  onClick={handleCopy}
                  title="Copy coupon code"
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copied ? "Copied!" : "Copy"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Highlights Bar */}
          <div className={s.featuresRow}>
            <div className={s.feature}>
              <Gift size={15} />
              <span>Free Gift above ₹1,499</span>
            </div>
            <div className={s.dotSep}>•</div>
            <div className={s.feature}>
              <Sparkles size={15} />
              <span>Pure Soy Wax & Botanicals</span>
            </div>
            <div className={s.dotSep}>•</div>
            <div className={s.feature}>
              <span>Direct Studio Hand-Pouring</span>
            </div>
          </div>
        </div>

        {/* Right Column: 100% Clear, Vibrant Photo (Zero Black Shadow!) */}
        <div className={s.photoCol}>
          <div className={s.photoFrame}>
            <img
              src={BANNER_IMAGE}
              alt="Festive Handcrafted Studio Sale"
              className={s.photoImg}
            />
            <div className={s.photoBadge}>
              <span>Handcrafted In Jaipur</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
