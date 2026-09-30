import { NavLink, Link, useLocation } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Bell,
  ChevronDown,
  ChevronRight,
  Gift,
  Handshake,
  Heart,
  HelpCircle,
  Home,
  Info,
  LayoutGrid,
  MapPin,
  MessageCircle,
  Search,
  ShoppingBag,
  Sparkles,
  Sun,
  Moon,
  Tag,
  User,
  Users,
  X,
} from "lucide-react";
import { cn } from "../../lib/cn.js";
import { BRAND, PRIMARY_NAV } from "../../config/site.js";
import { useCart } from "../../context/CartContext.jsx";
import { useWishlist } from "../../context/WishlistContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useUI } from "../../context/UIContext.jsx";
import MegaMenu from "./MegaMenu.jsx";
import PartnersMegaMenu from "./PartnersMegaMenu.jsx";
import NotificationCenter from "./NotificationCenter.jsx";
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

const NAV_ITEM_CONFIG = {
  "/": {
    icon: Home,
    iconClass: "itemIconGreen",
    title: "Home",
    subtitle: "Back to studio showcase & collections",
  },
  "/categories": {
    icon: LayoutGrid,
    iconClass: "itemIconSage",
    title: "All Categories",
    subtitle: "Ceramics, candles, resin & home decor",
  },
  "#partners": {
    icon: Handshake,
    iconClass: "itemIconClay",
    title: "Partners & Creators",
    subtitle: "Artisan collectives & studio makers",
  },
  "/sale": {
    icon: Tag,
    iconClass: "itemIconPink",
    title: "Festive Sale",
    subtitle: "Handcrafted specials up to 40% off",
  },
  "/about": {
    icon: Info,
    iconClass: "itemIconGreen",
    title: "About CraftiNiya",
    subtitle: "Heritage traditions & rural workshops",
  },
};

