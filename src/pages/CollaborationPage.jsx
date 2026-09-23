import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { SlidersHorizontal, Sparkles, X } from "lucide-react";
import SEO from "../components/common/SEO.jsx";
import ProductGrid from "../components/product/ProductGrid.jsx";
import { Radio } from "../components/ui/Field.jsx";
import { SORT_OPTIONS } from "../config/site.js";
import { useAsync } from "../hooks/useAsync.js";
import { getProducts } from "../services/productService.js";
import { BRAND } from "../config/site.js";
import { getCollaboration } from "../data/partners.js";

import rangsajjaImg from "../assets/rangsajja.png";
import s from "./CollaborationPage.module.css";

export default function CollaborationPage() {
  const { collabSlug } = useParams();
  const slug = collabSlug ? collabSlug.toLowerCase().trim() : "rangsajja";
  const [filterOpen, setFilterOpen] = useState(false);
  const [sort, setSort] = useState("relevance");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);

  // Match collaboration metadata from single source of truth
  const foundCollab = getCollaboration(slug);
  const collab = foundCollab || {
    title: slug.replace(/-/g, " "),
    eyebrow: "Special Collaboration",
    tagline: "Limited run artisan collaboration edition.",
    bannerImage: rangsajjaImg,
  };

  // Fetch relevant products for this collaboration edition using dedicated collaborationSlug
  const { data: productEnvelope, loading, error, refetch } = useAsync(
    (opts) =>
      getProducts(
        {
          collaborationSlug: slug,
          sort,
          inStock: inStockOnly ? true : undefined,
          onSale: onSaleOnly ? true : undefined,
          pageSize: 16,
        },
        opts,
      ),
    [slug, sort, inStockOnly, onSaleOnly],
  );

  const products = productEnvelope?.items ?? [];
  const hasActiveFilters = sort !== "relevance" || inStockOnly || onSaleOnly;

  return (
    <div className={s.page}>
      <SEO
        title={`${collab.title} — Exclusive Collaboration`}
        description={collab.tagline || `Exclusive collaboration on ${BRAND.name}.`}
      />

      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className={s.breadcrumbNav}>
          <Link to="/" className={s.breadcrumbLink}>
            Home
          </Link>
          <span className={s.breadcrumbSep}>/</span>
          <Link to="/collaborations" className={s.breadcrumbLink}>
            Collaborations
          </Link>
          <span className={s.breadcrumbSep}>/</span>
          <span className={s.breadcrumbCurrent}>{collab.title}</span>
        </nav>

        {/* 1. Collaboration Banner at the top */}
        <div className={s.heroBannerSection}>
          <div className={s.heroBannerCard}>
            <img
              src={collab.bannerImage}
              alt={collab.title}
              className={s.heroBannerImage}
              loading="eager"
            />
          </div>
        </div>

        {/* 2. Collaboration Header & Details */}
        <div className={s.collabInfoBar}>
          <span className={s.collabBadge}>
            <Sparkles size={14} aria-hidden="true" />
            {collab.eyebrow}
          </span>
          <h1 className={s.collabTitle}>{collab.title}</h1>
          <p className={s.collabTagline}>{collab.tagline}</p>
        </div>

        {/* 3. Products Header with Filter Icon on Right Side */}
        <div className={s.productsHeader}>
          <div>
            <h2 className={s.productsHeadingTitle}>Collection Pieces</h2>
            {!loading && (
              <span className={s.productsCount}>
                {products.length} {products.length === 1 ? "Piece" : "Pieces"}
              </span>
            )}
          </div>

          <div className={s.headerActions}>
            <button
              type="button"
              className={s.filterIconButton}
              onClick={() => setFilterOpen(true)}
              aria-label="Filter products"
              title="Filters"
            >
              <SlidersHorizontal size={19} />
              {hasActiveFilters && <span className={s.filterDot} aria-hidden="true" />}
            </button>
          </div>
        </div>

        <ProductGrid
          products={products}
          loading={loading}
          error={error}
          onRetry={refetch}
          columns={4}
          skeletonCount={8}
          emptyTitle="Pieces launching soon"
          emptyMessage="We are preparing the small-batch inventory for this collaboration. Check back shortly!"
        />
      </div>

      {/* Filter Drawer for Collaboration Page */}
      {filterOpen && (
        <>
          <div className={s.scrim} onClick={() => setFilterOpen(false)} aria-hidden="true" />
          <aside className={s.filterDrawer} role="dialog" aria-label="Filter and Sort">
            <div className={s.drawerHead}>
              <h3 className={s.drawerTitle}>Filters & Sort</h3>
              <button
                type="button"
                className={s.closeButton}
                onClick={() => setFilterOpen(false)}
                aria-label="Close filters"
              >
                <X size={18} />
              </button>
            </div>

            <div className={s.drawerBody}>
              <div className={s.filterSection}>
                <h4 className={s.sectionLabel}>Sort By</h4>
                <div className={s.optionsList}>
                  {SORT_OPTIONS.map((opt) => (
                    <Radio
                      key={opt.value}
                      name="collab-sort"
                      label={opt.label}
                      checked={sort === opt.value}
                      onChange={() => setSort(opt.value)}
                    />
                  ))}
                </div>
              </div>

              <div className={s.filterSection}>
                <h4 className={s.sectionLabel}>Availability</h4>
                <label className={s.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                  />
                  <span>In stock only</span>
                </label>
                <label className={s.checkboxLabel} style={{ marginTop: "10px" }}>
                  <input
                    type="checkbox"
                    checked={onSaleOnly}
                    onChange={(e) => setOnSaleOnly(e.target.checked)}
                  />
                  <span>On sale pieces</span>
                </label>
              </div>
            </div>

            <div className={s.drawerFoot}>
              {hasActiveFilters && (
                <button
                  type="button"
                  className={s.clearBtn}
                  onClick={() => {
                    setSort("relevance");
                    setInStockOnly(false);
                    setOnSaleOnly(false);
                  }}
                >
                  Clear all
                </button>
              )}
              <button
                type="button"
                className={s.applyBtn}
                onClick={() => setFilterOpen(false)}
              >
                Apply Filters
              </button>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}

