/**
 * Runtime configuration.
 *
 * `API_MODE` is the switch that flips the whole app from mock data to a real
 * backend. In `mock` mode the transport fetches `/mock/*.json` and applies
 * filtering, sorting and pagination locally; in `live` mode it forwards the
 * same query objects to `API_BASE_URL`. Nothing outside `services/` reads
 * these values.
 */

const env = import.meta.env ?? {};

function num(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export const API_MODE = env.VITE_API_MODE === "live" ? "live" : "mock";
export const API_BASE_URL = env.VITE_API_BASE_URL ?? "";
export const IS_MOCK = API_MODE === "mock";
export const IS_DEV = Boolean(env.DEV);

/** Where the mock datasets are served from. Real HTTP, not a bundled import. */
export const MOCK_BASE_URL = "/mock";

/**
 * Simulated latency. Randomised within a range rather than a fixed delay —
 * a constant 300ms hides spinner flash and layout shift that real, variable
 * networks expose.
 */
export const MOCK_LATENCY_MIN = num(env.VITE_MOCK_LATENCY_MIN, 150);
export const MOCK_LATENCY_MAX = num(env.VITE_MOCK_LATENCY_MAX, 600);

/** 0–1. Set to 1 to prove every screen has a working error state. */
export const MOCK_FAILURE_RATE = Math.min(
  Math.max(num(env.VITE_MOCK_FAILURE_RATE, 0), 0),
  1,
);

/** Multiplies mock latency, for eyeballing slow-connection behaviour. */
export const MOCK_SLOW_FACTOR = num(env.VITE_MOCK_SLOW_FACTOR, 1);

/** Request timeout in ms, applied in both modes. */
export const REQUEST_TIMEOUT = num(env.VITE_REQUEST_TIMEOUT, 15000);

export default {
  API_MODE,
  API_BASE_URL,
  IS_MOCK,
  IS_DEV,
  MOCK_BASE_URL,
  MOCK_LATENCY_MIN,
  MOCK_LATENCY_MAX,
  MOCK_FAILURE_RATE,
  MOCK_SLOW_FACTOR,
  REQUEST_TIMEOUT,
};
