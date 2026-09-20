import { useParams } from "react-router-dom";
import SEO from "../components/common/SEO.jsx";
import PageHeader from "../components/layout/PageHeader.jsx";
import { ErrorState } from "../components/ui/Feedback.jsx";
import SubcategoryCircles from "../features/catalog/SubcategoryCircles.jsx";
import CatalogView from "../features/catalog/CatalogView.jsx";
import { useAsync } from "../hooks/useAsync.js";
import categoryService from "../services/categoryService.js";
import NotFoundPage from "./NotFoundPage.jsx";
import { ERROR_CODES } from "../services/errors.js";

export default function CategoryPage() {
  const { categoryId } = useParams();

  const { data: category, loading, error, refetch } = useAsync(
    (opts) => categoryService.getCategoryById(categoryId, opts),
    [categoryId],
  );

  /* A bad slug is a 404, not a silent fallback to the first category — the
     previous build quietly showed the wrong products for any unknown id. */
  if (error?.code === ERROR_CODES.NOT_FOUND) {
    return <NotFoundPage title="We could not find that category" />;
  }

  if (error) {
    return (
      <div className="container" style={{ paddingBlock: "var(--sp-11)" }}>
        <ErrorState error={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <>
      <SEO
        title={category?.title}
        description={category?.description}
        image={category?.posterImage}
      />

      <PageHeader
        align="left"
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Categories", to: "/categories" },
          { label: category?.title ?? "…" },
        ]}
      >
        <SubcategoryCircles
          categoryId={categoryId}
          subcategories={category?.subcategories ?? []}
          loading={loading}
        />
      </PageHeader>

      <CatalogView
        scope={{ categoryId }}
        emptyTitle="Nothing in this category matches"
        emptyMessage="Try clearing a filter or widening the price range."
      />
    </>
  );
}
