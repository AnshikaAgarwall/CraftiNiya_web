import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Check, Copy, Flame, Sparkles, Tag, X } from "lucide-react";
import { useAsync } from "../../hooks/useAsync.js";
import { useCountdown } from "../../hooks/useCountdown.js";
import promoService from "../../services/promoService.js";
import s from "./SalePopup.module.css";

const POSTER_IMAGE =
  "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1200&q=85";

export default function SalePopup() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const { data: promo } = useAsync((opts) => promoService.getActivePromotion(opts), []);
  const { data: serverTime } = useAsync((opts) => promoService.getServerTime(opts), []);

  const { days, hours, minutes, seconds, isExpired } = useCountdown(
    promo?.endsAt,
    serverTime?.nowIso,
  );

  useEffect(() => {
    // If user is currently on the /sale page, don't show the popup
    if (location.pathname === "/sale") return;

    // Check if user already dismissed in this browsing session
    const isDismissed = sessionStorage.getItem("craftiniya:sale_popup_dismissed");
    if (isDismissed) return;

    // Trigger after exactly 5 seconds
    const timer = setTimeout(() => {
      if (window.location.pathname !== "/sale") {
        setIsOpen(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Close when user clicks cross button
  const handleClose = (e) => {
    e?.stopPropagation();
    setIsOpen(false);
    sessionStorage.setItem("craftiniya:sale_popup_dismissed", "true");
  };

  // Navigate to sale page on clicking poster or CTA
  const handleGoToSale = () => {
    setIsOpen(false);
    navigate("/sale");
  };

  const handleCopyCode = (e) => {
    e?.stopPropagation();
    const code = promo?.couponCode || "FESTIVE40";
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen || !promo || isExpired) return null;

  return (
    <div className={s.overlay} onClick={handleClose} role="dialog" aria-modal="true">
      <div className={s.dialog} onClick={(e) => e.stopPropagation()}>
        {/* Floating Cross Button */}
        <button
          type="button"
          className={s.closeButton}
          onClick={handleClose}
          aria-label="Close sale poster"
        >
          <X size={18} />
        </button>

        {/* Poster Card — 100% visible clear photo with zero black shadow */}
        <div className={s.poster} onClick={handleGoToSale}>
          {/* Top: 100% Clear & Vibrant Photo */}
          <div className={s.imageContainer}>
            <img
              src={POSTER_IMAGE}
              alt="Festive Handcrafted Studio Sale"
              className={s.posterImg}
            />
            <div className={s.imageBadgeRow}>
              <span className={s.liveBadge}>
                <Flame size={13} className={s.flameIcon} />
                LIVE FESTIVE SALE
              </span>
              <span className={s.discountBadge}>UP TO 40% OFF</span>
            </div>
          </div>

          {/* Bottom: Clean Boutique Content Body */}
          <div className={s.content}>
            <h2 className={s.headline}>
              {promo.headline || "Festive Sale — Up to 40% Off Handmade Gifting"}
            </h2>

            <p className={s.subline}>
              {promo.subline ||
                "Handcrafted soy candles, resin botanical art & custom gift hampers."}
            </p>

            {/* Countdown timer strip */}
            <div className={s.timerContainer}>
              <div className={s.timerTitle}>
                <Sparkles size={12} />
                <span>OFFER ENDS IN:</span>
              </div>
              <div className={s.timerBlocks}>
                <div className={s.timerUnit}>
                  <strong>{String(days).padStart(2, "0")}</strong>
                  <span>Days</span>
                </div>
                <span className={s.timerColon}>:</span>
                <div className={s.timerUnit}>
                  <strong>{String(hours).padStart(2, "0")}</strong>
                  <span>Hours</span>
                </div>
                <span className={s.timerColon}>:</span>
                <div className={s.timerUnit}>
                  <strong>{String(minutes).padStart(2, "0")}</strong>
                  <span>Mins</span>
                </div>
                <span className={s.timerColon}>:</span>
                <div className={s.timerUnit}>
                  <strong>{String(seconds).padStart(2, "0")}</strong>
                  <span>Secs</span>
                </div>
              </div>
            </div>

            {/* Coupon Code Pill */}
            <div className={s.couponRow} onClick={(e) => e.stopPropagation()}>
              <div className={s.couponBox} onClick={handleCopyCode}>
                <Tag size={13} className={s.tagIcon} />
                <span className={s.couponLabel}>CODE:</span>
                <strong className={s.couponCode}>
                  {promo.couponCode || "FESTIVE40"}
                </strong>
                <button
                  type="button"
                  className={s.copyBtn}
                  onClick={handleCopyCode}
                  title="Copy Code"
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>

            {/* CTA Button */}
            <button
              type="button"
              className={s.ctaBtn}
              onClick={handleGoToSale}
            >
              <span>Explore The Sale</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
