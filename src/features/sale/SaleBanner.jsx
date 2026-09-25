import { useState } from "react";
import { Check, Copy, Tag } from "lucide-react";
import { useAsync } from "../../hooks/useAsync.js";
import { useCountdown } from "../../hooks/useCountdown.js";
import promoService from "../../services/promoService.js";
import { cn } from "../../lib/cn.js";
import s from "./SaleBanner.module.css";

const BANNER_IMAGE =
  "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1200&q=85";

export default function SaleBanner() {
  const [copied, setCopied] = useState(false);

  const { data: promo } = useAsync(
    (opts) => promoService.getActivePromotion(opts),
    [],
  );
  const { data: serverTime } = useAsync(
    (opts) => promoService.getServerTime(opts),
    [],
  );

  const { days, hours, minutes, seconds, isExpired } = useCountdown(
    promo?.endsAt,
    serverTime?.nowIso,
  );

  const handleCopy = () => {
    const code = promo?.couponCode || "FESTIVE40";
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className={s.banner} aria-label="Festive Sale">
      <div className={`container ${s.layout}`}>
        <div className={s.content}>
          <p className={s.kicker}>
            Festive Studio Archive &bull; Up to 40% Off
          </p>

          <h1 className={s.title}>
            {promo?.headline || "Curated handmade pieces, thoughtfully discounted."}
          </h1>

          <p className={s.description}>
            {promo?.subline && promo.subline.trim().toLowerCase() !== "shop now"
              ? promo.subline
              : "Hand-poured soy wax candles, dried botanical resin art, and keepsake gift boxes crafted in small studio batches."}
          </p>

          <div className={s.metaRow}>
            {/* Minimalist Countdown */}
            {!isExpired && (
              <div className={s.countdownGroup}>
                <span className={s.metaLabel}>Ending in</span>
                <span className={s.countdownValue}>
                  {String(days).padStart(2, "0")}d : {String(hours).padStart(2, "0")}h : {String(minutes).padStart(2, "0")}m : {String(seconds).padStart(2, "0")}s
                </span>
              </div>
            )}

            {/* Elevated Boutique Coupon Card */}
            <div
              className={cn(s.voucherCard, copied && s.voucherCopied)}
              onClick={handleCopy}
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                (e.key === "Enter" || e.key === " ") && handleCopy()
              }
              title="Click to copy coupon code"
              aria-label="Copy festive discount coupon code"
            >
              <div className={s.voucherLeft}>
                <div className={s.voucherTag}>
                  <Tag size={11} className={s.voucherTagIcon} />
                  <span>FESTIVE VOUCHER</span>
                </div>
                <div className={s.voucherCodeRow}>
                  <code className={s.voucherCode}>
                    {promo?.couponCode || "FESTIVE40"}
                  </code>
                  <span className={s.voucherOffer}>Extra 10% Off</span>
                </div>
              </div>

              <div className={s.voucherDivider} aria-hidden="true" />

              <div className={s.voucherRight}>
                <span className={s.voucherActionBtn}>
                  {copied ? (
                    <>
                      <Check size={13} className={s.checkIcon} />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      <span>Copy</span>
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Clean, pure visual without badges or stickers */}
        <div className={s.mediaWrap}>
          <img
            src={BANNER_IMAGE}
            alt="Handcrafted Festive Studio Pieces"
            className={s.image}
            loading="eager"
          />
        </div>
      </div>
    </header>
  );
}
