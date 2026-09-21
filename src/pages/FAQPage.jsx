import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, X, ChevronDown, MessageCircle, Mail, Sparkles } from "lucide-react";
import SupportLayout from "../components/support/SupportLayout.jsx";
import { BRAND } from "../config/site.js";
import s from "./FAQPage.module.css";

const FAQ_DATA = [
  {
    id: "custom-timeline",
    category: "Ordering & Customization",
    question: "How long does it take to make and dispatch custom handmade orders?",
    answer: "Because every piece is handcrafted from scratch, standard catalog items take 2–4 business days in the studio for casting, sanding, and curing before dispatch. Customized pieces (such as custom nameplates or wedding flower resin preservation) take 5–8 days to ensure full resin crystallization and flawless finish. Delivery takes an additional 3–5 business days depending on your pincode.",
  },
  {
    id: "personalization-brief",
    category: "Ordering & Customization",
    question: "Can I customize names, colors, or dried flowers in an item?",
    answer: "Yes, absolutely! Most of our resin coasters, clocks, trays, and nameplates can be customized. You can mention your desired names, color palette, or special requirements during checkout in the notes box, or connect with us directly on WhatsApp with your Order ID.",
  },
  {
    id: "gift-packaging-note",
    category: "Ordering & Customization",
    question: "Do you offer gift packaging and handwritten notes?",
    answer: "Yes! Every CraftiNiya order arrives gift-ready with tissue wrap, decorative paper, and sealed with our studio sticker. If you build a custom gift box using our 'Make Your Gift Box' feature, we also include a complimentary personalized handwritten note on botanical paper with your custom message.",
  },
  {
    id: "shipping-charges",
    category: "Shipping & Delivery",
    question: "What are the shipping charges, and is free delivery available?",
    answer: "We offer Free Pan-India Shipping on all orders above ₹1,499. For orders below ₹1,499, a nominal flat delivery charge of ₹99 is applied at checkout. We deliver across 26,000+ PIN codes via Bluedart, Delhivery, and DTDC.",
  },
  {
    id: "track-order-faq",
    category: "Shipping & Delivery",
    question: "How do I track my order once it is shipped?",
    answer: "The moment your package is hand-packed and picked up by our courier partner, you receive an automated SMS and email with your AWB tracking number. You can also visit our Track Order page anytime, enter your Order ID or phone number, and see live tracking updates.",
  },
  {
    id: "transit-damage",
    category: "Shipping & Delivery",
    question: "What should I do if my fragile item arrives damaged in transit?",
    answer: "We use 4-layer shock-absorbent packaging to ensure 99.8% safe delivery. However, in the rare event of transit damage, please record a continuous video while unboxing the outer parcel and email it to hello@craftiniya.in within 48 hours of delivery. We will immediately dispatch a free replacement or initiate a full refund.",
  },
  {
    id: "return-policy-faq",
    category: "Returns & Refunds",
    question: "What is your return policy for handmade items?",
    answer: "Standard, non-custom catalog pieces can be returned within 7 days of delivery, provided they are unused and in their original packaging. Customized commissions (with custom names, dates, or specific photos) and custom gift boxes with personalized notes are non-returnable unless damaged in transit.",
  },
  {
    id: "refund-timeline-faq",
    category: "Returns & Refunds",
    question: "How and when will I receive my refund?",
    answer: "Once the returned piece arrives back at our studio and passes quality check, refunds are initiated within 24 hours. For UPI payments, funds reflect in 24–48 hours; for credit/debit cards and netbanking, your bank may take 4–7 business days to credit your statement.",
  },
  {
    id: "resin-care-guide",
    category: "Product Care & Materials",
    question: "How do I clean and care for resin art, coasters, and clocks?",
    answer: "Wipe with a soft micro-fiber cloth dampened with mild soapy water. Avoid abrasive scrubs, harsh chemicals, or dishwashers. Keep out of prolonged direct scorching sunlight to maintain crystal clarity, and avoid placing scorching boiling cookware directly on decorative resin surfaces.",
  },
  {
    id: "candle-care-guide",
    category: "Product Care & Materials",
    question: "How should I burn and store hand-poured soy candles?",
    answer: "Always trim the cotton wick to 5mm (1/4 inch) before each lighting. On the first burn, allow the wax pool to reach the container edges (approx. 2 hours) to prevent tunneling. Never leave a burning candle unattended or within reach of children or drafts.",
  },
  {
    id: "bulk-corporate-gifting",
    category: "Bulk & Corporate",
    question: "Do you take bulk orders for corporate gifts, weddings, or return favors?",
    answer: "Yes! We specialize in bulk gifting for corporate festive hampers (Diwali, New Year), wedding favors, housewarming, and baby showers. We offer volume-based tiered discounts, customized brand logo engraving, and bespoke box sleeves. Please contact us via our Contact Us page or WhatsApp for bulk enquiries.",
  },
  {
    id: "payment-methods-cod",
    category: "Payments & Security",
    question: "Which payment options do you support? Is COD available?",
    answer: "We accept all major Indian payment methods: UPI (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit Cards (Visa, MasterCard, RuPay), and Net Banking via secure 256-bit encrypted Razorpay. Cash on Delivery (COD) is available on standard catalog items, but custom-curated Gift Boxes are strictly prepaid.",
  },
];

