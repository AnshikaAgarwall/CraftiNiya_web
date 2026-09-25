import SEO from "../components/common/SEO.jsx";
import CatalogView from "../features/catalog/CatalogView.jsx";
import SaleBanner from "../features/sale/SaleBanner.jsx";

export default function Sale() {
  return (
    <>
      <SEO
        title="Festive Sale — Up to 40% Off Handcrafted Pieces"
        description="Discounted handmade resin art, soy candles and gift boxes from the Craftiniya Jaipur studio, while festive stock lasts."
      />

      {/* Clean, editorial Sale header */}
      <SaleBanner />

      {/* Sale Catalog with In-Section Left Drawer & On-Screen Sort */}
      <div style={{ paddingBottom: "var(--sp-12)" }}>
        <CatalogView
          scope={{ onSale: true }}
          emptyTitle="No sale pieces right now"
          emptyMessage="Nothing is reduced at the moment. New batches go up most weeks."
        />
      </div>
    </>
  );
}
