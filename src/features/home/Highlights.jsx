import { Hand, Leaf, PenLine, PackageCheck } from "lucide-react";
import { SectionHeading } from "../../components/ui/Bits.jsx";
import { VALUE_PROPS } from "../../config/site.js";
import s from "./Highlights.module.css";

/** Short editorial brand section. */

const VALUE_ICONS = { handmade: Hand, materials: Leaf, personal: PenLine, packaging: PackageCheck };

export function WhyCraftiniya() {
  return (
    <section className={s.why}>
      <div className="container">
        <SectionHeading
          eyebrow="Why Craftiniya"
          title="Slow, small-batch, and honest about it"
        />

        <div className={s.whyGrid}>
          {VALUE_PROPS.map((prop) => {
            const Icon = VALUE_ICONS[prop.id] ?? Hand;
            return (
              <article key={prop.id} className={s.whyCard}>
                <span className={s.whyIcon} aria-hidden="true">
                  <Icon />
                </span>
                <h3 className={s.whyTitle}>{prop.title}</h3>
                <p className={s.whyBody}>{prop.body}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default { WhyCraftiniya };
