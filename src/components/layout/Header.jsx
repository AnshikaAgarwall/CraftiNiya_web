import { NavLink, Link, useLocation } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
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
 * "Categories" is a disclosure button rather than a link: it opens the mega
 * menu panel below the nav row. Click-to-open, not hover, so the panel cannot
 * ambush a shopper reaching for the row below it, and so it works on touch.
 */
export default function Header() {
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { isAuthenticated, user } = useAuth();
  const { openSearch, menuOpen, toggleMenu, closeMenu } = useUI();
  const { pathname } = useLocation();

  const [condensed, setCondensed] = useState(false);
  const [isMegaMenuOpen, setMegaMenuOpen] = useState(false);
  const headerRef = useRef(null);

  const closeMegaMenu = useCallback(() => setMegaMenuOpen(false), []);

  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => closeMenu(), [pathname, closeMenu]);

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

          {/* The name is the logo — no separate icon mark. */}
          <Link to="/" className={s.brand} aria-label={`${BRAND.name} home`}>
            <span className={s.brandName}>{BRAND.name}</span>
            <span className={s.brandTagline}>{BRAND.tagline}</span>
          </Link>

          <div className={s.actions}>
            <button
              type="button"
              className={s.action}
              onClick={openSearch}
              aria-label="Search products"
            >
              <Search />
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
              <User />
            </Link>
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
                  className={({ isActive }) => cn(s.navLink, isActive && s.navLinkActive)}
                >
                  {item.label}
                </NavLink>
              </li>
            ),
          )}
        </ul>

        {isMegaMenuOpen && <MegaMenu onNavigate={closeMegaMenu} />}
      </nav>

      {/* ---- Mobile navigation ---- */}
      {menuOpen && (
        <nav id="mobile-nav" className={s.mobileNav} aria-label="Mobile">
          <ul>
            {PRIMARY_NAV.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    cn(s.mobileLink, isActive && s.mobileLinkActive)
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li>
              <NavLink to={accountTo} className={s.mobileLink}>
                {isAuthenticated ? "Your account" : "Sign in"}
              </NavLink>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
