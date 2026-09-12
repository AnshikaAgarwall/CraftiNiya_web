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

export default function SubcategoryPage() {
  const { categoryId, subcategoryId } = useParams();

  const { data, loading, error, refetch } = useAsync(
    async (opts) => {
      const category = await categoryService.getCategoryById(categoryId, opts);
      const subcategory = await categoryService.getSubcategoryById(
        categoryId,
        subcategoryId,
        opts,
      );
      return { category, subcategory };
    },
    [categoryId, subcategoryId],
  );

  if (error?.code === ERROR_CODES.NOT_FOUND) {
    return <NotFoundPage title="We could not find that collection" />;
  }

  if (error) {
    return (
      <div className="container" style={{ paddingBlock: "var(--sp-11)" }}>
        <ErrorState error={error} onRetry={refetch} />
      </div>
    );
  }

  const { category, subcategory } = data ?? {};

  return (
    <>
      <SEO
        title={subcategory ? `${subcategory.title} — ${category.title}` : null}
        description={`Handmade ${subcategory?.title?.toLowerCase() ?? "pieces"} from the Craftiniya studio.`}
        image={subcategory?.posterImage}
      />

      <PageHeader
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Categories", to: "/categories" },
          { label: category?.title ?? "…", to: `/category/${categoryId}` },
          { label: subcategory?.title ?? "…" },
        ]}
        eyebrow={category?.title}
        title={subcategory?.title ?? " "}
      >
        <SubcategoryCircles
          categoryId={categoryId}
          subcategories={category?.subcategories ?? []}
          loading={loading}
          activeId={subcategoryId}
        />
      </PageHeader>

      <CatalogView
        scope={{ categoryId, subcategoryId }}
        emptyTitle="Nothing here right now"
        emptyMessage="This collection is small and moves quickly. Try the wider category."
      />
    </>
  );
}
