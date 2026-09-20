import SEO from "../components/common/SEO.jsx";
import PageHeader from "../components/layout/PageHeader.jsx";
import CatalogView from "../features/catalog/CatalogView.jsx";

export default function Shop() {
  return (
    <>
      <SEO
        title="Shop all"
        description="Every handmade piece in the Craftiniya studio — home decor, bags, candles, crochet, festive and pooja essentials, gifts and personalized pieces."
      />

      <PageHeader
        align="left"
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Shop" }]}
        title="Shop everything"
        description="Every piece we make, in one place. Filter by price, category or what is actually in stock."
      />

      <CatalogView
        emptyTitle="Nothing matches those filters"
        emptyMessage="Try loosening the price range or clearing a category."
      />
    </>
  );
}
