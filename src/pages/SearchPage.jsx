import { useSearchParams } from "react-router-dom";
import SEO from "../components/common/SEO.jsx";
import PageHeader from "../components/layout/PageHeader.jsx";
import CatalogView from "../features/catalog/CatalogView.jsx";
import { EmptyState } from "../components/ui/Feedback.jsx";
import Button from "../components/ui/Button.jsx";

export default function SearchPage() {
  const [params] = useSearchParams();
  const term = params.get("q")?.trim() ?? "";

  return (
    <>
      <SEO title={term ? `Search: ${term}` : "Search"} noIndex />

      <PageHeader
        align="left"
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Search" }]}
        title={term ? `Results for “${term}”` : "Search"}
      />

      {term ? (
        <CatalogView
          scope={{ q: term }}
          emptyTitle={`Nothing matched “${term}”`}
          emptyMessage="Try a material, an occasion, or a category name — “resin”, “wedding”, “candles”."
        />
      ) : (
        <div className="container" style={{ paddingBlock: "var(--sp-11)" }}>
          <EmptyState
            title="What are you looking for?"
            message="Search by material, occasion or category — try “resin”, “gifting” or “crochet”."
            action={<Button to="/shop">Browse everything</Button>}
          />
        </div>
      )}
    </>
  );
}
