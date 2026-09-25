import { useState } from "react";
import { Check, Copy, Gift, Sparkles, Tag } from "lucide-react";
import { useUI } from "../../context/UIContext.jsx";
import { cn } from "../../lib/cn.js";
import s from "./HeroOfferVouchers.module.css";

const OFFERS = [
  {
    id: "first-user",
    discount: "15%",
    unit: "OFF",
    tag: "FIRST ORDER",
    terms: "Min. ₹499",
    subtitle: "On your 1st handcrafted piece",
    code: "NEW15",
    icon: Sparkles,
    themeClass: s.themeEmerald,
  },
  {
    id: "birthday",
    discount: "20%",
    unit: "OFF",
    tag: "BIRTHDAY TREAT",
    terms: "Min. ₹999",
    subtitle: "Celebrate your special month",
    code: "BDAY20",
    icon: Gift,
    themeClass: s.themeTerracotta,
  },
  {
    id: "festive",
    discount: "10%",
    unit: "EXTRA",
    tag: "ATELIER SALE",
    terms: "No Min. Spend",
    subtitle: "Applicable on all collections",
    code: "FESTIVE10",
    icon: Tag,
    themeClass: s.themeGold,
  },
];

export default function HeroOfferVouchers() {
  const { toast } = useUI();
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (offer, e) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(offer.code).catch(() => {});
    }
    setCopiedId(offer.id);
    toast(`Coupon code ${offer.code} copied! Apply at checkout.`, {
      type: "success",
    });

    setTimeout(() => {
      setCopiedId((curr) => (curr === offer.id ? null : curr));
    }, 2400);
  };

  return (
    <section className={s.voucherSection} aria-label="Exclusive Offers & Vouchers">
      <div className="container">
        <div className={s.voucherGrid}>
          {OFFERS.map((offer) => {
            const isCopied = copiedId === offer.id;
            const Icon = offer.icon;

            return (
              <div
                key={offer.id}
                className={cn(s.card, offer.themeClass, isCopied && s.cardCopied)}
                onClick={(e) => handleCopy(offer, e)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleCopy(offer, e);
                  }
                }}
                aria-label={`${offer.discount} ${offer.unit} - ${offer.subtitle}. Click to copy code ${offer.code}`}
              >
                {/* Accent indicator ribbon */}
                <div className={s.accentBar} aria-hidden="true" />

                {/* Left ticket body: Badge, discount, description */}
                <div className={s.cardLeft}>
                  <div className={s.badgeRow}>
                    <span className={s.tagBadge}>
                      <Icon size={11} className={s.badgeIcon} />
                      <span>{offer.tag}</span>
                    </span>
                    <span className={s.termsBadge}>{offer.terms}</span>
                  </div>

                  <div className={s.discountRow}>
                    <span className={s.discountAmount}>{offer.discount}</span>
                    <span className={s.discountUnit}>{offer.unit}</span>
                  </div>

                  <p className={s.subline}>{offer.subtitle}</p>
                </div>

                {/* Perforated ticket tear-line divider with mathematically centered notches */}
                <div className={s.ticketDivider} aria-hidden="true">
                  <span className={s.notchTop} />
                  <span className={s.dashedLine} />
                  <span className={s.notchBottom} />
                </div>

                {/* Right ticket stub: Interactive code box & copy state */}
                <div className={s.cardRight}>
                  <span className={s.codeLabel}>VOUCHER CODE</span>
                  <div className={cn(s.codeBox, isCopied && s.codeBoxCopied)}>
                    <code className={s.codeText}>{offer.code}</code>
                    <span className={s.copyBtn} aria-hidden="true">
                      {isCopied ? (
                        <Check size={12} strokeWidth={3} className={s.checkIcon} />
                      ) : (
                        <Copy size={11} />
                      )}
                    </span>
                  </div>
                  <span className={s.tapHint}>
                    {isCopied ? "Code copied!" : "Tap to copy"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
