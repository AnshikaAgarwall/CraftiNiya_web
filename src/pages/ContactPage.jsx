import { useState } from "react";
import { Mail, MessageCircle, MapPin, Clock, Send, CheckCircle2, ChevronRight } from "lucide-react";
import SupportLayout from "../components/support/SupportLayout.jsx";
import { useUI } from "../context/UIContext.jsx";
import { BRAND } from "../config/site.js";
import s from "./ContactPage.module.css";

export default function ContactPage() {
  const { toast } = useUI();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    topic: "Order Status & Tracking",
    orderId: "",
    message: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast("Please fill in your name, email, and message", { type: "error" });
      return;
    }

    setSubmitting(true);
    // Simulate real network submission
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      toast("Message sent successfully! Our studio will reply within 4 hours.", { type: "success" });
    }, 600);
  }

  function handleReset() {
    setSubmitted(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      topic: "Order Status & Tracking",
      orderId: "",
      message: "",
    });
  }

  return (
    <SupportLayout
      title="Contact Customer Support"
      subtitle="Have a question about a bespoke piece, tracking, or bulk orders? We're here to help."
      badge="Direct Support"
      seoTitle="Contact Us — Craftiniya Studio"
      seoDescription="Get in touch with the Craftiniya artisan studio via WhatsApp, Email, or our support form for custom orders, tracking, and bulk gifting."
    >
      <div className={s.contactGrid}>
        {/* Top Direct Channels Strip */}
        <div className={s.channelsGrid}>
          {/* WhatsApp Card */}
          <div className={s.channelCard}>
            <div className={s.channelIconWrap}><MessageCircle size={22} /></div>
            <h3 className={s.channelTitle}>WhatsApp Support</h3>
            <p className={s.channelText}>Fastest response for order status, custom briefs, and photos.</p>
            <a
              href="https://wa.me/919876543210?text=Hi%20CraftiNiya,%20I%20have%20an%20enquiry"
              target="_blank"
              rel="noreferrer noopener"
              className={s.channelLink}
            >
              Chat on WhatsApp <ChevronRight size={14} />
            </a>
          </div>

          {/* Email Card */}
          <div className={s.channelCard}>
            <div className={s.channelIconWrap}><Mail size={22} /></div>
            <h3 className={s.channelTitle}>Email Desk</h3>
            <p className={s.channelText}>For corporate gifting, wholesale quotes, and formal feedback.</p>
            <a href={`mailto:${BRAND.email}`} className={s.channelLink}>
              {BRAND.email} <ChevronRight size={14} />
            </a>
          </div>

          {/* Studio Location */}
          <div className={s.channelCard}>
            <div className={s.channelIconWrap}><MapPin size={22} /></div>
            <h3 className={s.channelTitle}>Artisan Atelier</h3>
            <p className={s.channelText}>Craftiniya Design Studio, C-Scheme, Jaipur, Rajasthan, 302001.</p>
            <span className={s.channelLink}>Handcrafted in India</span>
          </div>

          {/* Studio Hours */}
          <div className={s.channelCard}>
            <div className={s.channelIconWrap}><Clock size={22} /></div>
            <h3 className={s.channelTitle}>Studio Timings</h3>
            <p className={s.channelText}>Monday to Saturday: 10:00 AM – 7:00 PM IST.</p>
            <span className={s.channelLink}>Typical reply: &lt; 4 hours</span>
          </div>
        </div>

        {/* Contact Form Card */}
        <div className={s.formCard}>
          {submitted ? (
            <div className={s.successCard}>
              <div className={s.successIconWrap}><CheckCircle2 size={30} /></div>
              <h3 className={s.successTitle}>Thank You! We Received Your Message</h3>
              <p className={s.successText}>
                One of our studio team members will review your enquiry and respond to <strong>{formData.email}</strong> shortly.
              </p>
              <button type="button" className={s.resetBtn} onClick={handleReset}>
                Send Another Message
              </button>
            </div>
          ) : (
            <>
              <div className={s.formHeader}>
                <h3 className={s.formTitle}>Send Us a Message</h3>
                <p className={s.formSubtitle}>
                  Fill out the form below and we will get back to you as soon as possible.
                </p>
              </div>

              <form className={s.form} onSubmit={handleSubmit}>
                <div className={s.formRow}>
                  <div className={s.formGroup}>
                    <label className={s.label} htmlFor="contact-name">Your Full Name *</label>
                    <input
                      type="text"
                      id="contact-name"
                      name="name"
                      required
                      placeholder="e.g. Priya Sharma"
                      value={formData.name}
                      onChange={handleChange}
                      className={s.input}
                    />
                  </div>
                  <div className={s.formGroup}>
                    <label className={s.label} htmlFor="contact-email">Email Address *</label>
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      required
                      placeholder="e.g. priya@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className={s.input}
                    />
                  </div>
                </div>

                <div className={s.formRow}>
                  <div className={s.formGroup}>
                    <label className={s.label} htmlFor="contact-phone">Phone / WhatsApp Number</label>
                    <input
                      type="tel"
                      id="contact-phone"
                      name="phone"
                      placeholder="e.g. +91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                      className={s.input}
                    />
                  </div>
                  <div className={s.formGroup}>
                    <label className={s.label} htmlFor="contact-order-id">Order ID (if applicable)</label>
                    <input
                      type="text"
                      id="contact-order-id"
                      name="orderId"
                      placeholder="e.g. CRF-1049"
                      value={formData.orderId}
                      onChange={handleChange}
                      className={s.input}
                    />
                  </div>
                </div>

                <div className={s.formGroup}>
                  <label className={s.label} htmlFor="contact-topic">Topic / Enquiry Category</label>
                  <select
                    id="contact-topic"
                    name="topic"
                    value={formData.topic}
                    onChange={handleChange}
                    className={s.select}
                  >
                    <option value="Order Status & Tracking">Order Status & Tracking</option>
                    <option value="Custom Design & Bespoke Commission">Custom Design & Bespoke Commission</option>
                    <option value="Gift Box Question">Gift Box Question</option>
                    <option value="Return, Exchange or Refund">Return, Exchange or Refund</option>
                    <option value="Bulk, Corporate or Wedding Favors">Bulk, Corporate or Wedding Favors</option>
                    <option value="Creator & Artisan Collaboration">Creator & Artisan Collaboration</option>
                    <option value="General Question / Feedback">General Question / Feedback</option>
                  </select>
                </div>

                <div className={s.formGroup}>
                  <label className={s.label} htmlFor="contact-message">Your Message *</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    placeholder="Tell us how we can help you..."
                    value={formData.message}
                    onChange={handleChange}
                    className={s.textarea}
                  />
                </div>

                <button type="submit" className={s.submitBtn} disabled={submitting}>
                  <Send size={16} /> {submitting ? "Sending to Studio…" : "Send Message"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </SupportLayout>
  );
}
