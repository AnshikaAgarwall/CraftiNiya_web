import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import SEO from "../components/common/SEO.jsx";
import PageHeader from "../components/layout/PageHeader.jsx";
import LazyImage from "../components/common/LazyImage.jsx";
import { getCollaborations } from "../data/partners.js";
import { BRAND } from "../config/site.js";
import s from "./CollaborationsPage.module.css";

export default function CollaborationsPage() {
  const collaborations = getCollaborations();

  return (
    <>
      <SEO
        title={`Brand Collaborations — Exclusive Collections | ${BRAND.name}`}
        description="Discover limited-edition artisan collaborations co-designed with visionary Indian craft studios and heritage labels."
      />

      <PageHeader
        align="left"
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Brand Collaborations" }]}
        eyebrow="Special Edits"
        title="Brand Collaborations"
        description="Exclusive seasonal edits and co-created handcrafted collections designed in partnership with premier Indian artisan ateliers."
      />

      <div className={`container ${s.wrap}`}>
        <div className={s.grid}>
          {collaborations.map((collab, i) => (
            <Link
              key={collab.id}
              to={`/collaboration/${collab.slug}`}
              className={s.card}
              title={`View ${collab.title}`}
            >
              <div className={s.imageWrap}>
                <LazyImage
                  src={collab.bannerImage}
                  alt={collab.title}
                  ratio="16 / 9"
                  eager={i === 0}
                  imgClassName={s.image}
                />
                {collab.badge && (
                  <span className={s.badge}>
                    <Sparkles size={12} aria-hidden="true" />
                    {collab.badge}
                  </span>
                )}
              </div>

              <div className={s.body}>
                <span className={s.cardEyebrow}>{collab.eyebrow}</span>
                <h2 className={s.cardTitle}>{collab.title}</h2>
                <p className={s.tagline}>{collab.tagline}</p>

                <div className={s.metaRow}>
                  <span className={s.metaSpecialty}>
                    {collab.specialty || collab.founded}
                  </span>
                  <span className={s.cta}>
                    Explore Collection
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
