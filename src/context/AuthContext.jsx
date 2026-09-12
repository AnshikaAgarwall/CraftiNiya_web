/* eslint-disable react-refresh/only-export-components --
   Provider and its consumer hook belong together: splitting them into two
   files to satisfy Fast Refresh would add four files that exist only to
   hold a one-line export. Fast Refresh falls back to a full reload for
   this file, which is an acceptable trade for a provider that rarely changes. */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import authService from "../services/authService.js";
import cartService from "../services/cartService.js";
import wishlistService from "../services/wishlistService.js";
import { sessionStore } from "../storage/stores.js";
import { isAborted } from "../services/errors.js";

/**
 * Authentication state.
 *
 * The interface here (session, user, signIn, signUp, signOut, loading)
 * deliberately mirrors a real auth SDK, so swapping the mock for Supabase or
 * a cookie-based backend does not touch any component.
 *
 * `loading` starts true and the app must not decide "logged out" until it
 * flips — otherwise a protected route redirects to sign-in for a frame before
 * the session resolves.
 */

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    authService
      .getSession({ signal: controller.signal })
      .then(setSession)
      .catch((e) => !isAborted(e) && setError(e))
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  // Sign out in one tab signs out in all of them.
  useEffect(() => sessionStore.subscribe((next) => setSession(next ?? null)), []);

  /**
   * A guest builds a cart and a wishlist, then signs in. Without this merge
   * step both would silently vanish at the moment of sign-in.
   */
  const mergeGuestState = useCallback(async () => {
    await Promise.allSettled([
      cartService.mergeGuestCart(),
      wishlistService.mergeGuestWishlist(),
    ]);
  }, []);

  const run = useCallback(
    async (operation) => {
      setPending(true);
      setError(null);
      try {
        const next = await operation();
        setSession(next);
        if (next) await mergeGuestState();
        return next;
      } catch (e) {
        setError(e);
        throw e;
      } finally {
        setPending(false);
      }
    },
    [mergeGuestState],
  );

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      isAuthenticated: Boolean(session?.user),
      loading,
      pending,
      error,
      clearError: () => setError(null),

      signIn: (credentials) => run(() => authService.signIn(credentials)),
      signUp: (payload) => run(() => authService.signUp(payload)),
      signOut: async () => {
        setPending(true);
        try {
          await authService.signOut();
          setSession(null);
        } finally {
          setPending(false);
        }
      },
      requestPasswordReset: (email) => authService.requestPasswordReset(email),
      updateProfile: async (patch) => {
        const user = await authService.updateProfile(patch);
        setSession((s) => (s ? { ...s, user } : s));
        return user;
      },
    }),
    [session, loading, pending, error, run],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

export default AuthContext;
