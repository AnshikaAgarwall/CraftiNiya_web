import { NavLink, Link, useLocation } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  Heart,
  HelpCircle,
  MapPin,
  Menu,
  MessageCircle,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { cn } from "../../lib/cn.js";
import { BRAND, PRIMARY_NAV } from "../../config/site.js";
import { useCart } from "../../context/CartContext.jsx";
import { useWishlist } from "../../context/WishlistContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useUI } from "../../context/UIContext.jsx";
import MegaMenu from "./MegaMenu.jsx";
import s from "./Header.module.css";

/** The nav entry that opens the mega menu instead of routing. */
const CATEGORIES_PATH = "/categories";

const TRENDY_SEARCH_PLACEHOLDERS = [
  "Search 'resin botanical coasters'...",
  "Search 'hand-poured soy candles'...",
  "Search 'festive gift hampers'...",
  "Search 'ceramic coffee mugs'...",
  "Search 'macrame wall hanging'...",
  "Search 'pressed floral trays'...",
  "Search 'curated gift boxes'...",
];

/**
 * Two-tier header.
 *
 *   Row 1 — brand centred, utility icons right
 *   Row 2 — primary navigation, centred
 *
 * On mobile the second row collapses into a drawer and the brand shifts left,
 * because a centred wordmark plus four icons does not fit a 360px viewport
 * without either wrapping or shrinking the tap targets below 44px.
 *
 * "Categories" opens the mega menu on hover (and click for accessibility).
 * Closes when mouse leaves the trigger + panel, or on outside click / Escape.
 */
