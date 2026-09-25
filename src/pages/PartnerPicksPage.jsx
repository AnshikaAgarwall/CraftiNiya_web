import SEO from "../components/common/SEO.jsx";
import PageHeader from "../components/layout/PageHeader.jsx";
import ProductGrid from "../components/product/ProductGrid.jsx";
import { useAsync } from "../hooks/useAsync.js";
import productService from "../services/productService.js";
import { BRAND } from "../config/site.js";

export default function PartnerPicksPage() {
  const { data: catalog, loading, error, refetch } = useAsync(
    (opts) => productService.getProducts({ partnerPicks: true, pageSize: 12 }, opts),
    [],
  );

  const products = catalog?.items ?? [];

  return (
    <>
      <SEO
        title={`Partner Picks — Design & Craft Collaborations | ${BRAND.name}`}
        description="Thoughtfully curated pieces created by our artisan partner studios and independent creators."
      />

      <PageHeader
        align="left"
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Partner Picks" }]}
        eyebrow="Curated Collaborations"
        title="Partner Picks"
        description="Special edition pieces and handcrafted heritage designs curated from our affiliated partner workshops."
      />

      <div className="container" style={{ paddingTop: "var(--sp-4)", paddingBottom: "var(--sp-10)", minHeight: "50vh" }}>
        <ProductGrid
          products={products}
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
