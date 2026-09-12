import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { cn } from "../../lib/cn.js";
import s from "./PageHeader.module.css";

/**
 * Banner used at the top of every non-home page: breadcrumb, title, optional
 * description and a slot for actions. Having one of these is what keeps the
 * pages feeling like one site rather than fifteen.
 */
export default function PageHeader({
  breadcrumbs = [],
  eyebrow,
  title,
  description,
  children,
  align = "center",
  className,
}) {
  return (
    <header className={cn(s.header, s[align], className)}>
      <div className="container">
        {breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb">
            <ol className={s.crumbs}>
              {breadcrumbs.map((crumb, i) => {
                const isLast = i === breadcrumbs.length - 1;
                return (
                  <li key={`${crumb.label}-${i}`} className={s.crumb}>
                    {crumb.to && !isLast ? (
                      <Link to={crumb.to}>{crumb.label}</Link>
                    ) : (
                      <span aria-current={isLast ? "page" : undefined}>
                        {crumb.label}
                      </span>
                    )}
                    {!isLast && <ChevronRight aria-hidden="true" />}
                  </li>
                );
              })}
            </ol>
          </nav>
        )}

        {eyebrow && <p className={s.eyebrow}>{eyebrow}</p>}
        {title && <h1 className={s.title}>{title}</h1>}
        {description && <p className={s.description}>{description}</p>}
        {children && <div className={s.slot}>{children}</div>}
      </div>
    </header>
  );
}
