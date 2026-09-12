import { Link } from "react-router-dom";
import { BadgeCheck } from "lucide-react";
import { SectionHeading, Rating } from "../../components/ui/Bits.jsx";
import { Skeleton } from "../../components/ui/Feedback.jsx";
import LazyImage from "../../components/common/LazyImage.jsx";
import { useAsync } from "../../hooks/useAsync.js";
import { useReducedMotion } from "../../hooks/useReducedMotion.js";
import reviewService from "../../services/reviewService.js";
import { cn } from "../../lib/cn.js";
import s from "./ReviewPills.module.css";

/**
 * Testimonials as slim horizontal pills: product thumbnail, customer, stars,
 * and a line of review text.
 *
 * The rail marquees across two duplicated tracks for a seamless loop. The
 * clone is aria-hidden so screen readers hear each review once, and reduced
 * motion drops the animation for a plain scrollable rail.
 */
export default function ReviewPills() {
  const reducedMotion = useReducedMotion();
  const { data: reviews, loading } = useAsync(
    (opts) => reviewService.getFeaturedReviews({ limit: 10 }, opts),
    [],
  );

  const items = reviews ?? [];

  return (
    <section className={s.section} aria-labelledby="reviews-heading">
      <div className="container">
        <SectionHeading
          eyebrow="Customer love"
          title="What people say once it arrives"
          subtitle="Unedited, from people who bought and kept it."
          id="reviews-heading"
        />
      </div>

      {loading ? (
        <div className={`container ${s.loading}`}>
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className={s.skeleton} />
          ))}
        </div>
      ) : (
        <div className={cn(s.rail, reducedMotion && s.railStatic)}>
          {[0, 1].map((track) => (
            <ul
              key={track}
              className={cn(s.track, !reducedMotion && s.trackAnimated)}
              aria-hidden={track === 1 ? "true" : undefined}
            >
              {items.map((review) => (
                <li key={`${track}-${review.id}`} className={s.pill}>
                  <Link to={`/product/${review.productSlug}`} className={s.thumb}>
                    <LazyImage src={review.productImage} alt="" />
                  </Link>

                  <div className={s.body}>
                    <div className={s.head}>
                      <span className={s.name}>
                        {review.authorName}
                        {review.isVerifiedPurchase && (
                          <BadgeCheck
                            className={s.verified}
                            aria-label="Verified purchase"
                          />
                        )}
                      </span>
                      <Rating value={review.rating} size={11} showValue={false} />
                    </div>

                    <p className={s.email}>{review.authorEmail}</p>
                    <p className={s.text}>{review.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          ))}
        </div>
      )}
    </section>
  );
}
