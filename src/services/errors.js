/**
 * The single error shape every service rejects with, in both mock and live
 * mode. Components branch on `code`, show `message`, bind `details` to form
 * fields, and offer retry when `retryable` is true.
 */

export const ERROR_CODES = {
  NETWORK: "NETWORK",
  TIMEOUT: "TIMEOUT",
  ABORTED: "ABORTED",
  NOT_FOUND: "NOT_FOUND",
  VALIDATION: "VALIDATION",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  CONFLICT: "CONFLICT",
  OUT_OF_STOCK: "OUT_OF_STOCK",
  RATE_LIMITED: "RATE_LIMITED",
  SERVER: "SERVER",
  UNKNOWN: "UNKNOWN",
};

const RETRYABLE = new Set([
  ERROR_CODES.NETWORK,
  ERROR_CODES.TIMEOUT,
  ERROR_CODES.RATE_LIMITED,
  ERROR_CODES.SERVER,
]);

/** Human-readable defaults. A service may override with something specific. */
const DEFAULT_MESSAGES = {
  [ERROR_CODES.NETWORK]:
    "We could not reach Craftiniya. Check your connection and try again.",
  [ERROR_CODES.TIMEOUT]: "That took too long to load. Please try again.",
  [ERROR_CODES.ABORTED]: "Request cancelled.",
  [ERROR_CODES.NOT_FOUND]: "We could not find what you were looking for.",
  [ERROR_CODES.VALIDATION]: "Please check the highlighted fields.",
  [ERROR_CODES.UNAUTHORIZED]: "Please sign in to continue.",
  [ERROR_CODES.FORBIDDEN]: "You do not have access to that.",
  [ERROR_CODES.CONFLICT]: "That conflicts with something that already exists.",
  [ERROR_CODES.OUT_OF_STOCK]: "There is not enough stock left for that.",
  [ERROR_CODES.RATE_LIMITED]: "Too many requests. Give it a moment.",
  [ERROR_CODES.SERVER]: "Something went wrong on our side.",
  [ERROR_CODES.UNKNOWN]: "Something went wrong. Please try again.",
};

export class ApiError extends Error {
  constructor({ code = ERROR_CODES.UNKNOWN, status = 0, message, details = null }) {
    super(message || DEFAULT_MESSAGES[code] || DEFAULT_MESSAGES.UNKNOWN);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.details = details;
    this.retryable = RETRYABLE.has(code);
  }
}

/** Map an HTTP status onto an error code. */
export function codeForStatus(status) {
  switch (status) {
    case 400:
      return ERROR_CODES.VALIDATION;
    case 401:
      return ERROR_CODES.UNAUTHORIZED;
    case 403:
      return ERROR_CODES.FORBIDDEN;
    case 404:
      return ERROR_CODES.NOT_FOUND;
    case 409:
      return ERROR_CODES.CONFLICT;
    case 422:
      return ERROR_CODES.VALIDATION;
    case 429:
      return ERROR_CODES.RATE_LIMITED;
    default:
      return status >= 500 ? ERROR_CODES.SERVER : ERROR_CODES.UNKNOWN;
  }
}

export const isApiError = (e) => e instanceof ApiError;

/**
 * A cancelled request is not a failure. `useAsync` swallows these rather than
 * rendering an error state, so nothing flashes when a user changes filters
 * faster than the previous request resolves.
 */
export const isAborted = (e) => isApiError(e) && e.code === ERROR_CODES.ABORTED;

export const notFound = (message) =>
  new ApiError({ code: ERROR_CODES.NOT_FOUND, status: 404, message });

export const validationError = (details, message) =>
  new ApiError({ code: ERROR_CODES.VALIDATION, status: 422, message, details });

export const abortError = () =>
  new ApiError({ code: ERROR_CODES.ABORTED, status: 0 });
