import SEO from "../components/common/SEO.jsx";
import PageHeader from "../components/layout/PageHeader.jsx";
import Button from "../components/ui/Button.jsx";
import ProductGrid from "../components/product/ProductGrid.jsx";
import { useAsync } from "../hooks/useAsync.js";
import wishlistService from "../services/wishlistService.js";
import { useWishlist } from "../context/WishlistContext.jsx";
import { pluralize } from "../lib/format.js";

export default function WishlistPage() {
  const { ids, count, clear } = useWishlist();

  // Keyed on the id list so removing a heart refreshes the grid immediately.
  const { data, loading, error, refetch } = useAsync(
    (opts) => wishlistService.getWishlist({ pageSize: 48 }, opts),
    [ids.join(",")],
  );

  const products = data?.items ?? [];

  return (
    <>
      <SEO title="Wishlist" noIndex />

      <PageHeader
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Wishlist" }]}
        eyebrow="Saved"
        title="Your wishlist"
        description={count ? `${pluralize(count, "piece")} saved for later.` : undefined}
      >
        {count > 0 && (
          <Button variant="link" onClick={clear}>
            Clear wishlist
          </Button>
        )}
      </PageHeader>

      <div className="container" style={{ paddingTop: "clamp(12px, 1.6vw, 20px)", paddingBottom: "var(--section-y)" }}>
        <ProductGrid
          products={products}
          loading={loading}
          error={error}
          onRetry={refetch}
          columns={4}
          skeletonCount={8}
          emptyTitle="Nothing saved yet"
          emptyMessage="Tap the heart on anything you like and it will wait for you here."
          emptyAction={<Button to="/shop">Browse the shop</Button>}
        />
      </div>
    </>
  );
}
