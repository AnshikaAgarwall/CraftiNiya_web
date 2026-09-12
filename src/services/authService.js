/**
 * Authentication.
 *
 * The Session shape returned here contains a user and an expiry and NEVER a
 * token. That omission is deliberate and load-bearing: because no component
 * ever reads a credential, the real backend can move to an httpOnly cookie
 * without touching a single line of UI.
 *
 * The mock "password hash" below is a non-cryptographic digest. It exists only
 * so a sign-up in one tab can sign in from another while offline. It is not
 * security, and the live implementation must never keep credentials on the
 * client at all.
 */

import { simulate } from "./http.js";
import { ApiError, ERROR_CODES, validationError } from "./errors.js";
import { credentialStore, sessionStore } from "../storage/stores.js";

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Not a password hash. A stand-in so the offline mock can compare something. */
function digest(value) {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h.toString(36);
}

function toSession(user) {
  return {
    user,
    expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
    isGuest: false,
  };
}

function validate({ name, email, password }, { requireName }) {
  const details = {};
  if (requireName && !name?.trim()) details.name = "Please tell us your name.";
  if (!email?.trim()) details.email = "Please enter your email.";
  else if (!EMAIL_RE.test(email.trim())) details.email = "That does not look like a valid email.";
  if (!password) details.password = "Please enter a password.";
  else if (requireName && password.length < 8)
    details.password = "Use at least 8 characters.";
  return details;
}

/* ---------------------------------------------------------------
   Public API
   --------------------------------------------------------------- */

/** Current session, or null. Expired sessions are cleared, not returned. */
export async function getSession(opts) {
  return simulate(() => {
    const session = sessionStore.read();
    if (!session) return null;
    if (session.expiresAt && Date.parse(session.expiresAt) < Date.now()) {
      sessionStore.clear();
      return null;
    }
    return session;
  }, opts);
}

export async function signUp({ name, email, password }, opts) {
  const details = validate({ name, email, password }, { requireName: true });
  if (Object.keys(details).length) throw validationError(details);

  await simulate(() => null, opts);

  const normalised = email.trim().toLowerCase();
  const credentials = credentialStore.read();

  if (credentials.some((c) => c.email === normalised)) {
    throw new ApiError({
      code: ERROR_CODES.CONFLICT,
      status: 409,
      message: "An account with that email already exists.",
      details: { email: "Try signing in instead." },
    });
  }

  const user = {
    id: `user-${digest(normalised)}`,
    name: name.trim(),
    email: normalised,
    avatarUrl: null,
    createdAt: new Date().toISOString(),
  };

  credentialStore.write([...credentials, { email: normalised, password: digest(password), user }]);
  const session = toSession(user);
  sessionStore.write(session);
  return session;
}

export async function signIn({ email, password }, opts) {
  const details = validate({ email, password }, { requireName: false });
  if (Object.keys(details).length) throw validationError(details);

  await simulate(() => null, opts);

  const normalised = email.trim().toLowerCase();
  const record = credentialStore
    .read()
    .find((c) => c.email === normalised && c.password === digest(password));

  if (!record) {
    // One message for both wrong-email and wrong-password: a distinct
    // "no such account" reply tells an attacker which addresses are registered.
    throw new ApiError({
      code: ERROR_CODES.UNAUTHORIZED,
      status: 401,
      message: "That email and password do not match.",
    });
  }

  const session = toSession(record.user);
  sessionStore.write(session);
  return session;
}

export async function signOut(opts) {
  await simulate(() => null, opts);
  sessionStore.clear();
  return null;
}

export async function requestPasswordReset(email, opts) {
  await simulate(() => null, opts);
  // Always resolves, whether or not the address exists — the same reasoning as
  // the generic sign-in failure above.
  return { sent: true, email: String(email ?? "").trim().toLowerCase() };
}

export async function updateProfile(patch, opts) {
  await simulate(() => null, opts);
  const session = sessionStore.read();
  if (!session) {
    throw new ApiError({ code: ERROR_CODES.UNAUTHORIZED, status: 401 });
  }

  const user = { ...session.user, ...patch };
  sessionStore.write({ ...session, user });

  const credentials = credentialStore.read();
  credentialStore.write(
    credentials.map((c) => (c.user.id === user.id ? { ...c, user } : c)),
  );

  return user;
}

export default {
  getSession,
  signUp,
  signIn,
  signOut,
  requestPasswordReset,
  updateProfile,
};
