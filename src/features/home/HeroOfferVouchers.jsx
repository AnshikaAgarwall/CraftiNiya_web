import { useState } from "react";
import { Check } from "lucide-react";
import { useUI } from "../../context/UIContext.jsx";
import { cn } from "../../lib/cn.js";
import s from "./HeroOfferVouchers.module.css";

const OFFERS = [
  {
    id: "first-user",
    title: "GET EXTRA 15% OFF",
    subtitle: "On Your 1st Purchase",
    code: "NEW15",
    terms: "UP TO ₹300",
    themeClass: s.themePink,
    iconType: "percent",
    tagBg: "#FFE699",
    tagColor: "#581829",
  },
  {
    id: "birthday",
    title: "BIRTHDAY SPECIAL 20%",
    subtitle: "Celebrate Your Month",
    code: "BDAY20",
    terms: "MIN. ORDER ₹999",
    themeClass: s.themeGreen,
    iconType: "birthday",
    tagBg: "#FFE8CC",
    tagColor: "#143721",
  },
  {
    id: "sale",
    title: "FESTIVE SALE EXTRA 10%",
    subtitle: "Extra Off On All Orders",
    code: "FESTIVE10",
    terms: "NO MIN. SPEND",
    themeClass: s.themePeach,
    iconType: "sale",
    tagBg: "#D4F0DF",
    tagColor: "#542510",
  },
];

function VoucherTicketIcon({ type, bg, color }) {
  return (
    <div className={s.ticketWrap}>
      <svg
        width="44"
        height="34"
        viewBox="0 0 46 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={s.ticketSvg}
        aria-hidden="true"
      >
        <path
          d="M4 0H42C44.2 0 46 1.8 46 4V8C44 8 42 9.8 42 12C42 14.2 44 16 46 16V20C44 20 42 21.8 42 24C42 26.2 44 28 46 28V32C46 34.2 44.2 36 42 36H4C1.8 36 0 34.2 0 32V28C2 28 4 26.2 4 24C4 21.8 2 20 0 20V16C2 16 4 14.2 4 12C4 9.8 2 8 0 8V4C0 1.8 1.8 0 4 0Z"
          fill={bg}
        />
      </svg>
      <div className={s.ticketIconInner} style={{ color }}>
        {type === "percent" && <span className={s.ticketGlyph}>%</span>}
        {type === "birthday" && <span className={s.ticketEmoji}>🎂</span>}
        {type === "sale" && <span className={s.ticketEmoji}>⚡</span>}
      </div>
    </div>
  );
}

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

            return (
              <div
                key={offer.id}
                className={cn(s.card, offer.themeClass)}
                onClick={(e) => handleCopy(offer, e)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleCopy(offer, e);
                  }
                }}
                aria-label={`${offer.title} - ${offer.subtitle}. Click to copy code ${offer.code}`}
              >
                {/* Authentic Ticket Notches */}
                <div className={s.notchTop} aria-hidden="true" />
                <div className={s.notchBottom} aria-hidden="true" />
                <div className={s.dashedDivider} aria-hidden="true" />

                {/* Left Ticket Badge */}
                <div className={s.badgeCol}>
                  <VoucherTicketIcon
                    type={offer.iconType}
                    bg={offer.tagBg}
                    color={offer.tagColor}
                  />
                </div>

                {/* Center Content */}
                <div className={s.contentCol}>
                  <h3 className={s.headline}>{offer.title}</h3>
                  <p className={s.subline}>{offer.subtitle}</p>
                </div>

                {/* Right Action / Code Pill */}
                <div className={s.actionCol}>
                  <div className={cn(s.codePill, isCopied && s.codePillCopied)}>
                    {isCopied ? (
                      <>
                        <Check size={12} strokeWidth={3} className={s.checkIcon} />
                        <span>COPIED!</span>
                      </>
                    ) : (
                      <>
                        <span className={s.codePrefix}>USE CODE</span>
                        <span className={s.codeText}>{offer.code}</span>
                      </>
                    )}
                  </div>
                  {offer.terms && (
                    <span className={s.termsText}>{offer.terms}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
