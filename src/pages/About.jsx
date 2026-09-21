import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowRight,
  Briefcase,
  Calendar,
  Camera,
  ExternalLink,
  Flame,
  Gift,
  Hand,
  Heart,
  HeartHandshake,
  Lamp,
  Leaf,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  Palette,
  PenLine,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  Truck,
  Users,
} from "lucide-react";
import SEO from "../components/common/SEO.jsx";
import Button from "../components/ui/Button.jsx";
import { SectionHeading } from "../components/ui/Bits.jsx";
import { ErrorState, LoadingBlock } from "../components/ui/Feedback.jsx";
import { useAsync } from "../hooks/useAsync.js";
import contentService from "../services/contentService.js";
import { BRAND } from "../config/site.js";
import { cn } from "../lib/cn.js";
import s from "./About.module.css";

function InstagramIcon({ size = 18, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

/**
 * About page. All copy, figures, links and pictures come from the content
 * service, so an admin can change them without a deploy.
 */

const ICONS = {
  briefcase: Briefcase,
  camera: Camera,
  external: ExternalLink,
  flame: Flame,
  gift: Gift,
  hand: Hand,
  heart: Heart,
  "heart-handshake": HeartHandshake,
  instagram: InstagramIcon,
  lamp: Lamp,
  leaf: Leaf,
  mail: Mail,
  message: MessageCircle,
  package: Package,
  palette: Palette,
  "pen-line": PenLine,
  "rotate-ccw": RotateCcw,
  "shopping-bag": ShoppingBag,
  sparkles: Sparkles,
  truck: Truck,
  users: Users,
};
const iconFor = (name) => ICONS[name] ?? Sparkles;

/**
 * Fallback routing metadata for practical customer care sections so every
 * policy card is always clickable and navigates to its customer support counterpart.
 */
const POLICY_META = {
  shipping: {
    link: "/shipping-policy",
    icon: Truck,
    highlight: "Free above ₹1,499 • 3–6 Days",
    linkText: "View Shipping Policy",
  },
  returns: {
    link: "/return-refund-policy",
    icon: RotateCcw,
    highlight: "7-Day Easy Returns Guarantee",
    linkText: "View Returns Policy",
  },
  care: {
    link: "/faq#resin-care-guide",
    icon: Sparkles,
    highlight: "Resin, Soy Wax & Crochet",
    linkText: "Read Care Guide",
  },
  contact: {
    link: "/contact",
    icon: MessageCircle,
    highlight: "Human Replies • WhatsApp & Email",
    linkText: "Get in Touch",
  },
};


export default function About() {
  const { data: page, loading, error, refetch } = useAsync(
    (opts) => contentService.getAboutPage(opts),
    [],
  );
  const { hash } = useLocation();

  // Deep-link to policy anchors (#shipping, #returns…) if loaded
  useEffect(() => {
    if (!page || !hash) return;
    document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
  }, [page, hash]);

  if (error || loading || !page) {
    return (
      <>
        <SEO title="About" />
        <div className="container" style={{ paddingBlock: "var(--sp-10)" }}>
          {error ? (
            <ErrorState error={error} onRetry={refetch} />
          ) : (
            <LoadingBlock label="Loading our story…" />
          )}
        </div>
      </>
    );
  }

  const { seo, welcome, services, stalls, collaborations, policies, contact } = page;
  const validStalls = stalls?.items?.filter((item) => Boolean(item.imageUrl)) ?? [];

  return (
    <>
      <SEO title={seo.title} description={seo.description} image={welcome?.image?.url} />

      {/* 1. Page Hero Banner (Full Banner Style) */}
      {welcome?.image?.url && (
        <section className={s.heroBanner} aria-label="About CraftiNiya Banner">
          <img
            src={welcome.image.url}
            alt={welcome.image.alt || "About CraftiNiya"}
            className={s.bannerImage}
            loading="eager"
            fetchPriority="high"
          />
        </section>
      )}

      {/* 2. What We Make (Services / Collections) */}
      {services && services.items.length > 0 && (
        <section className={s.services}>
          <div className="container">
            <SectionHeading eyebrow={services.eyebrow} title={services.title} />
            <div className={s.serviceGrid}>
              {services.items.map((item) => {
                const Icon = iconFor(item.icon);
                const inner = (
                  <>
                    <span className={s.serviceIcon} aria-hidden="true">
                      <Icon />
                    </span>
                    <h3 className={s.serviceTitle}>{item.title}</h3>
                    {item.body && <p className={s.serviceBody}>{item.body}</p>}
                  </>
                );
                if (!item.href) {
                  return (
                    <article key={item.id} className={s.service}>
                      {inner}
                    </article>
                  );
                }
                return item.href.startsWith("/") ? (
                  <Link key={item.id} to={item.href} className={cn(s.service, s.serviceLink)}>
                    {inner}
                  </Link>
                ) : (
                  <a key={item.id} href={item.href} className={cn(s.service, s.serviceLink)}>
                    {inner}
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 3. Community, Collaborations, NGOs & Affiliate Picks */}
      {collaborations && collaborations.items?.length > 0 && (
        <section className={s.collaborations}>
          <div className="container">
            <SectionHeading
              eyebrow={collaborations.eyebrow || "Beyond The Studio"}
              title={collaborations.title || "Collaborations, Community & Impact"}
            />
            {collaborations.subtitle && (
              <p className={s.collaborationsSubtitle}>{collaborations.subtitle}</p>
            )}

            <div className={s.collaborationsGrid}>
              {collaborations.items.map((item) => {
                const Icon = iconFor(item.icon);
                const hasLink = Boolean(item.link);
                const isExt = Boolean(item.external);

                const CardContent = (
                  <>
                    <div className={s.collabHeader}>
                      <span className={s.collabIcon} aria-hidden="true">
                        <Icon size={19} />
                      </span>
                      {item.tag && <span className={s.collabTag}>{item.tag}</span>}
                    </div>
                    <h3 className={s.collabTitle}>{item.title}</h3>
                    <p className={s.collabBody}>{item.body}</p>
                    {item.badge && (
                      <div className={s.collabBadgeRow}>
                        <span className={s.collabBadge}>
                          <Sparkles size={11} /> {item.badge}
                        </span>
                      </div>
                    )}
                    {item.linkText && (
                      <div className={s.collabAction}>
                        <span>{item.linkText}</span>
                        {isExt ? (
                          <ExternalLink size={13} aria-hidden="true" />
                        ) : (
                          <ArrowRight size={13} aria-hidden="true" className={s.collabArrow} />
                        )}
                      </div>
                    )}
                  </>
                );

                if (!hasLink) {
                  return (
                    <div key={item.id} className={s.collabCard}>
                      {CardContent}
                    </div>
                  );
                }

                return isExt ? (
                  <a
                    key={item.id}
                    href={item.link}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={cn(s.collabCard, s.collabCardInteractive)}
                  >
                    {CardContent}
                  </a>
                ) : (
                  <Link
                    key={item.id}
                    to={item.link}
                    className={cn(s.collabCard, s.collabCardInteractive)}
                  >
                    {CardContent}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 4. Live Events & Stalls Exhibitions */}
      {stalls && validStalls.length > 0 && (
        <section className={s.stalls}>
          <div className="container">
            <SectionHeading eyebrow={stalls.eyebrow} title={stalls.title} />
            {stalls.body && <p className={s.stallsIntro}>{stalls.body}</p>}

            <div className={s.mosaicGrid}>
              {validStalls.map((item, idx) => (
                <div
                  key={item.id}
                  className={cn(s.mosaicTile, s[`mosaicTile_${(idx % 4) + 1}`])}
                >
                  <div className={s.tileInner}>
                    <img
                      src={item.imageUrl}
                      alt={item.title || `CraftiNiya stall exhibition ${idx + 1}`}
                      loading="lazy"
                      className={s.tileImage}
                    />
                    <div className={s.tileScrim} />
                    {(item.title || item.event || item.location || item.date) && (
                      <div className={s.tileContent}>
                        {(item.event || item.date) && (
                          <div className={s.tileBadges}>
                            {item.event && <span className={s.tileTag}>{item.event}</span>}
                            {item.date && (
                              <span className={s.tileDate}>
                                <Calendar size={11} aria-hidden="true" />
                                {item.date}
                              </span>
                            )}
                          </div>
                        )}
                        {item.title && <h3 className={s.tileTitle}>{item.title}</h3>}
                        {item.location && (
                          <p className={s.tileLocation}>
                            <MapPin size={11} aria-hidden="true" />
                            <span>{item.location}</span>
                          </p>
                        )}
                        {item.caption && <p className={s.tileCaption}>{item.caption}</p>}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. The Practical Bits — Redesigned, compact & fully clickable to Customer Support */}
      {(policies?.items?.length > 0 || contact) && (
        <section className={s.policies}>
          <div className="container">
            {policies?.items?.length > 0 && (
              <>
                <div className={s.practicalHeadingWrap}>
                  <SectionHeading
                    eyebrow={policies.eyebrow || "Customer Care & Guarantees"}
                    title={policies.title || "The practical bits"}
                  />
                  {policies.subtitle && (
                    <p className={s.practicalSubtitle}>{policies.subtitle}</p>
                  )}
                </div>

                <div className={s.practicalGrid}>
                  {policies.items.map((policy) => {
                    const meta = POLICY_META[policy.id] || {};
                    const targetLink = policy.link || meta.link || "/contact";
                    const Icon = meta.icon || Sparkles;
                    const highlight = policy.highlight || meta.highlight;
                    const linkText = policy.linkText || meta.linkText || "View Policy Details";

                    return (
                      <Link
                        key={policy.id}
                        id={policy.id}
                        to={targetLink}
                        className={s.practicalCard}
                      >
                        <div className={s.practicalCardHeader}>
                          <span className={s.practicalIcon} aria-hidden="true">
                            <Icon size={18} />
                          </span>
                          {highlight && (
                            <span className={s.practicalBadge}>{highlight}</span>
                          )}
                        </div>

                        <h3 className={s.practicalTitle}>{policy.title}</h3>
                        <p className={s.practicalBody}>{policy.body}</p>

                        <div className={s.practicalFooter}>
                          <span className={s.practicalLinkText}>{linkText}</span>
                          <ArrowRight size={14} aria-hidden="true" className={s.practicalArrow} />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </>
            )}

            {contact && (
              <div className={s.contact}>
                <div className={s.contactCopy}>
                  <span className={s.contactBadge}>Artisan Direct</span>
                  <p className={s.contactTitle}>{contact.title}</p>
                  <p className={s.contactSub}>
                    Got a custom question or need order assistance? We are happy to help.
                  </p>
                </div>
                <div className={s.contactActions}>
                  <Button
                    href={`mailto:${BRAND.email}`}
                    variant="primary"
                    startIcon={<Mail size={16} />}
                  >
                    {BRAND.email}
                  </Button>
                  <Button
                    href={BRAND.instagram}
                    target="_blank"
                    rel="noreferrer noopener"
                    variant="secondary"
                    startIcon={<InstagramIcon size={16} />}
                  >
                    @craftiniya
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}
