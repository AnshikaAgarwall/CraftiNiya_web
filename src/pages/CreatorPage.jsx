import { useParams, Link } from "react-router-dom";
import {
  Sparkles,
  MapPin,
  ExternalLink,
  CheckCircle2,
  HeartHandshake,
  Quote,
  Flame,
} from "lucide-react";
import SEO from "../components/common/SEO.jsx";
import ProductGrid from "../components/product/ProductGrid.jsx";
import LazyImage from "../components/common/LazyImage.jsx";
import { useAsync } from "../hooks/useAsync.js";
import productService from "../services/productService.js";
import { BRAND } from "../config/site.js";
import { getCreator } from "../data/partners.js";
import s from "./CreatorPage.module.css";

export default function CreatorPage() {
  const { slug } = useParams();
  const foundCreator = getCreator(slug);

  const profile = foundCreator || {
    name: slug ? slug.replace(/-/g, " ") : "Featured Creator",
    bio: "Handcrafted in small batches with heartfelt attention to detail and pure sustainable materials.",
    category: "influencer",
    categoryLabel: "Artisan Creator",
    mediaType: "banner",
    mediaUrl:
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80",
    missionTitle: "The Story Behind This Studio",
    missionSubtitle: "Dedicated to slow crafts, fair wages, and thoughtful handcrafted art",
    missionStory: [
      "Every piece in this collection is created with patience and deep respect for craftsmanship.",
      "Supporting this studio keeps traditional handcrafted arts alive and directly empowers independent creators.",
    ],
    whySupportTitle: "Why Your Support Matters",
    supportPoints: [
      {
        title: "Ethical & Fair Wages",
        desc: "Direct support to artisan makers with zero unfair commissions.",
      },
      {
        title: "Preserving Authentic Craft",
        desc: "Original handmade techniques that machine mass-production cannot duplicate.",
      },
      {
        title: "Empowering Local Studios",
        desc: "Your purchase directly fuels small creative communities and artisan families.",
      },
    ],
    quote: "“Handmade art connects people through human touch, heritage, and genuine care.”",
    quoteAuthor: "Studio Creator",
  };

  const {
    data: catalog,
    loading,
    error,
    refetch,
  } = useAsync(
    (opts) =>
      productService.getProducts({ creatorSlug: slug, pageSize: 16 }, opts),
    [slug],
  );

  const displayProducts = catalog?.items ?? [];

  return (
    <>
      <SEO
        title={`${profile.name} — Creator Spotlight & Mission | ${BRAND.name}`}
        description={profile.bio}
      />

      <div className={s.pageWrap}>
        <div className="container">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className={s.breadcrumb}>
            <Link to="/" className={s.crumbLink}>
              Home
            </Link>
            <span className={s.crumbDivider}>/</span>
            <Link to="/creators" className={s.crumbLink}>
              Creators
            </Link>
            <span className={s.crumbDivider}>/</span>
            <span className={s.crumbCurrent}>{profile.name}</span>
          </nav>

          {/* 1. Full-Width Hero Banner */}
          <div className={s.heroBannerSection}>
            {profile.mediaType === "reel" ? (
              <div className={s.reelHeroWrapper}>
                <div className={s.reelPlayerBox}>
                  <video
                    src={profile.mediaUrl}
                    poster={profile.posterUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className={s.reelVideo}
                  />
                  <div className={s.bannerOverlayBadge}>
                    <Sparkles size={12} aria-hidden="true" />
                    <span>Creator Studio Live</span>
                  </div>
                </div>
                <div className={s.reelHeroText}>
                  <span className={s.categoryBadge}>
                    {profile.categoryLabel || "Creator Spotlight"}
                  </span>
                  <h1 className={s.heroTitle}>{profile.name}</h1>
                  <p className={s.heroTagline}>{profile.tagline || profile.bio}</p>
                  {profile.location && (
                    <div className={s.locationChip}>
                      <MapPin size={14} aria-hidden="true" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className={s.imageHeroCard}>
                <picture className={s.heroPicture}>
                  {profile.mediaUrlMobile && (
                    <source media="(max-width: 640px)" srcSet={profile.mediaUrlMobile} />
                  )}
                  <img
                    src={profile.mediaUrlDesktop || profile.mediaUrl}
                    alt={`${profile.name} Creator Banner`}
                    className={s.heroBannerImg}
                    loading="eager"
                  />
                </picture>
                <div className={s.bannerOverlayBadge}>
                  <Sparkles size={12} aria-hidden="true" />
                  <span>{profile.categoryLabel || "Artisan Spotlight"}</span>
                </div>
              </div>
            )}
          </div>

          {/* 2. Creator Identity & Mission Story */}
          <div className={s.creatorStorySection}>
            {/* Top Identity Header */}
            <div className={s.profileHeader}>
              <div className={s.titleArea}>
                <span className={s.categoryTag}>
                  {profile.categoryLabel || "Artisan Collective"}
                </span>
                <h1 className={s.creatorMainName}>{profile.name}</h1>
                <p className={s.tagline}>{profile.tagline || profile.bio}</p>
              </div>

              {profile.instagramHandle && (
                <div className={s.socialCtaBox}>
                  <a
                    href={
                      profile.instagramUrl ||
                      `https://instagram.com/${profile.instagramHandle.replace("@", "")}`
                    }
                    target="_blank"
                    rel="noreferrer noopener"
                    className={s.instagramBtn}
                  >
                    <span>Follow on Instagram</span>
                    <ExternalLink size={14} aria-hidden="true" />
                  </a>
                  <span className={s.handleText}>{profile.instagramHandle}</span>
                </div>
              )}
            </div>

            {/* Story & Cause Narrative */}
            <div className={s.missionCard}>
              <div className={s.missionContent}>
                <div className={s.causeHeader}>
                  <span className={s.causeBadge}>
                    <HeartHandshake size={15} aria-hidden="true" />
                    Creator Mission & Social Service
                  </span>
                  <h2 className={s.missionTitle}>
                    {profile.missionTitle || "Why I Started This Mission"}
                  </h2>
                  {profile.missionSubtitle && (
                    <p className={s.missionSubtitle}>
                      {profile.missionSubtitle}
                    </p>
                  )}
                </div>

                <div className={s.storyParagraphs}>
                  {profile.missionStory ? (
                    profile.missionStory.map((para, idx) => (
                      <p key={idx} className={s.storyP}>
                        {para}
                      </p>
                    ))
                  ) : (
                    <p className={s.storyP}>{profile.bio}</p>
                  )}
                </div>

                {/* Quote Box */}
                {profile.quote && (
                  <blockquote className={s.quoteBox}>
                    <Quote size={28} className={s.quoteIcon} aria-hidden="true" />
                    <p className={s.quoteText}>{profile.quote}</p>
                    {profile.quoteAuthor && (
                      <cite className={s.quoteAuthor}>— {profile.quoteAuthor}</cite>
                    )}
                  </blockquote>
                )}
              </div>
            </div>

            {/* 3 Pillars: Why You Should Support */}
            {profile.supportPoints && profile.supportPoints.length > 0 && (
              <div className={s.supportSection}>
                <div className={s.supportHeader}>
                  <Flame size={18} className={s.supportFlame} aria-hidden="true" />
                  <h3 className={s.supportTitle}>
                    {profile.whySupportTitle || "Why You Should Support This Initiative"}
                  </h3>
                </div>

                <div className={s.supportGrid}>
                  {profile.supportPoints.map((point, index) => (
                    <div key={index} className={s.supportCard}>
                      <div className={s.supportIconWrap}>
                        <CheckCircle2 size={18} aria-hidden="true" />
                      </div>
                      <div>
                        <h4 className={s.pointTitle}>{point.title}</h4>
                        <p className={s.pointDesc}>{point.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 3. Handcrafted Works Catalog */}
          <section className={s.catalogSection}>
            <div className={s.catalogHeader}>
              <div>
                <p className={s.subHeading}>Handcrafted Creations</p>
                <h2 className={s.catalogTitle}>Pieces by {profile.name}</h2>
              </div>
              {!loading && (
                <span className={s.countBadge}>
                  {displayProducts.length}{" "}
                  {displayProducts.length === 1 ? "Piece" : "Pieces"} Available
                </span>
              )}
            </div>

            <ProductGrid
              products={displayProducts}
              loading={loading}
              error={error}
              onRetry={refetch}
              columns={4}
              emptyTitle={`No pieces currently listed for ${profile.name}`}
              emptyMessage="New handcrafted pieces from this creator studio are currently being made and will arrive soon."
            />
          </section>
        </div>
      </div>
    </>
  );
}
