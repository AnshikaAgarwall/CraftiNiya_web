import { Link } from "react-router-dom";
import {
  Camera,
  Heart,
  Mail,
  MessageCircle,
} from "lucide-react";
import { BRAND, FOOTER_NAV } from "../../config/site.js";
import s from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={s.footer}>
      {/* ── Main Footer Grid ── */}
      <div className={`container ${s.inner}`}>
        {/* Dynamic Navigation Columns */}
        {FOOTER_NAV.map((column) => (
          <nav key={column.heading} className={s.col} aria-label={column.heading}>
            <h3 className={s.colHeading}>{column.heading}</h3>
            <ul className={s.colList}>
              {column.links.map((link) => (
                <li key={`${column.heading}-${link.label}-${link.to}`}>
                  <Link to={link.to} className={s.colLink}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      {/* ── Bottom Legal, Social & Copyright Bar ── */}
      <div className={`container ${s.bottom}`}>
        {/* Social Channel Icons */}
        <div className={s.bottomSocial}>
          <a
            href={BRAND.instagram}
            target="_blank"
            rel="noreferrer noopener"
            className={s.socialLink}
            aria-label={`${BRAND.name} on Instagram`}
          >
            <Camera size={18} />
          </a>
          <a
            href={`mailto:${BRAND.email}`}
            className={s.socialLink}
            aria-label={`Email ${BRAND.name}`}
          >
            <Mail size={18} />
          </a>
          <a
            href="https://wa.me/919876543210?text=Hi%20CraftiNiya,%20I%20have%20an%20enquiry"
            target="_blank"
            rel="noreferrer noopener"
            className={s.socialLink}
            aria-label="Chat with CraftiNiya on WhatsApp"
          >
            <MessageCircle size={18} />
          </a>
        </div>

        <p className={s.copyright}>
          © {new Date().getFullYear()} {BRAND.name}. Handcrafted with love in Jaipur, Rajasthan, India. All rights reserved.
        </p>
        <p className={s.credit}>
          Made with <Heart size={14} aria-hidden="true" /> for lovers of handmade art
        </p>
      </div>
    </footer>
  );
}
