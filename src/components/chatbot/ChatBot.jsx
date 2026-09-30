import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Truck,
  RotateCcw,
  MessageCircle,
  Mail,
  Sparkles,
  Gift,
  HelpCircle,
  FileText,
  History,
  Users,
  ChevronRight,
  ExternalLink,
  ShoppingBag,
  X,
  Send,
  ArrowRight,
} from "lucide-react";
import productService from "../../services/productService.js";
import { formatINR } from "../../lib/money.js";
import s from "./ChatBot.module.css";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80";

const QUICK_TOPICS = [
  { label: "📦 Track Order", query: "Track Order" },
  { label: "🚚 Shipping Policy", query: "Shipping Policy" },
  { label: "🔄 Returns & Refunds", query: "Return Policy" },
  { label: "💬 Customer Support", query: "Customer Support" },
  { label: "✨ About CraftiNiya", query: "About CraftiNiya" },
  { label: "🎁 Custom Gift Box", query: "Gift Box" },
];

const SUPPORT_KNOWLEDGE = [
  {
    id: "track_order",
    keywords: ["track", "order status", "kahan hai", "where is my order", "tracking", "shipment", "docket", "parcel"],
    response: {
      text: "You can track your order live using your Order ID (e.g. CN-84920) or your registered mobile number. All parcels are dispatched within 24–48 hours via Bluedart and Delhivery with real-time tracking.",
      actionLinks: [
        { label: "Track Your Order", to: "/track-order", icon: "Package" },
        { label: "View Order History", to: "/account/orders", icon: "History" },
      ],
      chips: ["Shipping Policy", "Customer Support", "Return Policy"],
    },
  },
  {
    id: "shipping_policy",
    keywords: ["shipping", "delivery", "courier", "charges", "free shipping", "dispatch", "kitne din", "delivery time", "kab tak", "pahuchega", "shipping cost"],
    response: {
      text: "🚚 Shipping & Delivery Policy Highlights:\n• Free Shipping across India on all orders above ₹999 (flat ₹69 below ₹999).\n• Dispatched within 24–48 hours from our Jaipur studio.\n• Standard delivery reaches in 3–6 business days with SMS & WhatsApp updates.",
      actionLinks: [
        { label: "Shipping & Delivery Policy", to: "/shipping-policy", icon: "Truck" },
        { label: "Track Live Order", to: "/track-order", icon: "Package" },
      ],
      chips: ["Track Order", "Return & Refund", "Customer Support"],
    },
  },
  {
    id: "return_policy",
    keywords: ["return", "refund", "replace", "replacement", "exchange", "cancel", "damaged", "broken", "wapas", "money back", "defective", "tuta"],
    response: {
      text: "🔄 7-Day Hassle-Free Returns & Replacements:\n• Received a broken or defective piece? We offer a 100% free replacement or instant refund.\n• Simply share an unboxing photo or video within 7 days of delivery.\n• Personalized/custom bespoke items cannot be returned unless damaged in transit.",
      actionLinks: [
        { label: "Return & Refund Policy", to: "/return-refund-policy", icon: "RotateCcw" },
        { label: "Request via WhatsApp", href: "https://wa.me/919876543210?text=Hi%20CraftiNiya,%20I%20have%20an%20issue%20with%20my%20order", icon: "MessageCircle" },
        { label: "Contact Support Form", to: "/contact", icon: "Mail" },
      ],
      chips: ["Track Order", "Customer Support", "Shipping Policy"],
    },
  },
  {
    id: "contact_support",
    keywords: ["contact", "support", "customer care", "phone", "number", "email", "whatsapp", "help", "reach", "call", "complaint", "talk", "madad", "care", "cust care"],
    response: {
      text: "💬 CraftiNiya Customer Care & Studio Desk:\n• WhatsApp: Instant replies for order updates, custom design briefs, and photos.\n• Email: hello@craftiniya.in\n• Studio Hours: Mon – Sat, 10:00 AM – 7:00 PM IST (Typical reply within 4 hours).",
      actionLinks: [
        { label: "Chat on WhatsApp", href: "https://wa.me/919876543210?text=Hi%20CraftiNiya,%20I%20need%20assistance", icon: "MessageCircle" },
        { label: "Send Message via Form", to: "/contact", icon: "Mail" },
        { label: "Help & FAQs", to: "/faq", icon: "HelpCircle" },
      ],
      chips: ["Track Order", "Return Policy", "About CraftiNiya"],
    },
  },
  {
    id: "about_craftiniya",
    keywords: ["about", "who are you", "craftiniya", "story", "artisan", "handmade", "maker", "brand", "kya hai", "heritage", "jaipur"],
    response: {
      text: "🌿 About CraftiNiya:\nCraftiNiya is an independent artisanal home decor and bespoke gifting studio in Jaipur. We handcraft botanical crystal resin, hand-poured soy aroma candles, and collaborate with 45+ rural women artisans to preserve heritage arts while ensuring 100% fair wages.",
      actionLinks: [
        { label: "Our Story & Studio", to: "/about", icon: "Sparkles" },
        { label: "Meet Creators & Artisans", to: "/creators", icon: "Users" },
        { label: "Exclusive Collaborations", to: "/collaborations", icon: "Gift" },
      ],
      chips: ["Popular Best Sellers", "Gift Box Customizer", "Customer Support"],
    },
  },
  {
    id: "gift_box_custom",
    keywords: ["gift box", "hamper", "custom box", "customise", "bundle", "corporate", "bulk", "gift ideas", "gifting", "hampers"],
    response: {
      text: "🎁 Custom Gift Boxes & Studio Bundles:\n• Build a custom gift box in 4 steps with handcrafted resin, soy candles, and handwritten note cards.\n• We also curate corporate bulk gifting and wedding favours with bespoke branding.",
      actionLinks: [
        { label: "Build a Custom Gift Box", to: "/gift-box", icon: "Gift" },
        { label: "Budget Gifting Store", to: "/budget-gifting", icon: "Sparkles" },
        { label: "Corporate Bulk Enquiry", to: "/contact", icon: "Mail" },
      ],
      chips: ["Under ₹499 Gifts", "Shipping Policy", "Track Order"],
    },
  },
  {
    id: "faq_care",
    keywords: ["faq", "care", "resin care", "clean", "maintenance", "candle care", "safe", "how to use", "heat"],
    response: {
      text: "✨ Product Care & Maintenance Guide:\n• Resin Art: Wipe with a soft dry microfiber cloth. Keep away from harsh abrasive scrubbers and prolonged extreme heat.\n• Soy Candles: Trim wick to 1/4 inch; burn on a flat heat-safe surface for an even melt pool.",
      actionLinks: [
        { label: "Browse All FAQs & Guides", to: "/faq", icon: "HelpCircle" },
        { label: "Customer Support Desk", to: "/contact", icon: "Mail" },
      ],
      chips: ["Return Policy", "Shipping Policy", "Contact Support"],
    },
  },
  {
    id: "policies_legal",
    keywords: ["policy", "policies", "terms", "privacy", "conditions", "cod", "payment", "secure"],
    response: {
      text: "📜 CraftiNiya Store Policies:\n• Payments: 100% 256-bit SSL encrypted (UPI, Cards, NetBanking, COD).\n• Transparent policies for customer delight and artisan respect.",
      actionLinks: [
        { label: "Terms & Conditions", to: "/terms", icon: "FileText" },
        { label: "Privacy Policy", to: "/privacy-policy", icon: "FileText" },
        { label: "Shipping Policy", to: "/shipping-policy", icon: "Truck" },
        { label: "Return & Refund Policy", to: "/return-refund-policy", icon: "RotateCcw" },
      ],
      chips: ["Return Policy", "Track Order", "Customer Support"],
    },
  },
];

