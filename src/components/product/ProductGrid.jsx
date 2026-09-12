import { cn } from "../../lib/cn.js";
import ProductCard from "./ProductCard.jsx";
import { EmptyState, ErrorState, ProductCardSkeleton } from "../ui/Feedback.jsx";
import s from "./ProductGrid.module.css";

/**
 * Renders the four states every product list has: loading, error, empty, and
 * results. Centralising them here is what stops each page reinventing (and
 * forgetting) two of the four.
 */
export default function ProductGrid({
  products = [],
  loading = false,
  error = null,
  onRetry,
  columns = 4,
  compact = false,
  skeletonCount = 8,
  emptyTitle = "No pieces match that",
  emptyMessage = "Try widening your filters or clearing a couple of them.",
  emptyAction,
  className,
}) {
  const gridClass = cn(s.grid, s[`cols_${columns}`], className);

  if (error) {
    return <ErrorState error={error} onRetry={onRetry} />;
  }

  if (loading) {
    return (
      <div className={gridClass} aria-busy="true" aria-live="polite">
        {Array.from({ length: skeletonCount }, (_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <EmptyState title={emptyTitle} message={emptyMessage} action={emptyAction} />
    );
  }

  return (
    <div className={gridClass}>
      {products.map((product, i) => (
        <ProductCard
          key={product.id}
          product={product}
          compact={compact}
          eager={i < 4}
        />
      ))}
    </div>
  );
}
