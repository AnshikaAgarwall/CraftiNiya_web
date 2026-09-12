import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { useUI } from "../../context/UIContext.jsx";
import { useAsync } from "../../hooks/useAsync.js";
import { useDebouncedValue } from "../../hooks/useDebounce.js";
import productService from "../../services/productService.js";
import LazyImage from "../common/LazyImage.jsx";
import { Spinner } from "../ui/Feedback.jsx";
import { Price } from "../ui/Bits.jsx";
import s from "./SearchOverlay.module.css";

/**
 * Type-ahead search.
 *
 * The query is debounced so a five-letter word fires one request, not five,
 * and useAsync aborts superseded requests so a slow early result cannot
 * overwrite a newer one.
 */
export default function SearchOverlay() {
  const { searchOpen, closeSearch } = useUI();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [term, setTerm] = useState("");
  const debounced = useDebouncedValue(term.trim(), 250);

  // Clear the box each time the overlay opens. Adjusted during render rather
  // than in an effect, so the field is never painted with the previous term.
  const [wasOpen, setWasOpen] = useState(searchOpen);
  if (wasOpen !== searchOpen) {
    setWasOpen(searchOpen);
    if (searchOpen) setTerm("");
  }

  useEffect(() => {
    if (!searchOpen) return;
    // Wait a frame so the element exists before focusing it.
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [searchOpen]);

  const { data, loading } = useAsync(
    (opts) =>
      debounced.length < 2
        ? Promise.resolve({ items: [], total: 0 })
        : productService.searchProducts(debounced, { pageSize: 6 }, opts),
    [debounced],
  );

  const results = data?.items ?? [];

  const submit = (e) => {
    e.preventDefault();
    if (!term.trim()) return;
    closeSearch();
    navigate(`/search?q=${encodeURIComponent(term.trim())}`);
  };

  if (!searchOpen) return null;

  return (
    <div className={s.root}>
      <button
        type="button"
        className={s.scrim}
        onClick={closeSearch}
        aria-label="Close search"
        tabIndex={-1}
      />

      <div className={s.panel} role="dialog" aria-modal="true" aria-label="Search products">
        <form className={`container ${s.form}`} onSubmit={submit} role="search">
          <Search className={s.icon} aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search candles, resin art, gifting…"
            className={s.input}
            aria-label="Search products"
          />
          {loading && <Spinner className={s.spinner} />}
          <button type="button" onClick={closeSearch} className={s.close} aria-label="Close search">
            <X />
          </button>
        </form>

        {debounced.length >= 2 && (
          <div className={`container ${s.results}`}>
            {results.length ? (
              <>
                <ul className={s.list}>
                  {results.map((p) => (
                    <li key={p.id}>
                      <button
                        type="button"
                        className={s.result}
                        onClick={() => {
                          closeSearch();
                          navigate(`/product/${p.slug}`);
                        }}
                      >
                        <LazyImage src={p.image} alt="" className={s.resultImg} />
                        <span className={s.resultBody}>
                          <span className={s.resultTitle}>{p.title}</span>
                          <span className={s.resultMeta}>{p.subcategoryTitle}</span>
                        </span>
                        <Price
                          listMinor={p.listPriceMinor}
                          effectiveMinor={p.effectivePriceMinor}
                          size="sm"
                          showDiscount={false}
                        />
                      </button>
                    </li>
                  ))}
                </ul>
                <button type="button" className={s.all} onClick={submit}>
                  See all results for “{debounced}”
                </button>
              </>
            ) : (
              !loading && (
                <p className={s.none}>
                  Nothing matched “{debounced}”. Try a material, an occasion, or a
                  category.
                </p>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
