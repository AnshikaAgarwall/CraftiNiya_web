import { Sparkles, ShieldCheck, Gift, HeartHandshake } from "lucide-react";
import s from "./SaleTrustBanner.module.css";

const TRUST_PILLARS = [
  {
    icon: Sparkles,
    title: "Small-Batch Handcrafting",
    desc: "Every soy candle and floral resin piece is hand-poured with love in our Jaipur atelier.",
  },
  {
    icon: ShieldCheck,
    title: "Breakage-Free Transit",
    desc: "Reinforced eco-honeycomb wraps ensure 100% safe arrival, backed by free instant replacement.",
  },
  {
    icon: Gift,
    title: "Ready-To-Gift Packaging",
    desc: "Delivered in signature festive boxes with complimentary handwritten celebration cards.",
  },
  {
    icon: HeartHandshake,
    title: "Direct Studio Value",
    desc: "Direct artisan-to-doorstep pricing with authentic craft guarantees and no distributor markups.",
  },
];

export default function SaleTrustBanner() {
  return (
    <section className={s.section} aria-label="CraftiNiya Festive Studio Promise">
      <div className="container">
        <div className={s.header}>
          <span className={s.tagline}>THE CRAFTINIYA PROMISE</span>
          <h2 className={s.heading}>Why Shop Our Festive Studio Sale?</h2>
          <p className={s.subheading}>
            Unlike mass-produced festive decor, every piece here carries the human touch, pure botanical fragrances, and heirloom-quality craftsmanship.
          </p>
        </div>

        <div className={s.grid}>
          {TRUST_PILLARS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className={s.card}>
                <div className={s.iconWrap}>
                  <Icon size={22} className={s.icon} />
                </div>
                <h3 className={s.cardTitle}>{item.title}</h3>
                <p className={s.cardDesc}>{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
