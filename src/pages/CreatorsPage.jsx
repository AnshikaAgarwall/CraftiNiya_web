import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";
import SEO from "../components/common/SEO.jsx";
import PageHeader from "../components/layout/PageHeader.jsx";
import LazyImage from "../components/common/LazyImage.jsx";
import { getCreators } from "../data/partners.js";
import { BRAND } from "../config/site.js";
import s from "./CreatorsPage.module.css";

export default function CreatorsPage() {
  const creators = getCreators();

  return (
    <>
      <SEO
        title={`Creators & Artisans — Studio Spotlight | ${BRAND.name}`}
        description="Meet the independent makers, studio artists, and NGO collectives partnering with CraftiNiya."
      />

      <PageHeader
        align="left"
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Creators" }]}
        eyebrow="Artisan Spotlight"
        title="Creators & Makers"
        description="Celebrating the independent makers, studio artists, and rural NGO craft collectives who create with soul, intention, and heritage craft."
      />

      <div className={`container ${s.wrap}`}>
        <div className={s.grid}>
          {creators.map((creator, i) => (
            <Link
              key={creator.id}
              to={`/creator/${creator.slug}`}
              className={s.card}
              title={`View ${creator.name}`}
            >
              <div className={s.mediaWrap}>
                <LazyImage
                  src={creator.posterUrl || creator.mediaUrl}
                  alt={creator.name}
                  ratio="16 / 10"
                  eager={i === 0}
                  imgClassName={s.mediaImage}
                />
                <span className={s.categoryBadge}>
                  <Sparkles size={11} aria-hidden="true" />
                  {creator.categoryLabel || "Artisan Maker"}
                </span>
              </div>

              <div className={s.body}>
                {creator.location && (
                  <div className={s.location}>
                    <MapPin size={13} aria-hidden="true" />
                    <span>{creator.location}</span>
                  </div>
                )}

                <h2 className={s.creatorName}>{creator.name}</h2>
                <p className={s.bio}>{creator.bio}</p>

                {creator.crafts && creator.crafts.length > 0 && (
                  <div className={s.craftTags}>
                    {creator.crafts.map((craft) => (
                      <span key={craft} className={s.craftTag}>
                        {craft}
                      </span>
                    ))}
                  </div>
                )}

                <div className={s.metaRow}>
                  <span className={s.handle}>
                    {creator.instagramHandle || creator.founded || "Studio Partner"}
                  </span>
                  <span className={s.cta}>
                    View Studio & Works
                    <ArrowRight size={14} aria-hidden="true" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
