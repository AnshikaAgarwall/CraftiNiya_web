import { Sparkles, Tag, Gift, Heart } from "lucide-react";
import s from "./AnnouncementTicker.module.css";

const TICKER_ITEMS = [
  { text: "FLAT 10% OFF ON FIRST ORDER", icon: Tag },
  { text: "PERFECT GIFT PARTNER", icon: Heart },
  { text: "NIYA CREATIONS", icon: Sparkles },
  { text: "CUSTOMIZE YOUR GIFTS", icon: Gift },
  { text: "HANDCRAFTED WITH LOVE", icon: Heart },
  { text: "PAN-INDIA DISPATCH IN 24H", icon: Sparkles },
];

export default function AnnouncementTicker() {
  return (
    <div className={s.tickerWrapper} role="region" aria-label="Announcement ticker">
      <div className={s.track}>
        {/* Double the list to create a seamless infinite CSS loop */}
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className={s.item}>
              <Icon size={11} className={s.icon} aria-hidden="true" />
              <span className={s.text}>{item.text}</span>
              <span className={s.dot} aria-hidden="true">•</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
