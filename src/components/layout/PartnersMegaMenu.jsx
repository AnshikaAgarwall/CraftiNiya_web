import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import {
  getCollaborations,
  getCreators,
  getPartnerTypes,
} from "../../data/partners.js";
import s from "./PartnersMegaMenu.module.css";

/**
 * PartnersMegaMenu
 *
 * Full-width panel for the "Partners" trigger in the primary navigation.
 * Left: Directory navigation for the 3 partner types with "View All" links.
 * Right: Curated featured showcase (featured collaboration, creator spotlight, partner picks).
 *
 * No /partners page: every destination routes strictly to /collaborations,
 * /creators, /partner-picks, /collaboration/:collabSlug, or /creator/:slug.
 */
export default function PartnersMegaMenu({ onNavigate }) {
  const collaborations = getCollaborations();
  const creators = getCreators();
  const partnerTypes = getPartnerTypes();

  // Curated featured selection (only 1 or 2 items, avoiding dumping full catalog)
  const featuredCollab = collaborations[0] || null; // RangSajja
  const featuredCreator = creators[0] || null; // Ananya Sharma & Local Artisans
  const partnerPicksType = partnerTypes.find((p) => p.id === "partner-picks");

  return (
    <div
      className={s.panel}
      id="partners-mega-menu"
      role="region"
      aria-label="Partners Menu"
    >
      <div className={`container ${s.inner}`}>
        <div className={s.layout}>
          {/* =========================================================
              LEFT: Directory & Category Navigation with View All links
              ========================================================= */}
          <div className={s.leftCol}>
            {/* 1. Brand Collaborations */}
            <div className={s.sectionBlock}>
              <div className={s.sectionHeader}>
                <Link
                  to="/collaborations"
                  className={s.sectionTitle}
                  onClick={onNavigate}
                >
                  Brand Collaborations
                </Link>
                <span className={s.sectionBadge}>Editions</span>
              </div>
              <ul className={s.linkList}>
                {collaborations.slice(0, 2).map((c) => (
                  <li key={c.id}>
                    <Link
                      to={`/collaboration/${c.slug}`}
                      className={s.subLink}
                      onClick={onNavigate}
                    >
                      {c.title}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                to="/collaborations"
                className={s.viewAll}
                onClick={onNavigate}
              >
                View all collaborations <ArrowRight aria-hidden="true" />
              </Link>
            </div>

            <div className={s.divider} />

            {/* 2. Creators */}
            <div className={s.sectionBlock}>
              <div className={s.sectionHeader}>
                <Link
                  to="/creators"
                  className={s.sectionTitle}
                  onClick={onNavigate}
                >
                  Creators
                </Link>
                <span className={s.sectionBadge}>Artisans</span>
              </div>
              <ul className={s.linkList}>
                {creators.slice(0, 2).map((cr) => (
                  <li key={cr.id}>
                    <Link
                      to={`/creator/${cr.slug}`}
                      className={s.subLink}
                      onClick={onNavigate}
                    >
                      {cr.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                to="/creators"
                className={s.viewAll}
                onClick={onNavigate}
              >
                View all creators <ArrowRight aria-hidden="true" />
              </Link>
            </div>

            <div className={s.divider} />

            {/* 3. Partner Picks */}
            <div className={s.sectionBlock}>
              <div className={s.sectionHeader}>
                <Link
                  to="/partner-picks"
                  className={s.sectionTitle}
                  onClick={onNavigate}
                >
                  Partner Picks
                </Link>
                <span className={s.sectionBadge}>Affiliate</span>
              </div>
              <p className={s.sectionDesc}>
                {partnerPicksType?.description ||
                  "Handcrafted heritage designs fulfilled directly with affiliate partner workshops."}
              </p>
              <Link
                to="/partner-picks"
                className={s.viewAll}
                onClick={onNavigate}
              >
                View all partner picks <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* =========================================================
              RIGHT: Curated Featured Cards Showcase
              ========================================================= */}
          <div className={s.rightCol}>
            <div className={s.rightHeader}>
              <span className={s.rightTitle}>Featured Partners</span>
              <span className={s.rightTagline}>
                Curated craft ateliers & seasonal releases
              </span>
            </div>

            <div className={s.featuredGrid}>
              {/* Featured Collaboration Card */}
              {featuredCollab && (
                <Link
                  to={`/collaboration/${featuredCollab.slug}`}
                  className={s.featuredCard}
                  onClick={onNavigate}
                  title={`View ${featuredCollab.title}`}
                >
                  <div className={s.cardMedia}>
                    <img
                      src={featuredCollab.bannerImage}
                      alt={featuredCollab.title}
                      className={s.cardImage}
                      loading="lazy"
                    />
                    <span className={s.cardBadge}>
                      <Sparkles size={11} aria-hidden="true" />
                      {featuredCollab.badge || "Featured Collab"}
                    </span>
                  </div>
                  <div className={s.cardBody}>
                    <span className={s.cardCategory}>Brand Collaboration</span>
                    <h3 className={s.cardTitle}>{featuredCollab.title}</h3>
                    <p className={s.cardSubtitle}>{featuredCollab.tagline}</p>
                    <span className={s.cardAction}>
                      Explore Edition <ArrowRight aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              )}

              {/* Creator Spotlight Card */}
              {featuredCreator && (
                <Link
                  to={`/creator/${featuredCreator.slug}`}
                  className={s.featuredCard}
                  onClick={onNavigate}
                  title={`View ${featuredCreator.name}`}
                >
                  <div className={s.cardMedia}>
                    <img
                      src={featuredCreator.posterUrl || featuredCreator.mediaUrl}
                      alt={featuredCreator.name}
                      className={s.cardImage}
                      loading="lazy"
                    />
                    <span className={s.cardBadge}>
                      <Sparkles size={11} aria-hidden="true" />
                      Artisan Spotlight
                    </span>
                  </div>
                  <div className={s.cardBody}>
                    <span className={s.cardCategory}>
                      {featuredCreator.categoryLabel || "Creator"}
                    </span>
                    <h3 className={s.cardTitle}>{featuredCreator.name}</h3>
                    <p className={s.cardSubtitle}>{featuredCreator.bio}</p>
                    <span className={s.cardAction}>
                      Meet the Maker <ArrowRight aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              )}

              {/* Partner Picks / Affiliate Highlight Card */}
              <Link
                to="/partner-picks"
                className={s.featuredCard}
                onClick={onNavigate}
                title="View Partner Picks"
              >
                <div className={s.cardMedia}>
                  <img
                    src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80"
                    alt="Handmade Brass Oil Burner & Partner Picks"
                    className={s.cardImage}
                    loading="lazy"
                  />
                  <span className={s.cardBadge}>
                    <Sparkles size={11} aria-hidden="true" />
                    Curated Picks
                  </span>
                </div>
                <div className={s.cardBody}>
                  <span className={s.cardCategory}>Partner Picks</span>
                  <h3 className={s.cardTitle}>Artisan Studio Edits</h3>
                  <p className={s.cardSubtitle}>
                    Solid brassware and exclusive studio pieces fulfilled directly by our partner ateliers.
                  </p>
                  <span className={s.cardAction}>
                    Shop Partner Picks <ArrowRight aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
