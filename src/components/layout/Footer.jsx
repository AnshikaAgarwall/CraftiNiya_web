import { Link } from "react-router-dom";
import { Camera, Heart, Mail } from "lucide-react";
import { BRAND, FOOTER_NAV } from "../../config/site.js";
import s from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={s.footer}>
      <div className={`container ${s.inner}`}>
        <div className={s.brandCol}>
          <Link to="/" className={s.wordmark} aria-label={`${BRAND.name} home`}>
            {BRAND.name}
          </Link>

          <p className={s.tagline}>{BRAND.strapline}</p>

          <div className={s.social}>
            <a
              href={`mailto:${BRAND.email}`}
              className={s.socialLink}
              aria-label={`Email ${BRAND.name}`}
            >
              <Mail />
            </a>
            <a
              href={BRAND.instagram}
              target="_blank"
              rel="noreferrer noopener"
              className={s.socialLink}
              aria-label={`${BRAND.name} on Instagram`}
            >
              <Camera />
            </a>
          </div>
        </div>

        {FOOTER_NAV.map((column) => (
          <nav key={column.heading} className={s.col} aria-label={column.heading}>
            <h3 className={s.colHeading}>{column.heading}</h3>
            <ul className={s.colList}>
              {column.links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className={s.colLink}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className={`container ${s.bottom}`}>
        <p>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
        <p className={s.credit}>
          Made with <Heart aria-hidden="true" /> for handmade lovers
        </p>
      </div>
    </footer>
  );
}
