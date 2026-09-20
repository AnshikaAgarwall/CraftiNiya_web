import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SEO from "../components/common/SEO.jsx";
import PageHeader from "../components/layout/PageHeader.jsx";
import LazyImage from "../components/common/LazyImage.jsx";
import { ErrorState, Skeleton } from "../components/ui/Feedback.jsx";
import { useAsync } from "../hooks/useAsync.js";
import categoryService from "../services/categoryService.js";
import { pluralize } from "../lib/format.js";
import s from "./CategoriesPage.module.css";

export default function CategoriesPage() {
  const { data: categories, loading, error, refetch } = useAsync(
    (opts) => categoryService.getCategories(opts),
    [],
  );

  return (
    <>
      <SEO
        title="Categories"
        description="Browse Craftiniya by category — home decor, bags, candles, crochet, festive and pooja, gifts and personalized pieces."
      />

      <PageHeader
        align="left"
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Categories" }]}
        title="Every category"
        description="Every family of handmade goods we make, each with its own makers and materials."
      />

      <div className={`container ${s.wrap}`}>
        {error ? (
          <ErrorState error={error} onRetry={refetch} />
        ) : loading ? (
          <div className={s.list}>
            {Array.from({ length: 3 }, (_, i) => (
              <Skeleton key={i} height={260} className={s.skeleton} />
            ))}
          </div>
        ) : (
          <div className={s.list}>
            {categories.map((category, i) => (
              <section key={category.id} className={s.block}>
                <Link to={`/category/${category.id}`} className={s.poster}>
                  <LazyImage
                    src={category.posterImage}
                    alt=""
                    ratio="4 / 3"
                    eager={i === 0}
                  />
                </Link>

                <div className={s.body}>
                  <h2 className={s.title}>
                    <Link to={`/category/${category.id}`}>{category.title}</Link>
                  </h2>
                  <p className={s.count}>{pluralize(category.productCount, "piece")}</p>
                  <p className={s.description}>{category.description}</p>

                  <ul className={s.subs}>
                    {category.subcategories.map((sub) => (
                      <li key={sub.id}>
                        <Link
                          to={`/category/${category.id}/subcategory/${sub.id}`}
                          className={s.sub}
                        >
                          {sub.title}
                          <span className={s.subCount}>{sub.productCount}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <Link to={`/category/${category.id}`} className={s.all}>
                    Browse {category.title}
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