const CATEGORIES = [
  "All",
  "Ordering & Customization",
  "Shipping & Delivery",
  "Returns & Refunds",
  "Product Care & Materials",
  "Bulk & Corporate",
  "Payments & Security",
];

export default function FAQPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [openIds, setOpenIds] = useState(new Set(["custom-timeline"]));

  function toggleItem(id) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchesCat = activeCategory === "All" || item.category === activeCategory;
      if (!matchesCat) return false;

      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    });
  }, [search, activeCategory]);

  return (
    <SupportLayout
      title="Frequently Asked Questions"
      subtitle="Find quick answers about custom orders, shipping times, artisan crafting, and care guides."
      badge="Help & FAQs"
      seoTitle="Frequently Asked Questions (FAQs) — Craftiniya"
      seoDescription="Find answers to common questions about Craftiniya handmade resin art, candles, custom gift boxes, shipping, returns, and care."
    >
      <div className={s.faqWrap}>
        {/* Search Input */}
        <div className={s.searchWrap}>
          <Search size={18} className={s.searchIcon} />
          <input
            type="text"
            className={s.searchInput}
            placeholder="Search questions (e.g. shipping time, resin care, returns, bulk)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search FAQs"
          />
          {search && (
            <button
              type="button"
              className={s.clearSearchBtn}
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className={s.categoryPills}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`${s.pillBtn} ${activeCategory === cat ? s.pillActive : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        {filteredFaqs.length === 0 ? (
          <div className={s.emptyState}>
            <h4>No questions matched your search</h4>
            <p>Try searching for a different keyword or browse categories above.</p>
          </div>
        ) : (
          <div className={s.accordionList}>
            {filteredFaqs.map((faq) => {
              const isOpen = openIds.has(faq.id);
              return (
                <div key={faq.id} className={s.faqItem} data-open={isOpen}>
                  <button
                    type="button"
                    className={s.faqQuestionBtn}
                    onClick={() => toggleItem(faq.id)}
                    aria-expanded={isOpen}
                  >
                    <div className={s.questionTitleGroup}>
                      <span className={s.categoryTag}>{faq.category}</span>
                      <span>{faq.question}</span>
                    </div>
                    <ChevronDown
                      size={18}
                      className={`${s.chevronIcon} ${isOpen ? s.chevronOpen : ""}`}
                    />
                  </button>

                  {isOpen && (
                    <div className={s.faqAnswer}>
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Still Have Questions Box */}
        <div className={s.stillQuestionsCard}>
          <div className={s.stillQuestionsLeft}>
            <h4 className={s.stillQuestionsTitle}>Still have questions?</h4>
            <p className={s.stillQuestionsText}>
              Can&apos;t find what you&apos;re looking for? Reach out to our Jaipur artisan studio. A real person will be happy to assist you.
            </p>
          </div>
          <div className={s.stillQuestionsActions}>
            <a
              href="https://wa.me/919876543210?text=Hi%20CraftiNiya,%20I%20have%20a%20question%20about%20your%20products"
              target="_blank"
              rel="noreferrer noopener"
              className={s.chatBtn}
            >
              <MessageCircle size={15} /> WhatsApp Support
            </a>
            <Link to="/contact" className={s.contactBtn}>
              <Mail size={15} /> Contact Us
            </Link>
          </div>
        </div>
      </div>
    </SupportLayout>
  );
}
