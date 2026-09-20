import { Link } from "react-router-dom";
import { SectionHeading } from "../../components/ui/Bits.jsx";
import rangsajjaImg from "../../assets/rangsajja.png";
import sugandhitImg from "../../assets/sugandhit.png";
import crochetkariImg from "../../assets/crochetkari.png";
import mittiImg from "../../assets/CraftiNiya x Mitti Se.png";
import s from "./FeaturedCollaborations.module.css";

const COLLAB_BANNERS = [
  {
    id: "rangsajja",
    slug: "rangsajja",
    title: "CraftiNiya x RangSajja",
    image: rangsajjaImg,
    href: "/collaboration/rangsajja",
  },
  {
    id: "sugandhit",
    slug: "sugandhit",
    title: "CraftiNiya x Sugandhit",
    image: sugandhitImg,
    href: "/collaboration/sugandhit",
  },
  {
    id: "crochetkari",
    slug: "crochetkari",
    title: "CraftiNiya x CrochetKari",
    image: crochetkariImg,
    href: "/collaboration/crochetkari",
  },
  {
    id: "mitti-se",
    slug: "mitti-se",
    title: "CraftiNiya x Mitti Se",
    image: mittiImg,
    href: "/collaboration/mitti-se",
  },
];

export default function FeaturedCollaborations() {
  return (
    <section className={s.section} aria-label="Exclusive Collaborations">
      <div className="container">
        <div className={s.headerWrapper}>
          <SectionHeading
            eyebrow="Special Edits"
            title="Exclusive Collaborations"
          />
        </div>

        <div className={s.scrollTrack} role="region" aria-label="Collaborations carousel">
          {COLLAB_BANNERS.map((item) => (
            <Link
              key={item.id}
              to={item.href}
              className={s.card}
              title={item.title}
            >
              <img
                src={item.image}
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