function renderActionIcon(iconName) {
  switch (iconName) {
    case "Package":
      return <Package size={15} />;
    case "Truck":
      return <Truck size={15} />;
    case "RotateCcw":
      return <RotateCcw size={15} />;
    case "MessageCircle":
      return <MessageCircle size={15} />;
    case "Mail":
      return <Mail size={15} />;
    case "Sparkles":
      return <Sparkles size={15} />;
    case "Gift":
      return <Gift size={15} />;
    case "HelpCircle":
      return <HelpCircle size={15} />;
    case "FileText":
      return <FileText size={15} />;
    case "History":
      return <History size={15} />;
    case "Users":
      return <Users size={15} />;
    default:
      return <ChevronRight size={15} />;
  }
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Namaste! I'm your CraftiNiya Studio Assistant 🌿 How can I help you today? You can ask about products, track your order, customer care, or store policies.",
      chips: ["📦 Track Order", "🚚 Shipping Policy", "🔄 Returns & Refunds", "💬 Customer Support", "✨ About Us"],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, loading]);

  const processQuery = async (queryText) => {
    const trimmed = queryText.trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [...prev, { type: "user", text: trimmed }]);
    setInput("");
    setLoading(true);

    const lowerQuery = trimmed.toLowerCase();

    // 1. Check if query matches support, policies, about, or FAQs
    for (const item of SUPPORT_KNOWLEDGE) {
      const match = item.keywords.some((kw) => lowerQuery.includes(kw));
      if (match) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              type: "bot",
              text: item.response.text,
              actionLinks: item.response.actionLinks,
              chips: item.response.chips,
            },
          ]);
          setLoading(false);
        }, 300);
        return;
      }
    }

    // 2. Otherwise, treat as product / gifting / decor search
    try {
      let res = await productService.getProducts({ q: trimmed, pageSize: 4 });
      let matchedProducts = res.items || [];

      if (matchedProducts.length === 0) {
        const words = lowerQuery
          .replace(/[^a-z0-9\s]/g, "")
          .split(/\s+/)
          .filter(
            (w) =>
              w.length > 2 &&
              !["for", "the", "and", "want", "need", "show", "some", "with", "this", "that", "give"].includes(w)
          );

        for (const word of words) {
          const wordRes = await productService.getProducts({ q: word, pageSize: 4 });
          if (wordRes.items?.length) {
            matchedProducts = wordRes.items;
            break;
          }
        }
      }

      if (matchedProducts.length > 0) {
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            text: `Here are our handcrafted recommendations for "${trimmed}":`,
            products: matchedProducts.slice(0, 3),
            chips: ["Shipping Info", "Track Order", "Customer Support"],
          },
        ]);
      } else {
        const popularRes = await productService.getProducts({
          sort: "popular",
          pageSize: 3,
        });
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            text: `I couldn't find an exact match for "${trimmed}". Here are our most loved studio bestsellers, or feel free to check our policies and customer support below:`,
            products: popularRes.items?.slice(0, 3) || [],
            actionLinks: [
              { label: "Contact Customer Support", to: "/contact", icon: "Mail" },
              { label: "Browse FAQs", to: "/faq", icon: "HelpCircle" },
            ],
            chips: ["📦 Track Order", "🚚 Shipping Policy", "🔄 Returns & Refunds"],
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: "Something went wrong while searching. You can reach our studio directly via WhatsApp or Email below:",
          actionLinks: [
            { label: "Chat on WhatsApp", href: "https://wa.me/919876543210?text=Hi%20CraftiNiya,%20I%20have%20a%20question", icon: "MessageCircle" },
            { label: "Contact Support Desk", to: "/contact", icon: "Mail" },
          ],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    processQuery(input);
  };

  const handleChipClick = (query) => {
    processQuery(query);
  };

  return (
    <>
      <button
        className={`${s.fab} ${isOpen ? s.hidden : ""}`}
        onClick={() => setIsOpen(true)}
        aria-label="Open CraftiNiya Assistant"
        title="Need help? Ask CraftiNiya Assistant"
      >
        <span className={s.fabIcon}>💬</span>
      </button>

      {isOpen && (
        <div className={s.chatWindow} role="dialog" aria-label="CraftiNiya Assistant">
          {/* Header */}
          <div className={s.header}>
            <div className={s.headerTitleWrap}>
              <div className={s.headerStatusDot} aria-hidden="true" />
              <div>
                <h4 className={s.headerTitle}>CraftiNiya Assistant</h4>
                <span className={s.headerSubtitle}>Shopping, Tracking & Studio Support</span>
              </div>
            </div>
            <button
              className={s.closeBtn}
              onClick={() => setIsOpen(false)}
              aria-label="Close Chat"
            >
              ✕
            </button>
          </div>

          {/* Quick Topics Bar */}
          <div className={s.quickTopicsBar} role="region" aria-label="Quick Topics">
            {QUICK_TOPICS.map((topic) => (
              <button
                key={topic.label}
                type="button"
                className={s.quickTopicBtn}
                onClick={() => handleChipClick(topic.query)}
              >
                {topic.label}
              </button>
            ))}
          </div>

          {/* Messages Body */}
          <div className={s.messagesBody}>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`${s.messageWrapper} ${
                  msg.type === "user" ? s.userWrap : s.botWrap
                }`}
              >
                <div
                  className={`${s.message} ${
                    msg.type === "user" ? s.userMsg : s.botMsg
                  }`}
                >
                  <p className={s.messageParagraph}>{msg.text}</p>
                </div>

                {/* Direct Policy / Support Action Links */}
                {msg.actionLinks && msg.actionLinks.length > 0 && (
                  <div className={s.actionLinksGrid}>
                    {msg.actionLinks.map((action, idx) =>
                      action.href ? (
                        <a
                          key={idx}
                          href={action.href}
                          target="_blank"
                          rel="noreferrer noopener"
                          className={s.actionLink}
                        >
                          <span className={s.actionIconWrap}>
                            {renderActionIcon(action.icon)}
                          </span>
                          <span className={s.actionLabel}>{action.label}</span>
                          <ExternalLink size={13} className={s.actionChevron} />
                        </a>
                      ) : (
                        <Link
                          key={idx}
                          to={action.to}
                          className={s.actionLink}
                          onClick={() => setIsOpen(false)}
                        >
                          <span className={s.actionIconWrap}>
                            {renderActionIcon(action.icon)}
                          </span>
                          <span className={s.actionLabel}>{action.label}</span>
                          <ChevronRight size={14} className={s.actionChevron} />
                        </Link>
                      )
                    )}
                  </div>
                )}

                {/* Product Recommendations */}
                {msg.products && msg.products.length > 0 && (
                  <div className={s.productCards}>
                    {msg.products.map((p) => (
                      <Link
                        key={p.id}
                        to={`/product/${p.slug}`}
                        className={s.productCard}
                        onClick={() => setIsOpen(false)}
                      >
                        <img
                          src={p.image || p.images?.[0] || FALLBACK_IMAGE}
                          alt={p.title}
                          className={s.productImg}
                        />
                        <div className={s.productInfo}>
                          <span className={s.productTitle}>{p.title}</span>
                          <span className={s.productPrice}>
                            {formatINR(p.effectivePriceMinor)}
                          </span>
                        </div>
                        <span className={s.viewProductCta}>
                          View <ChevronRight size={13} />
                        </span>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Follow-up Suggestion Chips */}
                {msg.chips && msg.chips.length > 0 && (
                  <div className={s.chipsRow}>
                    {msg.chips.map((chipText) => (
                      <button
                        key={chipText}
                        type="button"
                        className={s.chipBtn}
                        onClick={() => handleChipClick(chipText)}
                      >
                        {chipText}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className={`${s.messageWrapper} ${s.botWrap}`}>
                <div className={`${s.message} ${s.botMsg} ${s.loadingMsg}`}>
                  <span className={s.typingDots}>
                    <span>.</span><span>.</span><span>.</span>
                  </span>
                  Checking details for you…
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form className={s.inputArea} onSubmit={handleSend}>
            <input
              type="text"
              placeholder="Ask about orders, returns, support, or gifts…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={s.inputField}
              disabled={loading}
            />
            <button type="submit" className={s.sendBtn} disabled={loading || !input.trim()} aria-label="Send">
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

