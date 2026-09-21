import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ExternalLink, ArrowLeft } from "lucide-react";
import SEO from "../components/common/SEO.jsx";
import { Spinner } from "../components/ui/Feedback.jsx";
import Button from "../components/ui/Button.jsx";
import { useAsync } from "../hooks/useAsync.js";
import productService from "../services/productService.js";
import { BRAND } from "../config/site.js";

export default function PartnerRedirectPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { data: product, loading, error } = useAsync(
    (opts) => productService.getProductBySlug(slug, opts),
    [slug],
  );

  useEffect(() => {
    if (product?.affiliate?.externalUrl) {
      const timer = setTimeout(() => {
        window.location.replace(product.affiliate.externalUrl);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [product]);

  return (
    <>
      <SEO
        title={`Connecting to Partner Studio | ${BRAND.name}`}
        description="Redirecting you securely to our artisan partner studio."
      />

      <div className="container" style={{ paddingBlock: "var(--sp-12)", minHeight: "55vh", display: "grid", placeItems: "center" }}>
        <div style={{
          maxWidth: "480px",
          width: "100%",
          textAlign: "center",
          padding: "var(--sp-8)",
          backgroundColor: "var(--c-surface)",
          border: "1px solid var(--c-border)",
          borderRadius: "var(--r-lg)",
          boxShadow: "var(--sh-md)",
        }}>
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--sp-4)" }}>
              <Spinner size={32} />
              <p style={{ color: "var(--c-text)", fontWeight: 600 }}>Connecting you to our partner studio…</p>
              <p style={{ color: "var(--c-text-2)", fontSize: "var(--fs-xs)" }}>You will be redirected securely in a moment.</p>
            </div>
          ) : product?.affiliate?.externalUrl ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--sp-4)" }}>
              <ExternalLink size={36} color="var(--c-brand)" />
              <h2 style={{ fontFamily: "var(--font-sans)", fontSize: "var(--fs-2xl)" }}>Visiting Partner Atelier</h2>
              <p style={{ color: "var(--c-text-2)", fontSize: "var(--fs-sm)", lineHeight: "var(--lh-base)" }}>
                You are being taken to our partner store to complete your purchase for <strong>{product.title}</strong>.
              </p>
              <a
                href={product.affiliate.externalUrl}
                target="_blank"
                rel="noreferrer noopener"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "10px 20px",
                  borderRadius: "var(--r-pill)",
                  backgroundColor: "var(--c-brand)",
                  color: "#ffffff",
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: "var(--fs-xs)",
                  textTransform: "uppercase",
                  letterSpacing: "var(--ls-wide)",
                  marginTop: "var(--sp-2)",
                }}
              >
                Proceed to Partner Store <ExternalLink size={14} />
              </a>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--sp-4)" }}>
              <p style={{ color: "var(--c-text)", fontWeight: 600 }}>Product not found or partner link unavailable.</p>
              <Button to="/shop" startIcon={<ArrowLeft size={16} />}>Back to Shop</Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
