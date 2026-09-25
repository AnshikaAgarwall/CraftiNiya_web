import { useState, useRef, useEffect } from "react";
import { Package, RotateCcw, MessageSquare, X, ChevronRight } from "lucide-react";
import s from "./WhatsAppSupport.module.css";

const WHATSAPP_NUMBER = "919876543210";

const SUPPORT_OPTIONS = [
  {
    id: "track",
    title: "Track My Order",
    desc: "Check live delivery & shipment updates",
    icon: Package,
    message: "Hi CraftiNiya, I would like to track my order status. My Order ID is: ",
  },
  {
    id: "return",
    title: "Return & Refund Policy",
    desc: "Queries about returns, replacements & refunds",
    icon: RotateCcw,
    message: "Hi CraftiNiya, I have a query regarding return and refund policy.",
  },
  {
    id: "support",
    title: "Chat with Support Team",
    desc: "Custom orders, bespoke pieces & general help",
    icon: MessageSquare,
    message: "Hi CraftiNiya, I need assistance with your products and support.",
  },
];

export default function WhatsAppSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const getWhatsAppUrl = (msg) => {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className={s.wrapper} ref={popupRef}>
      {/* Floating WhatsApp Action Button */}
      <button
        type="button"
        className={`${s.fab} ${isOpen ? s.fabActive : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Contact Customer Support on WhatsApp"
        aria-expanded={isOpen}
      >
        <svg
          className={s.waIcon}
          viewBox="0 0 24 24"
          width="28"
          height="28"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12.031 2c-5.508 0-9.984 4.477-9.984 9.984 0 1.761.458 3.479 1.328 4.994l-1.411 5.156 5.281-1.385c1.464.798 3.12 1.219 4.786 1.219 5.508 0 9.984-4.477 9.984-9.984s-4.476-9.984-9.984-9.984zm0 18.286c-1.498 0-2.966-.401-4.252-1.162l-.305-.181-3.159.828.843-3.078-.198-.316c-.838-1.332-1.281-2.883-1.281-4.493 0-4.57 3.719-8.286 8.297-8.286 4.577 0 8.297 3.716 8.297 8.286 0 4.57-3.72 8.286-8.242 8.286zm4.545-6.208c-.249-.125-1.472-.727-1.7-.809-.228-.083-.394-.125-.56.125-.166.249-.643.809-.788.975-.145.166-.29.187-.539.062s-1.05-.387-2.001-1.234c-.74-.66-1.239-1.475-1.384-1.724-.145-.249-.015-.384.11-.508.112-.112.249-.29.373-.435.124-.145.166-.249.249-.415.083-.166.042-.311-.021-.435-.062-.125-.56-1.349-.768-1.847-.202-.486-.408-.419-.56-.427l-.477-.008c-.166 0-.435.062-.663.311-.228.249-.871.851-.871 2.075 0 1.224.892 2.407 1.016 2.573.124.166 1.755 2.68 4.251 3.757.594.257 1.058.41 1.42.525.597.19 1.141.163 1.57.099.479-.072 1.472-.602 1.68-1.183.207-.581.207-1.079.145-1.183-.062-.104-.228-.166-.477-.29z" />
        </svg>
      </button>

      {/* Slide-up Support Card */}
      {isOpen && (
        <div className={s.popover} role="dialog" aria-modal="true" aria-label="Customer Support Options">
          <div className={s.popHeader}>
            <div className={s.brandInfo}>
              <div className={s.avatarWrap}>
                <span className={s.avatarDot} />
                <svg
                  className={s.headerWaIcon}
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12.031 2c-5.508 0-9.984 4.477-9.984 9.984 0 1.761.458 3.479 1.328 4.994l-1.411 5.156 5.281-1.385c1.464.798 3.12 1.219 4.786 1.219 5.508 0 9.984-4.477 9.984-9.984s-4.476-9.984-9.984-9.984zm0 18.286c-1.498 0-2.966-.401-4.252-1.162l-.305-.181-3.159.828.843-3.078-.198-.316c-.838-1.332-1.281-2.883-1.281-4.493 0-4.57 3.719-8.286 8.297-8.286 4.577 0 8.297 3.716 8.297 8.286 0 4.57-3.72 8.286-8.242 8.286zm4.545-6.208c-.249-.125-1.472-.727-1.7-.809-.228-.083-.394-.125-.56.125-.166.249-.643.809-.788.975-.145.166-.29.187-.539.062s-1.05-.387-2.001-1.234c-.74-.66-1.239-1.475-1.384-1.724-.145-.249-.015-.384.11-.508.112-.112.249-.29.373-.435.124-.145.166-.249.249-.415.083-.166.042-.311-.021-.435-.062-.125-.56-1.349-.768-1.847-.202-.486-.408-.419-.56-.427l-.477-.008c-.166 0-.435.062-.663.311-.228.249-.871.851-.871 2.075 0 1.224.892 2.407 1.016 2.573.124.166 1.755 2.68 4.251 3.757.594.257 1.058.41 1.42.525.597.19 1.141.163 1.57.099.479-.072 1.472-.602 1.68-1.183.207-.581.207-1.079.145-1.183-.062-.104-.228-.166-.477-.29z" />
                </svg>
              </div>
              <div>
                <h4 className={s.title}>CraftiNiya Support</h4>
                <p className={s.statusText}>Typically replies in minutes</p>
              </div>
            </div>
            <button
              type="button"
              className={s.closeBtn}
              onClick={() => setIsOpen(false)}
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <div className={s.greeting}>
            <p className={s.greetingText}>
              👋 Hello! How can we help you today? Choose an option below to start a WhatsApp chat:
            </p>
          </div>

          <div className={s.optionsList}>
            {SUPPORT_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              return (
                <a
                  key={opt.id}
                  href={getWhatsAppUrl(opt.message)}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={s.optionItem}
                  onClick={() => setIsOpen(false)}
                >
                  <div className={s.optionIconWrap}>
                    <Icon size={18} />
                  </div>
                  <div className={s.optionContent}>
                    <span className={s.optionTitle}>{opt.title}</span>
                    <span className={s.optionDesc}>{opt.desc}</span>
                  </div>
                  <ChevronRight size={16} className={s.chevron} />
                </a>
              );
            })}
          </div>

          <div className={s.footer}>
            <span>Direct WhatsApp assistance by CraftiNiya Team</span>
          </div>
        </div>
      )}
    </div>
  );
}
