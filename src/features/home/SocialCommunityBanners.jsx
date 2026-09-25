import { BRAND } from "../../config/site.js";
import posterInsta from "../../assets/instaforniyacommunity.png";
import posterWa from "../../assets/LOCALSHOPS.png";
import s from "./SocialCommunityBanners.module.css";

/**
 * 2 Pure Poster Cards directly following Customer Love on the Home page.
 * Height matches the compact review pill section height, strictly poster images (no text overlay).
 * Links user directly to WhatsApp Community and Instagram Community.
 */
export default function SocialCommunityBanners() {
  const whatsappCommunityUrl = "https://wa.me/919876543210?text=Hi%20CraftiNiya,%20I%20would%20love%20to%20join%20the%20CraftiNiya%20WhatsApp%20community!";
  const instagramCommunityUrl = BRAND.instagram || "https://www.instagram.com/manmish_creations";

  return (
    <section className={s.section} aria-label="CraftiNiya Community Channels">
      <div className={`container ${s.grid}`}>
        {/* 1. Instagram Community Card */}
        <a
          href={instagramCommunityUrl}
          target="_blank"
          rel="noreferrer noopener"
          className={s.card}
          aria-label="Join our Instagram Community"
        >
          <img
            src={posterInsta}
            alt="Instagram Community Poster"
            className={s.posterImg}
            loading="lazy"
          />
        </a>

        {/* 2. WhatsApp Community Card */}
        <a
          href={whatsappCommunityUrl}
          target="_blank"
          rel="noreferrer noopener"
          className={s.card}
          aria-label="Join our WhatsApp Community"
        >
          <img
            src={posterWa}
            alt="WhatsApp Community Poster"
            className={s.posterImg}
            loading="lazy"
          />
        </a>
      </div>
    </section>
  );
}
