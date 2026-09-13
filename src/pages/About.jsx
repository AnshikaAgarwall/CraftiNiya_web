import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Calendar,
  Camera,
  Flame,
  Gift,
  Hand,
  Heart,
  Lamp,
  Leaf,
  Mail,
  MapPin,
  Package,
  Palette,
  PenLine,
  Sparkles,
  Truck,
  Users,
} from "lucide-react";
import SEO from "../components/common/SEO.jsx";
import Button from "../components/ui/Button.jsx";
import { SectionHeading } from "../components/ui/Bits.jsx";
import { ErrorState, LoadingBlock } from "../components/ui/Feedback.jsx";
import LazyImage from "../components/common/LazyImage.jsx";
import { useAsync } from "../hooks/useAsync.js";
import contentService from "../services/contentService.js";
import { BRAND } from "../config/site.js";
import { cn } from "../lib/cn.js";
import s from "./About.module.css";

/**
 * About page. All copy, figures, links and pictures come from the content
 * service, so an admin can change them without a deploy. Icons are picked by
 * name from a fixed set; an unknown name falls back rather than breaking.
 */

const ICONS = {
  flame: Flame,
  gift: Gift,
  hand: Hand,
  heart: Heart,
  lamp: Lamp,
  leaf: Leaf,
  package: Package,
  palette: Palette,
  "pen-line": PenLine,
  sparkles: Sparkles,
  truck: Truck,
  users: Users,
};
const iconFor = (name) => ICONS[name] ?? Sparkles;

/** Internal paths route client-side; anything else is a plain link. */
const linkProps = (href) => (href.startsWith("/") ? { to: href } : { href });

function FramedImage({ image, eager = false, side = "right" }) {
  return (
    <div className={cn(s.frame, side === "left" && s.frameLeft)}>
      <div className={s.blob}>
        <LazyImage src={image.url} alt={image.alt} ratio="4 / 5" eager={eager} />
      </div>
      <span className={s.swatches} aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      <Sparkles className={s.sparkle} aria-hidden="true" />
    </div>
  );
}

export default function About() {
  const { data: page, loading, error, refetch } = useAsync(
    (opts) => contentService.getAboutPage(opts),
    [],
  );
  const { hash } = useLocation();

  // Footer links deep-link to policy anchors (#shipping, #returns…), which
  // only exist once the content has loaded.
  useEffect(() => {
    if (!page || !hash) return;
    document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
  }, [page, hash]);

  if (error || loading || !page) {
    return (
      <>
        <SEO title="About" />
        <div className="container" style={{ paddingBlock: "var(--sp-12)" }}>
          {error ? (
            <ErrorState error={error} onRetry={refetch} />
          ) : (
            <LoadingBlock label="Loading our story…" />
          )}
        </div>
      </>
    );
  }

  const { seo, welcome, services, stalls, policies, contact } = page;

  return (
    <>
      <SEO title={seo.title} description={seo.description} image={welcome?.image?.url} />

      {welcome && (
        <section className={s.welcome}>
          <div className={cn("container", s.split, s.splitReverse)}>
            <FramedImage image={welcome.image} side="left" eager />
            <div className={s.copy}>
              <Sparkles className={s.heroSparkle} aria-hidden="true" />
              <h1 className={s.heroTitle}>{welcome.title}</h1>
              {welcome.body && <p className={s.body}>{welcome.body}</p>}
              {welcome.stats?.length > 0 && (
                <ul className={s.stats}>
                  {welcome.stats.map((stat) => {
                    const Icon = iconFor(stat.icon);
                    return (
                      <li key={stat.id} className={s.stat}>
                        <span className={s.statValue}>{stat.value}</span>
                        <span className={s.statLabel}>{stat.label}</span>
                        <span className={s.statIcon} aria-hidden="true">
                          <Icon />
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </section>
      )}

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

      {stalls && (
        <section className={s.stalls}>
          <div className="container">
            <SectionHeading eyebrow={stalls.eyebrow} title={stalls.title} />
            {stalls.body && <p className={s.stallsIntro}>{stalls.body}</p>}

            {stalls.items?.length > 0 && (
              <div className={s.mosaicGrid}>
                {stalls.items.map((item, idx) => (
                  <div
                    key={item.id}
                    className={cn(s.mosaicTile, s[`mosaicTile_${(idx % 6) + 1}`])}
                  >
                    {item.imageUrl ? (
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
                                <MapPin size={12} aria-hidden="true" />
                                <span>{item.location}</span>
                              </p>
                            )}
                            {item.caption && <p className={s.tileCaption}>{item.caption}</p>}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className={s.placeholderTile}>
                        <div className={s.placeholderGlow} aria-hidden="true" />
                        <div className={s.placeholderIcon} aria-hidden="true">
                          <Camera size={26} />
                        </div>
                        <div className={s.placeholderInfo}>
                          <span className={s.placeholderTitle}>
                            {item.title || `Stall Photo ${idx + 1}`}
                          </span>
                          <span className={s.placeholderHint}>Admin Photo Slot</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {(policies?.items.length > 0 || contact) && (
        <section className={`container ${s.policies}`}>
          {policies?.items.length > 0 && (
            <>
              {policies.title && <h2 className={s.policiesTitle}>{policies.title}</h2>}
              <div className={s.policyGrid}>
                {policies.items.map((policy) => (
                  <article key={policy.id} id={policy.id} className={s.policy}>
                    <h3>{policy.title}</h3>
                    <p>{policy.body}</p>
                  </article>
                ))}
              </div>
            </>
          )}

          {contact && (
            <div className={s.contact}>
              {contact.title && <p>{contact.title}</p>}
              <div className={s.contactActions}>
                <Button href={`mailto:${BRAND.email}`} startIcon={<Mail size={16} />}>
                  {BRAND.email}
                </Button>
                <Button
                  href={BRAND.instagram}
                  target="_blank"
                  rel="noreferrer noopener"
                  variant="secondary"
                  startIcon={<Camera size={16} />}
                >
                  @craftiniya
                </Button>
              </div>
            </div>
          )}
        </section>
      )}
    </>
  );
}
