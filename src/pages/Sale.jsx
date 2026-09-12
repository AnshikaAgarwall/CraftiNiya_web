import SEO from "../components/common/SEO.jsx";
import PageHeader from "../components/layout/PageHeader.jsx";
import CatalogView from "../features/catalog/CatalogView.jsx";
import { Badge } from "../components/ui/Bits.jsx";
import { useAsync } from "../hooks/useAsync.js";
import promoService from "../services/promoService.js";

export default function Sale() {
  const { data: promo } = useAsync((opts) => promoService.getActivePromotion(opts), []);

  return (
    <>
      <SEO
        title="Sale"
        description="Discounted handmade pieces from the Craftiniya studio, while stock lasts."
      />

      <PageHeader
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Sale" }]}
        eyebrow="Reduced"
        title={promo?.headline ?? "On sale right now"}
        description={
          promo?.subline ??
          "Small-batch pieces at reduced prices. When they are gone, they are gone — most of these are the last of a run."
        }
      >
        {promo && <Badge tone="accent">{promo.label}</Badge>}
      </PageHeader>

      <CatalogView
        scope={{ onSale: true }}
        emptyTitle="No sale pieces right now"
        emptyMessage="Nothing is reduced at the moment. New batches go up most weeks."
      />
    </>
  );
}
