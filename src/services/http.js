/**
 * Transport layer. The only file that knows whether we are on mock data or a
 * real backend.
 *
 * Mock mode fetches `/mock/<name>.json` over real HTTP — not a bundled import,
 * so the network path, cache behaviour, failure modes and abort semantics are
 * the same ones the live backend will exercise. Swapping to live changes the
 * base URL and nothing else.
 */

import {
  API_BASE_URL,
  IS_MOCK,
  MOCK_BASE_URL,
  MOCK_FAILURE_RATE,
  MOCK_LATENCY_MAX,
  MOCK_LATENCY_MIN,
  MOCK_SLOW_FACTOR,
  REQUEST_TIMEOUT,
} from "../config/env.js";
import { ApiError, ERROR_CODES, abortError, codeForStatus } from "./errors.js";

/* ---------------------------------------------------------------
   Abortable timing
   --------------------------------------------------------------- */

/** A sleep that actually honours an AbortSignal. */
export function delay(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(abortError());
      return;
    }
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    function onAbort() {
      clearTimeout(timer);
      reject(abortError());
    }
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

function mockLatency() {
  const spread = Math.max(MOCK_LATENCY_MAX - MOCK_LATENCY_MIN, 0);
  return (MOCK_LATENCY_MIN + Math.random() * spread) * MOCK_SLOW_FACTOR;
}

function maybeFail() {
  if (MOCK_FAILURE_RATE > 0 && Math.random() < MOCK_FAILURE_RATE) {
    throw new ApiError({ code: ERROR_CODES.SERVER, status: 500 });
  }
}

/**
 * Wrap any locally-computed result so it behaves like a network call:
 * realistic variable latency, injectable failures, honest cancellation.
 * Used by the cart, wishlist, auth and order services, which read and write
 * LocalStorage rather than a dataset.
 */
export async function simulate(producer, { signal } = {}) {
  await delay(mockLatency(), signal);
  maybeFail();
  return typeof producer === "function" ? producer() : producer;
}

/* ---------------------------------------------------------------
   Dataset loading (mock mode)
   --------------------------------------------------------------- */

const datasetCache = new Map();
const inFlight = new Map();

/**
 * Load and memoise a mock dataset. Concurrent callers share one request, so
 * five components mounting at once produce one fetch, not five.
 *
 * Note the deliberate asymmetry: the fetch itself is not tied to the caller's
 * signal, because a shared cache entry must not be poisoned by whichever
 * component happened to unmount first. Cancellation is honoured around it.
 */
export async function loadDataset(name, { signal } = {}) {
  if (signal?.aborted) throw abortError();

  if (datasetCache.has(name)) {
    await delay(mockLatency(), signal);
    maybeFail();
    return datasetCache.get(name);
  }

  if (!inFlight.has(name)) {
    const promise = (async () => {
      const res = await fetch(`${MOCK_BASE_URL}/${name}.json`, {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) {
        throw new ApiError({
          code: codeForStatus(res.status),
          status: res.status,
          message: `Could not load ${name}.`,
        });
      }
      const json = await res.json();
      datasetCache.set(name, json);
      return json;
    })().finally(() => inFlight.delete(name));

    inFlight.set(name, promise);
  }

  const [data] = await Promise.all([
    inFlight.get(name).catch((e) => {
      throw e instanceof ApiError
        ? e
        : new ApiError({ code: ERROR_CODES.NETWORK, status: 0 });
    }),
    delay(mockLatency(), signal),
  ]);

  maybeFail();
  return data;
}

/** Test seam — lets specs and the dev tools force a cold read. */
export function clearDatasetCache(name) {
  if (name) datasetCache.delete(name);
  else datasetCache.clear();
}

/* ---------------------------------------------------------------
   Live requests
   --------------------------------------------------------------- */

function buildUrl(path, query) {
  const url = `${API_BASE_URL}${path}`;
  if (!query) return url;
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value)) value.forEach((v) => params.append(key, String(v)));
    else params.append(key, String(value));
  });
  const qs = params.toString();
  return qs ? `${url}?${qs}` : url;
}

/**
 * Live-mode request. Present now so the swap is a mode flag rather than new
 * code: services already route through this shape.
 */
export async function request(
  path,
  { method = "GET", query, body, signal, timeout = REQUEST_TIMEOUT } = {},
) {
  const controller = new AbortController();
  const onAbort = () => controller.abort();
  signal?.addEventListener("abort", onAbort, { once: true });
  const timer = setTimeout(() => controller.abort("timeout"), timeout);

  try {
    const res = await fetch(buildUrl(path, query), {
      method,
      credentials: "include",
      headers: {
        Accept: "application/json",
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    if (!res.ok) {
      let details = null;
      let message;
      try {
        const payload = await res.json();
        details = payload.details ?? payload.errors ?? null;
        message = payload.message;
      } catch {
        /* non-JSON error body — fall back to the code's default message */
      }
      throw new ApiError({
        code: codeForStatus(res.status),
        status: res.status,
        message,
        details,
      });
    }

    return res.status === 204 ? null : await res.json();
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if (err?.name === "AbortError") {
      throw signal?.aborted
        ? abortError()
        : new ApiError({ code: ERROR_CODES.TIMEOUT, status: 0 });
    }
    throw new ApiError({ code: ERROR_CODES.NETWORK, status: 0 });
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", onAbort);
  }
}

/* ---------------------------------------------------------------
   Envelope
   --------------------------------------------------------------- */

/**
 * Every list read resolves this shape — never a bare array. Components that
 * destructure `items`/`total`/`hasMore` today keep working unchanged once a
 * real paginated endpoint is behind them.
 */
export function paginate(items, { page = 1, pageSize = 24 } = {}) {
  const total = items.length;
  const safeSize = Math.max(1, pageSize);
  const pageCount = Math.max(1, Math.ceil(total / safeSize));
  const safePage = Math.min(Math.max(1, page), pageCount);
  const start = (safePage - 1) * safeSize;

  return {
    items: items.slice(start, start + safeSize),
    total,
    page: safePage,
    pageSize: safeSize,
    pageCount,
    hasMore: start + safeSize < total,
  };
}

export const emptyEnvelope = (pageSize = 24) => ({
  items: [],
  total: 0,
  page: 1,
  pageSize,
  pageCount: 1,
  hasMore: false,
});

export { IS_MOCK };
