import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "../../components/ui/Bits.jsx";
import { ErrorState, Skeleton } from "../../components/ui/Feedback.jsx";
import LazyImage from "../../components/common/LazyImage.jsx";
import Button from "../../components/ui/Button.jsx";
import { useAsync } from "../../hooks/useAsync.js";
import categoryService from "../../services/categoryService.js";
import { pluralize } from "../../lib/format.js";
import s from "./FeaturedCategories.module.css";



export default function FeaturedCategories() {
  const { data: categories, loading, error, refetch } = useAsync(
    (opts) => categoryService.getCategories(opts),
    [],
  );

  return (
    <section className={s.section}>
      <div className="container">
        <SectionHeading
          eyebrow="Shop by category"
          title="Find your corner of the studio"
          action={
            <Button to="/categories" variant="ghost" endIcon={<ArrowRight size={16} />}>
              All categories
            </Button>
          }
          align="split"
        />

        {error ? (
          <ErrorState error={error} onRetry={refetch} />
        ) : (
          <div className={s.grid}>
            {loading
              ? Array.from({ length: 7 }, (_, i) => (
                <Skeleton
                  key={i}
                  className={s.skeleton}
                  data-slot={i === 0 ? "primary" : i <= 4 ? "upper" : "lower"}
                />
              ))
              : categories?.map((category, i) => {
                const slot = i === 0 ? "primary" : i <= 4 ? "upper" : "lower";
                return (
                  <Link
                    key={category.id}
                    to={`/category/${category.id}`}
                    className={s.card}
                    data-slot={slot}
                    data-index={i}
                  >
                    <LazyImage
                      src={category.posterImage}
                      alt=""
                      ratio={null}
                      className={s.cardImage}
                      eager={i < 2}
                    />
                    <span className={s.cardOverlay} aria-hidden="true" />
                    <span className={s.cardBody}>
                      <span className={s.cardTitle}>{category.title}</span>
                    </span>
                  </Link>
                );
              })}
          </div>
        )}
      </div>
    </section>
  );
}
