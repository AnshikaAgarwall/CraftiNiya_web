import { Link } from "react-router-dom";
import SEO from "../components/common/SEO.jsx";
import ProductGrid from "../components/product/ProductGrid.jsx";
import { useAsync } from "../hooks/useAsync.js";
import productService from "../services/productService.js";
import { BRAND } from "../config/site.js";

export default function PartnerPicksPage() {
  const { data: catalog, loading, error, refetch } = useAsync(
    (opts) => productService.getProducts({ pageSize: 12 }, opts),
    [],
  );

  const affiliateProducts = (catalog?.items ?? []).filter(
    (p) => p.productType === "affiliate",
  );

  return (
    <>
      <SEO
        title={`Partner Picks — Design & Craft Collaborations | ${BRAND.name}`}
        description="Thoughtfully curated pieces created by our artisan partner studios and independent creators."
      />

      <div className="container" style={{ paddingBlock: "var(--sp-12)", minHeight: "60vh" }}>
        <nav aria-label="Breadcrumb" style={{ marginBottom: "var(--sp-4)" }}>
          <Link to="/" style={{ color: "var(--c-text-2)", textDecoration: "none" }}>Home</Link>
          <span style={{ marginInline: "var(--sp-2)", color: "var(--c-text-2)" }}>/</span>
          <span>Partner Picks</span>
        </nav>

        <header style={{ marginBottom: "var(--sp-8)" }}>
          <p style={{ textTransform: "uppercase", letterSpacing: "var(--ls-wider)", color: "var(--c-brand)", fontSize: "var(--fs-sm)", fontWeight: 700 }}>
            Curated Collaborations
          </p>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--fs-3xl)", marginTop: "var(--sp-2)" }}>
            Partner Picks
          </h1>
          <p style={{ color: "var(--c-text-2)", maxWidth: "620px", marginTop: "var(--sp-2)", lineHeight: "var(--lh-base)" }}>
            Special edition pieces and handcrafted heritage designs curated from our affiliated partner workshops. Orders are fulfilled directly with our partner studios.
          </p>
        </header>

        <ProductGrid
          products={affiliateProducts}
          loading={loading}
          error={error}
          onRetry={refetch}
          columns={4}
          emptyTitle="New partner picks arriving soon"
          emptyMessage="Our team is currently curating fresh collaborations with independent heritage ateliers."
        />
      </div>
    </>
  );
}
