import { useCallback, useEffect, useRef, useState } from "react";
import { isAborted } from "../services/errors.js";

/**
 * Run a service call and expose { data, error, loading, refetch }.
 *
 * Creates an AbortController per run and aborts the previous one whenever the
 * dependencies change or the component unmounts. That is what prevents the
 * classic stale-result bug: click category A, then B, and A's slower response
 * would otherwise resolve last and paint A's products under B's heading.
 *
 * Aborted requests are swallowed — a cancelled call is not a failure and must
 * never flash an error state.
 *
 * The return shape mirrors TanStack Query on purpose, so it can be swapped in
 * at backend-integration time with near-identical call sites.
 *
 * Note on the eslint exceptions below: `react-hooks/set-state-in-effect` is
 * aimed at effects that derive state from props. Kicking off a request and
 * moving through loading → data/error is exactly the external-system
 * synchronisation effects are for, and is what a query library does
 * internally. Fetching here is deliberate and the disables are scoped to it.
 */
export function useAsync(fn, deps = [], { immediate = true, initialData = null } = {}) {
  const [data, setData] = useState(initialData);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(immediate);

  const controllerRef = useRef(null);
  const mountedRef = useRef(true);
  const fnRef = useRef(fn);

  // Kept current in an effect, not during render: a render can be thrown away,
  // and mutating a ref on a discarded render is what that rule guards against.
  useEffect(() => {
    fnRef.current = fn;
  });

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      controllerRef.current?.abort();
    };
  }, []);

  const run = useCallback(async () => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const result = await fnRef.current({ signal: controller.signal });
      if (!controller.signal.aborted && mountedRef.current) {
        setData(result);
        setLoading(false);
      }
    } catch (err) {
      if (isAborted(err) || controller.signal.aborted) return; // superseded
      if (!mountedRef.current) return;
      setError(err);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!immediate) return undefined;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- starts the request; see note above
    run();
    return () => controllerRef.current?.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- caller-supplied dependency list
  }, deps);

  return { data, error, loading, refetch: run };
}

/**
 * useAsync for an envelope-returning list endpoint, with "load more".
 * `fetchPage(page, opts)` must resolve { items, total, hasMore, ... }.
 */
export function usePaginatedAsync(fetchPage, deps = [], { pageSize = 24 } = {}) {
  const [pages, setPages] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const controllerRef = useRef(null);
  const mountedRef = useRef(true);
  const fetchRef = useRef(fetchPage);

  useEffect(() => {
    fetchRef.current = fetchPage;
  });

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      controllerRef.current?.abort();
    };
  }, []);

  const load = useCallback(async (targetPage, { append }) => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    if (append) setLoadingMore(true);
    else setLoading(true);
    setError(null);

    try {
      const envelope = await fetchRef.current(targetPage, { signal: controller.signal });
      if (controller.signal.aborted || !mountedRef.current) return;

      setPages((prev) => (append ? [...prev, envelope.items] : [envelope.items]));
      setTotal(envelope.total ?? 0);
      setHasMore(Boolean(envelope.hasMore));
      setPage(envelope.page ?? targetPage);
    } catch (err) {
      if (isAborted(err) || controller.signal.aborted || !mountedRef.current) return;
      setError(err);
    } finally {
      if (mountedRef.current && !controller.signal.aborted) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- starts the request; see note above
    load(1, { append: false });
    return () => controllerRef.current?.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- caller-supplied dependency list
  }, deps);

  const loadMore = useCallback(() => {
    if (!hasMore || loadingMore || loading) return;
    load(page + 1, { append: true });
  }, [hasMore, loading, loadingMore, page, load]);

  return {
    items: pages.flat(),
    total,
    page,
    pageSize,
    hasMore,
    loading,
    loadingMore,
    error,
    loadMore,
    refetch: () => load(1, { append: false }),
  };
}

export default useAsync;
