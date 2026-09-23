import { Link } from "react-router-dom";
import { SectionHeading } from "../../components/ui/Bits.jsx";
import { getCollaborations } from "../../data/partners.js";
import s from "./FeaturedCollaborations.module.css";

export default function FeaturedCollaborations() {
  const collaborations = getCollaborations();

  return (
    <section className={s.section} aria-label="Exclusive Collaborations">
      <div className="container">
        <SectionHeading
          eyebrow="Special Edits"
          title="Exclusive Collaborations"
        />

        <div className={s.scrollTrack} role="region" aria-label="Collaborations carousel">
          {collaborations.map((item) => (
            <Link
              key={item.id}
              to={`/collaboration/${item.slug}`}
              className={s.card}
              title={item.title}
            >
              <img
                src={item.bannerImage}
                alt={item.title}
                className={s.cardImage}
                loading="lazy"
                draggable={false}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
