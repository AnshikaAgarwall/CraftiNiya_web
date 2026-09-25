import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, ChevronRight } from "lucide-react";
import s from "./TopPromoBanner.module.css";

const TICKER_ITEMS = [
  {
    id: "festive-sale",
    badge: "Festive Sale",
    text: "Festive Sale — Up to 40% Off Handcrafted Gifting",
    cta: "Shop Sale",
    link: "/sale",
  },
  {
    id: "partner-picks",
    badge: "Partner Picks",
    text: "Find Partner Picks — Handpicked Heritage Art & Décor",
    cta: "Explore",
    link: "/partner-picks",
  },
  {
    id: "collab-rangsajja",
    badge: "Collaboration",
    text: "CraftiNiya x RangSajja — Limited Festive Edition",
    cta: "Discover",
    link: "/collaboration/rangsajja",
  },
];

export default function TopPromoBanner() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem("craftiniya:promo_ticker_dismissed") === "true";
    } catch {
      return false;
    }
  });

  // Cycle along Y-axis every 3.8 seconds
  useEffect(() => {
    if (dismissed) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % TICKER_ITEMS.length);
    }, 3800);

    return () => clearInterval(interval);
  }, [dismissed]);

  if (dismissed) {
    return null;
  }

  const currentItem = TICKER_ITEMS[activeIndex];

  const handleDismiss = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDismissed(true);
    try {
      sessionStorage.setItem("craftiniya:promo_ticker_dismissed", "true");
    } catch {
      // ignore
    }
  };

  const handleItemClick = () => {
    if (currentItem?.link) {
      navigate(currentItem.link);
    }
  };

  return (
    <aside
      role="complementary"
      aria-label="Promotional announcement ticker"
      className={s.banner}
      onClick={handleItemClick}
    >
      <div className={s.trackWrapper}>
        <div key={currentItem.id} className={s.tickerItem}>
          <span className={s.text}>{currentItem.text}</span>
          <span className={s.ctaLink}>
            <span>{currentItem.cta}</span>
            <ChevronRight size={13} aria-hidden="true" />
          </span>
        </div>
      </div>

      {/* Dismiss All (X) button */}
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss all announcements"
        className={s.closeBtn}
      >
        <X size={14} />
      </button>
    </aside>
  );
}
