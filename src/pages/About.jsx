import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Camera,
  Flame,
  Gift,
  Hand,
  Heart,
  Lamp,
  Leaf,
  Mail,
  Package,
  Palette,
  PenLine,
  Play,
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

  const { seo, hero, welcome, services, commitment, policies, contact } = page;

  return (
    <>
      <SEO title={seo.title} description={seo.description} image={hero?.image.url} />

      {hero && (
        <section className={s.hero}>
          <div className={cn("container", s.split)}>
            <div className={s.copy}>
              <Sparkles className={s.heroSparkle} aria-hidden="true" />
              <h1 className={s.heroTitle}>{hero.title}</h1>
              {hero.body && <p className={s.body}>{hero.body}</p>}
              {(hero.cta || hero.videoUrl) && (
                <div className={s.heroActions}>
                  {hero.cta && <Button {...linkProps(hero.cta.href)}>{hero.cta.label}</Button>}
                  {hero.videoUrl && (
                    <a
                      href={hero.videoUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className={s.play}
                      aria-label="Watch our story"
                    >
                      <Play />
                    </a>
                  )}
                </div>
              )}
            </div>
            <FramedImage image={hero.image} eager />
          </div>
        </section>
      )}

      {welcome && (
        <section className={s.welcome}>
          <div className={cn("container", s.split, s.splitReverse)}>
            <FramedImage image={welcome.image} side="left" />
            <div className={s.copy}>
              <h2 className={s.sectionTitle}>{welcome.title}</h2>
              {welcome.body && <p className={s.body}>{welcome.body}</p>}
              {welcome.stats.length > 0 && (
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

      {commitment && (
        <section className={s.commitment}>
          <div className={cn("container", s.split)}>
            <div className={s.copy}>
              <h2 className={s.sectionTitle}>{commitment.title}</h2>
              {commitment.body && <p className={s.body}>{commitment.body}</p>}
              {commitment.metrics.length > 0 && (
                <ul className={s.metrics}>
                  {commitment.metrics.map((metric) => (
                    <li key={metric.id} className={s.metric}>
                      <span className={s.metricHead}>
                        <span>{metric.label}</span>
                        <span className={s.metricValue}>{metric.value}%</span>
                      </span>
                      <span className={s.metricTrack} aria-hidden="true">
                        <span className={s.metricFill} style={{ width: `${metric.value}%` }} />
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <FramedImage image={commitment.image} />
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