export default function Header() {
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { isAuthenticated, user } = useAuth();
  const { openSearch, menuOpen, toggleMenu, closeMenu, theme, toggleTheme } = useUI();
  const { pathname } = useLocation();

  const [condensed, setCondensed] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null); // 'categories' | 'partners' | null
  const [mobilePartnersOpen, setMobilePartnersOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const headerRef = useRef(null);
  const closeTimeoutRef = useRef(null);

  const isCategoryMenuOpen = activeMenu === "categories";
  const isPartnersMenuOpen = activeMenu === "partners";

  // Rotate trendy search hints every 2.8s
  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % TRENDY_SEARCH_PLACEHOLDERS.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const closeAllMenus = useCallback(() => {
    clearTimeout(closeTimeoutRef.current);
    setActiveMenu(null);
    setNotificationsOpen(false);
  }, []);

  const openCategoriesMenu = useCallback(() => {
    clearTimeout(closeTimeoutRef.current);
    setActiveMenu("categories");
    setNotificationsOpen(false);
  }, []);

  const openPartnersMenu = useCallback(() => {
    clearTimeout(closeTimeoutRef.current);
    setActiveMenu("partners");
    setNotificationsOpen(false);
  }, []);

  const closeMenuDelayed = useCallback(() => {
    clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
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
    closeAllMenus();
    setMobilePartnersOpen(false);
    setNotificationsOpen(false);
  }, [pathname, closeMenu, closeAllMenus]);

  /* Close mega menus on pointerdown outside or Escape key */
  useEffect(() => {
    if (!activeMenu) return undefined;

    const onPointerDown = (event) => {
      if (!headerRef.current?.contains(event.target)) closeAllMenus();
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") closeAllMenus();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [activeMenu, closeAllMenus]);

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
              onClick={() => {
                setNotificationsOpen(false);
                openSearch();
              }}
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

            {/* Notification Bell Button: Alerts for New Creators, Drops, Sales & Coupons */}
            <div className={s.notificationWrapper}>
              <button
                type="button"
                className={cn(s.action, s.notificationButton, notificationsOpen && s.actionActive)}
                onClick={() => setNotificationsOpen((prev) => !prev)}
                aria-label={`Notifications, ${unreadNotifications} unread`}
                aria-expanded={notificationsOpen}
                data-notification-trigger="true"
              >
                <Bell />
                {unreadNotifications > 0 && (
                  <span className={cn(s.badge, s.notificationBadge)}>
                    {unreadNotifications}
                  </span>
                )}
              </button>

              <NotificationCenter
                isOpen={notificationsOpen}
                onClose={() => setNotificationsOpen(false)}
                onUnreadChange={setUnreadNotifications}
              />
            </div>

            {/* Dark / Light Theme Toggle */}
            <button
              type="button"
              className={cn(s.action, s.themeToggle)}
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            >
              {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
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
              className={cn(s.menuButton, menuOpen && s.menuButtonOpen)}
              onClick={toggleMenu}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <span className={s.hamburgerIcon} aria-hidden="true">
                <span className={cn(s.hamburgerBar, s.hamburgerBarTop)} />
                <span className={cn(s.hamburgerBar, s.hamburgerBarMid)} />
                <span className={cn(s.hamburgerBar, s.hamburgerBarBot)} />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ---- Row 2: primary navigation ---- */}
      <nav className={s.navRow} aria-label="Primary">
        <ul className={cn("container", s.navList)}>
          {PRIMARY_NAV.map((item) => {
            const isCategories = item.to === CATEGORIES_PATH;
            const isPartners =
              item.isTrigger || item.to === "#partners" || item.label === "Partners";

            if (isCategories) {
              return (
                <li key={item.to}>
                  <button
                    type="button"
                    className={cn(
                      s.navLink,
                      s.navTrigger,
                      isCategoryMenuOpen && s.navLinkActive,
                    )}
                    onMouseEnter={openCategoriesMenu}
                    onMouseLeave={closeMenuDelayed}
                    onFocus={openCategoriesMenu}
                    onClick={() =>
                      setActiveMenu((cur) =>
                        cur === "categories" ? null : "categories",
                      )
                    }
                    aria-expanded={isCategoryMenuOpen}
                    aria-controls="mega-menu"
                  >
                    {item.label}
                    <ChevronDown aria-hidden="true" />
                  </button>
                </li>
              );
            }

            if (isPartners) {
              return (
                <li key={item.to || item.label}>
                  <button
                    type="button"
                    className={cn(
                      s.navLink,
                      s.navTrigger,
                      isPartnersMenuOpen && s.navLinkActive,
                    )}
                    onMouseEnter={openPartnersMenu}
                    onMouseLeave={closeMenuDelayed}
                    onFocus={openPartnersMenu}
                    onClick={() =>
                      setActiveMenu((cur) =>
                        cur === "partners" ? null : "partners",
                      )
                    }
                    aria-haspopup="menu"
                    aria-expanded={isPartnersMenuOpen}
                    aria-controls="partners-mega-menu"
                  >
                    {item.label}
                    <ChevronDown aria-hidden="true" />
                  </button>
                </li>
              );
            }

            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    cn(
                      s.navLink,
                      isActive && s.navLinkActive,
                      item.to === "/sale" && s.saleNavLink,
                    )
                  }
                >
                  {item.to === "/sale" ? (
                    <span className={s.salePill}>
                      <span className={s.saleDot} aria-hidden="true" />
                      {item.label}
                      <span className={s.saleSparkle}>%</span>
                    </span>
                  ) : (
                    item.label
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>

        {isCategoryMenuOpen && (
          <div
            onMouseEnter={openCategoriesMenu}
            onMouseLeave={closeMenuDelayed}
          >
            <MegaMenu onNavigate={closeAllMenus} />
          </div>
        )}

        {isPartnersMenuOpen && (
          <div
            onMouseEnter={openPartnersMenu}
            onMouseLeave={closeMenuDelayed}
          >
            <PartnersMegaMenu onNavigate={closeAllMenus} />
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
              <Link to="/" className={s.brand} onClick={closeMenu} aria-label={`${BRAND.name} home`}>
                <span className={s.brandName}>{BRAND.name}</span>
                <span className={s.brandTagline}>{BRAND.tagline}</span>
              </Link>
              <div className={s.drawerHeaderActions}>
                <button
                  type="button"
                  className={s.drawerThemeBtn}
                  onClick={toggleTheme}
                  aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
                  title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
                >
                  {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
                </button>
                <button
                  type="button"
                  className={s.drawerCloseBtn}
                  onClick={closeMenu}
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className={s.drawerBody}>
              {/* User Account / Welcome Offer Banner (matches screenshot banner card) */}
              <div className={s.drawerBannerWrap}>
                <Link
                  to={accountTo}
                  className={s.drawerBannerCard}
                  onClick={closeMenu}
                >
                  <div className={s.drawerBannerContent}>
                    <span className={s.drawerBannerBadge}>
                      {isAuthenticated ? "Studio Member" : "Special Offer"}
                    </span>
                    <h3 className={s.drawerBannerTitle}>
                      {isAuthenticated ? `Hi, ${user?.name || "Member"}` : "Flat 10% Off First Order"}
                    </h3>
                    <p className={s.drawerBannerSubtitle}>
                      {isAuthenticated ? "View profile, orders & saved pieces" : "Handcrafted heirlooms direct from artisans"}
                    </p>
                    <div className={s.drawerBannerAction}>
                      <span>{isAuthenticated ? "My Account" : "Explore Now"}</span>
                      <ArrowRight size={13} aria-hidden="true" />
                    </div>
                  </div>
                  <div className={s.drawerBannerBadgeCircle}>
                    {isAuthenticated && user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt="" className={s.userAvatarImg} />
                    ) : (
                      <Sparkles size={20} className={s.drawerBannerStarIcon} />
                    )}
                  </div>
                </Link>
              </div>

              {/* Quick Highlight Cards (matches screenshot 3-card row) */}
              <div className={s.drawerQuickRow}>
                <Link to="/categories" className={s.drawerQuickCard} onClick={closeMenu}>
                  <div className={cn(s.drawerQuickIcon, s.quickIconGreen)}>
                    <LayoutGrid size={18} />
                  </div>
                  <span className={s.drawerQuickLabel}>Shop All</span>
                </Link>
                <Link to="/sale" className={s.drawerQuickCard} onClick={closeMenu}>
                  <div className={cn(s.drawerQuickIcon, s.quickIconPink)}>
                    <Tag size={18} />
                  </div>
                  <span className={s.drawerQuickLabel}>Sale 40%</span>
                </Link>
                <Link to="/gift-box" className={s.drawerQuickCard} onClick={closeMenu}>
                  <div className={cn(s.drawerQuickIcon, s.quickIconSage)}>
                    <Gift size={18} />
                  </div>
                  <span className={s.drawerQuickLabel}>Gift Boxes</span>
                </Link>
              </div>

              {/* Browse Categories Section Header */}
              <div className={s.drawerSectionHeader}>
                <span>Browse Categories</span>
              </div>

              {/* Category / Nav List Items */}
              <ul className={s.drawerCategoryList}>
                {PRIMARY_NAV.map((item) => {
                  const isPartners =
                    item.isTrigger || item.to === "#partners" || item.label === "Partners";
                  const conf = NAV_ITEM_CONFIG[item.to] || {
                    icon: LayoutGrid,
                    iconClass: "itemIconGreen",
                    title: item.label,
                    subtitle: "Handcrafted studio collections",
                  };
                  const Icon = conf.icon;

                  if (isPartners) {
                    return (
                      <li key={item.to || item.label} className={s.drawerCategoryLi}>
                        <button
                          type="button"
                          className={cn(
                            s.drawerCategoryItem,
                            s.drawerCategoryItemBtn,
                            mobilePartnersOpen && s.drawerItemActive,
                          )}
                          onClick={() => setMobilePartnersOpen((prev) => !prev)}
                          aria-expanded={mobilePartnersOpen}
                          aria-controls="mobile-partners-submenu"
                        >
                          <div className={cn(s.drawerItemIcon, s[conf.iconClass])}>
                            <Icon size={18} />
                          </div>
                          <div className={s.drawerItemText}>
                            <span className={s.drawerItemTitle}>{conf.title}</span>
                            <span className={s.drawerItemSubtitle}>{conf.subtitle}</span>
                          </div>
                          <ChevronDown
                            size={16}
                            className={cn(
                              s.drawerItemChevron,
                              mobilePartnersOpen && s.drawerChevronOpen,
                            )}
                            aria-hidden="true"
                          />
                        </button>

                        {mobilePartnersOpen && (
                          <ul id="mobile-partners-submenu" className={s.drawerSubMenuList}>
                            <li>
                              <Link
                                to="/collaborations"
                                className={s.drawerSubItemRow}
                                onClick={closeMenu}
                              >
                                <div className={cn(s.drawerSubIconWrap, s.itemIconGreen)}>
                                  <Sparkles size={15} />
                                </div>
                                <div className={s.drawerItemText}>
                                  <span className={s.drawerSubItemTitle}>Brand Collaborations</span>
                                  <span className={s.drawerItemSubtitle}>Limited edition artisan craft sets</span>
                                </div>
                                <ChevronRight size={14} className={s.drawerItemChevron} />
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="/creators"
                                className={s.drawerSubItemRow}
                                onClick={closeMenu}
                              >
                                <div className={cn(s.drawerSubIconWrap, s.itemIconSage)}>
                                  <Users size={15} />
                                </div>
                                <div className={s.drawerItemText}>
                                  <span className={s.drawerSubItemTitle}>Creators &amp; Artisans</span>
                                  <span className={s.drawerItemSubtitle}>Independent studio makers &amp; NGOs</span>
                                </div>
                                <ChevronRight size={14} className={s.drawerItemChevron} />
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="/partner-picks"
                                className={s.drawerSubItemRow}
                                onClick={closeMenu}
                              >
                                <div className={cn(s.drawerSubIconWrap, s.itemIconPink)}>
                                  <ShoppingBag size={15} />
                                </div>
                                <div className={s.drawerItemText}>
                                  <span className={s.drawerSubItemTitle}>Partner Picks</span>
                                  <span className={s.drawerItemSubtitle}>Curated affiliate workshop designs</span>
                                </div>
                                <ChevronRight size={14} className={s.drawerItemChevron} />
                              </Link>
                            </li>
                          </ul>
                        )}
                      </li>
                    );
                  }

                  return (
                    <li key={item.to} className={s.drawerCategoryLi}>
                      <NavLink
                        to={item.to}
                        end={item.to === "/"}
                        onClick={closeMenu}
                        className={({ isActive }) =>
                          cn(
                            s.drawerCategoryItem,
                            isActive && s.drawerItemActive,
                          )
                        }
                      >
                        <div className={cn(s.drawerItemIcon, s[conf.iconClass])}>
                          <Icon size={18} />
                        </div>
                        <div className={s.drawerItemText}>
                          <div className={s.drawerTitleRow}>
                            <span className={s.drawerItemTitle}>{conf.title}</span>
                            {item.to === "/sale" && (
                              <span className={s.drawerSalePill}>40% OFF</span>
                            )}
                          </div>
                          <span className={s.drawerItemSubtitle}>{conf.subtitle}</span>
                        </div>
                        <ChevronRight size={16} className={s.drawerItemChevron} />
                      </NavLink>
                    </li>
                  );
                })}
              </ul>

              {/* Customer Care Section */}
              <div className={s.drawerSectionHeader}>
                <span>Customer Care</span>
              </div>
              <ul className={s.drawerCategoryList}>
                <li className={s.drawerCategoryLi}>
                  <Link to="/track-order" className={s.drawerCategoryItem} onClick={closeMenu}>
                    <div className={cn(s.drawerItemIcon, s.itemIconClay)}>
                      <MapPin size={18} />
                    </div>
                    <div className={s.drawerItemText}>
                      <span className={s.drawerItemTitle}>Track Your Order</span>
                      <span className={s.drawerItemSubtitle}>Real-time delivery &amp; dispatch updates</span>
                    </div>
                    <ChevronRight size={16} className={s.drawerItemChevron} />
                  </Link>
                </li>
                <li className={s.drawerCategoryLi}>
                  <Link to="/faq" className={s.drawerCategoryItem} onClick={closeMenu}>
                    <div className={cn(s.drawerItemIcon, s.itemIconGreen)}>
                      <HelpCircle size={18} />
                    </div>
                    <div className={s.drawerItemText}>
                      <span className={s.drawerItemTitle}>Help &amp; FAQs</span>
                      <span className={s.drawerItemSubtitle}>Care guides, shipping &amp; returns</span>
                    </div>
                    <ChevronRight size={16} className={s.drawerItemChevron} />
                  </Link>
                </li>
                <li className={s.drawerCategoryLi}>
                  <Link to="/contact" className={s.drawerCategoryItem} onClick={closeMenu}>
                    <div className={cn(s.drawerItemIcon, s.itemIconSage)}>
                      <MessageCircle size={18} />
                    </div>
                    <div className={s.drawerItemText}>
                      <span className={s.drawerItemTitle}>Contact Support</span>
                      <span className={s.drawerItemSubtitle}>Direct assistance from studio team</span>
                    </div>
                    <ChevronRight size={16} className={s.drawerItemChevron} />
                  </Link>
                </li>
              </ul>
            </div>

            {/* Drawer Footer */}
            <div className={s.drawerFooter}>
              <div className={s.drawerFooterNote}>
                <span>🌿 Handcrafted with love in India</span>
              </div>
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}