export default function Header() {
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { isAuthenticated, user } = useAuth();
  const { openSearch, menuOpen, toggleMenu, closeMenu } = useUI();
  const { pathname } = useLocation();

  const [condensed, setCondensed] = useState(false);
  const [isMegaMenuOpen, setMegaMenuOpen] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const headerRef = useRef(null);
  const closeTimeoutRef = useRef(null);

  // Rotate trendy search hints every 2.8s
  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % TRENDY_SEARCH_PLACEHOLDERS.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const closeMegaMenu = useCallback(() => {
    clearTimeout(closeTimeoutRef.current);
    setMegaMenuOpen(false);
  }, []);

  const openMegaMenu = useCallback(() => {
    clearTimeout(closeTimeoutRef.current);
    setMegaMenuOpen(true);
  }, []);

  const closeMegaMenuDelayed = useCallback(() => {
    clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => {
      setMegaMenuOpen(false);
    }, 150);
  }, []);

  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    closeMenu();
  }, [pathname]);

  /* Every link inside the panel closes it through onNavigate, so routing is
     already covered. This handles the rest: a click anywhere outside the
     header, and Escape. Bound on
     pointerdown so a click that both closes the panel and hits something
     underneath still does the second thing. */
  useEffect(() => {
    if (!isMegaMenuOpen) return undefined;

    const onPointerDown = (event) => {
      if (!headerRef.current?.contains(event.target)) closeMegaMenu();
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") closeMegaMenu();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isMegaMenuOpen, closeMegaMenu]);

  const accountTo = isAuthenticated ? "/account" : "/auth?mode=signin";

  return (
    <header className={cn(s.header, condensed && s.condensed)} ref={headerRef}>
      {/* ---- Row 1: brand + utilities ---- */}
      <div className={s.brandRow}>
        <div className={cn("container", s.brandInner)}>
          {/* The name is the logo — no separate icon mark. */}
          <Link to="/" className={s.brand} aria-label={`${BRAND.name} home`}>
            <span className={s.brandName}>{BRAND.name}</span>
            <span className={s.brandTagline}>{BRAND.tagline}</span>
          </Link>

          <div className={s.actions}>
            {/* Expandable Search: sits as search icon in actions; on desktop/tablet, smoothly slides out revealing trendy placeholders array; on mobile remains clean icon */}
            <button
              type="button"
              className={s.searchExpandable}
              onClick={openSearch}
              aria-label="Search products and categories"
            >
              <span className={s.searchIconWrapper}>
                <Search size={19} />
              </span>
              <span className={s.searchSlideArea}>
                <span className={s.searchPlaceholderWrapper}>
                  <span key={placeholderIndex} className={s.searchPlaceholderText}>
                    {TRENDY_SEARCH_PLACEHOLDERS[placeholderIndex]}
                  </span>
                </span>
              </span>
            </button>

            <Link
              to="/wishlist"
              className={s.action}
              aria-label={`Wishlist, ${wishlistCount} items`}
            >
              <Heart />
              {wishlistCount > 0 && <span className={s.badge}>{wishlistCount}</span>}
            </Link>

            <Link
              to="/cart"
              className={s.action}
              aria-label={`Shopping bag, ${itemCount} items`}
            >
              <ShoppingBag />
              {itemCount > 0 && <span className={s.badge}>{itemCount}</span>}
            </Link>

            <Link
              to={accountTo}
              className={cn(s.action, s.accountAction)}
              aria-label={isAuthenticated ? `Account, signed in as ${user?.name}` : "Sign in"}
            >
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt=""
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "1.5px solid var(--c-brand)",
                  }}
                />
              ) : (
                <User />
              )}
            </Link>

            {/* Hamburger menu button appears next to cart on mobile/tablet */}
            <button
              type="button"
              className={s.menuButton}
              onClick={toggleMenu}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* ---- Row 2: primary navigation ---- */}
      <nav className={s.navRow} aria-label="Primary">
        <ul className={cn("container", s.navList)}>
          {PRIMARY_NAV.map((item) =>
            item.to === CATEGORIES_PATH ? (
              <li key={item.to}>
                <button
                  type="button"
                  className={cn(s.navLink, s.navTrigger, isMegaMenuOpen && s.navLinkActive)}
                  onMouseEnter={openMegaMenu}
                  onMouseLeave={closeMegaMenuDelayed}
                  onClick={() => setMegaMenuOpen((open) => !open)}
                  aria-expanded={isMegaMenuOpen}
                  aria-controls="mega-menu"
                >
                  {item.label}
                  <ChevronDown aria-hidden="true" />
                </button>
              </li>
            ) : (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    cn(
                      s.navLink,
                      isActive && s.navLinkActive,
                      item.to === "/sale" && s.saleNavLink,
                      item.isGift && s.giftNavLink,
                    )
                  }
                >
                  {item.to === "/sale" ? (
                    <span className={s.salePill}>
                      <span className={s.saleDot} aria-hidden="true" />
                      {item.label}
                      <span className={s.saleSparkle}>%</span>
                    </span>
                  ) : item.isGift ? (
                    <span className={s.giftNavText}>
                      <span className={s.yellowBlinkDot} aria-hidden="true" />
                      {item.label}
                    </span>
                  ) : (
                    item.label
                  )}
                </NavLink>
              </li>
            ),
          )}
        </ul>

        {isMegaMenuOpen && (
          <div
            onMouseEnter={openMegaMenu}
            onMouseLeave={closeMegaMenuDelayed}
          >
            <MegaMenu onNavigate={closeMegaMenu} />
          </div>
        )}
      </nav>

      {/* ---- Mobile navigation drawer ---- */}
      {menuOpen && (
        <div className={s.mobileNavRoot}>
          {/* Backdrop overlay */}
          <div
            className={s.mobileBackdrop}
            onClick={closeMenu}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <aside
            id="mobile-nav"
            className={s.mobileDrawer}
            aria-label="Mobile Navigation"
          >
            {/* Drawer Header */}
            <div className={s.drawerHeader}>
              <div className={s.drawerBrand}>
                <span className={s.drawerBrandName}>{BRAND.name}</span>
                <span className={s.drawerBrandTagline}>{BRAND.tagline}</span>
              </div>
              <button
                type="button"
                className={s.drawerCloseBtn}
                onClick={closeMenu}
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            {/* User Account Bar */}
            <div className={s.drawerUserBar}>
              <Link
                to={accountTo}
                className={s.drawerUserLink}
                onClick={closeMenu}
              >
                <div className={s.drawerUserAvatar}>
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="" className={s.userAvatarImg} />
                  ) : (
                    <User size={18} />
                  )}
                </div>
                <div className={s.drawerUserInfo}>
                  <span className={s.drawerUserName}>
                    {isAuthenticated ? user?.name || "My Account" : "Sign In / Register"}
                  </span>
                  <span className={s.drawerUserSub}>
                    {isAuthenticated ? "View profile & orders" : "10% off your first handcrafted order"}
                  </span>
                </div>
                <ArrowRight size={14} className={s.drawerUserArrow} />
              </Link>
            </div>

            {/* Navigation links */}
            <nav className={s.drawerNav}>
              <div className={s.drawerSectionTitle}>Explore Studio</div>
              <ul className={s.drawerList}>
                {PRIMARY_NAV.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.to === "/"}
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        cn(
                          s.drawerLink,
                          isActive && s.drawerLinkActive,
                          item.to === "/sale" && s.drawerSaleLink,
                        )
                      }
                    >
                      <span className={s.drawerLinkText}>
                        {item.isGift ? (
                          <span className={s.giftNavText}>
                            <span className={s.yellowBlinkDot} aria-hidden="true" />
                            {item.label}
                          </span>
                        ) : (
                          item.label
                        )}
                      </span>

                      {item.to === "/sale" && (
                        <span className={s.drawerSaleBadge}>
                          <span className={s.saleDot} aria-hidden="true" />
                          40% OFF
                        </span>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>

              {/* Quick Customer Support inside drawer */}
              <div className={s.drawerSectionTitle}>Customer Care</div>
              <ul className={s.drawerSecondaryList}>
                <li>
                  <Link to="/track-order" className={s.drawerSubLink} onClick={closeMenu}>
                    <MapPin size={15} className={s.drawerSubIcon} />
                    <span>Track Your Order</span>
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className={s.drawerSubLink} onClick={closeMenu}>
                    <HelpCircle size={15} className={s.drawerSubIcon} />
                    <span>Help & FAQs</span>
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className={s.drawerSubLink} onClick={closeMenu}>
                    <MessageCircle size={15} className={s.drawerSubIcon} />
                    <span>Contact Support</span>
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Bottom studio WhatsApp button in drawer */}
            <div className={s.drawerFooter}>
              <a
                href="https://wa.me/919876543210?text=Hi%20CraftiNiya,%20I%20have%20an%20enquiry"
                target="_blank"
                rel="noreferrer noopener"
                className={s.drawerWhatsappBtn}
              >
                <MessageCircle size={16} />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}