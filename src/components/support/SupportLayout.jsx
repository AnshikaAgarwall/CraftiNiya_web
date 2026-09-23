import { useEffect, useRef } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import {
  HelpCircle,
  Truck,
  RotateCcw,
  FileText,
  ShieldCheck,
  Mail,
  MapPin,
  MessageCircle,
  Clock,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import SEO from "../common/SEO.jsx";
import { BRAND } from "../../config/site.js";
import s from "./SupportLayout.module.css";

export const SUPPORT_LINKS = [
  { label: "Help & FAQs", to: "/faq", icon: HelpCircle },
  { label: "Track Your Order", to: "/track-order", icon: MapPin },
  { label: "Shipping Policy", to: "/shipping-policy", icon: Truck },
  { label: "Returns & Refunds", to: "/return-refund-policy", icon: RotateCcw },
  { label: "Contact Us", to: "/contact", icon: Mail },
  { label: "Terms & Conditions", to: "/terms-and-conditions", icon: FileText },
  { label: "Privacy Policy", to: "/privacy-policy", icon: ShieldCheck },
];

export default function SupportLayout({
  title,
  subtitle,
  badge = "Customer Support",
  seoTitle,
  seoDescription,
  showMobileHelp = true,
  children,
}) {
  const location = useLocation();
  const navRef = useRef(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const activeEl = nav.querySelector(`.${s.navLinkActive}`);
    if (!activeEl) return;

    // Only scroll the nav element itself, NEVER the window or viewport
    const targetScroll = activeEl.offsetLeft - (nav.clientWidth - activeEl.clientWidth) / 2;
    nav.scrollTo({
      left: Math.max(0, targetScroll),
      behavior: "smooth",
    });
  }, [location.pathname]);

  return (
    <>
      <SEO
        title={seoTitle || `${title} — ${BRAND.name}`}
        description={seoDescription || subtitle || `${title} for Craftiniya handmade studio.`}
      />

      <div className={s.pageWrap}>
        {/* Top Header Banner */}
        <header className={s.headerBanner}>
          <div className={`container ${s.headerContainer}`}>
            <div className={s.breadcrumbs}>
              <Link to="/" className={s.crumbLink}>Home</Link>
              <span className={s.crumbSeparator}>/</span>
              <span className={s.crumbCurrent}>Customer Support</span>
            </div>

            <span className={s.badge}>
              <Sparkles size={13} /> {badge}
            </span>

            <h1 className={s.pageTitle}>{title}</h1>
            {subtitle && <p className={s.pageSubtitle}>{subtitle}</p>}
          </div>
        </header>

        {/* Main 2-Column Support Layout */}
        <div className={`container ${s.mainContainer}`}>
          {/* Left Nav (Sticky Sidebar on Desktop, Horizontal Scroll on Mobile) */}
          <aside className={s.sidebar}>
            <div className={s.sidebarNavWrap}>
              <p className={s.navTitle}>Support & Policies</p>
              <nav ref={navRef} className={s.nav} aria-label="Customer support navigation">
                {SUPPORT_LINKS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `${s.navLink} ${isActive ? s.navLinkActive : ""}`
                      }
                    >
                      <Icon size={17} className={s.navIcon} />
                      <span className={s.navLabel}>{item.label}</span>
                      <ChevronRight size={14} className={s.navArrow} />
                    </NavLink>
                  );
                })}
              </nav>

              {/* Direct Help Card */}
              <div className={s.helpCard}>
                <div className={s.helpCardHeader}>
                  <MessageCircle size={18} className={s.helpIcon} />
                  <h3 className={s.helpHeading}>Need quick help?</h3>
                </div>
                <p className={s.helpText}>
                  Our artisan studio is here for you. We typically respond within 4 hours.
                </p>
                <div className={s.helpChannels}>
                  <a
                    href="https://wa.me/919876543210?text=Hi%20CraftiNiya,%20I%20need%20help%20with%20my%20order"
                    target="_blank"
                    rel="noreferrer noopener"
                    className={s.whatsappBtn}
                  >
                    <MessageCircle size={15} /> WhatsApp Support
                  </a>
                  <a href={`mailto:${BRAND.email}`} className={s.emailLink}>
                    <Mail size={14} /> {BRAND.email}
                  </a>
                </div>
                <div className={s.hours}>
                  <Clock size={12} /> Mon–Sat: 10:00 AM – 7:00 PM IST
                </div>
              </div>
            </div>
          </aside>

          {/* Right Content Area */}
          <main className={s.contentArea}>
            {children}

            {/* Mobile Direct Studio Help Card (shows cleanly beneath content on mobile/tablet) */}
            {showMobileHelp && (
              <div className={s.mobileHelpCard}>
                <div className={s.mobileHelpTop}>
                  <div className={s.mobileHelpHeader}>
                    <MessageCircle size={16} className={s.helpIcon} />
                    <h4 className={s.mobileHelpHeading}>Need quick human help?</h4>
                  </div>
                  <p className={s.mobileHelpText}>
                    Our artisan team typically responds within 4 hours.
                  </p>
                </div>
                <div className={s.mobileHelpActions}>
                  <a
                    href="https://wa.me/919876543210?text=Hi%20CraftiNiya,%20I%20need%20help%20with%20my%20order"
                    target="_blank"
                    rel="noreferrer noopener"
                    className={s.mobileWhatsappBtn}
                  >
                    <MessageCircle size={14} /> WhatsApp Support
                  </a>
                  <a href={`mailto:${BRAND.email}`} className={s.mobileEmailLink}>
                    <Mail size={14} /> Email Studio
                  </a>
                </div>
                <div className={s.mobileHours}>
                  <Clock size={11} /> Mon–Sat: 10:00 AM – 7:00 PM IST
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
