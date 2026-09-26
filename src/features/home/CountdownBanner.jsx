import { useState } from "react";
import { Gift, ArrowRight, Sparkles } from "lucide-react";
import Button from "../../components/ui/Button.jsx";
import s from "./CountdownBanner.module.css";

const BANNER_IMAGE =
  "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=85";

export default function CountdownBanner() {
  const [imgSrc, setImgSrc] = useState(BANNER_IMAGE);

  return (
    <section className={s.banner} aria-labelledby="giftbox-banner-heading">
      <div className="container">
        <div className={s.card}>
          {/* Content Column */}
          <div className={s.contentCol}>
            <div className={s.headerRow}>
              <div className={s.label}>
                <Gift size={12} aria-hidden="true" />
                <span>Build Your Own</span>
              </div>
              <span className={s.priceBadge}>From ₹499</span>
            </div>

            <h2 id="giftbox-banner-heading" className={s.headline}>
              Personalize Your GiftBox
            </h2>

            <div className={s.perksRow}>
              <span className={s.perkItem}>✨ Custom note included</span>
              <span className={s.perkDot}>•</span>
              <span className={s.perkItem}>🌿 Handcrafted pieces</span>
              <span className={s.perkDot}>•</span>
              <span className={s.perkItem}>📦 Ready in 2 days</span>
            </div>

            {/* Action Area */}
            <div className={s.actionArea}>
              <Button
                to="/gift-box"
                variant="accent"
                size="sm"
                className={s.cta}
                endIcon={<ArrowRight size={14} aria-hidden="true" />}
              >
                Start Building Your Box
              </Button>
            </div>
          </div>

          {/* Media Column */}
          <div className={s.mediaCol}>
            <div className={s.imageCard}>
              <img
                src={imgSrc}
                alt="Artisanal Handcrafted Gift Box with Scented Candle and Floral Resin Coaster"
                className={s.image}
                loading="lazy"
                onError={() => setImgSrc(BANNER_IMAGE)}
              />
              <div className={s.imageBadge}>
                <Sparkles size={11} aria-hidden="true" />
                <span>Studio Keepsake Box</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


