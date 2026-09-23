import { useParams, Link } from "react-router-dom";
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
    mediaType: "banner",
    mediaUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80",
  };

  const { data: catalog, loading, error, refetch } = useAsync(
    (opts) => productService.getProducts({ creatorSlug: slug, pageSize: 12 }, opts),
    [slug],
  );

  const displayProducts = catalog?.items ?? [];

  return (
    <>
      <SEO
        title={`${profile.name} — Creator Spotlight`}
        description={profile.bio}
      />

      <div className="container" style={{ paddingBlock: "var(--sp-8)" }}>
        <nav aria-label="Breadcrumb" className={s.breadcrumb}>
          <Link to="/" className={s.crumbLink}>Home</Link>
          <span className={s.crumbDivider}>/</span>
          <Link to="/creators" className={s.crumbLink}>Creators</Link>
          <span className={s.crumbDivider}>/</span>
          <span>{profile.name}</span>
        </nav>

        {/* Unified Dynamic Media Block: Swaps based on profile.mediaType */}
        <div className={s.heroSection}>
          {profile.mediaType === "reel" ? (
            <div className={s.reelBlock}>
              <video
                src={profile.mediaUrl}
                poster={profile.posterUrl}
                autoPlay
                loop
                muted
                playsInline
                className={s.reelVideo}
              />
              <div className={s.reelBadge}>
                <span>Creator In Studio</span>
              </div>
            </div>
          ) : (
            <div className={s.bannerBlock}>
              <LazyImage
                src={profile.mediaUrl}
                alt={profile.name}
                className={s.bannerImage}
                eager
              />
              <div className={s.bannerBadge}>
                <span>Artisan Workshop</span>
              </div>
            </div>
          )}

          <div className={s.infoBlock}>
            <span className={s.categoryTag}>
              {profile.category === "ngo_artisan" ? "Artisan Collective & NGO" : "Independent Maker"}
            </span>
            <h1 className={s.creatorName}>{profile.name}</h1>
            <p className={s.creatorBio}>{profile.bio}</p>

            <div className={s.metaChips}>
              {profile.location && <span className={s.chip}>📍 {profile.location}</span>}
              {profile.instagramHandle && <span className={s.chip}>{profile.instagramHandle}</span>}
              <span className={s.chip}>Small Batch Production</span>
            </div>
          </div>
        </div>

        {/* Handcrafted works showcase */}
        <section className={s.collectionSection}>
          <div className={s.collectionHeader}>
            <p className={s.subHeading}>Handcrafted Catalog</p>
            <h2 className={s.headingTitle}>Pieces by {profile.name}</h2>
          </div>

          <ProductGrid
            products={displayProducts}
            loading={loading}
            error={error}
            onRetry={refetch}
            columns={4}
            emptyTitle={`No pieces currently listed for ${profile.name}`}
            emptyMessage="New handcrafted pieces from this creator studio will be arriving soon."
          />
        </section>
      </div>
    </>
  );
}
