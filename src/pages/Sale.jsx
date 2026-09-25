import SEO from "../components/common/SEO.jsx";
import CatalogView from "../features/catalog/CatalogView.jsx";
import SaleBanner from "../features/sale/SaleBanner.jsx";

export default function Sale() {
  return (
    <>
      <SEO
        title="Festive Sale — Up to 40% Off"
        description="Discounted handmade resin art, soy candles and gift boxes from the Craftiniya studio, while stock lasts."
      />

      {/* Sale Banner on top of the Sale page */}
      <SaleBanner />

      <div className="container" style={{ paddingBottom: "var(--sp-12)" }}>
        <CatalogView
          scope={{ onSale: true }}
          drawerFilter={true}
          emptyTitle="No sale pieces right now"
          emptyMessage="Nothing is reduced at the moment. New batches go up most weeks."
        />
      </div>
    </>
  );
}
