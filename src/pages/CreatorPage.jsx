import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import {
  Sparkles,
  MapPin,
  ExternalLink,
  HeartHandshake,
  Quote,
  ChevronDown,
  Play,
  Users,
  Landmark,
  Leaf,
  ShoppingBag,
} from "lucide-react";
import SEO from "../components/common/SEO.jsx";
import ProductGrid from "../components/product/ProductGrid.jsx";
import { useAsync } from "../hooks/useAsync.js";
import productService from "../services/productService.js";
import { BRAND } from "../config/site.js";
import { getCreator } from "../data/partners.js";
import s from "./CreatorPage.module.css";

/** ─────────────────────────────────────────────────────────
 *  NGO Artisan Layout Content
 * ───────────────────────────────────────────────────────── */
function NgoCreatorPage({ profile, displayProducts, loading, error, refetch }) {
  const [showAll, setShowAll] = useState(false);
  const featured = displayProducts.slice(0, 4);
  const rest = displayProducts.slice(4);

  const ngoStats = [
    { icon: Users, label: "Artisans Supported", value: "45+" },
    { icon: Landmark, label: "Villages Reached", value: "12" },
    { icon: Leaf, label: "Crafts Preserved", value: (profile.crafts || []).length || 3 },
    { icon: ShoppingBag, label: "Pieces Handcrafted", value: "500+" },
  ];

  return (
    <>
      {/* 1. Identity + Impact Counts side-by-side (below banner, open & clean) */}
      <div className={s.ngoProfileStatsRow}>
        <div className={s.ngoIdentityCol}>
          <div className={s.ngoBadge}>
            <HeartHandshake size={14} aria-hidden="true" />
            <span>{profile.categoryLabel || "Artisan Collective & NGO"}</span>
          </div>
          <h1 className={s.ngoTitle}>{profile.name}</h1>
          <p className={s.ngoDescription}>{profile.tagline || profile.bio}</p>
          {profile.location && (
            <div className={s.ngoLocation}>
              <MapPin size={13} aria-hidden="true" />
              <span>{profile.location}</span>
            </div>
          )}

          {/* 4 lines of story context under location */}
          <p className={s.ngoStoryText}>
            This collective brings together over 45 generational women artisans from rural Rajasthan and Gujarat. Every piece is woven and sculpted slowly by hand using eco-friendly local materials. By connecting their craft directly with you, we eliminate middlemen and ensure 100% fair living wages. Your support preserves dying heritage art while funding healthcare and schooling for artisan families.
          </p>
        </div>

        <div className={s.ngoStatsStrip}>
          {ngoStats.map(({ icon: Icon, label, value }) => (
            <div key={label} className={s.ngoStatItem}>
              <div className={s.ngoStatIcon}>
                <Icon size={18} aria-hidden="true" />
              </div>
              <div className={s.ngoStatValue}>{value}</div>
              <div className={s.ngoStatLabel}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Featured 4 Products + Expandable See All */}
      <section className={s.ngoFeaturedSection}>
        <div className={s.sectionHeadRow}>
          <div>
            <p className={s.subHeading}>Handcrafted By Rural Women</p>
            <h2 className={s.catalogTitle}>Featured Pieces</h2>
          </div>
          {!loading && (
            <span className={s.countBadge}>
              {displayProducts.length}{" "}
              {displayProducts.length === 1 ? "Piece" : "Pieces"}
            </span>
          )}
        </div>

        <ProductGrid
          products={featured}
          loading={loading}
          error={error}
          onRetry={refetch}
          columns={4}
          emptyTitle="No pieces currently listed"
          emptyMessage="New handcrafted pieces are being made and will arrive soon."
        />

        {rest.length > 0 && (
          <>
            {showAll && (
              <div className={s.ngoRestGrid}>
                <ProductGrid products={rest} columns={4} />
              </div>
            )}
            <div className={s.showMoreRow}>
              <button
                type="button"
                className={s.showMoreBtn}
                onClick={() => setShowAll((v) => !v)}
              >
                {showAll ? "Show Less" : `Click to see all ${displayProducts.length} Pieces`}
                <ChevronDown
                  size={16}
                  style={{
                    transform: showAll ? "rotate(180deg)" : "none",
                    transition: "transform 0.25s",
                  }}
                  aria-hidden="true"
                />
              </button>
            </div>
          </>
        )}
      </section>

      {/* 3. Creator Mission & Social Service: Clean Open Layout */}
      <section className={s.missionSection}>
        <div className={s.causeHeader}>
          <span className={s.causeBadge}>
            <HeartHandshake size={14} aria-hidden="true" />
            Creator Mission &amp; Social Service
          </span>
        </div>

        <div className={s.artisanElderQuoteGrid}>
          {/* Old working artisan lady */}
          <div className={s.artisanElderImageWrap}>
            <img
              src="https://images.unsplash.com/photo-1590086782957-93c06ef21604?auto=format&fit=crop&w=800&q=80"
              alt="Elder rural artisan woman handcrafting traditional work"
              className={s.artisanElderImg}
              loading="lazy"
            />
          </div>

          {/* Clean quote beside image */}
          <div className={s.artisanQuoteCol}>
            {profile.quote && (
              <blockquote className={s.quoteBox}>
                <Quote size={28} className={s.quoteIcon} aria-hidden="true" />
                <p className={s.quoteText}>{profile.quote}</p>
                {profile.quoteAuthor && (
                  <cite className={s.quoteAuthor}>— {profile.quoteAuthor}</cite>
                )}
              </blockquote>
            )}

            {profile.instagramHandle && (
              <div className={s.ngoFollowBox}>
                <p className={s.ngoFollowPrompt}>
                  See the artisan elders and rural women crafting live:
                </p>
                <a
                  href={
                    profile.instagramUrl ||
                    `https://instagram.com/${profile.instagramHandle.replace("@", "")}`
                  }
                  target="_blank"
                  rel="noreferrer noopener"
                  className={s.instagramBtn}
                >
                  <span>Follow {profile.instagramHandle}</span>
                  <ExternalLink size={14} aria-hidden="true" />
                </a>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

/** ─────────────────────────────────────────────────────────
 *  Influencer Creator Layout
 * ───────────────────────────────────────────────────────── */
function InfluencerCreatorPage({ profile, displayProducts, loading, error, refetch }) {
  const topVideoUrl =
    profile.mediaUrl || "https://www.pexels.com/download/video/7253687/";
  const processVideoUrl =
    profile.processVideoUrl || "https://www.pexels.com/download/video/7253689/";

  const shopLooks = [
    {
      id: "look-1",
      badge: "Reel 01 • Process of Making",
      title: "Process of Making • Botanical Resin Pour",
      videoUrl: processVideoUrl,
      products: displayProducts.slice(0, 2),
    },
    {
      id: "look-2",
      badge: "Reel 02 • Studio Styling",
      title: "Boho Summer Styling • Resin Bangles & Keepsakes",
      videoUrl: topVideoUrl,
      products:
        displayProducts.length > 2
          ? [displayProducts[1], displayProducts[2]]
          : displayProducts.slice(0, 2),
    },
  ];

  return (
    <>
      {/* 1. Circular Avatar Hero + Bio */}
      <div className={s.influHero}>
        <div className={s.influAvatarWrap}>
          <div className={s.influStoryRing} aria-hidden="true" />
          <div className={s.influAvatarRing}>
            <img
              src={profile.posterUrl || profile.mediaUrl}
              alt={profile.name}
              className={s.influAvatar}
              loading="eager"
            />
          </div>
        </div>

        <div className={s.influBioBlock}>
          <span className={s.categoryBadge}>{profile.categoryLabel || "Independent Maker"}</span>
          <h1 className={s.influName}>{profile.name}</h1>
          <p className={s.influTagline}>{profile.tagline || profile.bio}</p>

          <div className={s.influMeta}>
            {profile.location && (
              <span className={s.influMetaChip}>
                <MapPin size={12} aria-hidden="true" /> {profile.location}
              </span>
            )}
            {(profile.crafts || []).map((craft) => (
              <span key={craft} className={s.influMetaChip}>
                {craft}
              </span>
            ))}
          </div>

          {profile.instagramHandle && (
            <a
              href={
                profile.instagramUrl ||
                `https://instagram.com/${profile.instagramHandle.replace("@", "")}`
              }
              target="_blank"
              rel="noreferrer noopener"
              className={s.instagramBtn}
            >
              <span>Follow {profile.instagramHandle}</span>
              <ExternalLink size={14} aria-hidden="true" />
            </a>
          )}
        </div>
      </div>

      {/* 2. Top Feature Video — Process & Studio Pouring */}
      <div className={s.influReelSection}>
        <div className={s.influReelBadge}>
          <Play size={12} aria-hidden="true" />
          <span>Creator Studio • Process of Making</span>
        </div>
        <div className={s.influReelPlayer}>
          <video
            src={topVideoUrl}
            poster={profile.posterUrl}
            autoPlay
            loop
            muted
            playsInline
            className={s.influReelVideo}
          />
          <div className={s.influReelGradient} />
          <div className={s.influReelCaption}>
            <Sparkles size={14} aria-hidden="true" />
            <span>
              Watch how {profile.shortName || profile.name} hand-pours and cures each botanical resin piece
            </span>
          </div>
        </div>
      </div>

      {/* 3. Studio Handcrafted Pieces (Shop Now) — RIGHT ABOVE Shop The Look */}
      {displayProducts.length > 0 && (
        <section className={s.studioCreationsSection}>
          <div className={s.sectionHeadRow}>
            <div>
              <p className={s.subHeading}>Priya's Studio Collection</p>
              <h2 className={s.catalogTitle}>Handcrafted Resin Creations</h2>
            </div>
            <span className={s.countBadge}>{displayProducts.length} Available Pieces</span>
          </div>

          <ProductGrid
            products={displayProducts}
            loading={loading}
            error={error}
            onRetry={refetch}
            columns={4}
            emptyTitle="No pieces currently listed"
            emptyMessage="New resin creations are being poured and will arrive soon."
          />
        </section>
      )}

      {/* 4. Shop the Look — 2 Reels with Related Products */}
      <section className={s.shopTheLookSection}>
        <div className={s.sectionHeadRow}>
          <div>
            <p className={s.subHeading}>As Seen On Reel</p>
            <h2 className={s.catalogTitle}>Shop the Look</h2>
          </div>
          <span className={s.countBadge}>2 Featured Reels</span>
        </div>

        <div className={s.shopTheLookList}>
          {shopLooks.map((look) => (
            <div key={look.id} className={s.shopTheLookGrid}>
              <div className={s.shopLookVideo}>
                <div className={s.shopLookVideoBadge}>
                  <Play size={11} aria-hidden="true" /> {look.badge}
                </div>
                <video
                  src={look.videoUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className={s.shopLookVideoEl}
                />
                <div className={s.shopLookVideoHandle}>{profile.instagramHandle}</div>
              </div>

              <div className={s.shopLookProducts}>
                <div className={s.lookHeaderRow}>
                  <h3 className={s.lookHeading}>{look.title}</h3>
                  <span className={s.lookSubTag}>Exact pieces styled in this reel</span>
                </div>
                <ProductGrid
                  products={look.products}
                  loading={loading}
                  error={error}
                  onRetry={refetch}
                  columns={2}
                  emptyTitle="No pieces currently listed"
                  emptyMessage="Pieces from this reel will appear here shortly."
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Creator Story Quote */}
      {profile.quote && (
        <section className={s.missionSection}>
          <div className={s.causeHeader}>
            <span className={s.causeBadge}>
              <HeartHandshake size={14} aria-hidden="true" />
              Creator Philosophy
            </span>
          </div>
          <blockquote className={s.quoteBox}>
            <Quote size={28} className={s.quoteIcon} aria-hidden="true" />
            <p className={s.quoteText}>{profile.quote}</p>
            {profile.quoteAuthor && (
              <cite className={s.quoteAuthor}>— {profile.quoteAuthor}</cite>
            )}
          </blockquote>
        </section>
      )}
    </>
  );
}

/** ─────────────────────────────────────────────────────────
 *  Root Page: Full-bleed Homepage-style Banner + Container Content
 * ───────────────────────────────────────────────────────── */
export default function CreatorPage() {
  const { slug } = useParams();
  const foundCreator = getCreator(slug);

  const profile = foundCreator || {
    name: slug ? slug.replace(/-/g, " ") : "Featured Creator",
    bio: "Handcrafted in small batches with heartfelt attention to detail.",
    category: "influencer",
    categoryLabel: "Artisan Creator",
    mediaType: "banner",
    mediaUrl:
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80",
    quote: "“Handmade art connects people through human touch, heritage, and genuine care.”",
    quoteAuthor: "Studio Creator",
  };

  const {
    data: catalog,
    loading,
    error,
    refetch,
  } = useAsync(
    (opts) => productService.getProducts({ creatorSlug: slug, pageSize: 16 }, opts),
    [slug],
  );

  const displayProducts = catalog?.items ?? [];
  const isNgo = profile.category === "ngo_artisan";

  return (
    <>
      <SEO
        title={`${profile.name} — Creator Spotlight & Mission | ${BRAND.name}`}
        description={profile.bio}
      />

      <div className={s.pageWrap}>
        {/* Breadcrumb at top inside container */}
        <div className="container">
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
        </div>

        {isNgo ? (
          <>
            {/* FULL-BLEED HOMEPAGE-STYLE HERO BANNER (Edge-to-edge across screen) */}
            <div className={s.homeStyleHeroBanner}>
              <picture className={s.homeBannerPicture}>
                {profile.mediaUrlMobile && (
                  <source media="(max-width: 640px)" srcSet={profile.mediaUrlMobile} />
                )}
                <img
                  src={profile.mediaUrlDesktop || profile.mediaUrl}
                  alt={`${profile.name} Banner`}
                  className={s.homeBannerImg}
                  loading="eager"
                />
              </picture>
            </div>

            {/* Rest of page inside container */}
            <div className="container">
              <NgoCreatorPage
                profile={profile}
                displayProducts={displayProducts}
                loading={loading}
                error={error}
                refetch={refetch}
              />
            </div>
          </>
        ) : (
          <div className="container">
            <InfluencerCreatorPage
              profile={profile}
              displayProducts={displayProducts}
              loading={loading}
              error={error}
              refetch={refetch}
            />
          </div>
        )}
      </div>
    </>
  );
}
