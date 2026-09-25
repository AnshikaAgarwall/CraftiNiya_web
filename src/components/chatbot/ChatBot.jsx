import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import productService from "../../services/productService.js";
import { formatINR } from "../../lib/money.js";
import s from "./ChatBot.module.css";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Hi! What are you looking for? A gift, decor, or something else?",
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

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setMessages((prev) => [...prev, { type: "user", text: userText }]);
    setInput("");
    setLoading(true);

    try {
      // 1. First attempt: search with full query
      let res = await productService.getProducts({ q: userText, pageSize: 4 });
      let matchedProducts = res.items || [];

      // 2. Second attempt: if no exact match, extract meaningful words (> 2 chars)
      if (matchedProducts.length === 0) {
        const words = userText
          .toLowerCase()
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
            text: `Here are some recommendations for "${userText}":`,
            products: matchedProducts.slice(0, 3),
          },
        ]);
      } else {
        // Fallback: show popular products as a helpful recommendation
        const popularRes = await productService.getProducts({
          sort: "popular",
          pageSize: 3,
        });
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            text: `I couldn't find an exact match for "${userText}". You might love our popular picks:`,
            products: popularRes.items?.slice(0, 3) || [],
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: "Something went wrong while searching. Please try asking again!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className={`${s.fab} ${isOpen ? s.hidden : ""}`}
        onClick={() => setIsOpen(true)}
        aria-label="Open Chat"
      >
        <span className={s.fabIcon}>💬</span>
      </button>

      {isOpen && (
        <div className={s.chatWindow}>
          <div className={s.header}>
            <h4>Ask CraftiNiya</h4>
            <button
              className={s.closeBtn}
              onClick={() => setIsOpen(false)}
              aria-label="Close Chat"
            >
              ✕
            </button>
          </div>

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
                  {msg.text}
                </div>
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
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className={`${s.messageWrapper} ${s.botWrap}`}>
                <div className={`${s.message} ${s.botMsg}`}>
                  Finding the best pieces for you…
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form className={s.inputArea} onSubmit={handleSend}>
            <input
              type="text"
              placeholder="Type what you're looking for…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={s.inputField}
              disabled={loading}
            />
            <button type="submit" className={s.sendBtn} disabled={loading}>
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
