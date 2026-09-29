import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Bell,
  Check,
  ChevronRight,
  Copy,
  Flame,
  Package,
  Sparkles,
  Tag,
  Video,
  X,
} from "lucide-react";
import { cn } from "../../lib/cn.js";
import { useUI } from "../../context/UIContext.jsx";
import { INITIAL_NOTIFICATIONS } from "../../data/notifications.js";
import s from "./NotificationCenter.module.css";

const STORAGE_KEY = "craftiniya_read_notifications_v1";

export default function NotificationCenter({
  isOpen,
  onClose,
  onUnreadChange,
}) {
  const navigate = useNavigate();
  const { toast } = useUI();
  const panelRef = useRef(null);

  const [activeTab, setActiveTab] = useState("all");
  const [copiedId, setCopiedId] = useState(null);

  // Read notification IDs stored in localStorage
  const [readIds, setReadIds] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Calculate notifications with active isRead status
  const notifications = useMemo(() => {
    return INITIAL_NOTIFICATIONS.map((item) => ({
      ...item,
      isRead: item.isRead || readIds.includes(item.id),
    }));
  }, [readIds]);

  // Notify parent of unread count
  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  useEffect(() => {
    if (onUnreadChange) {
      onUnreadChange(unreadCount);
    }
  }, [unreadCount, onUnreadChange]);

  // Click outside to close (desktop dropdown)
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e) => {
      // Don't close if clicking inside panel or the bell button
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        !e.target.closest?.("[data-notification-trigger]")
      ) {
        onClose();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Lock body scroll when side drawer is open
  useEffect(() => {
    if (!isOpen) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  // Mark single notification as read
  const markAsRead = (id) => {
    if (!readIds.includes(id)) {
      const next = [...readIds, id];
      setReadIds(next);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Mark all notifications as read
  const markAllAsRead = (e) => {
    e.stopPropagation();
    const allIds = INITIAL_NOTIFICATIONS.map((n) => n.id);
    setReadIds(allIds);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allIds));
    } catch (err) {
      console.error(err);
    }
    toast?.("All notifications marked as read", { type: "info" });
  };

  // 1-click copy coupon code with visual feedback & toast
  const handleCopyCoupon = (e, code, id) => {
    e.stopPropagation();
    markAsRead(id);
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(code);
    }
    setCopiedId(id);
    toast?.(`Coupon "${code}" copied to clipboard!`, { type: "success" });
    setTimeout(() => {
      setCopiedId((curr) => (curr === id ? null : curr));
    }, 2500);
  };

  // Handle card click
  const handleCardClick = (item) => {
    markAsRead(item.id);
    onClose();
    if (item.link) {
      navigate(item.link);
    }
  };

  // Filter items by active tab
  const filteredNotifications = useMemo(() => {
    if (activeTab === "all") return notifications;
    if (activeTab === "creator") return notifications.filter((n) => n.type === "creator");
    if (activeTab === "coupon") return notifications.filter((n) => n.type === "coupon" || n.type === "sale");
    if (activeTab === "product") return notifications.filter((n) => n.type === "product");
    return notifications;
  }, [notifications, activeTab]);

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Backdrop */}
      <div className={s.backdrop} onClick={onClose} aria-hidden="true" />

      {/* Main Notification Right Side Drawer */}
      <div
        className={s.panel}
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Latest Updates and Notifications"
      >
        {/* Panel Header */}
        <div className={s.header}>
          <div className={s.titleArea}>
            <h3 className={s.title}>
              <Sparkles size={17} color="var(--c-brand, #4a6b53)" />
              What's New
            </h3>
            {unreadCount > 0 && (
              <span className={s.unreadCountBadge}>
                {unreadCount} new
              </span>
            )}
          </div>

          <div className={s.headerActions}>
            {unreadCount > 0 && (
              <button
                type="button"
                className={s.markAllBtn}
                onClick={markAllAsRead}
              >
                Mark all read
              </button>
            )}
            <button
              type="button"
              className={s.closeBtn}
              onClick={onClose}
              aria-label="Close updates"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className={s.tabs} role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "all"}
            className={cn(s.tab, activeTab === "all" && s.activeTab)}
            onClick={() => setActiveTab("all")}
          >
            All Updates
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "creator"}
            className={cn(s.tab, activeTab === "creator" && s.activeTab)}
            onClick={() => setActiveTab("creator")}
          >
            🎨 Creators
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "coupon"}
            className={cn(s.tab, activeTab === "coupon" && s.activeTab)}
            onClick={() => setActiveTab("coupon")}
          >
            🏷️ Offers & Coupons
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "product"}
            className={cn(s.tab, activeTab === "product" && s.activeTab)}
            onClick={() => setActiveTab("product")}
          >
            ✨ New Drops
          </button>
        </div>

        {/* Notification Cards List */}
        <div className={s.list}>
          {filteredNotifications.length === 0 ? (
            <div className={s.emptyState}>
              <div className={s.emptyIcon}>
                <Bell size={22} />
              </div>
              <p className={s.emptyText}>No updates right now in this category.</p>
            </div>
          ) : (
            filteredNotifications.map((item) => {
              const isUnread = !item.isRead;
              const isCoupon = item.type === "coupon";
              const isCreator = item.type === "creator";
              const isSale = item.type === "sale";
              const isProduct = item.type === "product";

              return (
                <div
                  key={item.id}
                  className={cn(s.card, isUnread && s.cardUnread)}
                  onClick={() => handleCardClick(item)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleCardClick(item);
                    }
                  }}
                >
                  {/* Unread Glowing Dot */}
                  {isUnread && <span className={s.unreadDot} aria-hidden="true" />}

                  {/* Left Icon / Media Thumbnail */}
                  <div
                    className={cn(
                      s.iconBox,
                      isCreator && s.creatorIconBox,
                      isCoupon && s.couponIconBox,
                      isProduct && s.productIconBox,
                      isSale && s.saleIconBox,
                    )}
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt=""
                        className={s.mediaThumb}
                        loading="lazy"
                      />
                    ) : isCreator ? (
                      <Video size={20} />
                    ) : isCoupon ? (
                      <Tag size={20} />
                    ) : isSale ? (
                      <Flame size={20} />
                    ) : (
                      <Package size={20} />
                    )}
                  </div>

                  {/* Main Content Details */}
                  <div className={s.content}>
                    <div className={s.tagRow}>
                      <span
                        className={cn(
                          s.tag,
                          isCreator && s.creatorTag,
                          isCoupon && s.couponTag,
                          isProduct && s.productTag,
                          isSale && s.saleTag,
                        )}
                      >
                        {item.tag}
                      </span>
                      <span className={s.time}>{item.time}</span>
                    </div>

                    <h4 className={s.cardTitle}>{item.title}</h4>
                    <p className={s.cardDesc}>{item.description}</p>

                    {/* Interactive Coupon Box */}
                    {isCoupon && item.couponCode && (
                      <div className={s.couponBox}>
                        <div>
                          <span className={s.couponCode}>{item.couponCode}</span>
                          {item.minOrder && (
                            <span className={s.couponMeta}> • {item.minOrder}</span>
                          )}
                        </div>
                        <button
                          type="button"
                          className={cn(
                            s.copyCodeBtn,
                            copiedId === item.id && s.copiedBtn,
                          )}
                          onClick={(e) => handleCopyCoupon(e, item.couponCode, item.id)}
                          aria-label={`Copy coupon code ${item.couponCode}`}
                        >
                          {copiedId === item.id ? (
                            <>
                              <Check size={12} /> Copied!
                            </>
                          ) : (
                            <>
                              <Copy size={12} /> Copy
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {/* Action link */}
                    <div className={s.actionRow}>
                      <span className={s.actionLink}>
                        {item.linkText || "View update"}
                        <ChevronRight size={13} />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Bar */}
        <div className={s.footer}>
          <span className={s.footerNote}>Real-time artisan studio updates</span>
          <Link
            to="/sale"
            className={s.viewAllLink}
            onClick={onClose}
          >
            Explore all offers
            <ChevronRight size={13} />
          </Link>
        </div>
      </div>
    </>
  );
}
