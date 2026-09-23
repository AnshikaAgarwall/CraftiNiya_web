import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight, Sparkles } from "lucide-react";
import SEO from "../components/common/SEO.jsx";
import PageHeader from "../components/layout/PageHeader.jsx";
import LazyImage from "../components/common/LazyImage.jsx";
import { ErrorState, Skeleton } from "../components/ui/Feedback.jsx";
import { useAsync } from "../hooks/useAsync.js";
import categoryService from "../services/categoryService.js";
import { BRAND } from "../config/site.js";
import s from "./CategoriesPage.module.css";

export default function CategoriesPage() {
  const { data: categories, loading, error, refetch } = useAsync(
    (opts) => categoryService.getCategories(opts),
    [],
  );

  return (
    <>
      <SEO
        title={`Categories — Handmade Collections | ${BRAND.name}`}
        description="Browse CraftiNiya by category — home decor, bags, candles, crochet, festive & pooja, gifting and personalized handcrafted pieces."
      />

      <PageHeader
        align="left"
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Categories" }]}
        eyebrow="Craft Collections"
        title="Explore Categories"
        description="Every family of handmade goods we create, crafted in small batches with heartfelt attention to detail and pure materials."
      />

      <div className={`container ${s.wrap}`}>
        {error ? (
          <ErrorState error={error} onRetry={refetch} />
        ) : loading ? (
          <div className={s.list}>
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} height={320} className={s.skeleton} />
            ))}
          </div>
        ) : (
          <div className={s.list}>
            {categories.map((category, i) => (
              <section key={category.id} className={s.block}>
                <Link
                  to={`/category/${category.id}`}
                  className={s.posterWrap}
                  title={`Explore ${category.title}`}
                >
                  <LazyImage
                    src={category.posterImage}
                    alt={category.title}
                    ratio="4 / 3"
                    eager={i === 0}
                    imgClassName={s.posterImage}
                  />
                  <span className={s.posterBadge}>
                    <Sparkles size={11} aria-hidden="true" />
                    Handcrafted
                  </span>
                </Link>

                <div className={s.body}>
                  <div className={s.headerGroup}>
                    <span className={s.eyebrow}>Artisan Studio</span>
                    <h2 className={s.title}>
                      <Link to={`/category/${category.id}`}>{category.title}</Link>
                    </h2>
                    <p className={s.description}>{category.description}</p>
                  </div>

                  {category.subcategories && category.subcategories.length > 0 && (
                    <div className={s.subsSection}>
                      <div className={s.subsHeader}>
                        <span className={s.subsLabel}>Featured Edits</span>
                      </div>
                      <div className={s.subsGrid}>
                        {category.subcategories.map((sub) => (
                          <Link
                            key={sub.id}
                            to={`/category/${category.id}/subcategory/${sub.id}`}
                            className={s.subItem}
                            title={`Browse ${sub.title}`}
                          >
                            <span className={s.subText}>{sub.title}</span>
                            <ChevronRight size={13} className={s.subArrow} aria-hidden="true" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className={s.actionRow}>
                    <Link
                      to={`/category/${category.id}`}
                      className={s.ctaBtn}
                    >
                      <span>Explore Collection</span>
                      <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
